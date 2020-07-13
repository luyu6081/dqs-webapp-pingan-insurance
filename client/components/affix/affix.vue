<template>
  <div class="affix-view" :style="wrapStyle">
    <div :class="{fix: affixed}" :style="styles">
      <slot name="main" class="fix"></slot>
    </div>
  </div>
</template>

<script>
  /**
   * 传入距离顶部的offset 触发
   */
  export default {
    props: {
      offset: {
        type: Number,
        default: 0,
      },
      // 当固定的元素的offsetTop不是body时，要修正这段高度
      amendOffsetTop: {
        type: Number,
        default: 0,
      },
    },

    data () {
      return {
        affixed: false,
        wrapStyle: {},
        styles: {},
        offsets: {},
        offsetTop: '',
      }
    },

    watch: {
      offsets (obj) {
        this.wrapStyle = {
          width: `${this.offsets.width}px`,
          height: `${this.offsets.height}px`,
        }
        this.styles = {
          width: `${this.offsets.width}px`,
          height: `${this.offsets.height}px`,
          left: `${this.offsets.x}px`,
          top: `${this.offset}px`,
        }
      },
    },

    mounted () {
      // 获取元素的x 宽度，高度

      this.$nextTick(() => {
        window.setTimeout(() => {
          this.getOffset()
          this.handleScroll()
          window.addEventListener('scroll', this.handleScroll)
          window.addEventListener('resize', this.getOffset)
        }, 1000)
      })
    },

    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.getOffset)
    },

    methods: {
      handleScroll () {
        let scrollTop = (document.documentElement.scrollTop || document.body.scrollTop) + this.offset
        this.offsetTop = this.$el.offsetTop + this.amendOffsetTop
        this.affixed = scrollTop >= this.offsetTop
      },
      getOffset () {
        this.offsets = this.$el.getBoundingClientRect()
      },
    },
  }
</script>

<style lang="scss">
  .affix-view {
    .fix {
      position: fixed;
      top: 0;
      /*left: x坐标;*/
    }
  }
</style>
