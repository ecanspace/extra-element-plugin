import { isUndef } from '../../../src/shared/util'
import { createDialog } from './instance'

let currentInstance = null

/**
 * @param {*} component 
 * @param {*} titleOrProps 
 * @returns 
 */
export default function Dialog(component, titleOrProps) {
  const options = sanitizeArguments(component, titleOrProps)

  if (isUndef(currentInstance = getInstance(component))) {
    const context = this // 上下文组件
    currentInstance = createDialog(context, options)
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

  if ((context || {})._isVue) {
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
  } else {
    console.warn('[extra-dialog] For performance reasons, Please call `$extraDialog` by `this` context.')
    instance.on('close', handleClose.bind(null, instance, component))

    function handleClose(i, c) {
      i.destroy()
      instanceMap.delete(c)
    }
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
}

/**
 * 关闭当前Dialog
 */
function closeDialog() {
  if (currentInstance) {
    currentInstance.close()
    // Next Drawer
    const instanceArray = Array.from(instanceMap.values())
    const index = instanceArray.indexOf(currentInstance)
    currentInstance = instanceArray[index - 1]
  }
}

/**
 * 关闭激活的所有Dialog
 */
function closeAllDialog() {
  instanceMap.forEach((instance) => instance.close())
}

Dialog.close = closeDialog
Dialog.closeAll = closeAllDialog
