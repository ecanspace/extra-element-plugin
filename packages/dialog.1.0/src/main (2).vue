<template>
  <el-dialog class="extra-dialog" :class="dialogClass" :visible.sync="model" v-bind="rawProps" @close="handleClose">
    <div class="extra-dialog__message" v-if="mode === 'msgbox'">
      <slot></slot>
    </div>
    <slot v-else></slot>

    <template slot="footer" v-if="showFooter">
      <el-button class="extra-dialog__cancel" @click="handleCancel" v-if="showCancelButton">{{cancelButtonText}}</el-button>
      <el-button class="extra-dialog__confirm" :type="type" @click="handleConfirm">{{confirmButtonText}}</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { Dialog } from  'element-ui'
import { assignExclude } from '../../../src/shared/util'

const RESET_PROPS = {
  plain: false
}

export default {
  name: 'ExtraDialog',

  props: {
    ...Dialog.props,

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

    plain: {
      type: Boolean
    },
  },

  data() {
    return {
      model: this.visible || false,
    }
  },

  computed: {
    rawProps() {
      const newProps = assignExclude(this.$props, [
        'mode', 
        'showFooter', 
        'height', 
        'plain', 
        'type', 
        'cancelButtonText', 
        'confirmButtonText',
        'showCancelButton',
        'onCancel',
        'onConfirm',
      ])
      newProps.closeOnClickModal = !!this.plain
      return newProps
    },

    dialogClass() {
      const classList = ['extra-dialog--' + this.type, { 'extra-dialog--plain': this.plain }]

      if (this.mode) {
        classList.push('extra-dialog--' + this.mode)
      }

      return classList
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
      Object.assign(this.$props, RESET_PROPS, newProps)
    },

    handleCancel() {
      this.END_STATUS = 'cancel'
      this.model = false
      this.$emit('close', {})
    },

    handleConfirm() {
      this.END_STATUS = 'confirm'

      const done = () => {
        this.model = false
        this.$emit('close')
      }
      
      if (this.onConfirm) {
        this.onConfirm(done)
      } else {
        let component
        if (component = this.$slots.default.componentInstance) {
          if (component.onConfirm) {
            component.onConfirm(done)
          } else {
            component.$emit('confirm', done)
          }
        }
      }
    },

    handleClose() {
      if (this.END_STATUS === 'confirm') return;
      if (this.onCancel) {
        this.onCancel()
      } else {
        let component
        if (component = this.$slots.default.componentInstance) {
          if (component.onCancel) {
            component.onCancel()
          } else {
            component.$emit('cancel')
          }
        }
      }
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