<template>
  <div class="elpro-puzzler">
    <div class="elpro-puzzler__inner">
      <img :src="imgs[0]" class="elpro-puzzler__img1" @load="load$1" />
      <img :src="imgs[1]" class="elpro-puzzler__img2" @load="load$2" :style="style$2" v-show="visible$2" />
      <transition name="fade">
        <div class="elpro-puzzler__tips" v-show="loading">
          <div class="elpro-puzzler__tips-wrap">
            <span class="elpro-puzzler__tips-icon"><i :class="tipsIcon"></i></span>
            <p class="elpro-puzzler__tips-text">{{tipsText}}</p>
          </div>
        </div>
      </transition>
    </div>
    <div class="elpro-puzzler__slider" :class="['is-' + status]">
      <div class="elpro-puzzler__slider-text">按住左边按钮拖动完成上方拼图</div>
      <el-slider class="elpro-puzzler__slider-origin" v-model="translate" :max="distance" :show-tooltip="false" @change="handleChange">
      </el-slider>
    </div>
  </div>
</template>

<script>
const FEEDBACK_TIMEOUT = 500
export default {
  name: "ElproPuzzler",

  props: {
    imgs: Array,
    position: [Number, String],
    onChange: Function,
    onSuccess: Function,
    onFail: Function,
  },

  data() {
    return {
      status: '',
      tipsIcon: 'el-icon-loading',
      tipsText: '加载中',
      loading: false,
      ratio: 0,
      translate: 0,
      width: 0,
      naturalWidth$2: 0,
    }
  },

  computed: {
    position$2() {
      return Math.round(this.position * this.ratio)
    },
    width$2() {
      return Math.round(this.naturalWidth$2 * this.ratio)
    },
    visible$2() {
      return this.width$2 && this.position$2
    },
    distance() {
      return (this.width - this.width$2) || 100
    },
    style$2() {
      return {
        width: this.width$2 + 'px',
        top: this.position$2 + 'px',
        left: this.translate + 'px',
      }
    }
  },

  methods: {
    load$1(e) {
      const img = e.target || {}
      const clientWidth = img.clientWidth
      this.width = clientWidth
      this.ratio = clientWidth / img.naturalWidth
    },
    load$2(e) {
      const img = e.target
      this.naturalWidth$2 = img.naturalWidth
    },
    computePos() {
      return [Math.round(this.translate / this.ratio), this.position$2].join(',')
    },
    sleep(wait) {
      return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
          resolve()
          clearTimeout(timer)
        }, wait)
      })
    },
    feedback(type, args = []) {
      if (type === 'success') {
        this.tipsIcon = 'el-icon-success'
        this.tipsText = '验证通过'
        this.sleep(FEEDBACK_TIMEOUT).then(() => {
          if (typeof this.onSuccess === 'function') this.onSuccess.apply(this, args)
          this.resetData()
        })
      } else {
        this.tipsIcon = 'el-icon-error'
        this.tipsText = '验证失败，请根据提示重新操作'
        this.sleep(FEEDBACK_TIMEOUT).then(() => {
          if (typeof this.onFail === 'function') this.onFail()
          this.resetData()
        })
      }
      this.status = type
    },
    handleChange() {
      this.loading = true
      if (typeof this.onChange === 'function') {
        const answer = this.computePos()
        this.onChange(answer).then((...args) => {
          this.feedback('success', args)
        }).catch(() => {
          this.feedback('fail')
        })
      }
    },
    resetData() {
      Object.assign(this.$data, this.$options.data.call(this))
    },
  },
}
</script>