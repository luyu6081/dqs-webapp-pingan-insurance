<template>
  <div class="scatter-content">
    <technical-panel v-if="detailInfo.techLinkman"
                     label="技术负责人"
                     :technicalInfo="detailInfo.techLinkman"
                     class="rule-leader-info"/>
    <technical-panel v-if="detailInfo.busiLinkman"
                     label="业务负责人"
                     :technicalInfo="detailInfo.busiLinkman"
                     class="rule-leader-info"/>
    <div class="rule-leader-info work-order-panel">
      <span>工单数量：</span>
      <span class="work-order-number dotted">{{detailInfo.workFlowTotal || 0}}个</span>
      <!--<el-card class="work-order-list">
        <h3>工单数量</h3>
        <el-table :data="workNumberInfo.workNumberList" style="width: 100%" height="160px">
          <el-table-column prop="title" label="标题" width="120"/>
          <el-table-column prop="status" label="状态"/>
        </el-table>
      </el-card>-->
    </div>
    <div class="rule-leader-info">
      <span>检查日期：</span>
      <span class="date-of-examination">{{detailInfo.modifyTm | formatDate}}</span>
    </div>
  </div>
</template>

<script>
  // import {
  //   Table as ElTable,
  //   TableColumn as ElTableColumn,
  // } from 'element-ui'

  import {formatDate} from '../../utils/date'
  import TechnicalPanel from './technical-panel.vue'

  export default {
    name: 'RulesTab',

    components: {
      // ElTable,
      // ElTableColumn,
      TechnicalPanel,
    },

    filters: {
      formatDate,
    },

    props: {
      workNumberInfo: {},
      detailInfo: {},
    },
  }
</script>

<style lang="scss">
  @import '../../style/variables.scss';

  .scatter-content {
    display: flex;

    .dotted {
      border-bottom: 1px dotted $color_666;
    }

    .rule-leader-info {
      min-width: 140px;
      flex: 1;
      font-size: $font-size-13;
      color: $color_666;
      line-height: 22px;
      margin-top: 12px;

      &:last-child {
        min-width: 200px;
      }
    }

    &-label {
      color: $color_666;
    }

    .work-order-panel {
      position: relative;

      &:hover {
        .work-order-list {
          display: block;
        }
      }
    }

    .work-order-list {
      display: none;
      position: absolute;
      background: $white;
      width: 240px;
      z-index: 2;
      left: -60px;

      .el-table td, .el-table th {
        padding: 8px;
      }

      .el-card__body {
        padding: 10px;
      }
    }

    .icon-leader {
      display: inline-block;
      vertical-align: top;
      width: 20px;
      height: 20px;
      background: $color_9FBFFF;
      border-radius: 50%;
      margin-right: 8px;
    }

    .business-leader {
      color: $blue;
    }
  }
</style>
