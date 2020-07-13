<template>
  <div class="approve-wrap-view">
    <approve-item v-for="(item, key) in data" :data="item" :key="key" :has-line="hasLine(key)"></approve-item>
  </div>
</template>

<script>
  import ApproveItem from './approve-item'

  export default {
    name: 'ApproveWrap',
    components: {
      ApproveItem,
    },
    data () {
      return {
        data: [1, 2, 3],
      }
    },
    methods: {
      hasLine (index) {
        // return (index !== this.data.length - 1 ? true : false)
        if (index !== this.data.length - 1) {
          return true
        } else {
          return false
        }
      },
    },
  }
</script>

<style lang="scss">
</style>
