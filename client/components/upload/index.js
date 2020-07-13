import Upload from './upload'

export default {
  ...Upload,
  install: (Vue) => Vue.component(Upload.name, Upload),
}
