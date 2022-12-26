<template>
  <div class="best-uploader">
    <el-upload
        class="best-uploader__origin"
        :action="action"
        :accept="accept"
        :auto-upload="autoUpload"
        :disabled="isDisabled"
        :show-file-list="false"
        :before-upload="handleBefore"
        :on-change="handleChange"
        :on-success="handleSuccess">
      <div :style="{ visibility: imageUrl ? 'hidden' : 'visible' }">
        <slot v-if="$slots.default"></slot>
        <div class="best-uploader__inner" :style="innerStyle" v-else>
          <span class="best-uploader__icon"><i :class="icon"></i></span>
          <span class="best-uploader__text">{{text}}</span>
        </div>
      </div>
      <div class="best-uploader__modal" v-if="imageUrl">
        <img class="" :src="imageUrl" />
        <div class="best-uploader__mask" v-show="!isDisabled">
          <span class="best-uploader__action-remove" @click.stop="handleRemove">
            <i class="el-icon-delete"></i>
          </span>
        </div>
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "BestUploader",

  inject: {
    elForm: {
      default: null,
    }
  },

  props: {
    accept: String,
    disabled: Boolean,
    width: String,
    height: String,
    text: String,
    url: String,
    value: String,
    beforeUpload: Function,
    onSuccess: Function,
    action: {
      type: String,
      default : '/merchantManage/files/upload',
    },
    icon: {
      type: String,
      default: 'el-icon-plus',
    },
    type: {
      type: String,
      default: 'image',
    },
  },

  data() {
    const imageUrl = this.type === 'base64' ? this.value : this.url
    return {
      imageUrl: imageUrl,
    }
  },

  computed: {
    autoUpload() {
      return this.type === 'image'
    },
    isDisabled() {
      return this.disabled || (this.elForm || {}).disabled
    },
    innerStyle() {
      return { width: this.width, height: this.height }
    },
  },

  watch: {
    url(val) {
      this.imageUrl = val
    }
  },

  methods: {
    /**
     * 图片上传限制
     */
    handleBefore(file) {
      if (typeof this.beforeUpload === 'function') {
        return this.beforeUpload(file)
      } else {
        const isIMG = /(gif|jpe?g|png)/.test(file.type)
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isIMG) {
          this.$message.warning('图片仅支持 GIF、JPG、JPEG、PNG 格式')
        }
        if (!isLt5M) {
          this.$message.warning('图片大小不超过5MB')
        }

        return isIMG && isLt5M
      }
    },

    /**
     * 选择图片
     */
    handleChange(file, fileList) {
      if (this.type === 'base64') {
        this.readAsBase64(file.raw)
      }
    },

    /**
     * 图片转 base64 格式
     */
    readAsBase64(file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.imageUrl = reader.result
        this.$emit('input', reader.result)
      }
      reader.readAsDataURL(file)
    },

    /**
     * 上传成功
     */
    handleSuccess(res, file, fileList) {
      if (typeof this.onSuccess === 'function') {
        this.onSuccess(res, file, fileList)
      } else {
        if (res.pubResponse.code === '0000') {
          const data = res.body
          this.imageUrl = data.accessUrl
          this.$emit('input', data.fid || this.value)
        }
      }
    },

    /**
     * 移除图片
     */
    handleRemove() {
      if (this.isDisabled) return;
      this.imageUrl = ''
      this.$emit('input', this.imageUrl)
    },
  }
}
</script>