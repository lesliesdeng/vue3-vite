const findRecursion = (parent: any, label: any) => {
  const result = []
  for (let i = 0; i < parent.children.length; i++) {
    if (
      // @ts-ignore
      [].indexOf.call(parent.children[i].classList, label) !== -1 ||
      parent.children[i].id === label ||
      parent.children[i].tagName === label
    ) {
      result.push(parent.children[i])
    }
    findRecursion(parent.children[i], label)
  }
  return result
}

const downloadFile = (res: any) => {
  // const iconv = require('iconv-lite')
  const link = document.createElement('a')
  link.style.display = 'none'
  if (window.URL !== undefined) {
    link.href = window.URL.createObjectURL(new Blob([res.data]))
  } else if (window.webkitURL !== undefined) {
    link.href = window.webkitURL.createObjectURL(new Blob([res.data]))
  }
  const fileName = res.headers['content-disposition'].split(';')[1].split('=')[1]

  link.setAttribute('download', decodeURIComponent(fileName))
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const redirectToLogin = () => {
  const dominUri = window.location.origin
  let queryString = ''
  let state
  const hash = window.location.hash.slice(1)
  // 链接处理，避免login重复拼接
  if (hash.indexOf('/login?uri') === -1) {
    state = `/cultural/#/login?uri=${encodeURIComponent(hash)}`
  } else {
    state = `/cultural/#${hash}`
  }

  queryString = `response_type=token&client_id=999&redirect_uri=${encodeURIComponent(
    dominUri
  )}&state=${encodeURIComponent(state)}&lang=cn&cancelRememberState=0`

  window.location.replace(`${window.location.origin}/oauth/#login/${btoa(queryString)}`)
}
const listToTree = function (data: any) {
  const obj = {}
  const parentList: any = []
  // * 先生成parent建立父子关系
  data.forEach((item: any) => {
    obj[item.id] = item
  })
  //   第二次循环里面处理isLeaf，标志是否叶节点
  data.forEach((item: any) => {
    const parent = obj[item.parentId]
    if (!parent) {
      parentList.push(item)
    } else {
      parent.children = parent.children || []
      parent.children.push(item)
    }
  })

  Object.keys(obj).forEach((key) => {
    const item = obj[key]
    item.isLeaf = !item.isParent && !item.children
  })

  return parentList
}

export default {
  downloadFile,
  findRecursion,
  redirectToLogin,
  listToTree
}
