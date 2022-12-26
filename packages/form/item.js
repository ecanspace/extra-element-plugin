import { FormItem } from 'element-ui'
import { addClass, addStyle } from '../../src/shared/vnode'

const rawRender = FormItem.render

export default {
  name: 'ExtraFormItem',

  mixins: [FormItem],

  inject: ['extraForm'],

  props: {
    span: [Number, String],
  },

  render(h) {
    const vnode = rawRender.call(this, h)
    addClass(vnode, ['extra-form-item', this.span ? 'el-col-' + this.span : ''])

    const itemPadding = this.extraForm.itemPadding
    addStyle(vnode, { paddingLeft: itemPadding, paddingRight: itemPadding })

    return vnode
  },
}