<template>
  <el-dialog class="extra-dialog" :class="dialogClass" :visible.sync="model" v-bind="rawProps" @close="handleCancel">
    <div class="extra-dialog-message" v-if="mode === 'msgbox'">
      <slot></slot>
    </div>
    <slot v-else></slot>

    <template slot="footer" v-if="showFooter">
      <el-button @click="handleCancel" v-if="showCancelButton">{{cancelButtonText}}</el-button>
      <el-button :type="type" @click="handleConfirm">{{confirmButtonText}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Dialog } from  'element-ui'
import { assignExclude } from '../../../src/shared/util'
export default {
  name: 'ExtraDialog',

  props: {
    ...Dialog.props,

    // Custom
    // --------------------------------
    mode: {
      type: String
    },

    showFooter: {
      type: Boolean,
      default: true
    },

    height: {
      type: String
    },

    // Cover
    // --------------------------------
    closeOnClickModal: {
      type: Boolean,
      default: false
    },

    closeOnPressEscape: {
      type: Boolean,
      default: false
    },

    // Compat 'message-box' props 
    // --------------------------------
    type: {
      type: String,
      optional: ['primary', 'success', 'warning', 'danger', 'info'],
      default: 'primary'
    },

    cancelButtonText: {
      type: String,
      default: '取消'
    },

    confirmButtonText: {
      type: String,
      default: '保存'
    },

    showCancelButton: {
      type: Boolean,
      default: true
    },

    onCancel: {
      type: Function
    },

    onConfirm: {
      type: Function
    },
  },

  data() {
    const classList = ['extra-dialog--' + this.type]

    if (this.mode) {
      classList.push('extra-dialog--' + this.mode)
    }

    return {
      model: this.visible || false,
      dialogClass: classList,
    }
  },

  computed: {
    rawProps() {
      return assignExclude(this.$props, [
        'mode', 
        'showFooter', 
        'height', 
        'type', 
        'cancelButtonText', 
        'confirmButtonText',
        'showCancelButton',
        'onCancel',
        'onConfirm',
      ])
    }
  },

  created() {
    this.$on('visible', this.handleVisible)
    this.$on('propsChange', this.handlePropsChange)
  },

  mounted() {
    if (this.height) {
      this.setContentHeight()
    }
  },

  methods: {
    handleVisible(val) {
      this.model = val
    },

    handlePropsChange(newProps) {
      Object.assign(this.$props, newProps)
    },

    handleCancel() {
      if (this.onCancel) {
        Promise.resolve().then(this.onCancel).then(this.handleClose)
      } else {
        let component
        if (component = this.$slots.default.componentInstance) {
          if (component.onCancel) {
            Promise.resolve().then(component.onCancel).then(this.handleClose)
          } else {
            component.$emit('cancel', this.handleClose)
          }
        }
      }
    },

    handleConfirm() {
      if (this.onConfirm) {
        this.onConfirm(this.handleClose)
      } else {
        let component
        if (component = this.$slots.default.componentInstance) {
          if (component.onConfirm) {
            component.onConfirm(this.handleClose)
          } else {
            component.$emit('confirm', this.handleClose)
          }
        }
      }
    },

    // handleClick(res) {
    //   if (typeof this.callback === 'function') {
    //     this.callback(res, this.handleClose)
    //   } else {
    //     this.handleClose()
    //   }
    // },

    handleClose() {
      this.model = false
      this.$emit('close', {})
    },

    setContentHeight() {
      setTimeout(() => {
        const contentElement = this.$el.querySelector('.el-dialog__body')
        contentElement.style.height = this.height
      })
    }
  }
}
</script>