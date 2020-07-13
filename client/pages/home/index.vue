<template>
  <div class="home-view">
    <!-- 左半部分 -->
    <div class="left">
      <div class="wrap special form-group-xs">
        <div class="title flex">
          <span class="text">本月数据质量专题</span>
          <!--todo: 暂时隐藏-->
          <!--<router-link class="btn action" to="/">查看历史专题</router-link>-->
        </div>
        <expand-comp maxHeight="390" v-if="specialHtml">
          <div v-html="specialHtml" class="html-special"></div>
        </expand-comp>
      </div>
      <div class="wrap form-group-xs target">
        <div class="title flex">
          <span class="flex-1">大数据信息中心关键数据质量指标</span>
          <router-link to="/" class="more">更多</router-link>
        </div>
        <div class="list">
          <div v-for="(item ,key) in targetList" :key="key" class="list-item">
            <target-item :data="item"/>
          </div>
        </div>
      </div>
      <four-block/>
    </div>

    <!-- 右半部分 -->
    <div class="right">
      <div class="wrap form-group-xs fast">
        <get-auth data="dqsIssueAdd">
          <a href="javascript:" class="btn action" @click="addOrder">提交数据质量工单</a>
        </get-auth>

        <div class="fast-info">
          待处理的工单数：<router-link :to="{name: 'issue-index', query: {type: issueTypeList.todo.key}}">{{fastOrder.wait}}</router-link> 条
        </div>
        <div class="fast-info">处理中工单：<router-link :to="{name: 'issue-index', query: {type: issueTypeList.open.key}}">{{fastOrder.starting}}</router-link> 条</div>
        <div class="fast-info">与我相关工单数：<router-link :to="{name: 'issue-index', query: {type: issueTypeList.related.key}}">{{fastOrder.related}}</router-link> 条</div>
      </div>
      <quality-situation ></quality-situation>
      <div class="wrap white-bg wrap-tree">
        <div class="title">数据质量地图</div>
        <disk-echart :data="diskTree" class="disk-tree"></disk-echart>
      </div>
      <wired-card v-if="false" style="display: block;">
        <span>数据质量社区</span>
        <wired-tabs>
          <wired-tab name="最新信息">
            <ul>
              <li v-for="n of 5" :key="n">Item {{n}}</li>
            </ul>
          </wired-tab>
          <wired-tab name="@我的">
            <ul>
              <li v-for="n of 5" :key="n">Item {{n}}</li>
            </ul>
          </wired-tab>
        </wired-tabs>
      </wired-card>
    </div>

    <create-issue-dialog :visible.sync="isIssueDlgVisible"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import xss from 'xss'
  import {diskTree} from '~/js/mockData/tress'
  import {data} from '~/js/mockData/home'
  import enumerate from '~/js/enum'
  import QUERY_ORDERFAST from '~/graphql/query_home_order.gql'
  import QUERY_SPECIAL from '~/graphql/query_home_special.gql'

  import DiskEchart from '~/components/echarts/disk.vue'
  import TargetItem from '~/components/home/target-item.vue'
  import ExpandComp from '~/components/expand'
  import CreateIssueDialog from '~/components/create-issue-dialog/index.vue'
  import QualitySituation from './quality-situation.vue'
  import FourBlock from './four-block'
  import GetAuth from '~/components/get-auth'

  Vue.use(GetAuth)

  export default {
    name: 'HomeView',

    data () {
      return {
        isIssueDlgVisible: false,
        diskTree: [],
        targetList: [],
        special: '',
        richAllShow: false,
        tabFixed: false,
        data: {},
        fastOrder: {},
        issueTypeList: enumerate.issueTypeList,
      }
    },

    computed: {
      specialHtml () {
        return xss(this.special, {
          onTagAttr: (tag, name, value, isWhiteAttr) => {
            if (tag === 'img' && name === 'src') {
              return `${name}="${xss.escapeAttrValue(value)}"}`
            }
          },
        })
      },
    },

    components: {
      TargetItem,
      FourBlock,
      ExpandComp,
      DiskEchart,
      QualitySituation,
      CreateIssueDialog,

    },

    created () {
      this.init()
    },

    methods: {
      init () {
        this.queryData()
        this.getOrderData()
        this.getSpecialData()
      },
      queryData () {
        this.diskTree = diskTree
        this.targetList = data.gauge_list
        this.data = data
      },
      addOrder () {
        this.isIssueDlgVisible = true
      },
      getOrderData () {
        this.$apollo.query({
          query: QUERY_ORDERFAST,
          fetchPolicy: 'network-only',
        }).then(res => {
          this.fastOrder = res.data.data
        })
      },
      getSpecialData () {
        this.$apollo.query({
          query: QUERY_SPECIAL,
          fetchPolicy: 'network-only',
        }).then(res => {
          this.special = res.data.data.special
        })
      },
    },
  }
</script>

<style lang="scss">
  @import "../../style/variables.scss";

  $left-width: 745px;
  $right-width: 350px;
  $gap-size: 5px;

  .home-view {
    @apply flex-auto flex text-black;

    > .left {
      width: $left-width;
    }

    > .right {
      flex: none;
      width: $right-width;
      margin-left: $gap-size;
    }

    .title {
      font-size: $font-size-big;
      font-weight: bold;
      padding-bottom: 7px;
    }

    .wrap {
      background: #fff;
      padding: 10px 20px;
    }

    .special {
      position: relative;

      .text {
        flex: 1;
      }

      .action-more {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        text-decoration: none;
        color: #000;
        background: linear-gradient(rgba(255, 255, 255, .9), #ddd);
      }

      .action {
        @apply text-blue;
        width: 90px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        font-size: $font-size-small;
      }
    }

    .target {
      .list {
        margin-left: -4px;
        margin-right: -4px;
      }

      .list-item {
        display: inline-block;
        margin: 0 3px 10px;
        padding: 8px 10px;
        width: 230px;
        height: 195px;
        border-radius: 4px 4px 4px 4px;
        box-shadow: 0 2px 6px 1px rgba(0, 0, 0, 0.07);
      }
    }

    .more {
      @apply text-blue;
      font-size: $font-size-normal;
      text-decoration: none;
    }

    .fixed-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 44px;

      .fixed-main {
        width: 1100px;
        margin: 0 auto;
      }

      .fixed-my-tabs {
        width: 745px;
        background: #fff;
        padding: 0 22px;
      }
    }

    .fast {
      /*align-items: center;*/
      padding: 10px 58px;

      .fast-info {
        line-height: 25px;
        margin-bottom: 3px;

        a {
          @apply text-blue;
          font-size: 18px;
        }
      }

      .action {
        @apply text-center border-0 text-white cursor-pointer bg-blue;

        width: 230px;
        height: 38px;
        line-height: 38px;
        font-size: theme('fontSize.lg');
        margin-bottom: 7px;
      }
    }

    .disk-tree {
      width: 304px;
      height: 325px;
    }

    .wrap-tree {
      @apply pb-md;
    }

    .html-special{
      img{
        margin: 0 auto;
      }
    }
  }
</style>
