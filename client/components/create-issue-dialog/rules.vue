<template>
  <div class="order-rules-view">
    <div class="filter">
      <div class="flex">
        <div class="form-item">
          <span class="label">规则名称：</span>
          <input type="text" v-model="params.name" class="my-input" @input="clearCache">
        </div>
        <div class="form-item ml-sm">
          <span class="label">执行状态：</span>
          <el-select v-model="params.rc"
                     placeholder="请选择"
                     clearable
                     class="flex-1"
                     @change="clearCache">
            <el-option
              v-for="(item, key) in executeStatusList"
              :key="key"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </div>
      </div>
      <div class="flex search">
        <div class="form-item">
          <span class="label">执行周期：</span>
          <el-date-picker v-model="datePicker"
                          size="mini"
                          type="daterange"
                          :clearable="false"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          @change="handlePicker"/>
        </div>
        <a class="btn btn-search" @click="queryData(1)">检索</a>
      </div>
    </div>
    <div class="toast">
      <a v-if="!isChecked" href="javascript:" class="checked" @click="handleChecked">
        <i class="el-icon-info icon"></i>已选择<span>{{this.checkedList.length}}</span>项
      </a>
      <a v-else href="javascript:" @click="handleChecked">返回</a>
    </div>
    <el-table
      ref="table"
      :data="dataList"
      class="my-table form-group-sm"
      style="width: 100%"
      @selection-change="selectionChange">
      <el-table-column type="selection" width="33"/>
      <el-table-column prop="name" label="规则名称">
        <template #default="{row}">
          <div v-html="row.name" class="root-highlight"></div>
        </template>
      </el-table-column>
      <el-table-column label="检查对象">
        <template #default="{row}">
          <div v-html="getTarget(row.target)" class="root-highlight"></div>
        </template>
      </el-table-column>
      <el-table-column prop="rc" label="执行状态" :formatter="renderExecute"/>
      <el-table-column prop="taskRunTm" label="最后执行日期" width="150" :formatter="getTime"/>
      <el-table-column prop="techLinkman.name" label="技术负责人"/>
      <el-table-column prop="busiLinkman.name" label="业务负责人"/>
    </el-table>
    <div class="my-pagination form-group">
      <pagination
        :total="total"
        :page-size="params.size"
        :current-page="page"
        class="fr"
        @current-change="queryData"/>
    </div>
  </div>

</template>

