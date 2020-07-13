<template>
    <div class="approve-item-view">
      <div class="line" v-if="hasLine"></div>
      <div class="item-main">
        <span></span>
      </div>
    </div>
</template>

<script>
  /*
  * 组件要求：
  * 左侧：用type判断
  *   通过
  *   不通过，红色
  * 中间图标:用type判断
  *    *   通过
  *   不通过，红色
  * 右侧：
  *   1设计已经去掉。有展开和收起
  *   如果附件和内容都没有，隐藏展开功能
  *   展开收起，用旋转
  * */
  export default {
    name: 'ApproveItem',
    props: {
      hasLine: {
        type: Boolean,
        default: true,
      },
    },
  }
</script>

<style lang="scss">
  $color_477DE9: #477DE9;
  .approve-item-view{
    position: relative;
    .line{
      position: absolute;
      width: 2px;
      /*height: 100%;*/
      background: $color_477DE9;
      top: 0;
      bottom: 0;
      left: 9px;
    }
    .item-main{
      position: relative;
      z-index: 10;
      height: 100px;
      span{
        display: inline-block;
        width: 20px;
        height: 20px;
        background: red;
        border-radius: 50%;
      }
    }
  }
</style>
