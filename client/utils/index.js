import Lodash from 'lodash'

import runtimeArgs from '~/runtime-args'

export function cloneDeep (obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 拼接检查对象
 *
 * @param target {
          #  所属应用
          applyName
          #  所属系统
          systemName
          #  数据库
          databaseName
          #  表
          tableName
        }

 */
export function getTarget (data) {
  let str = ''
  data.applyName && (str += `${data.applyName}`)
  if (data.systemName) {
    str && (str += '-')
    str += data.systemName
  }
  if (data.databaseName) {
    str && (str += '-')
    str += data.databaseName
  }
  if (data.tableName) {
    str && (str += '-')
    str += data.tableName
  }
  return str
}

/**
 * 字节格式化
 *
 * @param val {Number} - 字节大小
 * @return {String} - 格式化后的尺寸大小
 */
export function humanizeFileSize (val) {
  const ONE_KB = 1024
  const ONE_MB = ONE_KB * 1024

  if (val >= ONE_MB) {
    return `${Math.round(val / ONE_MB * 10) / 10}MB`
  } else if (val >= ONE_KB) {
    return `${Math.round(val / ONE_KB * 10) / 10}KB`
  } else {
    return `${val}B`
  }
}

/*
options = {
  id: 'organizationId',
  parentId: 'parentId',
  name: 'organizationName',
  rootId: '0',
}
1. 先找到最外层，删掉集合中的当条数据
2. 循环最外层，循环集合，如果集合中的父id等于上一层的id，
*/
export function toTreeData (data, attributes) {
  let resData = data
  let tree = []

  for (let i = 0; i < resData.length; i++) {
    if (resData[i][attributes.parentId] === attributes.rootId) {
      let obj = {
        id: resData[i][attributes.id],
        title: resData[i][attributes.name],
        children: [],
      }
      tree.push(obj)
      resData.splice(i, 1)
      i--
    }
  }
  run(tree)
  function run (chiArr) {
    if (resData.length !== 0) {
      for (let i = 0; i < chiArr.length; i++) {
        for (let j = 0; j < resData.length; j++) {
          if (chiArr[i].id === resData[j][attributes.parentId]) {
            let obj = {
              id: resData[j][attributes.id],
              title: resData[j][attributes.name],
              children: [],
            }
            chiArr[i].children.push(obj)
            resData.splice(j, 1)
            j--
          }
        }
        run(chiArr[i].children)
      }
    }
  }

  return tree
}

/**
 * 转换成百分比
 * @param val {Number} - 数字
 * @return {String} - 格式化后的百分比
 */
export function toPercent (val) {
  if (!val) return 0
  return `${Lodash.round(val * 100)}%`
}

/**
 * 拼接后端返回的图片key
 * @param val {String} - 字符串
 * @return {String} - 图片地址
 */
export function toImgHref (val) {
  if (!val) return ''
  return `${runtimeArgs.NUXT_ENV_ALL_HTTP}/fileDownload?ambryId=${val}&show=true`
}

/**
 * 获取非空（包含取值为false）参数
 * @param val {Object} - 对象
 * @return {Object} - 对象
 */
export function validParams (obj) {
  if (typeof obj === 'object') {
    let params = {}
    for (let key in obj) {
      if (!(obj[key] === '')) {
        params[key] = obj[key]
      }
    }
    return params
  } else {
    return obj
  }
}

