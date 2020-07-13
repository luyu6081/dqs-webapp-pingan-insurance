<template>
  <div class="four-block-view white-bg">
    <affix ref="affix" :offset="50" :amendOffsetTop="amendOffsetTop">
      <el-tabs slot="main" v-model="activeTab" class="my-tabs white-bg" @tab-click="handleTab">
        <el-tab-pane v-for="(item, key) in tabList" :key="key" :label="item.name" :name="item.key"/>
      </el-tabs>
    </affix>
    <div class="tabs-rules">
      <div :ref="tabList.order.key" class="order-list pb-xs">
        <div class="title flex sub-title">
          <span class="flex-1">最新提交的工单</span>
          <router-link :to="{name: 'issue-index'}" class="more">更多</router-link>
        </div>
        <div v-if="orderList.length" class="list">
          <div v-for="(item, key) in orderList" :key="key" class="list-item">
            <tabs-item :data="item" :type="tabList.order.key"/>
          </div>
        </div>
        <div v-else class="no-data">
          暂无
        </div>
      </div>
      <div class="focus-rules pb-xs">
        <div :ref="tabList.focus.key" class="title flex sub-title">
          <span class="flex-1">我关注的检查规则</span>
          <router-link :to="{name: 'rule-index'}" class="more">更多</router-link>
        </div>
        <div v-if="focusRules.length" class="list">
          <div v-for="(item, key) in focusRules" :key="key" class="list-item">
            <tabs-item :data="item" :type="tabList.focus.key"/>
          </div>
        </div>
        <div v-else class="no-data">
          暂无
        </div>
      </div>
      <div class="sub-rules pb-xs">
        <div :ref="tabList.subscript.key" class="title flex sub-title">
          <span class="flex-1">我订阅的检查规则</span>
          <router-link :to="{name: 'rule-index'}" class="more">更多</router-link>
        </div>
        <div v-if="subRules.length" class="list">
          <div v-for="(item, key) in subRules" :key="key" class="list-item">
            <tabs-item :data="item" :type="tabList.subscript.key"/>
          </div>
        </div>
        <div v-else class="no-data">
          暂无
        </div>
      </div>
      <div class="look-rules">
        <div :ref="tabList.look.key" class="title flex sub-title">
          <span class="flex-1">最近浏览的检查规则</span>
          <router-link to="/rules" class="more">更多</router-link>
        </div>
        <div v-if="lookRules.length" class="list">
          <div v-for="(item, key) in lookRules" :key="key" class="list-item">
            <tabs-item :data="item" :type="tabList.look.key"/>
          </div>
        </div>
        <div v-else class="no-data">
          暂无
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {TabPane, Tabs} from 'element-ui'

  import HOME_RULE from '~/graphql/home_rule.gql'
  import enumerate from '~/js/enum'
  import TabsItem from '~/components/home/tabs-item.vue'
  import Affix from '~/components/affix/affix'

  Vue.use(Tabs)
  Vue.use(TabPane)

  export default {
    name: 'FourBlock',

    components: {
      TabsItem,
      Affix,
    },

    data () {
      return {
        orderList: [],
        focusRules: [],
        subRules: [],
        lookRules: [],
        tabList: enumerate.tabTypeList,
        activeTab: enumerate.tabTypeList[0].key,
        tabsHeight: 64,
        offsetTop: {
          order: 0,
          focus: 0,
          sub: 0,
          look: 0,
        },
        timer: null,
        scrollType: true,
        amendOffsetTop: 50,
      }
    },

    created () {
      this.getDataList()
    },

    mounted () {
      this.$nextTick(() => {
        this.handleScroll()
        window.addEventListener('scroll', this.handleScroll)
      })
    },

    beforeDestroy () {
      window.removeEventListener('resize', this.getOffset)
      window.removeEventListener('scroll', this.handleScroll)
    },

    methods: {
      handleScroll () {
        if (!this.scrollType) {
          return
        }

        this.offsetTop.order = this['$refs'][this.tabList.order.key].offsetTop
        this.offsetTop.focus = this['$refs'][this.tabList.focus.key].offsetTop
        this.offsetTop.sub = this['$refs'][this.tabList.subscript.key].offsetTop
        this.offsetTop.look = this['$refs'][this.tabList.look.key].offsetTop
        this.timer = setTimeout(() => {
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          scrollTop += this.tabsHeight
          if (scrollTop >= this.offsetTop.look) {
            this.activeTab = this.tabList.look.key
          } else if (scrollTop >= this.offsetTop.sub) {
            this.activeTab = this.tabList.subscript.key
          } else if (scrollTop >= this.offsetTop.focus) {
            this.activeTab = this.tabList.focus.key
          } else {
            this.activeTab = this.tabList.order.key
          }
        }, 100)
      },
      handleTab () {
        this.scrollType = false
        let toHeight = this['$refs'][this.activeTab].offsetTop - this.tabsHeight - 50 + this.amendOffsetTop
        window.scrollTo(0, toHeight)
        setTimeout(() => {
          this.scrollType = true
        }, 50)
      },
      getDataList () {
        this.$apollo.query({
          query: HOME_RULE,
          fetchPolicy: 'network-only',
        }).then(respData => {
          if (respData) {
            let data = respData.data.data
            this.orderList = data.issue || []
            this.focusRules = data.ruleLike
            this.subRules = data.ruleSubscribe
            this.lookRules = data.ruleLook
          }
        })
      },
    },
  }
</script>

<style lang="scss">
  @import "../../style/variables.scss";

  .four-block-view {
    .tabs-rules {
      padding: 0 20px 10px;
    }

    .my-tabs {
      padding: 5px 22px 0;

      .el-tabs__item {
        font-size: $font-size-big;
      }

      .el-tabs__item.is-active, .el-tabs__item:hover {
        @apply text-blue;
      }
    }

    .my-tabs-wrap {
      height: 44px;
    }

    .list-item {
      @apply inline-block w-1/2;

      padding-right: 25px;
      margin-bottom: 10px;
    }

    .no-data {
      @apply flex justify-center text-xl text-gray;
    }

    .tabs-rules .sub-title {
      & {
        @apply text-lg;
        align-items: center;
        font-weight: 400;
      }

      .more {
        font-size: theme('fontSize.base');
      }
    }

    .fix {
      z-index: 100;
    }
  }
</style>
<style lang="scss">
  .four-block-view{
    .el-tabs__header{
      margin-bottom: 20px;
    }
  }
</style>
