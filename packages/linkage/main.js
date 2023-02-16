/**
 * 判断值不为空
 * @param {*} value 
 * @returns 
 */
function isNonEmpty(value) {
  return value !== '' && value != null
}

export default {
  name: 'ExtraLinkage',

  props: {
    value: Array,
    disabled: Boolean,
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
      if (values.join(',') === this.model.join(',')) return;
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
      return this.items[this.items.indexOf(current) + step]
    },

    handleItemChange(current) {
      this.handleItemClear(current)
      const next = this.getItem(current, 1)
      next && next.fetchData()
    },

    handleItemClear(current) {
      const nextItems = this.items.slice(this.items.indexOf(current) + 1)
      nextItems.forEach((item) => item.clear())
    },
  },
}
