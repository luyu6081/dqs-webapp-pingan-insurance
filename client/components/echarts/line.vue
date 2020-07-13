<template>
  <div class="line-view"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/tooltip'

  export default {
    name: 'LineChart',

    props: {
      data: {
        type: Array,
      },
    },

    mounted () {
      this.setTree()
    },

    methods: {
      setTree () {
        let myChart = echarts.init(this.$el)
        let option = {
          tooltip: {
            formatter: '{c}',
          },
          grid: {
            top: '10%',
            left: '0',
            right: '10%',
            // bottom: '3%',
            // width: '100%',
            height: '90%',
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              fontSize: '8',
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              fontSize: '8',
            },
          },
          series: [{
            data: this.data,
            type: 'line',
            areaStyle: {
              color: 'rgba(195, 195, 195, .8)',
            },
            smooth: true,
          }],
        }

        myChart.setOption(option)
      },
    },
  }
</script>
