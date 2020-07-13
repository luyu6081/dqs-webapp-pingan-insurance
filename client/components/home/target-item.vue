<template>
  <div class="target-item-view">
    <div class="item-title">
      <span>{{data.title}}</span>
      <!--<img class="position-top-2" src="@/assets/icon-light-success.svg" alt="">-->
      <i class="el-icon-s-opportunity icon-lamp ml-xs"></i>
    </div>
    <div class="flex">
      <div>
        <gauge-chart v-if="data.type === echartTypeList.gauge.key"
                     :data="data.rate"
                     class="my-echart"/>
        <line-chart v-else :data="data.data" class="my-echart"/>
      </div>
      <div class="other">
        {{data.time}}<br>
        数据执行情况 <br>
        <span class="num">{{data.number}}</span> 条<br>
        准确率 <span class="num">{{data.rate}}</span>
      </div>
    </div>
    <div class="time">检查评分{{data.time}}</div>
  </div>
</template>

<script>
  import enumerate from '~/js/enum'
  import GaugeChart from '../echarts/gauge'
  import LineChart from '../echarts/line'

  export default {
    name: 'TargetItem',

    components: {
      GaugeChart,
      LineChart,
    },

    props: {
      data: {
        type: Object,
      },
    },

    data () {
      return {
        echartTypeList: enumerate.echartTypeList,
      }
    },
  }
</script>

<style lang="scss">
  @import "../../style/variables";

  .target-item-view {
    * {
      box-sizing: border-box;
    }

    .item-title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 22px;
      font-size: 15px;
      margin-bottom: 15px;
    }

    img {
      margin-left: 9px;
      width: 14px;
      height: 18px;
    }

    .echart {
      width: 108px;
      height: 108px;
    }

    .other {
      margin-left: 5px;
      margin-right: 10px;
      line-height: 1.8em;
      font-size: 13px;
    }

    .time {
      /*@apply */
      margin-top: 5px;
      text-align: center;
      font-size: theme('fontSize.sm');
      color: #707070
    }

    .num {
      font-size: 19px;
      color: #FFB000;
    }

    .position-top-2 {
      position: relative;
      top: -2px;
    }

    .my-echart {
      width: 108px;
      height: 108px;
    }

    .icon-lamp {
      color: theme('colors.green.default');
      position: relative;
      top: -1px;
    }
  }
</style>
