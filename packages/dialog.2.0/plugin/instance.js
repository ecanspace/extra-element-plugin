import Vue from 'vue'
import DialogComponent from '../src/main.vue'

const DialogCtor = Vue.extend(DialogComponent)
const rawDocument = window.document

export class DialogManager {
  constructor(context, options = {}) {
    this._context = context
    this._options = options
    this._vm = new DialogCtor({ propsData: options.props }).$mount()
    this._isMounted = false
    this._self = this
  }

  get props() {
    return this._options.props
  }

  get slots() {
    return this._options.slots
  }

  on(event, handler) {
    this._vm.$on(event, handler)
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

  updateComponent(instance) {
    // To VNode
    instance._vm.$slots.default = this.createVNode(instance.slots.default)
  }

  createVNode(component) {
    if (typeof component === 'string') {
      return component
    } else {
      return this._vm.$createElement(component, {
        key: Date.now().toString().slice(-6),
        props: this.props.propsData
      })
    }
  }

  destroy() {
    this._vm.$destroy()
    this._context = null
    this._self = null
    rawDocument.body.removeChild(this._vm.$el)
  }
}

/**
 * 创建 Dialog 实例
 * @param {*} context 
 * @param {*} options 
 * @returns
 */
export function createDialog(context, options) {
  return new DialogManager(context, options)
}
