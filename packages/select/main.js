import { Select, Option } from 'element-ui'
import { assignExclude, parseValue, debounce, isEqualMap } from '../../src/shared/util'

const defaultFields = {
  label: 'label',
  value: 'value',
  data: 'body',
  keyword: 'keyword',
}

export default {
  name: 'ExtraSelect',

  props: {
    ...Select.props,

    clearable: {
      type: Boolean,
      default: true
    },

    filterable: {
      type: Boolean,
      default: true
    },

    action: {
      type: String
    },

    data: {
      type: Array
    },

    fields: {
      type: Object,
      default: () => ({})
    },

    query: {
      type: Object
    },

    fetchable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      model: this.value || this.multiple ? [] : void 0,
      optionData: this.data || [],
      filterData: null,
    }
  },

  computed: {
    customFilterable() {
      return this.filterable && this.fields.filter
    },

    innerFields() {
      const fields = Object.assign({}, defaultFields, this.fields)

      if (typeof fields.filter === 'string') {
        fields.filter = fields.filter.split(/,\s*/)
      }

      return fields
    }
  },

  watch: {
    value(newValue) {
      this.model = newValue
    }
  },

  created() {
    if (this.action) {
      this.fetchData(this.query)
      this.query && this.$watch('query', debounce(this.compareQuery))
    } else {
      this.$watch('data', (newData = []) => this.optionData = newData)
    }
  },

  render(h) {
    const props = assignExclude(this.$props, ['action', 'data', 'fields', 'query', 'fetchable'])

    // v-model
    props.value = this.model
    const listeners = Object.assign({}, this.$listeners)
    listeners.input = (value) => {
      this.model = value
      this.$emit('input', this.model)
    }

    if (this.customFilterable) {
      props.filterMethod = this.handleFilter
      listeners['visible-change'] = this.handleVisibleChange
    }

    if (this.remote) {
      props.remoteMethod = this.handleRemote
    }

    const data = {
      class: 'extra-select',
      ref: 'rawSelect',
      props,
      on: listeners,
    }
    return h(Select, data, this.genOption(h))
  },

  methods: {
    genOption(h) {
      const fields = this.innerFields
      const baseKey = Date.now().toString().slice(-5)

      return (this.filterData || this.optionData).map((item, index) => {
        const label = item[fields.label]
        const value = item[fields.value]

        return h(Option, {
          key: baseKey + index,
          props: {
            label,
            value
          },
        })
      })
    },

    compareQuery(newQuery = {}) {
      if (!isEqualMap(newQuery, this.prevQuery)) {
        this.fetchData(newQuery)
        this.prevQuery = newQuery
      }
    },

    fetchData(query = {}) {
      if (this.remote && !query[this.innerFields.keyword]) return;
      if (this.fetchable) {
        this.$axios.post(this.action, query).then((res) => {
          this.optionData = parseValue(res, this.innerFields.data)
        }).catch((error) => {
          console.error('[extra select]', error)
        })
      }
    },

    handleFilter(text) {
      if (text) {
        const filter = this.innerFields.filter
        this.filterData = this.optionData.filter(handler)

        function handler(item) {
          filter.some((key) => item[key] && item[key].indexOf(text) !== -1)
        }
      } else {
        this.filterData = this.optionData
      }
    },

    handleRemote(text) {
      if (text) {
        const query = Object.assign({}, this.query)
        query[this.innerFields.keyword] = text
        this.fetchData(query)
      } else {
        this.optionData = []
      }
    },

    handleVisibleChange(visible) {
      if (!visible) {
        setTimeout(() => {
          this.filterData = null
        }, 300)
      }
    }
  }
}