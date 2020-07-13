import enumerate from '~/js/enum'

export function getClassify (val) {
  // return enumerate.classify.find(it => it.value === val).name
  for (let it of enumerate.classify) {
    if (it.value === val) {
      return it.name
    }
  }
  return '无'
}
export function getRuleExecuteStatus (val) {
  // return enumerate.classify.find(it => it.value === val).name
  for (let it of enumerate.ruleExecuteStatusList) {
    if (it.value === val) {
      return it.name
    }
  }
  return '无'
}
export function getLineClassify (val) {
  // return enumerate.classify.find(it => it.value === val).name
  for (let it of enumerate.lineClassify) {
    if (it.value === val) {
      return it.name
    }
  }
  return '无'
}
