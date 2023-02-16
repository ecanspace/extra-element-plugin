import { Input, Select, Option } from 'element-ui'
import { assignExclude } from '../../src/shared/util'

const defaultFields = {
  prepend: 'prepend',
  input: 'input',
  append: 'append',
}

export default {
  name: 'ExtraCompoundInput',

  props: {
    ...Input.props,

    model: {
      type: Object
    },

    fields: {
      type: Object
    },

    appendData: {
      type: Array
    },

    prependData: {
      type: Array
    },

    width: {
      type: String
    }
  },

  computed: {
    innerFields() {
      return Object.assign({}, defaultFields, this.fields)
    }
  },

  render(h) {
    const classMap = {
      'extra-compound-input': true,
      'extra-compound-input--prepend': !!this.prependData,
      'extra-compound-input--append': !!this.appendData,
    }
    return h('div', { class: classMap }, this.renderChildren(h))
  },

  methods: {
    renderChildren(h) {
      const children = [this.renderInput(h)]

      if (this.prependData) {
        children.unshift(
          this.renderSelect(h, {
            data: this.prependData,
            prop: this.innerFields.prepend,
            class: 'extra-compound-input__prepend'
          })
        )
      }

      if (this.appendData) {
        children.push(
          this.renderSelect(h, {
            data: this.appendData,
            prop: this.innerFields.append,
            class: 'extra-compound-input__append'
          })
        )
      }

      return children
    },

    renderInput(h) {
      const props = assignExclude(this.$props, ['model', 'fields', 'appendData', 'prependData', 'width'])
      const listeners = Object.assign({}, this.$listeners)

      // v-model
      props.value = this.model[this.innerFields.input]
      listeners.input = (value) => {
        this.$set(this.model, this.innerFields.input, value)
      }

      const data = {
        attrs: this.$attrs,
        props,
        on: listeners
      }

      return h(Input, data)
    },

    renderSelect(h, params = {}) {
      const baseKey = Date.now().toString().slice(-5)
      const data = {
        class: params.class,
        props: {
          value: this.model[params.prop],
          disabled: this.disabled,
        },
        on: {
          input: (value) => {
            this.$set(this.model, params.prop, value)
          }
        },
        style: {
          width: this.width
        }
      }

      const children = params.data.map((item, index) => {
        return h(Option, {
          key: baseKey + index,
          props: {
            label: item.label,
            value: item.value
          }
        })
      })

      return h(Select, data, children)
    },
  }
}