import { FormItem } from 'element-ui'
import { assignExclude } from '../../src/shared/util'

// function addLabelVNodeTitle(vnode, context) {
//   const labelWrapVNode = vnode.children.find((sub) => sub.componentOptions && sub.componentOptions.tag === 'label-wrap')
//   const labelVNode = labelWrapVNode.componentOptions.children[0]
//   if (labelVNode && labelVNode.tag) {
//     const attrs = labelVNode.data.attrs || (labelVNode.data.attrs || {})
//     attrs.title = context.label
//   }
// }

export default {
  name: 'ExtraFormItem',

  inject: ['extraForm'],

  props: {
    ...FormItem.props,
    
    // Extended props
    // --------------------------------
    span: {
      type: Number,
      default: 24
    },
  },

  data() {
    return {
      columnSpan: Math.min(Math.max(0, this.span), 24)
    }
  },

  render(h) {
    // const vnode = rawRender.call(this, h)
    // addVNodeClass(vnode, ['extra-form-item', this.extraForm.inline ? '' : 'el-col-' + this.columnSpan])
    // addLabelVNodeTitle(vnode, this)
    // return vnode
    const data = {
      attrs: {
        title: this.label,
      },
      class: ['extra-form-item', this.extraForm.inline ? '' : 'el-col-' + this.columnSpan],
      props: assignExclude(this.$props, ['span']),
      on: this.$listeners,
    }
    return h(FormItem, data, this.$slots.default)
  },
}