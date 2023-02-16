import { TableColumn } from 'element-ui'
import { isEmpty, isDef }  from '../../src/shared/util'

export default {
  name: 'ExtraTableColumn',

  mixins: [TableColumn],

  props: {
    align: {
      type: String,
      default: 'left'
    },

    showOverflowTooltip: {
      type: Boolean,
      default: true
    },

    fixed: {
      type: [Boolean, String],
      default: function setDefaultFixed() { // ‘操作’ 列默认固定在右侧
        const options = this.$options
        const columnName = options.propsData.name || options.propsData.alias
        if (columnName === 'action' || options.propsData.label === '操作') {
          return 'right'
        }
      }
    },

    formatter: {
      type: Function,
      default: function defaultFormatter(row, column, value, index) {
        return isEmpty(value) ? '-' : value
      }
    },

    minWidth: {
      type: [Number, String],
      default: function computeMinWidth() {
        const minWidth = 100
        const cellPadding = 10
        const fontSize = 14
        const filterIconWidth = 12
        const sortIconWidth = 24

        const options = this.$options

        if (options.propsData.label) {
          let textCount = options.propsData.label.length
          let currWidth = fontSize * textCount + cellPadding * 2 + 2

          // 如果列启用了筛选
          if (isDef(options.propsData.filters || options.propsData.filterMethod)) {
            currWidth += filterIconWidth
          }

          // 如果列启用了排序
          if (isDef(options.propsData.sortable)) {
            currWidth += sortIconWidth
          }

          console.log('11111111111', currWidth)

          return Math.max(minWidth, currWidth)
        }
      }
    },
  },
}
