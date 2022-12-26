import { isUndef } from '../../../src/shared/util'
import { createDrawer } from './instance'

let currentInstance = null

/**
 * @param {*} component 
 * @param {*} titleOrProps 
 * @returns 
 */
export default function Drawer(component, titleOrProps) {
  const options = sanitizeArguments(component, titleOrProps)

  if (isUndef(currentInstance = getInstance(component))) {
    const context = this // 上下文组件
    currentInstance = createDrawer(context, options)
    registerInstance(context, currentInstance, component)
  }

  currentInstance.show(options)
  return currentInstance
}

/**
 * 外部参数清洁
 * @param {*} component 
 * @param {*} titleOrProps 
 * @returns 
 */
function sanitizeArguments(component, titleOrProps) {
  const options = {
    props: titleOrProps,
    slots: {
      default: component
    }
  }

  if (typeof titleOrProps === 'string') {
    options.props = {
      title: titleOrProps
    }
  }

  options.props = Object.assign({}, Drawer.options, options.props)

  return options
}

/** instance manager
 --------------------------------------------------- */
const contextInstanceMap = new Map()
const instanceMap = new Map()

function getInstance(component) {
  return instanceMap.get(component)
}

const VUE_HOOK_BEFOREDESTROY = 'hook:beforeDestroy'

/**
 * @param {*} context 
 * @param {*} instance 
 * @param {*} component 
 */
function registerInstance(context, instance, component) {
  instanceMap.set(component, instance)

  if (contextInstanceMap.has(context)) {
    const instanceGroup = contextInstanceMap.get(context)
    instanceGroup.push({
      component,
      instance
    })
  } else {
    contextInstanceMap.set(context, [{
      component,
      instance
    }])
    // 首次关联 instance 实例, 给 context 上下文组件注册 ‘销毁’ 生命周期钩子监听,
    // 以便在上下文组件销毁时，清理 instance 绑定
    context.$on(VUE_HOOK_BEFOREDESTROY, unregisterInstance)
  }
}

/**
 * 上下文组件准备销毁时, 清理它的 instance 绑定
 */
function unregisterInstance() {
  const context = this

  if (contextInstanceMap.has(context)) {
    const instanceGroup = contextInstanceMap.get(context)

    instanceGroup.forEach(({
      component,
      instance
    }) => {
      instance.destroy()
      instanceMap.delete(component)
    })

    contextInstanceMap.delete(context)
    context.$off(VUE_HOOK_BEFOREDESTROY)
  }

  console.log('[extra-drawer] component destroyed.')
}

/**
 * 关闭当前 Drawer, 并将当前实例指向上一个实例，便于从上到下依次关闭弹窗层
 */
function closeDrawer() {
  if (currentInstance) {
    currentInstance.close()
    // Next Drawer
    const instanceArray = Array.from(instanceMap.values())
    const index = instanceArray.indexOf(currentInstance)
    currentInstance = instanceArray[index - 1]
  }
}

/**
 * 关闭激活的所有Drawer
 */
function closeAllDrawer() {
  instanceMap.forEach((instance) => instance.close())
}

/**
 * 设置默认值
 */
function setDefaults(options) {
  Drawer.options = Object.assign({}, options)
}

Drawer.close = closeDrawer
Drawer.closeAll = closeAllDrawer
Drawer.setDefaults = setDefaults
