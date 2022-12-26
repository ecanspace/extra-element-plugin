import { TableColumn } from 'element-ui'
import { isEmpty, isDef }  from '../../src/shared/util'

/**
 * 默认空值处理
 */
function defaultFormatter(row, column, value, index) {
  return isEmpty(value) ? '/' : value
}

/**
 * 根据列的 label 属性，计算当前列所需的最小宽度
 */
function computeMinWidth(vm) {
  const minWidth = 80
  const cellPadding = 10
  const fontSize = 14
  const filterIconsWidth = 12
  const sortIconsWidth = 24

  const options = vm.$options

  if (options.propsData.label) {
    let count = options.propsData.label.length
    let width = fontSize * count + cellPadding * 2 + 2

    // 如果列启用了筛选
    if (isDef(options.propsData.filters || options.propsData.filterMethod)) {
      width += filterIconsWidth
    }

    // 如果列启用了排序
    if (isDef(options.propsData.sortable)) {
      width += sortIconsWidth
    }

    return Math.max(minWidth, width)
  }
}

export default {
  name: 'ExtraTableColumn',

  mixins: [TableColumn],

  props: {
    formatter: {
      type: Function,
      default: defaultFormatter
    },

    minWidth: {
      type: [Number, String],
      default() {
        return computeMinWidth(this)
      }
    },

    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
  }
}
