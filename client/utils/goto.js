import runtimeArgs from '~/runtime-args'

export function gotoMds (id) {
  // location.href = `${process.env.VUE_APP_MDS_HTTP}detail/${id}?source=dqs`
  window.open(`${runtimeArgs.NUXT_ENV_MDS_HTTP}/#/detail/${id}?source=dqs`)
}
