<script lang="jsx">
  import {Pagination as ElPagination} from 'element-ui'

  export default {
    name: 'EjPagination',

    functional: true,

    render: (h, {props, data, listeners}) => {
      const _props = {
        ...props,
        layout: props.layout !== undefined ? props.layout : 'prev, pager, next',
        background: props.background !== undefined ? props.background : true,
      }

      const _data = {
        style: data.style,
      }

      return <ElPagination {...{..._data, props: _props, on: listeners, staticClass: 'app-pagination'}}/>
    },
  }
</script>

<style lang="scss">
  $blue: #477de9;
  $color_d9d9d9: #d9d9d9;
  $white: #fff;
  .app-pagination {
    $border-color: $color_d9d9d9;

    /* override element-ui's style */

    .btn-prev,
    .btn-next,
    .number {
      box-sizing: border-box;
      width: 32px;
      height: 32px;
      line-height: 32px - 2px;
      font-size: 14px;
      border: 1px solid $border-color;
      border-radius: 6px !important;
      background: $white !important;
      // background: $white !important;
      margin: 0 4px !important;
    }

    .number.active {
      border-color: transparent;
      background: $blue !important;

      + .number {
        border-left: 1px solid $border-color;
      }
    }
  }
</style>