<script>

  import Vue from 'vue'
  import {DatePicker, Option, Select, Table, TableColumn} from 'element-ui'

  import Pagination from '~/common-components/pagination'
  import EXECUTION_LIST from '~/graphql/execution_list.gql'
  import enumerate from '~/js/enum'
  import {formatDate} from '~/utils/date'
  import {getTarget, validParams} from '~/utils/'

  Vue.use(Select)
  Vue.use(Option)
  Vue.use(DatePicker)
  Vue.use(Table)
  Vue.use(TableColumn)

  export default {
    name: 'StepRules',
    components: {
      Pagination,
    },
    props: {
      checkedList1: {
        type: Array,
      },
    },
    data () {
      return {
        params: {
          name: '',
          rc: 'NORMAL',
          startTime: null,
          endTime: null,
          offset: 0,
          limit: 5,
        },
        datePicker: [],
        dataList: [],
        checkedList: this.checkedList1,
        executeStatusList: enumerate.ruleExecuteStatusList,
        ids: [],
        total: 0,
        cacheList: [],
        cacheCurPage: 1,
        cacheCurTotal: 1,
        isChecked: false,
        timer: null,
      }
    },

    computed: {
      page () {
        return this.params.offset / this.params.limit + 1
      },
    },
    created () {
      this.init()
    },
    methods: {
      getTarget,
      init () {
        this.queryData()
      },
      getExecutionList () {
        this.$apollo.query({
          query: EXECUTION_LIST,
          fetchPolicy: 'network-only',
          variables: {
            input: validParams(this.params),
          },
        }).then(respData => {
          if (respData) {
            let data = respData.data.data
            this.total = data.total
            this.dataList = data.data
            this.cacheList.concat(data.data)
          }
        })
      },
      queryData (page) {
        if (this.isChecked) {
          this.queryCheckedData(page)
        } else {
          this.queryAllData(page)
        }
      },
      queryAllData (page) {
        if (page) {
          this.params.offset = (page - 1) * this.params.limit
        }
        let cacheData = this.getCache()

        if (cacheData.length) {
          this.dataList = cacheData
          this.total = this.cacheCurTotal
        } else {
          this.getExecutionList()
        }
        /*
        * 初始化信息表格已选项目
        * */
        this.$nextTick(() => {
          this.toggleRowSelection()
        })
      },
      queryCheckedData (page) {
        if (page) {
          this.params.page = page
        }
        this.dataList = this.getCheckedCache()
        this.total = this.dataList.length
        this.$nextTick(() => {
          this.toggleRowSelection()
        })
      },
      getCache () {
        return this.cacheList.slice(this.params.offset, this.params.offset + this.params.limit)
      },
      getCheckedCache () {
        return this.checkedList.slice(this.params.offset, this.params.offset + this.params.limit)
      },
      clearCache () {
        this.cacheList = []
      },
      renderExecute (row, column, cellValue) {
        let str
        this.executeStatusList.forEach(item => {
          if (item.value === row.rc) {
            str = item.name
          }
        })
        return str
      },
      selectionChange (selection) {
        if (this.timer) {
          clearTimeout(this.timer)
          this.timer = null
        }
        this.timer = setTimeout(() => {
          this.dataList.forEach(item => {
            this.checkedList.forEach((cheItem, index) => {
              if (cheItem.id === item.id) {
                this.checkedList.splice(index, 1)
              }
            })
          })
          this.checkedList = this.checkedList.concat(selection)
          this.$emit('update:checkedList1', this.checkedList)
        })
      },
      toggleRowSelection () {
        this.dataList.forEach(item => {
          this.checkedList.forEach(cheItem => {
            if (cheItem.id === item.id) {
              this.$refs.table.toggleRowSelection(item, true)
            }
          })
        })
      },
      handlePicker (val) {
        this.params.startTime = val[0]
        this.params.endTime = val[1]
      },
      handleChecked () {
        // 如果是总表缓存 总数，和当前页数
        if (!this.isChecked) {
          this.cacheCurPage = this.params.page
          this.cacheCurTotal = this.total
        }
        this.isChecked = !this.isChecked
        // 获取数据
        this.queryData(1)
      },
      getTime (row) {
        return formatDate(row.taskRunTm)
      },
    },
  }
</script>

<style lang="scss">
  @import "./commom";
  @import "../../style/variables";

  .order-rules-view {
    .form-item {
      flex: 1;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .label {
        min-width: 70px;
      }

      input {
        flex: 1;
      }

      input {
        border-radius: 4px;
        padding: 5px 12px;
        height: 24px;
        line-height: 24px;
      }
    }

    .target {
      margin: 0 10px 10px;
    }

    .search {
      align-items: center;

      .btn-search {
        @apply flex items-center justify-center border-blue bg-blue text-white;

        height: 24px;
        width: 60px;
      }
    }

    .toast {
      @apply bg-blue-lighter;
      border-radius: 4px;
      padding: 0 13px;
      height: 32px;
      line-height: 32px;
      color: $color_333;

      .icon {
        @apply text-blue;
        margin-right: 5px;
      }

      span {
        @apply text-blue;
      }

    }

    .my-table {
      height: 230px;
      overflow-y: auto;

      &::before {
        height: 0;
      }

      thead {
        tr, th {
          @apply bg-gray-lighter;
        }
      }

      th, td {
        padding: 7px 0;
      }

      tbody tr:last-child {
        border-color: transparent;

        td {
          border-color: transparent;
        }
      }
    }

    .my-pagination {
      display: flex;
      flex-direction: row-reverse;
      border-bottom: 1px solid $color_EEE;
    }
  }
</style>
<style lang="scss">
  @import "../../style/variables";

  .order-rules-view {
    .el-input__icon {
      line-height: unset;
    }

    .el-range-editor.el-input__inner {
      padding-left: 0;
    }

    .el-input__icon {
      line-height: 20px;
      margin-left: 0;
    }

    input.el-range-input {
      border: none;
      height: 24px;
      line-height: 24px;
    }

    a {
      text-decoration: none;
      color: $color_333;
    }
  }
</style>
