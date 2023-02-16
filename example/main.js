import Vue from 'vue'
import hljs from 'highlight.js'
import ElementUI from 'element-ui'
import ElementPro from 'element-pro/src/index.js'
import App from './App'
import router from './router'
import ElproDemo from './components/ElproDemo'
// styles
import 'element-ui/lib/theme-chalk/index.css'
import 'element-pro/packages/theme/index.css'
import './global.css'

Vue.use(ElementUI)
Vue.use(ElementPro)
Vue.component(ElproDemo.name, ElproDemo)

router.afterEach(route => {
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  })
})

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})