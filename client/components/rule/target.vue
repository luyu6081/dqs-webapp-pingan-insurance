<template>
  <el-cascader
    filterable
    v-model="value$"
    :options="tree"
    :props="{
      value: 'id',
      label: 'title',
    }"
    @change="handleChange"
    size="small"/>
</template>

<script>
  import Vue from 'vue'
  import {Cascader, Row, Col} from 'element-ui'

  Vue.use(Cascader)
  Vue.use(Row)
  Vue.use(Col)

  export default {
    name: 'SelectTarget',

    props: {
      tree: {
        type: Array,
        default: () => [],
      },
      params: {
        type: Object,
        default: () => {
        },
      },
    },

    computed: {
      value$: {
        get () {
          return Object.keys(this.params) ? [this.params.applyId, this.params.systemId, this.params.databaseId] : []
        },
        set (val) {
          this.$emit('update:params', Object.assign(this.params, {
            applyId: val[0],
            systemId: val[1],
            databaseId: val[2],
          }))
        },
      },
    },

    methods: {
      handleChange (val) {
        this.$emit('change', val)
      },
    },
  }
</script>
