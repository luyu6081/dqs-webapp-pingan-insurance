<template>
  <el-menu :default-active="activeIndex" class="my-side-view pt-md">
    <el-menu-item v-for="(it, idx) of sideList" :key="idx" :index="it.index">
      <router-link :to="{name: it.name}" class="setting-item">{{it.text}}</router-link>
    </el-menu-item>
  </el-menu>
</template>

<script>
  import Vue from 'vue'
  import {Menu, MenuItem} from 'element-ui'

  Vue.use(Menu)
  Vue.use(MenuItem)

  const sideList = [
    {
      name: 'setting-quality',
      text: '评分体系库',
      index: '0',
    },
    {
      name: 'setting-qualityAdmin',
      text: '质量评分管理',
      index: '2',
    },
    {
      name: 'setting-questions',
      text: '数据问题分类',
      index: '3',
    },
  ]
  export default {
    name: 'SettingSide',

    data () {
      return {
        sideList: sideList,
        activeIndex: '1',
      }
    },

    created () {
      this.activeIndex = this.sideList.find(it => it.name === this.$route.name).index
    },

    watch: {
      '$route' (val) {
        this.activeIndex = this.sideList.find(it => it.name === this.$route.name).index
      },
    },
  }
</script>
<style lang="scss">
  .my-side-view {
    border-right: none;

    .el-menu-item, .setting-item {
      @apply flex-1;

      display: flex;
      padding: 0;
      height: 40px;
      line-height: 40px;
    }

    .el-menu-item.is-active, .el-menu-item.is-active:hover {
      @apply bg-blue-lighter text-blue;
    }

    .el-menu-item:hover{
      @apply text-blue bg-white;
    }

    .el-menu-item{
      padding-left: 0 !important;
      .setting-item{
        padding-left: 20px;
      }
    }
  }
</style>
