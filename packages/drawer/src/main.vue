<template>
  <el-drawer class="extra-drawer" :style="drawerStyle" :visible="model" v-bind="drawerProps" @close="handleClose">
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
    bounding: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      model: this.visible || false,
    }
  },

  computed: {
    drawerStyle() {
      const bounding = this.bounding
      const style = Object.keys(bounding).reduce(normalizeBoundingMap, {})

      function normalizeBoundingMap(result, prop) {
       const value = bounding[prop]
       result[prop] = typeof value === 'number' ? value + 'px' : value
       return result
      }

      return style
    },

    drawerProps() {
      return assignExclude(this.$props, ['bounding', 'propsData'])
    }
  },

  created() {
    this.$on('visible', this.handleVisible)
    this.$on('propsChange', this.handlePropsChange)
  },

  methods: {
    handleVisible(val) {
      this.model = val
    },

    handlePropsChange(newProps) {
      Object.assign(this.$props, newProps)
    },

    handleClose() {
      this.model = false
    }
  }
}
</script>