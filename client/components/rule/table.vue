<template>
  <el-select
    v-model="tableId$"
    filterable
    size="small"
    remote
    :disabled="disabled"
    :remote-method="getTabs"
    @change="change"
    placeholder="请选择"
    class="block mb-sm">
    <el-option
      v-for="(it, idx) of tableList"
      :key="idx"
      :label="it.name"
      :value="it.id">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'targetTable',

    props: {
      tableId: {
        type: String || Number,
      },
      tableList: {
        type: Array,
        default: () => [],
      },
      disabled: {
        type: Boolean,
        default: true,
      },
    },

    computed: {
      tableId$: {
        get () {
          return this.tableId
        },
        set (val) {
          this.$emit('update:tableId', val)
        },
      },
    },

    methods: {
      getTabs (val) {
        this.$emit('getTables', val)
      },
      change (val) {
        this.$emit('change', val)
      },
    },
  }
</script>
