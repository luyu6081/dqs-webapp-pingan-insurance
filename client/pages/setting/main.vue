<template>
  <div class="setting-main-view flex flx-col flex-grow bg-white">
    <div class="setting-left bg-white">
      <side-view/>
    </div>
    <div class="setting-right flex-grow p-md">
      <nuxt/>
    </div>
  </div>
</template>

<script>
  /*
  * 左右布局
  * 左侧固定定位
  * 右侧区域滚动
  * */
  import SideView from './side'

  export default {
    components: {
      SideView,
    },
  }
</script>

<style lang="scss">
  /**/
  .setting-main-view {
    &::before {
      content: '';
      position: fixed;
      top: 50px;
      width: 1100px;
      border-top: 20px solid theme('colors.gray.lighter');
      z-index: 1000;
    }

    .setting-left {
      position: fixed;
      top: 70px;
      bottom: 0;
      width: 240px;
      border-right: 1px solid theme('colors.gray.light');
    }

    .setting-right {
      margin-left: 240px;
    }
  }
</style>
