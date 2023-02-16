<template>
  <el-container class="app-container">
    <el-header height="80px">
      <div class="app-header">
        <div class="app-header__inner">
          <h1 class="title">
            <a href="/#/" class="app-logo">
              <span><i class="el-icon-cloudy"></i></span>
              <span>Element Pro</span>
            </a>
          </h1>
          <div class="nav">
            <span class="info_9">最新版本：v0.7.1</span>
          </div>
        </div>
      </div>
    </el-header>
    <el-container class="app-content">
      <el-aside width="260px">
        <app-aside></app-aside>
      </el-aside>
      <el-main class="app-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from './components/Aside'
export default {
  name: 'App',
  components: { AppAside }
}
</script>

<style>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 999;
}
.app-header__inner {
  position: relative;
  width: 1200px;
  margin: auto;
  height: 80px;
  padding: 20px 0;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dcdfe6;
  background-color: white;
  box-sizing: border-box;
}
.app-header__inner > .title {
  margin: 0;
  color: #409EFF;
  font-size: 30px;
}
.app-header__inner > .title i {
  font-weight: bold;
}
.app-header__inner > .nav {
  flex: 1;
  font-size: 14px;
  text-align: right;
}
.app-content {
  width: 1200px;
  margin: auto;
}
.app-content .app-main {
  padding: 36px 0;
}
</style>