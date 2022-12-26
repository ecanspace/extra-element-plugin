import {
  createDeleteProperty
} from './compat'

/**
 * 空函数（用于占位）
 */
export function noop() {}

/**
 * 已定义
 * @param {*} value 
 * @returns 
 */
export function isDef(value) {
  return value !== undefined && value !== null
}

/**
 * 未定义
 * @param {*} value 
 * @returns 
 */
export function isUndef(value) {
  return value === undefined || value === null
}

/**
 * 值为空（泛）
 * @param {*} value 
 * @returns 
 */
export function isEmpty(value) {
  return value === undefined || value === null || value === ''
}

const rawToString = Object.prototype.toString

/**
 * 通过 ‘值的构造器’ 精确判断类型
 * @param {*} value 
 * @returns 
 */
export function ctorName(value) {
  return rawToString.call(value).slice(8, -1)
}

/**
 * 是否为 'Map' 类型（泛指）对象也是一种 'Map'
 * @param {*} value 
 * @returns 
 */
export function isMap(value) {
  return ctorName(value) === 'Object' || ctorName(value) === 'Map'
}

const hasOwn = Object.prototype.hasOwnProperty

/**
 * 判断值是否是 Promise 对象
 * @param {*} value 
 * @returns 
 */
export function isPromise(value) {
  return typeof value === 'object' && hasOwn.call(value.prototype, 'then')
}

const deleteProperty = createDeleteProperty()

/**
 * 进行浅拷贝时，排除某些属性
 * @param {*} source 
 * @param {*} excluded 
 */
export function assignExclude(source, excluded = []) {
  const target = Object.assign({}, source)

  if (typeof excluded === 'string') {
    excluded = excluded.split(',')
  }
  excluded.forEach((prop) => deleteProperty(target, prop))

  return target
}

/**
 * 只拷贝指定的属性
 * @param {*} source 
 * @param {*} included 
 * @returns 
 */
export function assignInclude(source, included = []) {
  let target = {}

  if (ctorName(included) === 'Object') {
    included = Object.keys(included)
  }
  included.forEach((prop) => target[prop] = source[prop])

  return target
}

/**
 * 防抖函数
 * @param {*} fn 
 * @param {*} delay 
 * @returns 
 */
export function debounce(fn, delay = 200) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * 比较两个对象是否相同
 * @param {*} newTarget 
 * @param {*} target 
 * @returns 
 */
export function isEqualMap(newTarget, target) {
  if (!newTarget && !target) {
    return true
  }

  if (!newTarget || !target) {
    return false
  }

  const newKeys = Object.keys(newTarget).join(',')
  const keys = Object.keys(target).join(',')

  if (newKeys === keys) {
    return keys.split(',').every((key) => Object.is(newTarget[key], target[key]))
  }

  return false
}

/**
 * @param {*} source 
 * @param {*} exp 
 * @returns 
 */
export function parseValue(source, exp) {
  let value = source

  exp = exp + '.'
  while (exp) {
    const index = exp.indexOf('.')
    value = value[exp.slice(0, index)]
    exp = exp.slice(index + 1)
  }

  return value
}