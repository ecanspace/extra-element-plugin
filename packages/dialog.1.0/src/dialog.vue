<template>
  <el-dialog
      class="elpro-dialog"
      :visible.sync="visible"
      :title="title"
      :width="width"
      :fullscreen="fullscreen"
      :top="top"
      :modal="modal"
      :modal-append-to-body="modalAppendToBody"
      :append-to-body="appendToBody"
      :lock-scroll="lockScroll"
      :custom-class="customClass"
      :close-on-click-modal="closeOnClickModal"
      :close-on-press-escape="closeOnPressEscape"
      :show-close="showClose"
      :before-close="beforeClose"
      :center="center"
      :destroy-on-close="destroyOnClose"
      @closed="handleClosed">
    <component ref="main" :is="mainComponent" v-bind="mainProps"></component>
    <div slot="footer" class="elpro-dialog__footer" v-if="showFooter">
      <el-button @click="handleCancel" v-if="showCancelButton">{{cancelButtonText}}</el-button>
      <el-button type="primary" @click="handleConfirm('main')" v-if="showConfirmButton">{{confirmButtonText}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
const DIALOG_DEFAULT_OPTIONS = {
  // ElDialog default options
  visible: false,
  title: '',
  width: '50%',
  fullscreen: false,
  top: '15vh',
  modal: true,
  modalAppendToBody: true,
  appendToBody: false,
  lockScroll: true,
  customClass: '',
  closeOnClickModal: false,
  closeOnPressEscape: true,
  showClose: true,
  beforeClose: null,
  center: false,
  destroyOnClose: false,
  // custom params
  mainComponent: null,
  mainProps: {},
  showFooter: true,
  showCancelButton: true,
  showConfirmButton: true,
  cancelButtonText: '取 消',
  confirmButtonText: '确 定',
  onClosed: () => {},
}
export default {
  name: 'ElproDialog',

  provide () {
    return {
      elproDialog: this,
    }
  },

  data() {
    return { ...DIALOG_DEFAULT_OPTIONS }
  },

  methods: {
    // closed callback
    handleClosed() {
      this.onClosed && this.onClosed()
    },
    // confirm
    handleConfirm(name) {
      const main = this.$refs.main

      if (typeof main.submitForm === 'function') {
        main.submitForm(() => this.visible = false, {
          start: (options) => this.showLoading(options),
          finish: () => this.hideLoading(),
        })
      } else {
        this.visible = false
      }

      // instance.then
      this.onConfirm && this.onConfirm()
    },
    // cancel
    handleCancel() {
      this.visible = false
      this.onCancel && this.onCancel()
    },
    showLoading(options = {}) {
      this.submitLoading = this.$loading({
        target: this.$el.querySelector('.el-dialog'),
        text: options.text || '正在提交...',
      })
    },
    hideLoading() {
      this.submitLoading.close()
    },
    // reset
    resetData() {
      Object.assign(this.$data, DIALOG_DEFAULT_OPTIONS)
    }
  },
}
</script>