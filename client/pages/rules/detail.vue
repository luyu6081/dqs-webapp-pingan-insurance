<template>
  <div class="rule-detail-view">
    <div v-if="isHasRuleData" ref="viewInner">
      <h2 class="rule-detail-title detail-first-row">
        <span class="rule-detail-title-text ell">{{detailInfo.name}}</span>
        <a href="javascript:" class="icon-collect flex" @click="handleStarred">
          <common-icon :icon="detailInfo.starred ? 'star' : 'star-o'" class="text-blue"/>
          <span>{{detailInfo.starred ? '已收藏' : '收藏'}}</span></a>
        <a href="javascript:" class="icon-subsrc flex" @click="handleSubscribed">
          <common-icon :icon="detailInfo.subscribed ? 'pin' : 'pin-o'" class="text-blue"/>
          <span>{{detailInfo.subscribed ? '已订阅' : '订阅'}}</span></a>
        <get-auth data="dqsIssueAdd">
          <a href="javascript:" class="issue-btn" @click="isIssueDlgVisible = true">提交工单</a>
        </get-auth>
      </h2>
      <div>
        <check-rule-leader-info :detailInfo="detailInfo"/>
      </div>
      <comp-tab :tabList="tabList" class="rule-detail-tab">
        <template #first>
          <h3 class="rule-detail-title">
            <span class="result-title">{{getCheckRecordTitle}}</span>
            <!-- FIXME: 下面的 <div> 并不是标题的内容 -->
            <div v-if="monthRange.length > 0 && prevDateCompare(visibleRangeFirstDate)"
                 class="arrow arrow-lt el-icon-arrow-left"
                 @click="handlePrevRules"></div>
            <div v-else class="arrow arrow-lt el-icon-arrow-left noData"></div>
            <div v-if="monthRange.length > 0 && nextDateCompare(visibleRangeLastDate)"
                 class="arrow arrow-gt el-icon-arrow-right"
                 @click="handleNextRules"></div>
            <div v-else class="arrow arrow-gt el-icon-arrow-right noData"></div>
          </h3>
          <div class="echarts-wrap">
            <heatmap-chart v-for="(mr, idx) in monthRange"
                           :key="idx + '-' + $route.params.ruleId"
                           height="270px"
                           :width="heatmapWidth + 'px'"
                           :calendarRange="mr.year + '-' + mr.month"
                           :heatmapData="seriesData[mr.date]"
                           :activeDate="activeDate"
                           @click-date="handleHeatmapClick"/>
          </div>
          <div class="rules-tab-wrap">
            <h4 class="rules-day-title">
              <span>{{detailDate}} 执行详情</span>
            </h4>
            <check-result-tab :checkTabInfo="checkTabInfo"/>
          </div>
        </template>

        <template #second>
          <check-rule :detailInfo="detailInfo" :rulesResultInfo="rulesResultInfo"/>
        </template>

        <template #third>
          <el-table v-if="detailInfo.scheduleHistory" :data="detailInfo.scheduleHistory" style="width: 100%" border class="mt-md">
            <el-table-column type=index label="序号" width="80"/>
            <el-table-column prop="name" label="变更日期" width="150">
              <template #default="{row}">
                {{row.createTm | formatDate('YYYY-MM-DD')}}
              </template>
            </el-table-column>
            <el-table-column prop="changesThat" label="变更说明"/>
          </el-table>
        </template>
      </comp-tab>
    </div>

    <!-- TODO: 也许应该填充一些占位信息 -->
    <div v-else></div>

    <create-issue-dialog :visible.sync="isIssueDlgVisible"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Table, TableColumn} from 'element-ui'

  import RULE_HEATMAP from '~/graphql/rule_heatmap.gql'
  import RULE_RESULT from '~/graphql/rule_result.gql'
  import RULE_DETAIL from '~/graphql/rule_detail.gql'
  import EDIT_COLLECT from '~/graphql/edit_collect.gql'
  import EDIT_SUBSCRIBE from '~/graphql/edit_subscribe.gql'

  import {cloneDeep} from '~/utils'
  import {formatDate} from '~/utils/date'
  import enumerate from '~/js/enum'
  import CreateIssueDialog from '~/components/create-issue-dialog/index.vue'
  import CommonIcon from '~/common-components/icon'
  import CompTab from '~/components/public-tab'
  import HeatmapChart from '~/components/heatmap-chart.vue'
  import CheckRuleLeaderInfo from './check-rule-leader-info'
  import CheckResultTab from './check-result-tab'
  import CheckRule from './check-rule'
  import GetAuth from '~/components/get-auth'

  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(GetAuth)
  const rulesResultInfo = () => {
    let data = []
    for (let i = 0; i < 10; i++) {
      data.push({
        ruleName: '规则名称',
        checkName: '检查对象',
        status: '状态',
        time: '2019-01-01 05:05:05',
      })
    }

    return {
      tags: [
        {name: '规则标签一', score: 444},
        {name: '规则标签二', score: 1},
      ],
      checkName: 'a库.dwODS.EF_CUST_ADDRESSS.c字段',
      checkType: 'ECIF表间字段一致性检查',
      checkTaskStatus: '运行',
      lastUpdateTime: '2011-02-12 18:03:01',
      executionPhase: '源系统',
      ETLTaskName: 'CHK_0_EF_CD_DWQC_DZH',
      checkTempTable: 'MO7_NONCONSIST_RES',
      checkTempInfo: {
        tableName: 'Mo7-2232_ssdw',
        zhName: '质量临时表',
        technologyLevel: '一层',
        businessTheme: '主题',
        otherCheck: '无',
        checkData: data,
      },
      tempSaveRecord: '5000',
      tempSaveDay: '--',
      checkSql: '',
      checkRuleDetail: '',
      technical: {
        name: '张浩',
        id: 213123,
        mobile: '13522222222',
        email: '1352222@163.com',
        address: '西湖洞里',
      },
      business: {
        name: '张强',
      },
      workNumbers: 3,
      checkTime: '2019-01-01 11:11:11',
    }
  }

  const NOW = new Date()
  // const TODAY_STR = formatDate(NOW, 'YYYY-MM-DD')
  const YESTERDAY = (() => {
    const d = new Date(NOW)
    d.setDate(d.getDate() - 1)
    return d
  })()
  const YESTERDAY_STR = formatDate(YESTERDAY, 'YYYY-MM-DD')
  const LAST_YEAR = (() => {
    const d = new Date(NOW)
    d.setFullYear(d.getFullYear() - 1)
    return d
  })()
  const LAST_YEAR_STR = formatDate(LAST_YEAR, 'YYYY-MM-DD')

  export default {
    name: 'RuleDetailView',

    components: {
      CommonIcon,
      CompTab,
      HeatmapChart,
      CheckResultTab,
      CheckRuleLeaderInfo,
      CheckRule,
      CreateIssueDialog,
    },

    filters: {
      formatDate,
    },

    data () {
      return {
        isIssueDlgVisible: false,
        detailDate: YESTERDAY_STR,
        isHasRuleData: true,
        currentRule: [],
        tabList: [{
          name: 'first',
          label: '检查结果',
        }, {
          name: 'second',
          label: '检查规则',
        }, {
          name: 'third',
          label: '变更历史',
        }],
        checkTabInfo: {
          result: [],
          log: '',
          data: [],
        },
        rulesResultInfo: {},
        heatmap: {
          options: {},
        },
        outOfRangeWdith: 480,
        heatmapMonth: [],
        screenWidth: document.body.clientWidth - 480,
        currentYearMonth: {
          year: NOW.getFullYear(),
          month: NOW.getMonth() + 1,
        },
        monthRange: [],
        seriesData: {},
        heatmapWidth: '350',
        detailInfo: {},
        activeDate: [],
      }
    },

    computed: {
      getCheckRecordTitle () {
        if (this.monthRange.length > 1) {
          return `${this.monthRange[0].year} - ${this.monthRange[0].month} ~
                    ${this.monthRange[this.getMonthRangeLastIndex()].year} - ${this.monthRange[this.getMonthRangeLastIndex()].month} 执行记录`
        } else if (this.monthRange.length > 0) {
          return `${this.monthRange[this.getMonthRangeLastIndex()].year} - ${this.monthRange[this.getMonthRangeLastIndex()].month} 执行记录`
        }
        return ''
      },

      visibleRangeFirstDate () {
        return this.monthRange[0].year + '-' + this.monthRange[0].month + '-' + NOW.getDate()
      },

      visibleRangeLastDate () {
        const lastIdx = this.getMonthRangeLastIndex()
        return this.monthRange[lastIdx].year + '-' + this.monthRange[lastIdx].month + '-' + NOW.getDate()
      },
    },

    watch: {
      '$route.params.ruleId' (ruleId) {
        this.monthRange = []
        this.seriesData = {}
        this.getDetailInfo()
        let monthList = this.getShowMonthList(this.getPossibleCalendarAmount())
        this.initCurrentRule(ruleId, monthList)
      },

      screenWidth (val) {
        if (this.monthRange.length > 0) {
          this.screenWidth = val
          // 屏幕宽度允许显示多个，如果是最后一条数据，数据向前移动
          let monthList = this.getShowMonthList(this.getPossibleCalendarAmount())
          this.initCurrentRule(this.$route.params.ruleId, monthList)
        }
      },
    },

    created () {
      this.rulesResultInfo = rulesResultInfo()
      this.getDetailInfo()
    },

    mounted () {
      window.onresize = () => {
        window.screenWidth = document.body.clientWidth - this.outOfRangeWdith
        this.screenWidth = window.screenWidth
      }

      this.initCurrentRule(
        +this.$route.params.ruleId,
        this.getShowMonthList(this.getPossibleCalendarAmount()),
      )
    },

    methods: {
      async getDetailInfo () {
        let respData = await this.$apollo.query({
          query: RULE_DETAIL,
          fetchPolicy: 'network-only',
          variables: {
            id: this.$route.params.ruleId,
          },
        })
        let data = respData.data.data
        data.templateParams = data.template.params.map((it, idx) => ({
          name: it.name,
          description: it.description,
          val: data.setting[idx],
        }))
        this.detailInfo = data
      },
      async getSeriesData (month) {
        if (this.seriesData[month]) {
          return
        }
        let respData = await this.$apollo.query({
          query: RULE_HEATMAP,
          fetchPolicy: 'network-only',
          variables: {
            input: {
              dates: [month],
              scheduleId: this.$route.params.ruleId,
            },
          },
        })
        let datalist = respData.data.data.map(it => {
          let item = [it.date, it.id, enumerate.ruleExecuteStatusList.find(s => s.value === it.rc).hatVal]
          return item
        })
        this.$set(this.seriesData, month, datalist)
      },

      async getResult (data) {
        if (data instanceof Array) {
          this.activeDate = [data]
          let respData = await this.$apollo.query({
            query: RULE_RESULT,
            fetchPolicy: 'network-only',
            variables: {
              id: data[1],
            },
          })
          let dataInfo = cloneDeep(respData.data.data)
          // let name = ''
          // enumerate.ruleExecuteStatusList.forEach(it => {
          //   if (it.value === data[2]) {
          //     name = it.name
          //   }
          // })
          // if (name) {
          //   dataInfo.result.unshift({
          //     name: '等级',
          //     value: name,
          //   })
          // }
          this.checkTabInfo = dataInfo
        } else {
          this.checkTabInfo = {
            result: [],
            log: '',
            data: [],
          }
          this.activeDate = []
        }
      },

      getMonthOrDayFormat (md) {
        md = Number(md)
        return md < 10 ? '0' + md : md
      },

      /**
       * 返回月份列表 最后一条数据的索引
       */
      getMonthRangeLastIndex () {
        return this.monthRange.length ? this.monthRange.length - 1 : 0
      },

      /**
       * 返回可显示的个数
       */
      getPossibleCalendarAmount () {
        return Math.floor(this.$refs.viewInner.offsetWidth / this.heatmapWidth) || 1
      },

      /**
       * 根据显示个数，返回年月的集合
       * @param startMonth 起始[年份，月份]
       * @param amount {number} - 月历数量（显示几个月的数据）
       */
      calculateMonthList (startMonth, amount = 1) {
        const monthList = []
        let _startYear = startMonth.year
        let _startMonth = Number(startMonth.month)
        let _monthRange = amount - 1

        monthList.push({year: startMonth.year, month: Number(startMonth.month)})
        for (let i = 0; i < _monthRange; i++) {
          let _month = _startMonth
          let _year = _startYear

          ++_month
          _month = _month > 12 ? ((_year = ++_year), 1) : _month

          _startYear = _year
          _startMonth = _month

          monthList.push({
            year: _year,
            month: _month,
          })
        }
        return monthList
      },

      /**
       * 根据屏幕宽度计算出显示数据月份的集合
       * 当前数据为最后一条时 调用此方法 月份做减法
       */
      subjoinMonthList (year, month, amount) {
        let _year = Number(year)
        let _month = Number(month)

        for (let i = 1; i < amount; i++) {
          const yearMonthObj = this.yearMonthChange(_year, _month, 'sub')
          _year = yearMonthObj.year
          _month = yearMonthObj.month
        }
        return this.calculateMonthList({year: _year, month: _month}, amount)
      },

      /**
       * 返回要显示的月份的集合
       */
      getShowMonthList (amount) {
        if (!this.monthRange.length && amount > 1) { // 初始进来 && 可显示大于1个日历图
          return this.subjoinMonthList(this.currentYearMonth.year, this.currentYearMonth.month, amount)
        } else if (!this.monthRange.length && amount < 2) { // 初始进来 && 可显示小于2个日历图
          return this.calculateMonthList(this.currentYearMonth, amount)
        } else if (amount > this.monthRange.length && !this.nextDateCompare(this.visibleRangeLastDate) && this.prevDateCompare(this.visibleRangeFirstDate)) { // 可视窗口宽度变化时 && 可显示大于1个日历图 && 当前日历图为最后一个
          const {year, month} = this.splitYearMonth(this.visibleRangeLastDate)
          return this.subjoinMonthList(year, month, amount)
        } else {
          const {year, month} = this.splitYearMonth(this.visibleRangeFirstDate)
          return this.calculateMonthList({year, month}, amount)
        }
      },

      splitYearMonth (yearMonth) {
        const [year, month] = yearMonth.split('-')
        return {
          year: Number(year),
          month: Number(month),
        }
      },

      async initCurrentRule (ruleId, monthRange) {
        /*解决 this.monthRange赋值为空，原因未知*/
        await this.$nextTick()
        this.monthRange = monthRange.map(it => {
          it.date = `${it.year}${this.getMonthOrDayFormat(it.month)}`
          return it
        })

        this.monthRange.map(mr => {
          let month = Number(mr.month)
          month = mr.year + '-' + this.getMonthOrDayFormat(month)
          this.getSeriesData(month.replace(/-/, '')).then(() => {
            let key = this.monthRange[0].date
            if (this.seriesData[key]) {
              if (this.seriesData[key][0] instanceof Array) {
                this.detailDate = this.seriesData[key][0][0]
              } else {
                this.detailDate = `${this.monthRange[0].year}-${this.getMonthOrDayFormat(this.monthRange[0].month)}-01`
              }
              this.getResult(this.seriesData[key][0])
            }
          })
        })
      },

      handleHeatmapClick (data) {
        this.detailDate = data[0]
        this.getResult(data)
      },

      handlePrevRules () {
        const hasPrevRules = this.prevDateCompare(this.visibleRangeFirstDate)
        if (hasPrevRules) {
          const {year, month} = this.splitYearMonth(this.visibleRangeFirstDate)
          const yearMonthObj = this.yearMonthChange(year, month, 'sub')
          const monthList = this.calculateMonthList({...yearMonthObj}, this.getPossibleCalendarAmount())
          this.initCurrentRule(this.$route.params.ruleId, monthList)
        }
      },

      handleNextRules () {
        const hasNextRules = this.nextDateCompare(this.visibleRangeFirstDate)
        if (hasNextRules) {
          const {year, month} = this.splitYearMonth(this.visibleRangeFirstDate)
          const yearMonthObj = this.yearMonthChange(year, month, 'add')
          const monthList = this.calculateMonthList({...yearMonthObj}, this.getPossibleCalendarAmount())
          this.initCurrentRule(this.$route.params.ruleId, monthList)
        }
      },

      /**
       * 目标日期 与 当前日期比较（向上比较）
       */
      nextDateCompare (targetDate) {
        const {year, month} = this.splitYearMonth(targetDate)
        const _targetDate = Number(year) * 100 + Number(month)
        const _currentDate = Number(this.currentYearMonth.year) * 100 + Number(this.currentYearMonth.month)
        return _currentDate > _targetDate
      },

      /**
       * 目标日期 与 当前日期比较（向下比较）
       * 目标日期是否在12个月之内
       */
      prevDateCompare (targetDate) {
        return new Date(targetDate).getTime() > new Date(LAST_YEAR_STR).getTime()
      },

      /**
       * 根据传入的年月 返回上一个年月或者下一个年月
       * @param year 年
       * @param month 月
       * @param subOrAdd 标识常量，add-下一个月，sub-上一个月
       */
      yearMonthChange (year, month, subOrAdd) {
        let _year = Number(year)
        let _month = Number(month)
        if (subOrAdd === 'sub') {
          _year = _month === 1 ? --_year : _year
          _month = _month === 1 ? 12 : --_month
        } else if (subOrAdd === 'add') {
          _year = _month === 12 ? ++_year : _year
          _month = _month === 12 ? 1 : ++_month
        }
        return {
          year: _year,
          month: _month,
        }
      },

      // todo: 收藏订阅暂停，后端调整
      handleStarred () {
        this.$apollo.mutate({
          mutation: EDIT_COLLECT,
          variables: {
            id: this.$route.params.ruleId,
            isOperations: !this.detailInfo.starred,
          },
        }).then(data => {
          if (data) {
            this.detailInfo.starred = !this.detailInfo.starred
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
        })
      },

      handleSubscribed () {
        //  订阅
        this.$apollo.mutate({
          mutation: EDIT_SUBSCRIBE,
          variables: {
            id: this.$route.params.ruleId,
            isOperations: !this.detailInfo.subscribed,
          },
        }).then(data => {
          if (data) {
            this.detailInfo.subscribed = !this.detailInfo.subscribed
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .rule-detail-tab {
    .el-tabs__item:hover {
      @apply text-blue;
    }

    .el-tabs__item.is-active {
      @apply text-blue;
    }

    .el-tabs__active-bar {
      @apply bg-blue;
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

    .el-tabs__header {
      margin: 0;
    }
  }

  .rule-detail-view {
    position: relative;

    .detail-first-row {
      display: flex;

      & > span {
        flex: 1;
      }
    }

    .rule-detail-title {
      margin: 10px 0;
      position: relative;
      user-select: none;

      .issue-btn {
        @apply text-white bg-blue inline-flex items-center justify-center;
        width: 140px;
        height: 32px;
        border-radius: 3px;
        font-size: $font-size-big;
        letter-spacing: 1px;
        cursor: pointer;
        z-index: 2;
      }

      a {
        font-size: $font-size-small;
        color: $black;
        margin-left: 20px;
        line-height: 34px;

        > span {
          line-height: 34px;
          vertical-align: top;
          display: inline-block;
          letter-spacing: 1px;
        }
      }

      .icon-subsrc {
        margin-right: 18px;
      }

      svg {
        line-height: 34px;
        width: 14px;
        height: 14px;
        margin-right: 5px;
        margin-top: 8px;
      }

      &-text {
        line-height: 34px;
        font-size: $font-size-20;
      }
    }

    > .el-card > .el-card__body {
      padding: 14px;
    }

    .arrow {
      @apply text-blue;

      font-weight: 700;
      cursor: pointer;
    }

    .noData {
      color: $color_d6d6d6;
    }

    .echarts-wrap {
      display: flex;
      align-items: center;
    }

    .result-title {
      padding-right: 8px;
    }
  }
</style>
