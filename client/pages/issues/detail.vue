<template>
  <div class="issue-detail-view">
    <nav class="mb-xs">
      <el-breadcrumb separator="/" class="px-md">
        <el-breadcrumb-item :to="{path: '/issues'}">工单列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{data.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </nav>
    <section class="process sec-detail clearfix">
      <div class="issue-title">{{data.title}}</div>
      <ej-task-flow v-if="processList.length" :data="processList" class="my-task-flow" @nag="nag"/>
      <div class="sub-title title-info">工单内容</div>
      <div class="flex flex-wrap">
        <div class="issue-item">发生日期：{{data.dateTime | formatDate}}</div>
        <div v-for="(item, idx) of orderTypeList" :key="idx" v-show="data.state === item.value" class="issue-item">
          状态：<i class="indicator" :class="`indicator-${item.key}`"></i>{{item.name}}
        </div>
        <div v-for="item of rankList" :key="item.key" v-show="data.urgency === item.value" class="issue-item"> 级别：<i
          class="indicator" :class="`indicator-${item.key}`"></i>{{item.name}}
        </div>
        <div v-if="data.resolveBy" class="issue-item">解决人：{{data.resolveBy.name || '--'}}</div>
        <div class="issue-item">解决时间：{{data.resolutionTime | formatDate}}</div>
        <div class="issue-item">解决周期：{{humanizeTime(data.period)}}</div>
        <div v-if="data.createdBy" class="issue-item">提交人：{{data.createdBy.name}}</div>
        <div class="issue-item">提交日期：{{data.dateTime | formatDate}}</div>
        <div class="issue-item"></div>
        <div class="issue-item"></div>
        <div class="issue-item"></div>
        <div class="issue-item"></div>
      </div>
      <div class="sub-title title-reason">事件原因和解决方案</div>
      <p>{{data.desc}}</p>

      <div class="sub-title title-rule">关联质量检查规则</div>
      <el-table :data="data.executions" v-if="data.executions">
        <el-table-column label="规则名称" prop="name"/>
        <el-table-column label="检查对象">
          <template #default="{row}">
            {{row.target | getTarget}}
          </template>
        </el-table-column>
        <el-table-column label="最后执行日期">
          <template #default="{row}">
            {{row.taskRunTm | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="技术负责人" prop="techLinkman.name"/>
        <el-table-column label="业务负责人" prop="busiLinkman.name"/>
      </el-table>
    </section>
    <audit-base v-if="data.issueNode !== issueAudit.hide.value" :auditName="data.issueNode" @change="getData"/>
    <section v-if="historyList.length">
      <div class="sub-title title-history">工单历史</div>
      <audit-history :options="historyList">
        <template #attachment="{options, content}">
          <attach-slot v-if="content || (options || []).length" :options="options" :content="content"/>
          <span v-else class="ml-3">暂无</span>
        </template>
      </audit-history>
    </section>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {
    Breadcrumb,
    BreadcrumbItem,
    Col,
    Row,
    Step,
    Steps,
    Table,
    TableColumn,
  } from 'element-ui'
  import {TaskFlow} from '@ej/ui'

  import enumerate from '~/js/enum'
  import {formatDate, humanizeTime} from '~/utils/date'
  import {getTarget, humanizeFileSize, toImgHref} from '~/utils'
  import QUERY_DETAIL from '~/graphql/issue_detail.gql'
  import Popcard from '~/common-components/popcard'
  import AuditHistory from '~/components/issues/history-task/audit-history'
  import AttachSlot from '~/components/issues/history-task/attach-slot'
  import AuditBase from './audit/base'

  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Steps)
  Vue.use(Step)
  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(TaskFlow)
  Vue.use(Breadcrumb)
  Vue.use(BreadcrumbItem)
  Vue.use(Popcard)

  const TaskType = {}
  TaskType[TaskType['Wait'] = 1] = 'Wait'
  TaskType[TaskType['Starting'] = 2] = 'Starting'
  TaskType[TaskType['Success'] = 3] = 'Success'
  TaskType[TaskType['Error'] = 4] = 'Error'

  export default {
    name: 'IssueDetailView',

    components: {
      AuditHistory,
      AttachSlot,
      AuditBase,
    },

    filters: {
      formatDate,
      getTarget,
    },

    data () {
      return {
        processList: [],
        timelineData: [],
        orderTypeList: enumerate.orderTypeList,
        rankList: enumerate.rankList,
        data: {},
        historyList: [],
        issueAudit: enumerate.issueAudit,
      }
    },

    created () {
      this.init()
    },

    methods: {
      init () {
        this.getData()
      },
      getData () {
        this.$apollo.query({
          query: QUERY_DETAIL,
          fetchPolicy: 'network-only',
          variables: {
            id: this.$route.params.issueId,
          },
        }).then(res => {
          this.data = res.data.data
          this.getHistory()
        })
      },
      nag (data) {
        //  todo: 催一下 联调
        console.log(data)
      },
      getHistory () {
        function getTaskFlowStatus (item) {
          let str = ''
          if (item.handleStateEnum === enumerate.issueNodeStatus.already.value) {
            str = item.operation === 'REJECT' ? enumerate.issueNodeStatus.already.hatVal.reject : enumerate.issueNodeStatus.already.hatVal.pass
          } else {
            str = enumerate.issueNodeStatus.find(itChild => itChild.value === item.handleStateEnum).hatVal
          }
          return str
        }

        let history = []
        let processList = []
        this.data.timeline.forEach(it => {
          // 获取当前人身份
          this.getAudit(it)
          // 提交历史
          if (it.handleStateEnum === enumerate.issueNodeStatus.already.value) {
            let item = {
              title: it.name,
              name: it.transact.name,
              img: toImgHref(it.transact.avatar),
              timestamp: it.endDate,
              duration: it.durationInMillis, // todo: 毫秒需要转化
              content: it.opinion,
              // todo 缺少的字段
              // 等schema出来后对照附件字段
              attachment: [],
            }
            if (it.files instanceof Array) {
              it.files.forEach(itChild => {
                let file = itChild.fileNname.split('.')
                item.attachment.push({
                  type: file[1],
                  filename: file[0],
                  size: humanizeFileSize(itChild.size),
                  img: itChild.filePath,
                })
              })
            }
            history.unshift(item)
          }

          //  流程
          let processItem = {
            title: it.name,
            type: getTaskFlowStatus(it),
            tasks: [{
              user_img: it.transact.avatar || '',
              user_name: it.transact.name || '',
            }],
          }
          if (it.endDate) {
            processItem.tasks[0].timestamp = it.endDate
          }
          if (it.durationInMillis) {
            processItem.tasks[0].duration = it.durationInMillis
          }
          processList.push(processItem)
        })

        this.historyList = history
        this.processList = processList
      },

      getAudit (it) {
        if (it.handleStateEnum === enumerate.issueNodeStatus.process.value) {
          this.auditName = it.name
        }
      },

      gotoList () {
        this.$router.push({name: 'issue-index'})
      },

      humanizeTime (val) {
        return val ? humanizeTime(val) : '--'
      },
    },
  }

  /*
  * 解决与转发
  *   解决,转发,信息补全，驳回
  * 补全
  *   补全
  * 无限的转发
  *   解决,转发,驳回
  * 不显示
  * */
</script>

<style lang="scss">
  @import "../../style/common";

  $color_E1E1E1: #E1E1E1;

  .issue-detail-view {
    flex: auto;

    nav {
      margin: 0 0 10px;

      a {
        color: #5A5A5A;
        text-decoration: none;

        &:hover {
          border-bottom: 1px solid;
        }
      }
    }

    .issue-title {
      font-size: $font-size-big;
      font-weight: bold;
      margin-bottom: 27px;
    }

    h2 {
      font-size: 18px;
      font-weight: normal;
      padding: 0 20px;
    }

    h3 {
      font-size: 16px;
    }

    section {
      background: #fff;
      padding: 20px;
      margin-bottom: 10px;

      &.sec-detail {
        padding-top: 7px;

        .el-col {
          line-height: 2.5;
        }

        .indicator {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: #000;
          margin-right: 5px;
        }

        p {
          line-height: 1.5;
        }

        .indicator-overtime {
          @apply bg-yellow;
        }

        .indicator-starting {
          @apply bg-blue;
        }

        .indicator-end {
          @apply bg-green;
        }

        .indicator-severity {
          @apply bg-red;
        }

        .indicator-warning {
          @apply bg-orange;
        }

        .indicator-focus {
          @apply bg-yellow;
        }

        .indicator-low {
          @apply bg-blue;
        }

        .indicator-normal {
          @apply bg-green;
        }
      }
    }

    .timeline-dot {
      width: 40px;
      height: 40px;
      border-radius: 9999px;
      background: #477DE9;
    }

    .process {
      padding-bottom: 15px;

      .end {
        .circle {
          background: $blue;
        }

        .icon {
          color: $blue;
        }
      }

      .end {
        .circle {
          background: $blue;
        }

        .icon {
          color: $blue;
        }
      }

      .starting {
        .circle {
          @apply bg-blue;
        }
      }
    }

    .process-item {
      display: flex;
      margin-bottom: 10px;
      margin-right: 35px;

      .left {
        margin-right: 30px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: $color_E1E1E1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .title {
        height: 17px;
        line-height: 17px;
        font-size: $font-size-small;
        color: $color_515151;
      }

      .right {
        height: 40px;
        display: flex;
        align-items: center;
      }

      .icon {
        font-size: 22px;
        color: $color_E6E6E6;
      }

      .email {
        width: 20px;
        height: 16px;
        position: relative;
        top: 2px
      }

      .p-item {
        padding: 5px 0;
        height: 20px;
        display: flex;
        align-items: center;
      }

      .p-action {
        display: flex;
        align-items: center;

        .press {
          margin-left: 5px;
        }
      }
    }

    .my-task-flow {
      padding-bottom: 20px;
    }

    .sub-title {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .sec-detail {
      .el-col {
        line-height: 2em;
      }

      .title-info {
        margin-bottom: 5px;
      }

      .title-reason {
        margin: 12px 0 8px;
      }

      .title-rule {
        margin: 14px 0 0;
      }
    }

    .title-history {
      margin-bottom: 15px;
    }

    .issue-item {
      @apply flex items-center;
      width: 33.3%;
      line-height: 2.5;
    }
  }
</style>

<style lang="scss">
  @import "../../style/variables.scss";

  .issue-detail-view {
    .el-breadcrumb__inner.is-link,
    .el-breadcrumb__inner.is-link:hover,
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      color: $color_515151;
      font-weight: 400;
    }
  }
</style>
