import { Select, Option } from 'element-ui'
import { noop, assignExclude } from '../../src/shared/util'

const defaultFields = {
  label: 'label',
  value: 'value',
}

export default {
  name: 'ExtraLinkageItem',

  inject: ['linkage'],

  props: {
    ...Select.props,

    value: {},

    clearable: {
      type: Boolean,
      default: true
    },

    filterable: {
      type: Boolean,
      default: true
    },

    // Linkage-Item props
    // ----------------------------------
    fetchMethod: {
      type: Function,
      default: noop
    },

    fields: {
      type: Object
    },
  },

  data() {
    return {
      model: this.value,
      data: [],
    }
  },

  computed: {
    innerFields() {
      return Object.assign({}, defaultFields, this.fields)
    }
  },

  watch: {
    value(newValue) {
      this.updateModel(newValue)
    },
  },

  created() {
    this.linkage.items.push(this)
  },

  render(h) {
    const fields = this.innerFields
    const baseKey = Date.now().toString().slice(-5)

    const OptionList = this.data.map((item, index) => {
      const label = item[fields.label]
      const value = item[fields.value]
      return h(Option, {
        key: baseKey + index,
        props: {
          label,
          value
        }
      })
    })

    const props = assignExclude(this.$props, ['fetchMethod', 'fields'])
    const listeners = {
      change: this.handleChange
    }

    // v-model
    props.value = this.model
    listeners.input = this.handleInput

    return h('div', {
      class: 'extra-linkage-item'
    }, [h(Select, { attrs: this.$attrs, props, on: listeners }, OptionList)])
  },

  methods: {
    clear() {
      this.handleInput('')
      this.data = []
    },
  
    fetchData() {
      const prevItem = this.linkage.getItem(this, -1)
      this.fetchMethod({ value: prevItem ? prevItem.model : '', callback: (data) => this.data = data || [] })
    },

    updateModel(value) {
      if (value === this.model) return;
      this.model = value
      const next = this.linkage.getItem(this, 1)
      next && next.fetchData()
    },

    handleInput(value) {
      this.model = value
      this.$emit('input', this.model)
    },

    handleChange(val) {
      if (val) {
        this.linkage.$emit('itemChange', this)
      } else {
        this.handleInput('')
        this.linkage.$emit('itemClear', this)
      }
    },
  }
}
