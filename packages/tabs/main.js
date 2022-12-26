import { Tabs } from 'element-ui'
import { addClass } from '../../src/shared/vnode'

const rawRender = Tabs.render

export default {
  name: 'ExtraTabs',

  mixins: [Tabs],

  provide() {
    return {
      extraTabs: this
    }
  },

  render(h) {
    const vnode = rawRender.call(this, h)
    addClass(vnode, 'extra-tabs')
    return vnode
  }
}