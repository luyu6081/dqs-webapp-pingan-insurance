<template>
  <div class="quality-adim-view">
    <ej-search-input v-model="keyword" :width="440" @search="getData" class="mb-sm"/>
    <el-table
      :data="dataList"
      style="width: 100%"
      border
      row-key="id"
      :tree-props="{children: 'platformScores'}">
      <el-table-column prop="name" label="系统名称"/>
      <el-table-column prop="score" label="近3个月数据质量得分" width="150"/>
      <el-table-column label="评分时间">
        <template #default="{row}">
          {{row.dateTime | formatDate('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column prop="errorScore" label="错误分"/>
      <el-table-column prop="issueScore" label="工单分"/>
      <el-table-column label="操作">
        <template #default="{$index, row}">
          <a href="javascript:" @click="gotoDetail(row)" class="inline-flex text-blue">详情</a>
          <a href="javascript:" @click="getHisData(row)" class="inline-flex text-blue ml-sm">历史</a>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="historyDialog.title" :visible.sync="historyDialog.visible">
      <el-table :data="historyDialog.dataList">
        <!--todo: 为什么无周期，对接后端-->
        <!--<el-table-column property="date" label="评分周期"/>-->
        <el-table-column property="score" label="质量得分"/>
        <el-table-column property="date" label="评分时间">
          <template #default="{row}">
            {{row.dateTime | formatDate('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column property="errorScore" label="错误分"/>
        <el-table-column property="errorRate" label="错误率">
          <!--<template #default="{row}">
            {{row.errorRate * 100}}
          </template>-->
        </el-table-column>
        <el-table-column property="issueScore" label="工单分"/>
        <el-table-column property="issueNumber" label="工单数"/>
      </el-table>
    </el-dialog>
    <el-dialog :title="detailDialog.data.name" :visible.sync="detailDialog.visible" class="quality-detail">
      <div class="text-center total">
        <div class="inline-flex items-center">
          <span class="label">总得分</span>
          <span class="num">{{detailDialog.data.score}}分</span>
        </div>
      </div>
      <div class="flex mb-md">
        <span class="item-label">排名</span>
        <div class="item-value">
          {{detailDialog.data.ranking}}名（<i class="el-icon-bottom text-red"
                                            :class="{'el-icon-top': detailDialog.data.changRanking > 0}"></i><span
          class="text-sm">{{Math.abs(detailDialog.data.changRanking)}}名</span>）
        </div>
      </div>
      <div class="flex mb-md">
        <span class="item-label">错误分</span>
        <div class="item-value">
          <div class="mb-sm text-red">{{detailDialog.data.errorScore}}分</div>
          <p class="desc text-gary-darker">
            累计错误{{detailDialog.data.checkErrorNumber}}条，总共{{detailDialog.data.executionNumber}}条，错误率为{{detailDialog.data.errorRate | toPercent}}，得分{{detailDialog.data.errorScore}}分</p>
        </div>
      </div>
      <div class="flex mb-md">
        <span class="item-label">工单分</span>
        <div class="item-value score-err">
          <div class="mb-sm text-red">{{detailDialog.data.issueScore}}分</div>
          <p class="desc text-gary-darker">累计工单{{detailDialog.data.issueNumber}}条，每个工单{{detailDialog.data.issueScore / detailDialog.data.issueNumber}}分，得分{{detailDialog.data.issueScore}}分</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Table, TableColumn, Dialog} from 'element-ui'
  import {SearchInput} from '@ej/ui'

  import {formatDate} from '~/utils/date'
  import {toPercent} from '~/utils'
  import QUERY_TREE from '~/graphql/query_quality_admin.gql'
  import QUERY_HISTORY from '~/graphql/query_quality_admin_history.gql'

  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(SearchInput)
  Vue.use(Dialog)

  export default {
    name: 'QualityAdim',

    filters: {
      formatDate,
      toPercent,
    },

    data () {
      return {
        keyword: '',
        dataList: [],
        historyDialog: {
          title: '',
          visible: false,
          dataList: [],
        },
        detailDialog: {
          visible: false,
          data: {},
        },
      }
    },

    created () {
      this.getData()
    },

    methods: {
      getData () {
        this.$apollo.query({
          query: QUERY_TREE,
          fetchPolicy: 'network-only',
          variables: {
            keyword: this.keyword,
          },
        }).then(res => {
          if (res) {
            this.dataList = res.data.data
          }
        })
      },
      getHisData (row) {
        this.historyDialog.title = row.name
        this.$apollo.query({
          query: QUERY_HISTORY,
          fetchPolicy: 'network-only',
          variables: {
            id: row.id,
          },
        }).then(res => {
          if (res) {
            this.historyDialog.dataList = res.data.data
            this.historyDialog.visible = true
          }
        })
      },
      gotoDetail (row) {
        this.detailDialog.data = Object.assign({}, row)
        this.detailDialog.visible = true
      },
    },
  }
</script>

<style lang="scss">
  .quality-adim-view {
    .el-dialog__header {
      @apply text-center;
    }

    .quality-detail {
      .el-dialog {
        width: 700px;

        .el-dialog__body {
          width: 375px;
          margin: 0 auto;
        }
      }

      .total {
        .num {
          @apply text-blue pl-lg;
          font-size: 24px;
        }
      }

      .item-label {
        width: 75px;
      }

      .desc {
        font-size: 13px;
      }
    }

    .ej-search-input > .el-input__inner {
      height: 40px;
    }
  }
</style>
