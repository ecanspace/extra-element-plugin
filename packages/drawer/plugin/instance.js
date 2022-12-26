import Vue from 'vue'
import DrawerComponent from '../src/main.vue'

const DrawerCtor = Vue.extend(DrawerComponent)
const rawDocument = window.document

export class DrawerManager {
  constructor(context, options = {}) {
    this._context = context
    this._options = options
    this._vm = new DrawerCtor({ propsData: options.props }).$mount()
    this._isMounted = false
    this._self = this
  }

  get props() {
    return this._options.props
  }

  get slots() {
    return this._options.slots
  }

  show(options = {}) {
    const instance = this._self

    if (instance._isMounted) {
      instance._options = options
    } else { // 首次激活
      instance._isMounted = true
      rawDocument.body.appendChild(instance._vm.$el)
    }

    instance.updateComponent(instance)
    instance._vm.$emit('propsChange', instance.props)
    instance._vm.$emit('visible', true)
  }

  close() {
    this._vm.$emit('visible', false)
  }

  destroy() {
    this._vm.$destroy()
    this._context = null
    this._self = null
    rawDocument.body.removeChild(this._vm.$el)
  }

  updateComponent(instance) {
    // (options, Ctor) => VNode
    instance._vm.$slots.default = this.createVNode(instance.slots.default)
  }

  createVNode(component) {
    return this._vm.$createElement(component, {
      key: Date.now().toString().slice(-6),
      props: this.props.propsData
    })
  }
}

/**
 * 创建 Drawer 实例
 * @param {*} options 
 * @returns
 */
export function createDrawer(context, options) {
  return new DrawerManager(context, options)
}
