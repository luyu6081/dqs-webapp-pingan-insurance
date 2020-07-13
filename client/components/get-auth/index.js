import GetAuth from './get-auth'

export default {
  ...GetAuth,
  install: Vue => Vue.component(GetAuth.name, GetAuth),
}
