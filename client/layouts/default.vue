<template>
  <div class="default-layout bg-gray-lighter">
    <ej-getuserinfo client="ucClient"/>

    <ej-app-header v-if="!bodyOnly"
                   :logo="logo"
                   title="数据质量"
                   fixed
                   @search="search"
                   class="ej-dqs-header__wrap flex-none">
      <ej-nav-menu :default-active="activeIndex"
                   mode="horizontal"
                   text-color="#fff"
                   active-text-color="#fff"
                   class="app-nav__menu flex"
                   @select="onMenuSelect">
        <el-menu-item index="1"
                      class="app-nav__menu-item flex items-center"
                      @click="$router.push({name: 'home'})">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="2"
                      class="app-nav__menu-item flex items-center"
                      @click="$router.push({name: 'rule-index'})">
          <span>质量检查规则</span>
        </el-menu-item>
        <el-menu-item index="3"
                      class="app-nav__menu-item flex items-center"
                      @click="$router.push({name: 'issue-index'})">
          <span>数据质量工单</span>
        </el-menu-item>
        <el-menu-item index="5"
                      class="app-nav__menu-item flex items-center"
                      @click="$router.push({name: 'templates'})">
          <span>数据模版</span>
        </el-menu-item>
        <el-menu-item index="4"
                      class="app-nav__menu-item flex items-center"
                      @click="$router.push({name: 'report-detail'})">
          <span>质量报告</span>
        </el-menu-item>
        <ej-nav-submenu index="6"
                        :show-timeout="100"
                        class="app-nav__menu-item flex items-center">
          <template #title>更多</template>
          <el-menu-item index="6-1">
            <span class="flex"><a :href="kcHref" target="_blank" class="flex px-2xl-dqs">政策法规</a></span>
          </el-menu-item>
          <el-menu-item index="6-2">
            <span class="flex"><a :href="kcHref" target="_blank" class="flex px-2xl-dqs">知识广场</a></span>
          </el-menu-item>
        </ej-nav-submenu>
      </ej-nav-menu>
      <template #tray>
        <ej-app-search/>
        <get-auth data="dqsSetting">
          <router-link to="/setting" class="ej-app-setting flex items-center" @click="goSettings">
            <ej-icon icon="gear" class="ej-app-setting__button"/>
          </router-link>
        </get-auth>
        <ej-app-notification class=""/>
        <ej-app-usermenu :user="userData" :endpoint="avatarHeader"/>
      </template>

    </ej-app-header>

    <div class="app-body pt-md" v-ej-loading.fullscreen="!loading">
      <nuxt v-if="loading" class="app-view mx-auto" :style="{width: mainWidth}"/>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import {mapGetters} from 'vuex'

  import {Menu, Submenu, MenuItem} from 'element-ui'
  import {AppHeader, AppSearch, Icon, AppNotification, Loading, AppUsermenu, NavMenu, NavSubmenu} from '@ej/ui'

  import runtimeArgs from '~/runtime-args'
  import {notiCommission, notiInfomation, notiNotify} from '~/js/mockData/common'
  import GetUserinfo from '~/components/get-userinfo'
  import GetAuth from '~/components/get-auth'

  Vue.use(AppHeader)
  Vue.use(Menu)
  Vue.use(Submenu)
  Vue.use(MenuItem)
  Vue.use(AppSearch)
  Vue.use(Icon)
  Vue.use(AppNotification)
  Vue.use(GetUserinfo)
  Vue.use(Loading)
  Vue.use(GetAuth)
  Vue.use(AppUsermenu)
  Vue.use(NavMenu)
  Vue.use(NavSubmenu)

  /*不需要添加识别项目*/
  const noNav = [
    '6-1',
    '6-2',
  ]

  export default {
    name: 'DQS',

    data () {
      return {
        logo: '/images/logo.svg',
        kcHref: `${runtimeArgs.NUXT_ENV_KC_HTTP}?system=DQS`,
        activeIndex: this.$route.meta.navIdx,
      }
    },

    computed: {
      ...mapGetters([
        'userData',
        'bodyOnly',
      ]),

      avatarHeader () {
        return {
          avatarUrl: `${runtimeArgs.NUXT_ENV_ALL_HTTP}/fileDownload`, /* 头像获取环境变量 */
          loginUrl: runtimeArgs.NUXT_ENV_UC_HTTP_LOGIN, /* 登录系统地址环境变量 */
          ucUrl: runtimeArgs.NUXT_ENV_UC_URL, /* 个人中心项目地址环境变量 */
          client: 'ucClient', /* 调用auth-frontier中的退出接口：client名称 */
        }
      },

      mainWidth () {
        return this.$route.name && this.$route.name.startsWith('rule-') ? undefined : '1100px'
      },

      loading () {
        return Object.keys(this.userData).length
      },
    },

    watch: {
      activeIndex (val, old) {
        if (noNav.indexOf(val) !== -1) {
          this.$nextTick(() => {
            this.activeIndex = old
          })
        }
      },
      '$route' (val) {
        if (!val.meta.navIdx) {
          this.activeIndex = ''
        }
      },
    },

    beforeCreate () {
      // todo: 接口获取数据
      this.$store.commit('setInfomation', notiInfomation)
      this.$store.commit('setNotify', notiNotify)
      this.$store.commit('setCommission', notiCommission)
    },

    methods: {
      search (keywords) {
        console.log(keywords)
      },
      goSettings () {
      },
      onMenuSelect (val, old) {
        this.activeIndex = val
      },
    },
  }
</script>

<style lang="scss">
  .ej-dqs-header__wrap {
    .ej-app-header {
      z-index: 100;
      min-width: 1200px;
    }

    .bg-black {
      background: #1B2843;
    }
  }

  .ej-app-setting {

    .ej-app-setting__button {
      width: 18px;
      height: 18px;
    }
  }
</style>

<style lang="scss">
  .el-menu--horizontal .el-menu .el-menu-item {
    padding: 0;
  }
</style>
