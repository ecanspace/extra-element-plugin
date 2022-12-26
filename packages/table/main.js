import { Table } from 'element-ui'
import { assignExclude } from '../../src/shared/util'
import ExtraTableColumn from './column'

export default {
  name: 'ExtraTable',

  props: {
    ...Table.props,

    border: {
      type: Boolean,
      default: true
    },

    columns: {
      type: Array
    },
  },

  created() {
    this.initVNodeMap()
  },

  render(h) {
    const data = {
      props: assignExclude(this.$props, ['columns']),
      on: this.$listeners,
    }
    const children = Array.isArray(this.columns) ? this.renderColumns(h, this.columns) : this.$slots.default
    return h(Table, data, children)
  },

  methods: {
    initVNodeMap() {
      const vnodes = this.$slots.default
      const vnodeMap = new Map()

      vnodes.forEach((vnode) => {
        const name = vnode.data.attrs.name || vnode.data.attrs.alias
        name && vnodeMap.set(name, vnode)
      })

      this.vnodeMap = vnodeMap
    },

    renderColumns(h, columns = []) {
      const vnodeMap = this.vnodeMap

      return columns.map((column) => {
        if (column.reference) {
          return vnodeMap.get(column.reference)
        } else {
          const props = assignExclude(column, ['columns'])
          return h(ExtraTableColumn, { props }, this.renderColumns(h, column.columns))
        }
      })
    },
  }
}
