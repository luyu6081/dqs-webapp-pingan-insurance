import EjPagination from './pagination.vue'

export default {
  ...EjPagination,
  install: Vue => Vue.component(EjPagination.name, EjPagination),
}
