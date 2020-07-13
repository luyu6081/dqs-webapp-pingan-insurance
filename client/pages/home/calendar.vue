<template>
  <div class="carousel-detail">
    <div class="flex sub-title form-group-sm">
      <a href="javascript:" @click="setActiveItem('prev')" :class="{over: activeIndex === 0}">
        <i class="icon el-icon-arrow-left"></i>
      </a>
      <span class="title text flex-1">{{dataBase[activeIndex]['title']}}</span>
      <a href="javascript:" @click="setActiveItem('next')" :class="{over: activeIndex === listLength - 1}">
        <i class="icon el-icon-arrow-right"></i>
      </a>
    </div>
    <el-carousel ref="carouselDetail"
                 :autoplay="false"
                 indicator-position="none"
                 :initial-index="activeIndex"
                 arrow="never">
      <el-carousel-item v-for="(item, key) of dataBase" :key="key">
        <heatmap-chart width="306px"
                       height="240px"
                       :fromHome="true"
                       :calendarRange="item.ruleData.year + '-' + item.ruleData.month"
                       :heatmapData="dataList[`${item.ruleData.year}${item.ruleData.month}`]"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Carousel, CarouselItem} from 'element-ui'
  import {formatDate} from '~/utils/date'
  import queryData from '~/graphql/query_platform_err_data.gql'

  import HeatmapChart from '~/components/heatmap-chart.vue'

  Vue.use(Carousel)
  Vue.use(CarouselItem)

  export default {
    name: 'CalendarView',

    components: {
      HeatmapChart,
    },

    props: {
      id: {
        type: [Number, String],
        required: true,
      },
    },

    created () {
      this.initData()
    },

    computed: {
      listLength () {
        return this.dataBase.length
      },
    },

    data () {
      return {
        activeIndex: 2,
        dataList: {},
        dataBase: [],
        // 配置取几个月的数据，与产品协商暂定三个月
        configMonthNum: 3,
      }
    },

    methods: {
      setActiveItem (type) {
        if (type === 'prev') {
          if (this.activeIndex > 0) {
            this.activeIndex--
          } else {
            return
          }
        } else {
          if (this.activeIndex < this.listLength - 1) {
            this.activeIndex++
          } else {
            return
          }
        }

        // 是否需要获取数据
        let date = this.dataBase[this.activeIndex].ruleData
        if (!this.dataList[`${date.year}${date.month}`]) {
          this.getData(date)
        }

        this.$refs.carouselDetail.setActiveItem(this.activeIndex)
      },
      initData () {
        let d = new Date()
        let curDate = {
          y: d.getFullYear(),
          m: d.getMonth() + 1,
          d: d.getDate(),
        }
        for (let i = 0; i < this.configMonthNum; i++) {
          this.dataBase.unshift({
            title: `${String(curDate.m).padStart(2, 0)}月数据质量`,
            ruleData: {
              month: `${String(curDate.m).padStart(2, 0)}`,
              year: curDate.y,
            },
          })
          // 修改年月
          if (curDate.m <= 1) {
            curDate.y--
            curDate.m = 12
          } else {
            curDate.m--
          }
        }
        this.getData(this.dataBase[this.activeIndex].ruleData)
      },
      getData (date) {
        let params = {
          id: this.id,
          date: `${date.year}${date.month}`,
        }
        this.$apollo.query({
          query: queryData,
          fetchPolicy: 'network-only',
          variables: params,
        }).then(res => {
          if (res) {
            let data = res.data.data.map(it => [formatDate(it.dataTime, 'YYYY-MM-DD'), it.number, it.number > 0 ? 3 : 0])
            this.$set(this.dataList, `${date.year}${date.month}`, data)
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  @import "../../style/variables";

  .carousel-detail {
    .sub-title {
      a {
        height: 20px;
        text-align: center;
      }

      .icon {
        color: theme('colors.blue.default');
        font-size: 14px;
        transition: .01s;
      }

      .icon:hover {
        transform: scale(1.2, 1.2);
      }

      .over {
        pointer-events: none;

        .icon {
          color: $color_CFCFCF;
        }
      }
    }
  }
</style>
