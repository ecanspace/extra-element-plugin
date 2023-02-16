import { FormItem } from 'element-ui'

export default {
  name: 'ExtraFormItem',

  inject: ['extraForm'],

  props: FormItem.props,

  render(h) {
    const data = {
      attrs: {
        title: this.label,
      },
      props: Object.assign({}, this.$props),
      on: this.$listeners,
    }
    return h(FormItem, data, this.$slots.default)
  },
}
