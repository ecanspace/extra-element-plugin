import { FormItem } from 'element-ui'
import { isDef } from '../../src/shared/util'

export default {
  name: 'ExtraTableFormItem',

  props: {
    ...FormItem.props,

    prop: [String, Array],
  },

  computed: {
    model() {
      return this.$parent.model
    },

    propIsArray() {
      return Array.isArray(this.prop)
    }
  },

  render(h) {
    const props = Object.assign({}, this.$props)
    props.prop = this.propIsArray ? props.prop[0] : props.prop
    return h(FormItem, { props }, this.renderComponents(h, this.$slots.default))
  },

  methods: {
    renderComponents(h, vnodes) {
      return vnodes.map((vnode) => {
        const options = vnode.componentOptions

        if (isDef(options)) {
          const props = options.propsData || {}
          const listeners = options.listeners || {}

          // v-model
          props.value = this.getPropValue()
          listeners.input = this.handleInput

          return h(options.tag, {
            props,
            on: listeners
          }, options.children || [])
        } else {
          return vnode
        }
      })
    },

    getPropValue() {
      const target = this.model

      if (this.propIsArray) {
        return this.prop.map((prop) => (target[prop] || ''))
      } else {
        return target[this.prop]
      }
    },

    handleInput(value) {
      const target = this.model

      if (this.propIsArray) {
        this.prop.forEach((prop, index) => this.$set(target, prop, (value || [])[index] || ''))
      } else {
        this.$set(target, this.prop, value)
      }
    },
  }
}