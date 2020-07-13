import List from './list.vue'

export default {
  ...List,
  install: Vue => Vue.component(List.name, List),
}
