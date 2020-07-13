import common from './common'
import home from './home'
import template from './template'
import rule from './rule'
import issue from './issue'

let obj = Object.assign(
  {},
  common,
  home,
  template,
  rule,
  issue,
)

function enumerate () {
  let ENUM = []
  for (let k in obj) {
    ENUM[k] = obj[k]
    obj[k].forEach(item => {
      ENUM[k][item.key] = item
    })
  }
  return ENUM
}

export default enumerate()
