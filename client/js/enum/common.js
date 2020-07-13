let echartTypeList = [
  {
    key: 'dist',
    value: 1,
    name: '矩形树图',
  },
  {
    key: 'gauge',
    value: 2,
    name: '仪表盘',
  },
  {
    key: 'line',
    value: 3,
    name: '折线图',
  },
]
let orderTypeList = [
  {
    key: 'overtime',
    value: 'OVERDUE',
    name: '已超时',
  },
  {
    key: 'starting',
    value: 'OPEN',
    name: '处理中',
  },
  {
    key: 'end',
    value: 'CLOSED',
    name: '已处理',
  },
]
let rankList = [
  {
    key: 'severity',
    value: 'SEVERITY',
    name: '严重警告',
  },
  {
    key: 'warning',
    value: 'WARNING',
    name: '警告',
  },
  {
    key: 'focus',
    value: 'FOCUS',
    name: '关注',
  },
  {
    key: 'low',
    value: 'LOW',
    name: '一般',
  },
  {
    key: 'normal',
    value: 'NORMAL',
    name: '正常',
  },
]

let issueOperateStatus = [
  {
    key: 'pass',
    value: 'PASS',
    name: '通过',
    hasAudit: ['SOLVE', 'INFINITI1', 'INFINITI2'],
  },
  {
    key: 'completion',
    value: 'COMPLETION',
    name: '信息补全',
    hasAudit: ['SOLVE'],
  },
  {
    key: 'reject',
    value: 'REJECT',
    name: '驳回',
    hasAudit: ['SOLVE', 'INFINITI1', 'INFINITI2'],
  },
  {
    key: 'resolve',
    value: 'RESOLVE',
    name: '转发',
    hasAudit: ['SOLVE', 'INFINITI1', 'INFINITI2'],
  },
]
let issueNodeStatus = [
  {
    key: 'already',
    value: 'ALREADY',
    name: '已经办理',
    hatVal: {
      pass: 3,
      reject: 4,
    },
  },
  {
    key: 'process',
    value: 'PROCESS',
    name: '正在办理',
    hatVal: 2,
  },
  {
    key: 'not',
    value: 'NOT',
    name: '还没有办理',
    hatVal: 1,
  },
]
let issueOperateSuccess = [
  {
    key: 'solve',
    value: 'SOLVE',
    name: '已解决',
  },
  {
    key: 'invalid',
    value: 'INVALid',
    name: '未发现问题',
  },
  {
    key: 'ignore',
    value: 'IGNORE',
    name: '忽略',
  },
  {
    key: 'other',
    value: 'OTHER',
    name: '其他',
  },
]
export default {
  echartTypeList,
  orderTypeList,
  rankList,
  issueOperateStatus,
  issueNodeStatus,
  issueOperateSuccess,
}
