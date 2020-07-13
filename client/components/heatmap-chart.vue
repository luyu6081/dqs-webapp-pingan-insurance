<template>
  <div class="echarts-chart">
    <div ref="echarts" :style="{width: width, height: height}"></div>
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/heatmap'
  import 'echarts/lib/chart/scatter'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/calendar'
  import 'echarts/lib/component/visualMap'
  import enumerate from '~/js/enum'

  const getMonthDay = (yearMonth) => {
    let dayData = []
    const [year, month] = yearMonth.split('-')
    const startDate = year + '-' + month + '-01'
    const endDate = year + '-' + (Number(month) + 1) + '-01'
    const start = +echarts.number.parseDate(startDate)
    const end = +echarts.number.parseDate(endDate)
    let dayTime = 3600 * 24 * 1000

    for (let time = start; time < end; time += dayTime) {
      dayData.push([
        echarts.format.formatTime('yyyy-MM-dd', time),
        1,
      ])
    }
    return dayData
  }

  export default {
    name: 'CalendarHeatmap',

    props: {
      width: {
        type: String,
        default: '400px',
      },
      height: {
        type: String,
        default: '300px',
      },
      calendarRange: {
        type: String,
        required: true,
      },
      heatmapData: {
        required: true,
      },
      activeDate: {
        type: Array,
      },
      fromHome: {
        type: Boolean,
        default: false,
      },
    },

    data () {
      return {
        scatterChart: {},
      }
    },

    watch: {
      calendarRange () {
        this.$nextTick(() => {
          this.initChart()
        })
      },
      heatmapData () {
        this.initChart()
      },
      activeDate () {
        this.initChart()
      },
    },

    mounted () {
      this.initChart()
    },

    methods: {
      initChart () {
        let echartsChart = echarts.init(this.$refs.echarts)
        this.echartsChart = echartsChart
        echartsChart.setOption(this.setOptions(), true)
        echartsChart.off('click')
        echartsChart.on('click', (params) => {
          this.$emit('click-date', params.data)
        })
      },

      setOptions () {
        let partOptions = {
          tooltip: {
            position: 'top',
            confine: true,
            padding: 5,
            textStyle: {
              fontSize: 12,
            },
            formatter: (params) => {
              const currentData = this.heatmapData.find(s => s[0] === params.value[0])

              if (this.fromHome) {
                return `<div>数量 ：${currentData[1]}</div>`
              } else {
                let name = ''
                enumerate.ruleExecuteStatusList.forEach(it => {
                  if (it.hatVal === currentData[2]) {
                    name = it.name
                  }
                })
                return `<div>等级 ：${name}</div>`
              }
            },
          },

          visualMap: [{
            min: 0,
            max: 4,
            calculable: true,
            seriesIndex: [1],
            orient: 'horizontal',
            inRange: {
              color: [
                '#FFF',
                'rgba(255, 106, 106, 0.2)',
                'rgba(255, 106, 106, 0.4)',
                'rgba(255, 106, 106, 0.6)',
                'rgba(255, 106, 106, 0.8)',
                'rgba(255, 106, 106, 1)',
              ],
            },
            show: false,
          }, {
            min: 0,
            max: 4,
            calculable: true,
            seriesIndex: [2],
            orient: 'horizontal',
            inRange: {
              color: [
                '#FFF',
                'rgba(255, 106, 106, 0.2)',
                'rgba(255, 106, 106, 0.4)',
                'rgba(255, 106, 106, 0.6)',
                'rgba(255, 106, 106, 0.8)',
                'rgba(255, 106, 106, 1)',
              ],
            },
            show: false,
          }],

          calendar: [{
            width: '90%',
            height: '70%',
            left: '5%',
            orient: 'vertical',
            dayLabel: {
              firstDay: 1,
              nameMap: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#eee',
                width: 1,
              },
            },
            itemStyle: {
              color: '#eee',
              borderColor: '#fff',
              borderWidth: 6,
            },
            yearLabel: {
              show: false,
            },
            monthLabel: {
              show: false,
            },
            range: this.calendarRange,
          }],

          series: [
            {
              type: 'scatter',
              coordinateSystem: 'calendar',
              calendarIndex: 0,
              symbolSize: 1,
              label: {
                normal: {
                  show: true,
                  formatter: (params) => {
                    const d = echarts.number.parseDate(params.value[0])
                    return d.getDate()
                  },
                  textStyle: {
                    fontSize: 12,
                    color: '#000',
                  },
                },
              },
              data: getMonthDay(this.calendarRange),
            },
            {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              data: this.heatmapData,
            },
            {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              // 默认选中的信息，从外面 传进来，更改数据后再改变它，同时更新热力图
              data: this.activeDate,
              itemStyle: {
                borderColor: 'red',
                borderWidth: 2,
              },
            },
          ],
        }
        return partOptions
      },
    },
  }
</script>
