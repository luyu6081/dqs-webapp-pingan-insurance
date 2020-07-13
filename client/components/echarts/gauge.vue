<template>
  <div class="gauge-view"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/gauge'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/tooltip'
  // arr = [
  //   0.98,
  //   new echarts.graphic.LinearGradient(0, 0, 1, 0, [
  //     {offset: 0, color: '#ae3df6'},
  //     {offset: 1, color: '#53bef9'},
  //   ]),
  // ]
  export default {
    name: 'GaugeChart',

    props: {
      data: {
        type: String,
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
            formatter: '{c}%',
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {},
            },
          },
          series: [
            {
              name: '',
              type: 'gauge',
              radius: '90%',
              /* 设置仪表盘起始角度 */
              startAngle: 269,
              /* 设置仪表盘结束角度 */
              endAngle: -90,
              splitNumber: 0,
              splitLine: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  width: 10,
                  color: [
                    [
                      this.data.slice(0, -1) / 100,
                      new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                                                        offset: 0,
                                                                        color: '#677CE2',
                                                                      },
                                                                      {
                                                                        offset: 0.5,
                                                                        color: '#5FB1EF',
                                                                      },
                                                                      {
                                                                        offset: 1,
                                                                        color: '#75D5EF',
                                                                      },
                      ]),
                    ],
                    [
                      1, '#f5f5f5',
                    ],
                  ],
                },
              },
              axisLabel: {show: false},
              /* 设置指针 宽度 */
              pointer: {
                show: true,
                width: 5,
              },
              /* 设置指针 颜色 */
              itemStyle: {
                color: '#EB8F43',
              },
              detail: {
                show: false,
              },
              data: [{value: this.data.slice(0, -1)}],
            },
          ],
        }

        myChart.setOption(option)
      },
    },
  }
</script>
