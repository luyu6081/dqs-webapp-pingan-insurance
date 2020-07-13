<template>
  <div v-ej-loading="loading" class="quality wrap form-group-xs">
    <el-dropdown trigger="click" :hide-timeout="150" class="my-dropdown">
      <a href="javascript:" class="el-dropdown-link">
        <i class="el-icon-arrow-down el-icon--right"></i>
      </a>
      <el-dropdown-menu slot="dropdown" class="my-dropdown-main">
        <el-dropdown-item v-for="(item, key) in dataList" :key="key">
          <div class="flex" @click="setActiveItem(key)">
            <span class="flex-1">{{item.name}}</span>
            <span v-if="item.score">{{item.score}}分</span>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-carousel ref="carousel"
                 height="460px"
                 :interval="5000"
                 indicator-position="none"
                 arrow="never">
      <el-carousel-item v-for="(item, key) in dataList" :key="key">
        <div class="quality-main">
          <div class="title">{{item.name}}</div>
          <div class="info form-group">
            <div class="flex-1 left">
              <span class="score">{{parseInt(item.score) || '-- '}}分</span>
              <span class="score-desc">综合评分</span>
            </div>
            <table class="my-table">
              <tr>
                <td class="space"><span>执行检查数</span>:</td>
                <td>{{item.executionNumber}}条</td>
              </tr>
              <tr>
                <td class="space"><span>检查报警数</span>:</td>
                <td>{{item.checkAlarmNumber}}个</td>
              </tr>
              <tr>
                <td class="space"><span>检查错误数</span>:</td>
                <td>{{item.checkErrorNumber}}个</td>
              </tr>
              <tr>
                <td class="space"><span>新增工单数</span>:</td>
                <td>{{item.changePlan}}个</td>
              </tr>
              <tr>
                <td class="space"><span>质量改进计划</span>:</td>
                <td>{{item.changePlan}}个</td>
              </tr>
            </table>
          </div>
          <calendar-view :id="item.objectId"/>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {Carousel, CarouselItem, Dropdown, DropdownItem, DropdownMenu} from 'element-ui'
  import {Loading} from '@ej/ui'
  import QUERY_TREE from '~/graphql/query_quality_admin.gql'

  import CalendarView from './calendar.vue'

  Vue.use(Carousel)
  Vue.use(CarouselItem)
  Vue.use(Dropdown)
  Vue.use(DropdownMenu)
  Vue.use(DropdownItem)
  Vue.use(Loading)

  export default {
    name: 'QualitySituation',

    components: {
      CalendarView,
    },

    data () {
      return {
        detailIndex: 0,
        dataList: [],
        loading: false,
      }
    },

    created () {
      this.getData()
    },

    methods: {
      setActiveItem (index) {
        this.$refs.carousel.setActiveItem(index)
      },
      getData () {
        this.loading = true
        this.$apollo.query({
          query: QUERY_TREE,
          fetchPolicy: 'network-only',
          variables: {
            keyword: this.keyword,
          },
        }).then(res => {
          this.loading = false
          if (res) {
            res.data.data.forEach(it => {
              if (it.platformScores && it.platformScores.length) {
                it.platformScores.forEach(itChild => {
                  itChild.activeItem = 0
                  this.dataList.push(itChild)
                })
              }
            })
            // 首页默认最多显示8 个平台
            this.dataList = this.dataList.slice(0, 8)
          }
        }).catch(() => {
          this.loading = false
        })
      },
    },
  }
</script>

<style lang="scss">
  @import "../../style/variables";

  .my-dropdown-main {
    padding: 5px 0;
    width: 306px;

    .el-dropdown-menu__item {
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: #000;
    }

    .el-dropdown-menu__item:hover, .el-dropdown-menu__item:focus {
      @apply text-blue;
      background: rgba(71, 135, 233, .1);
    }
  }

  .my-dropdown {
    .el-icon--right {
      @apply text-blue;

      font-size: 20px;
    }
  }

  $color_252525: #252525;

  .quality {
    position: relative;

    .my-table {
      line-height: 1;

      td {
        vertical-align: top;
      }

      .space {
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      }

      span {
        display: inline-block;
        width: 100px;
        height: 14px;
        overflow: hidden;
        text-align: justify;
        padding-right: 2px;

        &::after {
          content: '';
          display: inline-block;
          width: 100%;
        }
      }
    }

    .info {
      color: $color_252525;
      display: flex;
      align-items: center;
      padding-bottom: 21px;
      border-bottom: 1px solid #E3E3E3;
      margin-bottom: 20px;
    }

    .left {
      display: flex;
      flex-direction: column;
      align-items: center;

      .score {
        font-size: 60px;
        line-height: 84px;
        color: #4EC189;
      }

      .score-desc {
        font-size: $font-size-small;
      }
    }

    .sub-title {
      .text {
        font-size: $font-size-big;
        text-align: center;
        color: #252525;
      }
    }

    .my-dropdown {
      z-index: 1000;
      position: absolute;
      top: 8px;
      right: 22px;
    }
  }
</style>
