import {
  isMap
} from './util'

/**
 * 给 VNode 添加样式类
 * @param {*} vnode 
 * @param {*} className 
 * @returns 
 */
export function addClass(vnode, className) {
  if (Array.isArray(className)) {
    className.forEach((item) => addClass(vnode, item))
  } else {
    const classList = vnode.data.class || (vnode.data.class = [])

    if (isMap(classList)) {
      classList[className] = true
    } else {
      classList.push(className)
    }
  }

  return vnode
}

export function addStyle(vnode, payload) {
  const styleMap = vnode.data.style || (vnode.data.style = {})
  Object.assign(styleMap, payload)
  return vnode
}
