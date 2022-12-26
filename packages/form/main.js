import { Form } from 'element-ui'
import { addClass, addStyle } from '../../src/shared/vnode'

const rawRender = Form.render
const rawParseInt = Number.parseInt || window.parseInt

export default {
  name: 'ExtraForm',

  mixins: [Form],

  provide() {
    return {
      extraForm: this
    }
  },

  props: {
    gutter: {
      type: [Number, String],
      default: 20
    }
  },

  data() {
    return {
      itemPadding: Math.round(rawParseInt(this.gutter) / 2) + 'px'
    }
  },

  render(h) {
    const vnode = rawRender.call(this, h)
    addClass(vnode, 'extra-form')

    const itemPadding = '-' + this.itemPadding
    addStyle(vnode, { marginLeft: itemPadding, marginRight: itemPadding })
    
    return vnode
  },
}
