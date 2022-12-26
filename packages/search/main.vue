<template>
  <div class="extra-search">
    <el-input class="extra-search__input" v-model="model">
      <el-button slot="append" icon="el-icon-search" @click="handleSearch">查询</el-button>
    </el-input>
    
    <el-select class="extra-search__select" ref="select">
      <el-option label="选项A" value="1"></el-option>
      <el-option label="选项B" value="2"></el-option>
    </el-select>
  </div>
</template>

<script>
import { Input } from 'element-ui'
export default {
  name: 'ExtraSearchInput',

  props: Input.props,

  data() {
    return {
      model: this.value
    }
  },

  watch: {
    value(newValue) {
      this.model = newValue
    }
  },

  mounted() {
    this.select = this.$refs.select
  },

  methods: {
    handleSearch() {
      this.select.selectedLabel = this.model
      this.select.onInputChange()
      this.select.visible = true
    }
  }
}
</script>

<style>
.extra-search {
  position: relative;
}
.extra-search__menu {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
}
</style>