import { FormItem } from 'element-ui'
import { isUndef } from '../../src/shared/util'

export default {
  name: 'ExtraTableFormItem',

  props: {
    ...FormItem.props,

    prop: [String, Array],
  },

  computed: {
    formModel() {
      return this.$parent.model
    },

    propIsArray() {
      return Array.isArray(this.prop)
    }
  },

  render(h) {
    const props = Object.assign({}, this.$props)
    props.prop = this.propIsArray ? this.prop[0] : this.prop
    return h(FormItem, { props }, this.renderSlotComponents(h, this.$slots.default))
  },

  methods: {
    renderSlotComponents(h, vnodes) {
      return vnodes.map((vnode) => {
        const options = vnode.componentOptions
        if (isUndef(options)) return vnode

        return h(options.tag, {
          props: Object.assign({}, options.propsData, {
            value: this.getPropValue()
          }),

          on: Object.assign({}, options.listeners, {
            input: this.handleInput
          })
        }, options.children || [])
      })
    },

    getPropValue() {
      const target = this.formModel

      if (this.propIsArray) {
        return this.prop.map((prop) => (target[prop] || ''))
      } else {
        return target[this.prop]
      }
    },

    handleInput(model) {
      const target = this.formModel

      if (this.propIsArray) {
        this.prop.forEach((prop, index) => this.$set(target, prop, (model || [])[index] || ''))
      } else {
        this.$set(target, this.prop, model)
      }
    },
  }
}