<template>
  <div v-ej-loading.fullscreen="loading" class="issue-index-view">
    <el-tabs v-model="params.type" class="issue-index-tabs" @tab-click="getDataList(1)">
      <el-tab-pane v-for="(it, idx) of typeList"
                   :key="idx"
                   :label="`${it.name}(${dataNum[it.key]})`"
                   :name="it.key.toUpperCase()"/>
    </el-tabs>
    <div class="issue-index-tab">
      <div class="issue-index-search">
        <div class="flex-1">
          <ej-search-input v-model="params.keyword"
                           :width="340"
                           :height="34"
                           placeholder="请输入检索内容"
                           @search="handleSearch"/>
        </div>
        <get-auth data="dqsIssueAdd">
          <el-button class="new-order" @click="isIssueDlgVisible = true">新建工单</el-button>
        </get-auth>
      </div>
      <div class="issue-index-table">
        <el-table ref="table" :data="dataList" style="width: 100%">
          <el-table-column prop="id" label="序号" type="index" width="48">
            <!--<template slot-scope="scope">-->
            <!--<span class="issue-index-serial">{{scope.row.id}}</span>-->
            <!--</template>-->
          </el-table-column>
          <el-table-column label="标题" min-width="100" show-overflow-tooltip>
            <template #default="{row}">
              <router-link :to="{name: 'issue-detail', params: {issueId: row.id}}" v-html="row.title"
                           class="root-highlight"></router-link>
            </template>
          </el-table-column>
          <el-table-column label="发生日期" width="100">
            <template #default="{row}">
              <div>{{row.dateTime | formatDate}}</div>
            </template>
          </el-table-column>
          <el-table-column label="级别" width="100">
            <template slot-scope="scope">
              <span>
                <i class="icon-level icon-warn" :class="scope.row.urgency.toLocaleLowerCase()"></i>
                {{scope.row.urgency | convertLevelValue}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="resolveBy.name" label="解决人" width="100">
            <template #default="{row}">
              {{row.resolveBy.name ? row.resolveBy.name : '--'}}
            </template>
          </el-table-column>
          <el-table-column label="解决周期" width="90">
            <template #default="{row}">
              {{humanizeTime(row.period)}}
            </template>
          </el-table-column>
          <el-table-column prop="createdBy.name" label="提交人" width="100"/>
          <el-table-column label="提交日期" width="100">
            <template #default="{row}">
              <div>{{row.createdAt | formatDate}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="my-pagination mt-sm">
        <common-pagination
          :total="total"
          :page-size="params.limit"
          :current-page="currentPage"
          @current-change="getDataList"/>
      </div>
    </div>

    <create-issue-dialog :visible.sync="isIssueDlgVisible" @createSuccess="getDataList(1)"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Button as ElButton,
    Table as ElTable,
    TableColumn as ElTableColumn,
    TabPane,
    Tabs,
  } from 'element-ui'

  import {Loading, SearchInput} from '@ej/ui'

  import ISSUE_LIST from '~/graphql/issue_list.gql'
  import enumerate from '~/js/enum'
  import {issueTypeList} from '~/js/enum/issue'
  import {formatDate, humanizeTime} from '~/utils/date'
  import CreateIssueDialog from '~/components/create-issue-dialog/index.vue'
  import Pagination from '~/common-components/pagination'
  import GetAuth from '~/components/get-auth'

  Vue.use(SearchInput)
  Vue.use(Tabs)
  Vue.use(TabPane)
  Vue.use(Pagination)
  Vue.use(Loading)
  Vue.use(GetAuth)

  export default {
    name: 'IssueIndexView',

    components: {
      ElButton,
      ElTable,
      ElTableColumn,
      CreateIssueDialog,
    },

    filters: {
      convertLevelValue (num) {
        let str = ''
        enumerate.rankList.forEach(it => {
          if (it.value === num) {
            str = it.name
          }
        })
        return str
      },
      formatDate,
    },

    data () {
      return {
        isIssueDlgVisible: false,
        params: {
          type: issueTypeList[0].key.toUpperCase(),
          offset: 0,
          limit: 10,
          keyword: '',
        },
        dataList: [],
        total: 0,
        typeList: issueTypeList,
        dataNum: {
          todo: 0,
          open: 0,
          closed: 0,
          overdue: 0,
          related: 0,
          all: 0,
        },
        loading: false,
      }
    },

    computed: {
      currentPage () {
        return this.params.offset / this.params.limit + 1
      },
    },

    created () {
      this.params.type = (this.$route.query.type || issueTypeList[0].key).toUpperCase()
      this.getDataList()
    },

    methods: {
      getDataList (page) {
        this.loading = true
        if (page) {
          this.params.offset = (page - 1) * this.params.limit
        }
        this.$apollo.query({
          query: ISSUE_LIST,
          fetchPolicy: 'no-cache',
          variables: {
            input: this.params,
          },
        }).then(respData => {
          this.loading = false
          if (respData) {
            let data = respData.data.data
            this.total = data.total
            this.dataList = data.data
            this.dataNum = data.info
          }
        }).catch(() => {
          this.loading = false
        })
      },

      handleSearch (keywords) {
        this.params.keyword = keywords
        this.getDataList(1)
      },

      getOrderLevelOrStatusIcon (num, type) {
        if (type === 'level') {
          const iconsLevel = [{
            value: 1,
            icon: 'icon-warn',
          }, {
            value: 2,
            icon: 'icon-attention',
          }, {
            value: 3,
            icon: 'icon-normal',
          }, {
            value: 4,
            icon: 'icon-seriousWarn',
          }]
          const levelObj = iconsLevel.find(i => i.value === num)
          return levelObj ? levelObj.icon : ''
        }
        return ''
      },

      humanizeTime (val) {
        return val ? humanizeTime(val) : '--'
      },
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .issue-index {
    &-view {
      padding: 17px 30px;
      flex: auto;
      height: 100%;
      background: $white;

      .my-pagination {
        display: flex;
        flex-direction: row-reverse;
      }
    }

    &-tabs {
      .el-table {
        color: $color_666;
      }

      .el-table thead {
        color: $color_333;
      }

      .el-tabs__item {
        color: $color_303133;
        font-size: $font-size-big;
      }

      .el-tabs__item.is-active {
        @apply text-blue;
      }

      .el-tabs__nav-wrap::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 1px;
        background-color: $color_EEE;
        z-index: 1;
      }
    }

    &-search {
      display: flex;

      .new-order {
        @apply text-lg text-white bg-blue border-0;

        letter-spacing: 1px;
      }

      .el-button {
        padding: 6px 36px;
      }

      .el-input__inner {
        height: 34px;
        line-height: 34px;
        font-size: $font-size-big;
        border: 1px solid $blue;
      }

      .ej-input-wrap .search-input .el-button {
        padding: 3px;
      }

      .ej-input-wrap .search-input {
        max-width: 340px;
      }
    }

    &-serial {
      color: $color_333;
    }

    &-table {
      margin-top: 20px;

      a[href] {
        @apply text-blue;

        text-decoration: none;

        &:hover {
          @apply border-b border-blue;
        }
      }

      .icon-status,
      .icon-level {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin-right: 5px;
      }

      .severity {
        background: $color_E66B6B;
      }

      .warning {
        background: $orange;
      }

      .focus {
        background: $blue;
      }

      .low, .normal {
        background: $color_4EC189;
      }
    }
  }
</style>
<style lang="scss">
  .issue-index-view {
    .issue-index-search .el-input__inner {
      border-color: theme('colors.gray.default');

      &:focus {
        @apply border-blue;
      }
    }
  }
</style>
