import Lodash from 'lodash'
/*
*  1级别  40-50
*  2级别  5-10
*  3级别  3- 10
*/

export const diskTree = [
  {
    'value': Lodash.random(40, 50),
    'name': '交易',
    'children': [
      {
        'value': Lodash.random(5, 10),
        'name': '存款交易',
      },
      {
        'value': Lodash.random(5, 10),
        'name': '贷款交易',
      },
      {
        'value': Lodash.random(5, 10),
        'name': '外汇交易',
      },
      {
        'value': Lodash.random(5, 10),
        'name': '支付结算交易',
      },
    ],
  },
  {
    'value': Lodash.random(40, 50),
    'name': '产品',
    children: [
      {
        value: Lodash.random(3, 10),
        name: '支付结算类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '存款类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '贷款类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '外延类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '担保类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '咨询类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '租赁业务类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '信托类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '期货类产品',
      },
      {
        value: Lodash.random(3, 10),
        name: '互转类产品',
      },
    ],
  },
  {
    'value': Lodash.random(40, 50),
    'name': '协议',
    children: [
      {
        value: 10,
        name: '账户',
      },
      {
        value: 20,
        name: '票据',
      },
    ],
  },
  {
    'value': Lodash.random(40, 50),
    'name': '财务',
    children: [
      {
        value: Lodash.random(5, 10),
        name: '总账',
      },
      {
        value: Lodash.random(5, 10),
        name: '会计科目',
      },
      {
        value: Lodash.random(5, 10),
        name: '日记账',
      },
    ],
  },

  {
    'value': Lodash.random(70, 100),
    'name': '客户',
    children: [
      {
        value: Lodash.random(5, 10),
        name: '对公',
        children: [
          {
            value: Lodash.random(1, 10),
            name: '银行管理',
          },
          {
            value: Lodash.random(1, 10),
            name: '基本信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '联系信息',
          },
        ],
      },
      {
        value: Lodash.random(5, 10),
        name: '个人',
        children: [
          {
            value: Lodash.random(1, 10),
            name: '关联信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '风险信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '评价信息',
          },
        ],
      },
      {
        value: Lodash.random(5, 10),
        name: '同业',
        children: [
          {
            value: Lodash.random(1, 10),
            name: '银行管理',
          },
          {
            value: Lodash.random(1, 10),
            name: '关联信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '风险信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '评价信息',
          },
        ],
      },
      {
        value: Lodash.random(5, 10),
        name: '特殊',
        children: [
          {
            value: Lodash.random(1, 10),
            name: '银行管理',
          },
          {
            value: Lodash.random(1, 10),
            name: '关联信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '风险信息',
          },
          {
            value: Lodash.random(1, 10),
            name: '评价信息',
          },
        ],
      },
    ],
  },
  {
    'value': Lodash.random(40, 50),
    'name': '渠道',
    children: [
      {
        value: Lodash.random(1, 10),
        name: '手机银行',
      },
      {
        value: Lodash.random(1, 10),
        name: '网上银行',
      },
      {
        value: Lodash.random(1, 10),
        name: '短信银行',
      },
      {
        value: Lodash.random(1, 10),
        name: '客服中心',
      },
      {
        value: Lodash.random(1, 10),
        name: '自助设备',
      },
      {
        value: Lodash.random(1, 10),
        name: '人工接触',
      },
      {
        value: Lodash.random(1, 10),
        name: '客户直连',
      },
      {
        value: Lodash.random(1, 10),
        name: '外部代理',
      },
      {
        value: Lodash.random(1, 10),
        name: '第三方',
      },
    ],
  },
  {
    'value': Lodash.random(40, 50),
    'name': '事件',
    children: [
      {
        value: Lodash.random(8, 10),
        name: '核心',
        children: [
          {
            value: Lodash.random(3, 10),
            name: '金融',
          },
          {
            value: Lodash.random(3, 10),
            name: '非金融',
          },
        ],
      },
      {
        value: Lodash.random(8, 10),
        name: '信用卡',
      },
      {
        value: Lodash.random(8, 10),
        name: '外围',
        children: [
          {
            value: Lodash.random(3, 10),
            name: '前置',
          },
          {
            value: Lodash.random(3, 10),
            name: '信贷',
          },
          {
            value: Lodash.random(3, 10),
            name: '国结',
          },
          {
            value: Lodash.random(3, 10),
            name: '保理',
          },
        ],
      },
    ],
  },
]
