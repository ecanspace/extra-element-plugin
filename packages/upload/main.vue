<template>
  <div class="extra-upload">
    <ul class="extra-upload__file-list">
      <li class="extra-upload__file" :style="boundingStyle" v-for="(file, index) in files" :key="file.uid">
        <el-image class="extra-upload__thumbnail" ref="elImage" :fit="fit" :src="file.url" :preview-src-list="srcList"></el-image>

        <div class="extra-upload__actions">
          <span class="extra-upload__preview" @click="handlePreview(file, index)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span class="extra-upload__refresh" @click="handleRefresh(file, index)">
            <i class="el-icon-refresh-right"></i>
          </span>
          <span class="extra-upload__remove" @click="handleRemove(file, index)">
            <i class="el-icon-delete"></i>
          </span>
        </div>
      </li>
    </ul>

    <el-upload ref="elUpload" v-bind="rawProps" :before-upload="handleBeforeUpload" :on-change="handleChange" :on-success="handleSuccess">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
import { Upload } from 'element-ui'
import { assignExclude } from '../../src/shared/util'
export default {
  name: 'ExtraUpload',

  inject: {
    elForm: {
      default: null
    }
  },

  props: {
    ...Upload.props,

    listType: {
      type: String,
      default: 'picture-card'
    },

    showFileList: {
      type: Boolean,
      default: false
    },

    value: {},

    type: {
      type: String,
      optional: ['image', 'base64'],
      default: 'image'
    },

    width: {
      type: String
    },

    height: {
      type: String
    },

    url: {
      type: String
    },

    size: {
      type: Number,
      default: 2
    },

    fit: {
      type: String,
      optional: ['fill', 'contain', 'cover', 'none', 'scale-down'],
      default: 'contain'
    }
  },

  data() {
    return {
      files: [],
      activeIndex: -1,
    }
  },

  computed: {
    rawProps() {
      const props = assignExclude(this.$props, ['type', 'width', 'height', 'url', 'size'])

      props.autoUpload = this.type === 'image'
      props.disabled = this.disabled || (this.elForm || {}).disabled

      return props
    },

    srcList() {
      return this.files.map((file) => file.url)
    },

    boundingStyle() {
      return {
        width: this.width || this.height,
        height: this.height || this.width,
      }
    },

    currentFiles() {
      if (this.value && this.url && !this._filesInited) {
        this._filesInited = true

        return (this.value || []).map((fid, index) => ({
          uid: Date.now().toString().slice(-5) + index,
          url: this.url[index],
          fid: fid,
        }))
      }
    }
  },

  watch: {
    currentFiles(values = []) {
      this.files = values
    },

    files(values = []) {
      this.$emit('input', values.map((file) => file.fid))
    }
  },

  mounted() {
    if (this.width || this.height) {
      this.setUploadStyle()
    }
  },

  methods: {
    handleBeforeUpload(file) {
      if (typeof this.beforeUpload === 'function') {
        return this.beforeUpload(file)
      } else {
        const isIMG = /jpe?g|png|gif|webp/.test(file.type)
        const isLtSize = file.size / 1024 / 1024 < this.size

        if (!isIMG) {
          this.$message.warning('上传图片支持 JPG, JPEG, PNG, GIF, WEBP 格式')
        }
        
        if (!isLtSize) {
          this.$message.warning(`图片大小不超过${this.size}MB`)
        }

        return isIMG && isLtSize
      }
    },

    handleChange(file) {
      if (this.type === 'base64') {
        this.readAsBase64(file)
      }
    },

    handleSuccess(response, file, fileList) {
      if (response.pubResponse.code === '0000') {
        const data = response.body
        const newFile = {
          uid: file.uid || Date.now().toString().slice(-6),
          url: data.accessUrl,
          fid: data.fid,
        }

        if (this.activeIndex !== -1) {
          this.files.splice(this.activeIndex, 1, newFile)
          this.activeIndex = -1
        } else {
          this.files.push(newFile)
        }
      }
    },

    handlePreview(file, index) {
      this.$refs.elImage[index].clickHandler()
    },

    handleRefresh(file, index) {
      this.$refs.elUpload.$refs['upload-inner'].handleClick()
      this.activeIndex = index
    },

    handleRemove(file, index) {
      if (this.rawProps.disabled) return;
      this.files.splice(index, 1)
    },

    readAsBase64(file) {
      const reader = new FileReader()

      reader.onload = () => {
        const newFile = {
          uid: file.uid || Date.now().toString().slice(-6),
          url: URL.createObjectURL(file.raw),
          fid: reader.result
        }

        if (this.activeIndex !== -1) {
          this.files.splice(this.activeIndex, 1, newFile)
          this.activeIndex = -1
        } else {
          this.files.push(newFile)
        }
      }

      reader.readAsDataURL(file)
    },

    setUploadStyle() {
      const style = this.boundingStyle
      const uploadElement = this.$el.querySelector('.el-upload')
      uploadElement.style.cssText = `width: ${style.width}; height: ${style.height};`
    }
  }
}
</script>