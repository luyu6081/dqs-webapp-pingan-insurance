// 权限配置说明
export const issueTypeList = [
  {
    key: 'todo',
    value: 'todo',
    name: '我的待办',
  },
  {
    key: 'open',
    value: 'open',
    name: '进行中',
  },
  {
    key: 'closed',
    value: 'closed',
    name: '已完成',
  },
  {
    key: 'overdue',
    value: 'overdue',
    name: '异常工单',
  },
  {
    key: 'related',
    value: 'related',
    name: '与我相关',
  },
  {
    key: 'all',
    value: 'all',
    name: '全部工单',
  },
]

/*
* 四种角色信息
* value: 枚举值
* name: 拥有的权限
* */
let issueAudit = [
  {
    key: 'solve',
    value: 'SOLVE',
    name: '解决,转发,信息补全，驳回',
  },
  {
    key: 'some1',
    value: 'INFINITI1',
    name: '解决,转发,驳回',
  },
  {
    key: 'some2',
    value: 'INFINITI2',
    name: '解决,转发,驳回',
  },
  {
    key: 'completion',
    value: 'COMPLETION',
    name: '补全',
  },
  {
    key: 'hide',
    value: 'DONOTSHOW',
    name: '不显示',
  },
]

export default {
  issueTypeList,
  issueAudit,
}
