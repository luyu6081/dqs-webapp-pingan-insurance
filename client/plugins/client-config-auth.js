import Vue from 'vue'
import {onError} from 'apollo-link-error'

import runtimeArgs from '~/runtime-args'

function goto () {
  let url = `${runtimeArgs.NUXT_ENV_UC_HTTP_LOGIN}?redirect_url=${encodeURIComponent(location.href)}`
  console.log(url)
  location.href = url
}


export default () => {
  const link = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
      const {extensions} = graphQLErrors[0]
      let {code} = extensions
      if (code === '401'){
        goto()
      } else {
        let message = ''
        if (code === '400') {
          message = '参数错误'
        } else if (code === '500') {
          message = '后端服务不可用，请联系管理员'
        }
        Vue.prototype.$message({
          type: 'error',
          message,
        })
        console.log(extensions)
      }
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`)
      throw Error(networkError.message)
    }
  })

  return {
    link,
    httpEndpoint: runtimeArgs.NUXT_ENV_AUTH_HTTP_ENDPOINT,
  }
}
