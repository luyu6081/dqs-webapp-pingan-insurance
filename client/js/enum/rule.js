let taskStatus = [
  {
    key: 'error',
    value: 'ERROR',
    name: '错误',
  },
  {
    key: 'normal',
    value: 'NORMAL',
    name: '正常',
  },
  {
    key: 'warning',
    value: 'WARNING',
    name: '预警',
  },
]
let ruleStatus = [
  {
    key: 'true',
    value: true,
    name: '运行',
    val: 1,
  },
  {
    key: 'false',
    value: false,
    name: '暂停',
    val: 2, // 由于组件库不支持false， 故临时添加转义值
  },
]
let ruleExecuteStatusList = [
  {
    key: 'severity',
    value: 'FATAL',
    name: '严重错误',
    hatVal: 4,
  },
  {
    key: 'error',
    value: 'ERROR',
    name: '错误',
    hatVal: 3,
  },
  {
    key: 'warning',
    value: 'WARNING',
    name: '警告',
    hatVal: 2,
  },
  {
    key: 'low',
    value: 'INFO',
    name: '一般',
    hatVal: 1,
  },
  {
    key: 'normal',
    value: 'NORMAL',
    name: '正常',
    hatVal: 0,
  },
]
let ruleInterval = [
  {
    key: 'day',
    value: 'DAY',
    name: '日',
  },
  {
    key: 'week',
    value: 'WEEK',
    name: '周',
  },
  {
    key: 'month',
    value: 'MONTH',
    name: '月',
  },
]
let ruleLocation = [
  {
    key: 'pre',
    value: 'PRE',
    name: '前置',
  },
  {
    key: 'rear',
    value: 'REAR',
    name: '后置',
  },
]

export default {
  taskStatus,
  ruleStatus,
  ruleExecuteStatusList,
  ruleLocation,
  ruleInterval,
}
