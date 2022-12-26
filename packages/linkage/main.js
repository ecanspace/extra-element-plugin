function isNonEmpty(value) {
  return value !== null && value !== undefined && value !== ''
}

export default {
  name: 'ExtraLinkage',

  props: {
    value: Array,
  },

  provide() {
    return {
      linkage: this
    }
  },

  data() {
    return {
      model: [],
      items: [],
    }
  },

  computed: {
    innerModel() {
      return this.items.map((item) => item.model).filter((value) => isNonEmpty(value))
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(values) {
        if (Array.isArray(values)) {
          this.model = values
          this.items.forEach((item, index) => item.updateModel(values[index]))
        }
      }
    },

    innerModel(values = []) {
      if (values.join('') === this.model.join('')) return;
      this.model = values
      this.$emit('input', this.model)
      this.$emit('change', this.model)
    },
  },

  created() {
    this.$on('itemChange', this.handleItemChange)
    this.$on('itemClear', this.handleItemClear)
  },

  render(h) {
    return h('div', { class: 'extra-linkage' }, this.$slots.default)
  },

  mounted() {
    const item = this.items[0]

    if (!item) {
      console.warn('[extra warning] 缺少 `extra-linkage-item` 组件')
      return
    }

    item.fetchData()
  },

  methods: {
    getItem(current, step) {
      const items = this.items
      const index = items.indexOf(current)
      return items[index + step]
    },

    handleItemChange(current) {
      this.handleItemClear(current)
      const next = this.getItem(current, 1)
      next && next.fetchData()
    },

    handleItemClear(current) {
      const items = this.items
      const index = items.indexOf(current)
      const nexted = items.slice(index + 1)
      nexted.forEach((item) => item.clear())
    },
  },
}
