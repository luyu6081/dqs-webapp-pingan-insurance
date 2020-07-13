<template>
  <div class="tabs-item">
    <div v-if="type === tabList.order.key" class="order-main">
      <div class="flex item-title">
        <com-tooltip :html="data.title">
          <router-link :to="{name: 'issue-detail', params: {issueId: data.id}}" class="flex-1 single pr-sm text-blue">
            {{data.title}}
          </router-link>
        </com-tooltip>
        <span v-if="data.state === orderTypeList.overtime.value" class="btn tag wait">待处理</span>
        <span v-else-if="data.state === orderTypeList.starting.value"
              class="btn tag starting">处理中</span>
        <span v-else class="btn tag end">已处理</span>
      </div>
      <div class="item-sub-title single">
        提交人：{{data.createdBy.name}} 提交日期：{{data.createdAt | formatDate}}
      </div>
    </div>
    <div class="focus-main" v-else>
      <div class="flex item-title">
        <com-tooltip :html="data.name">
          <router-link :to="{name: 'rule-detail', params: {ruleId: data.id}}" class="text single text-blue">
            {{data.name}}
          </router-link>
        </com-tooltip>
        <i v-if="!data.rc === ruleExecuteStatusList.normal.value" class="el-icon-s-opportunity icon-lamp end"></i>
      </div>
      <div class="item-sub-title single target-name">
        检查对象：{{data.target | getTarget}}
      </div>
      <div class="item-sub-title single">
        最后执行日期：{{ data.taskRunTime ? formatDate(data.taskRunTime) : '暂无'}}
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import enumerate from '~/js/enum'
  import {formatDate} from '~/utils/date'
  import {getTarget} from '~/utils'

  import ComTooltip from '~/components/tooltip'

  Vue.use(ComTooltip)

  export default {
    name: 'TabsItem',

    filters: {
      formatDate,
      getTarget,
    },

    props: {
      type: {
        type: [Number, String],
      },
      data: {
        type: Object,
      },
    },

    data () {
      return {
        tabList: enumerate.tabTypeList,
        orderTypeList: enumerate.orderTypeList,
        ruleExecuteStatusList: enumerate.ruleExecuteStatusList,
      }
    },

    computed: {
      lampClass () {
        let obj = enumerate.ruleExecuteStatusList.find(it => it.value === this.data.rc)
        return obj ? obj.key : ''
      },
    },

    methods: {
      formatDate,
    },
  }
</script>

<style lang="scss">
  @import "../../style/variables.scss";

  $error1: #EB6F4F;
  $error2: #EA8F24;
  $warn: #FFB000;
  $success: #4EC189;
  $gray_A3A3A3: #A3A3A3;

  .tabs-item {
    .item-title {
      margin-bottom: 5px;
      align-items: center;

      .text {
        max-width: 140px;
        padding-right: 10px;
        cursor: pointer;
      }

      .tag {
        width: 44px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border: 1px solid $error1;
        font-size: $font-size-small;
        cursor: auto;
      }

      .wait {
        color: $error1;
      }

      .starting {
        border-color: $warn;
        color: $warn;
      }

      .end {
        border-color: $success;
        color: $success;
      }
    }

    .item-sub-title {
      color: $gray_A3A3A3;
      font-size: 13px;
    }

    .focus-main {
      img {
        width: 14px;
        height: 18px;
        margin: 0 10px;
      }

      .tag {
        margin: 5px;
        border-color: $error2;
        color: $error2;
      }

      .tag-more {
        letter-spacing: 2px;
      }

      .target-name {
        margin-bottom: 5px;
      }

      .text {
        max-width: 290px;
      }
    }

    .icon-lamp {
      position: relative;
      top: -2px;
      font-size: theme('fontSize.xl');
    }

    .severity {
      color: $error1;
    }

    .error {
      color: $error2;
    }

    .waning {
      color: $warn;
    }

    .low, .normal {
      color: $success;
    }
  }
</style>
