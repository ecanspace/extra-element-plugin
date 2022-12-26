import { Pagination } from 'element-ui'

export default {
  name: 'ExtraPagination',

  props: {
    ...Pagination.props,

    background: {
      type: Boolean,
      default: true
    },

    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },

    model: {
      type: Object,
    },
  },

  created() {
    this.$set(this.model, 'pageNum', 1)
    this.$set(this.model, 'pageSize', 20)
  },

  render(h) {
    const model = this.model
    const props = Object.assign({}, this.$props)

    props.currentPage = model.pageNum
    props.pageSize = model.pageSize
    props.total = this.total

    const listeners = {}
    listeners['current-change'] = this.handleCurrentChange
    listeners['size-change'] = this.handleSizeChange

    return h(Pagination, { props, on: listeners })
  },

  methods: {
    handleCurrentChange(value) {
      this.model.pageNum = value
      this.$emit('change', this.model)
    },

    handleSizeChange(value) {
      this.model.pageSize = value
      this.model.pageNum = 1
      this.$emit('change', this.model)
    }
  }
}