<template>
  <div class="disk-view"></div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/treemap'
  import 'echarts/lib/component/title'
  import 'echarts/lib/component/tooltip'

  export default {
    name: 'DiskChart',

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
        let data = this.data
        let myChart = echarts.init(this.$el)
        let formatUtil = echarts.format

        function getLevelOption () {
          return [
            {
              itemStyle: {
                normal: {
                  borderWidth: 0,
                  gapWidth: 5,
                },
              },
            },
            {
              itemStyle: {
                normal: {
                  gapWidth: 1,
                },
              },
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                normal: {
                  gapWidth: 1,
                  borderColorSaturation: 0.6,
                },
              },
            },
          ]
        }

        let option = {
          tooltip: {
            formatter: function (info) {
              let value = info.value
              let treePathInfo = info.treePathInfo
              let treePath = []
              for (let i = 1; i < treePathInfo.length; i++) {
                treePath.push(treePathInfo[i].name)
              }
              return [
                '<div class="tooltip-title">' + formatUtil.encodeHTML(treePath.join('/')) + '</div>',
                formatUtil.addCommas(value),
              ].join('')
            },
          },
          series: [
            {
              name: '全部',
              width: '100%',
              height: '100%',
              type: 'treemap',
              roam: 'false',
              visibleMin: 300,
              breadcrumb: {
                show: false,
              },
              label: {
                show: true,
                formatter: '{b}',
              },
              itemStyle: {
                normal: {
                  borderColor: '#fff',
                },
              },
              levels: getLevelOption(),
              data: data,
            },
          ],
          color: [
            '#FF6C6C',
            '#6C6DFF',
            '#C06CFF',
            '#6EEDBF',
            '#FF9E6C',
            '#75CCF3',
            '#FFE76C',
            '#F973CA',
            '#C8F072',
            '#B4B4B4',
          ],
        }
        myChart.setOption(option)
      },
    },
  }
</script>
