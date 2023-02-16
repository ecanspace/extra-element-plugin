<template>
  <div class="elpro-demo">
    <div class="elpro-demo__source">
      <slot name="source"></slot>
    </div>
    <div class="elpro-demo__code" :style="{ height: codeAreaCurrentHeight + 'px' }">
      <div class="highlight" v-pre><slot></slot></div>
    </div>
    <div class="elpro-demo__control" @click="dropdown">
      <i :class="['el-icon-caret-' + controlIcon]"></i>
      <span>{{controlText}}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElproDemo',
  data() {
    return {
      codeVisible: false,
      codeAreaHeight: 0,
    }
  },
  computed: {
    codeAreaCurrentHeight() {
      return this.codeVisible ? this.codeAreaHeight : 0
    },
    controlIcon() {
      return this.codeVisible ? 'top' : 'bottom'
    },
    controlText() {
      return this.codeVisible ? '隐藏代码' : '显示代码'
    }
  },
  methods: {
    dropdown() {
      const visible = !this.codeVisible
      if (visible) this.computeCodeAreaHeight()
      this.codeVisible = visible
    },
    computeCodeAreaHeight() {
      const elm = this.$el.querySelector('.elpro-demo__code')
      this.codeAreaHeight = Array.prototype.reduce.call(elm.children, (h, element) => {
        return h += element.clientHeight
      }, 0)
    }
  }
}
</script>