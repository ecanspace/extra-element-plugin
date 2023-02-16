<template>
  <el-drawer class="extra-drawer" :visible="model" :style="drawerStyle" v-bind="rawProps" @close="handleClose">
    <slot></slot>
  </el-drawer>
</template>

<script>
import { Drawer } from  'element-ui'
import { assignExclude } from '../../../src/shared/util'
export default {
  name: 'ExtraDrawer',

  props: {
    ...Drawer.props,

    // Cover
    // --------------------------------
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },

    modal: {
      type: Boolean,
      default: false
    },

    size: {
      type: [Number, String],
      default: '100%'
    },

    wrapperClosable: {
      type: Boolean,
      default: false
    },

    // Custom
    // --------------------------------
    width: {
      type: String
    },

    bounding: {
      type: Object,
      default: () => ({ width: '30%' })
    }
  },

  data() {
    return {
      model: this.visible || false,
    }
  },

  computed: {
    rawProps() {
      return assignExclude(this.$props, ['width', 'bounding', 'propsData'])
    },

    drawerStyle() {
      const bounding = this.bounding
      const style = Object.keys(bounding).reduce(normalizeBounding, {})

      if (this.width) {
        style.width = this.width
        style.left = 'auto'
      }

      function normalizeBounding(result, prop) {
       const value = bounding[prop]
       result[prop] = typeof value === 'number' ? value + 'px' : value
       return result
      }

      return style
    },
  },

  created() {
    this.$on('visible', this.handleVisible)
    this.$on('propsChange', this.handlePropsChange)
  },

  methods: {
    handleVisible(val) {
      this.model = val
      if (this.closeOnPressEscape) {
        this.$nextTick(() => {
          if (this.model) {
            document.addEventListener('keydown', this.handleKeydown)
          } else {
            document.removeEventListener('keydown', this.handleKeydown)
          }
        })
      }
    },

    handlePropsChange(newProps) {
      Object.assign(this.$props, newProps)
    },

    handleClose() {
      this.handleVisible(false)
    },

    handleKeydown(event) {
      if (event.keyCode === 27) {
        this.handleClose()
      }
    }
  }
}
</script>