<template>
  <div class="rules-tab">
    <comp-tab :tabList="tabList" class="rules-tab-class">
      <template #first>
        <div class="check-result">
          <div v-if="checkTabInfo.result.length">
            <div class="check-result-column">
              <span class="label" v-if="checkTabInfo.rc">等级</span>
              <span class="value">{{getRevel}}</span>
            </div>
            <div v-for="(item, idx) in checkTabInfo.result" :key="idx" class="check-result-column">
              <span class="label">{{item.description}}</span>
              <span class="value">{{item.value}}</span>
            </div>
          </div>
          <div v-else class="no-data">暂无</div>
        </div>
      </template>

      <template #second>
        <!-- todo: 渲染器 -->
        <div class="check-m check-h">
          <div v-if="checkTabInfo.log">
            <ej-highlight :code="checkTabInfo.log" language="sql" :key="highlightKey"/>
          </div>
          <div v-else class="no-data">暂无</div>
        </div>
      </template>

      <template #third>
        <div class="check-m">
          <el-table v-if="checkTabInfo.data.length"
                    :data="checkTabInfo.data"
                    size="mini"
                    height="250px"
                    style="width: 100%"
                    class="my-rule-table">
            <el-table-column v-for="(it, idx) of errorLabel" :key="idx" :prop="it" :label="it"/>
          </el-table>
          <div v-else class="no-data">暂无</div>
        </div>
      </template>
    </comp-tab>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Table as ElTable, TableColumn as ElTableColumn} from 'element-ui'
  import {Highlight} from '@ej/ui'

  import CompTab from '~/components/public-tab'
  import enumerate from '~/js/enum'

  Vue.use(Highlight)

  export default {
    name: 'RulesTab',

    components: {
      ElTable,
      ElTableColumn,
      CompTab,
    },

    props: {
      checkTabInfo: Object,
    },

    data () {
      return {
        tabList: [{
          name: 'first',
          label: '检查结果',
        }, {
          name: 'second',
          label: '执行日志',
        }, {
          name: 'third',
          label: '错误数据',
        }],
        errorData: [],
        errorLabel: [],
        highlightKey: 0,
      }
    },

    computed: {
      getRevel () {
        return enumerate.ruleExecuteStatusList.find(it => it.value === this.checkTabInfo.rc).name
      },
    },

    watch: {
      checkTabInfo () {
        this.initErrorData()
      },
      'checkTabInfo.log' () {
        this.highlightKey++
      },
    },

    created () {
      this.initErrorData()
    },

    methods: {
      initErrorData () {
        let data = this.checkTabInfo.data
        if (data.length) {
          let listLength = 0
          this.errorLabel = Object.keys(this.checkTabInfo.data[0])
        }
      },
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .rules-tab {
    &-class {
      .el-tabs__item:hover {
        color: $color_FA8C16;
      }

      .el-tabs__item.is-active {
        color: $color_FA8C16;
      }

      .el-tabs__active-bar {
        background: $color_FA8C16;
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

    .check-m {
      margin-top: 15px;
    }

    .check-result {
      margin-top: 15px;

      img {
        margin-left: 10px;
        vertical-align: middle;
      }

      span {
        font-size: $font-size-small;
        color: $black;
        line-height: 18px;
        letter-spacing: 0.75px;
        margin-top: 13px;

        &.label::after {
          content: '：';
        }
      }
    }
    .check-h{
      max-height: 475px;
      overflow-y: auto;
    }

    .my-rule-table::before {
      background: transparent;
    }
  }
</style>
