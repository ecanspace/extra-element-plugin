<template>
  <el-dialog class="elpro-dialog-puzzler" :visible.sync="visible" :width="width" @closed="handleClosed">
    <div class="elpro-dialog-puzzler__title">请完成安全验证</div>
    <elpro-puzzler :imgs="imgs" :position="position" :on-change="handleChange" :on-success="handleSuccess" :on-fail="handleFail">
    </elpro-puzzler>
  </el-dialog>
</template>

<script>
import ElproPuzzler from './puzzler.vue'
export default {
  components: { ElproPuzzler },
  data() {
    return {
      position: '0',
      width: '25%',
      visible: false,
      imgs: [],
      onChange: null,
      onSuccess: null,
      onFail: null,
    }
  },
  methods: {
    handleChange(...args) {
      if (typeof this.onChange === 'function') {
        return this.onChange.apply(this, args)
      }
    },
    handleSuccess(...args) {
      this.visible = false
      if (typeof this.onSuccess === 'function') {
        return this.onSuccess.apply(this, args)
      }
    },
    handleFail(...args) {
      if (typeof this.onFail === 'function') {
        return this.onFail.apply(this, args)
      }
    },
    handleClosed() {
      if (typeof this.onClosed === 'function') {
        return this.onClosed.call(this)
      }
    }
  }
}
</script>