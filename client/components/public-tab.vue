<template>
  <el-tabs v-model="activeName" class="comp-tab" @tab-click="handleTabsClick">
    <!-- TODO: 需要支持自定义 Tab 内容 -->
    <el-tab-pane v-for="tabItem in tabList"
                 :key="tabItem.name"
                 :name="tabItem.name"
                 :label="tabItem.label">
      <slot :name="tabItem.name"/>
    </el-tab-pane>

    <slot name="commonly"/>
  </el-tabs>
</template>

<script>
  import {
    Tabs as ElTabs,
    TabPane as ElTabPane,
  } from 'element-ui'

  export default {
    name: 'CompTab',

    components: {
      ElTabs,
      ElTabPane,
    },

    props: {
      tabList: Array,
      tabActiveName: {
        type: String,
        default: 'first',
      },
    },

    data () {
      return {
        activeName: '',
      }
    },

    mounted () {
      this.activeName = this.tabActiveName
    },

    methods: {
      handleTabsClick (tab) {
        this.activeName = this.tabActiveName
        this.$emit('tab-click', tab)
      },
    },
  }
</script>
