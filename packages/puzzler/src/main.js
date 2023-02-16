import Vue from 'vue'
import MainVue from './main.vue'

const MainConstructor = Vue.extend(MainVue)

let instance = null

const PuzzlerMethod = function (options = {}) {
  // prevent fast-click
  if (instance && instance.visible) return;
  options = Object.assign({}, options)
  const userClose = options.onClosed
  options.onClosed = () => {
    userClose && userClose()
    instance.$el.parentNode.removeChild(instance.$el)
    instance = null
  }
  instance = new MainConstructor({
    el: document.createElement('div'),
    data: options
  })
  instance.$mount()
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
  return instance
}

export default PuzzlerMethod
