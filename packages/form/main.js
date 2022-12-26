import { Form } from 'element-ui'
import { assignInclude, assignExclude, isDef, isUndef } from '../../src/shared/util'
import ExtraFormItem from './item'

const FIELD_DEFAULTS = {
  label: 'label',
  value: 'value'
}

/**
 * 参数消毒（或默认）处理
 * @param {*} item 
 * @returns 
 */
function normalizeConfig(item) {
  // set checkbox defaults
  if (isUndef(item.value) && /checkbox/i.test(item.component)) {
    item.value = []
  }

  if (/elselect|radio|checkbox/i.test(item.component)) {
    item.fields = Object.assign({}, FIELD_DEFAULTS, item.fields)
  } else if (/date/i.test(item.component)) {
    item.placeholder = '请选择日期'
    item.valueFormat = 'yyyy-MM-dd'

    if (item.type === 'daterange') {
      item.startPlaceholder = '开始日期'
      item.endPlaceholder = '结束日期'
    }
  } else if (/time/i.test(item.component)) {
    item.placeholder = '请选择时间'
  }

  return item
}

export default {
  name: 'ExtraForm',

  provide() {
    return {
      extraForm: this
    }
  },

  props: {
    ...Form.props,

    items: {
      type: Array
    },

    gutter: {
      type: [Number, String],
      default: 20
    },
  },

  created() {
    this.initVNodeMap()
    this.initForm()
  },

  render(h) {
    const props = Object.assign({}, this.$props)
    props.rules = this.formRules
    return h(Form, { props, on: this.$listeners }, this.renderFormItems(h))
  },

  methods: {
    initVNodeMap() {
      const vnodes = this.$slots.default
      const vnodeMap = new Map()

      vnodes && vnodes.forEach((vnode) => {
        const name = vnode.data.attrs.name || vnode.data.attrs.alias
        name && vnodeMap.set(name, vnode)
      })

      this.vnodeMap = vnodeMap
    },

    initForm() {
      const model = this.model
      const rules = {}

      this.items.forEach((item) => {
        item = normalizeConfig(item)

        if (isDef(item.value)) {
          this.$set(model, item.prop, item.value)
        }

        if (item.rule) {
          rules[item.prop] = item.rule
        }
      })

      this.formRules = rules
    },

    renderFormItems(h) {
      if (Array.isArray(this.items)) {
        const vnodeMap = this.vnodeMap
        
        return this.items.map((item) => {
          if (item.reference) {
            return vnodeMap.get(item.reference)
          } else {
            const props = assignInclude(item, ExtraFormItem.props)
            return h(ExtraFormItem, { props }, [ this.renderChild(h, item) ])
          }
        })
      } else {
        return this.$slots.default
      }
    },

    renderChild(h, config) {
      const model = this.model
      const props = assignExclude(config, ['component', 'rule', 'data', 'slots'].concat(Object.keys(ExtraFormItem.props)))

      // v-model
      props.value = model[config.prop]
      const listeners = {
        input: (value) => {
          this.$set(model, config.prop, value)
        }
      }

      const data = {
        attrs: {
          placeholder: config.placeholder,
        },
        props,
        on: listeners,
      }
      const children = config.children || this.genChildren(h, config) || []

      return h(config.component, data, children)
    },

    genChildren(h, config) {
      let children = []

      if (/elselect/i.test(config.component)) {
        children = this.genOption(h, config)
      } else if (/radio/i.test(config.component)) {
        children = this.genRadio(h, config)
      } else if (/checkbox/i.test(config.component)) {
        children = this.genCheckbox(h, config)
      }

      children = children.concat(this.genSlot(h, config) || [])
      return children
    },

    genOption(h, config) {
      return config.data.map((item, index) => {
        const label = item[config.fields.label || 'label']
        const value = item[config.fields.value || 'value']

        return h('ElOption', {
          key: value,
          props: {
            label,
            value
          }
        })
      })
    },

    genRadio(h, config) {
      return config.data.map((item, index) => {
        const label = item[config.fields.label || 'label']
        const value = item[config.fields.value || 'value']

        return h('ElRadio', {
          key: value,
          props: {
            label: value
          }
        }, label)
      })
    },

    genCheckbox(h, config) {
      return config.data.map((item, index) => {
        const label = item[config.fields.label || 'label']
        const value = item[config.fields.value || 'value']

        return h('ElCheckbox', {
          key: value,
          props: {
            label: value
          }
        }, label)
      })
    },

    genSlot(h, config) {
      if (config.slots) {
        const children = []

        for (let name in config.slots) {
          const slot = config.slots[name]

          if (typeof slot === 'function') {
            const vnode = slot.call(this, h)
            const data = vnode.data || (vnode.data = {})
            data.slot = name
            children.push(vnode)
          } else {
            children.push(slot)
          }
        }

        return children
      }
    },
  }
}