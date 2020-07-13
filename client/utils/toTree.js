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
        value: resData[i][attributes.id],
        label: resData[i][attributes.name],
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
          if (chiArr[i].value === resData[j][attributes.parentId]) {
            let obj = {
              value: resData[j][attributes.id],
              label: resData[j][attributes.name],
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
