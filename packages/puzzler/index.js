import Puzzler from './src/puzzler.vue'
import service from './src/main.js'

Puzzler.install = function (Vue) {
  Vue.component(Puzzler.name, Puzzler)
}

Puzzler.service = service

export default Puzzler
