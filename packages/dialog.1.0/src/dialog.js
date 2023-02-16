import Vue from 'vue'
import DialogVue from './dialog.vue'

const DialogConstructor = Vue.extend(DialogVue)

DialogConstructor.prototype.then = function (callback) {
  this.onConfirm = callback
  return this
}

DialogConstructor.prototype.catch = function (callback) {
  this.onCancel = callback
  return this
}

let dialogQueue = [] // dialog queue
let id = 1 // dialog component id

const initData = function (component, options) {
  options = options || {}
  if (typeof options === 'string') {
    options = {
      title: options
    }
  }
  options.mainComponent = component
  options.mainProps = options.props || {}
  delete options.props // unbind options props
  const userClosed = options.onClosed
  options.onClosed = function () {
    Dialog._recover(this.traceId)
    userClosed && userClosed()
  }
  return options
}

// Open current instance or create one
function Dialog(component, options) {
  if (dialogQueue.length === 0) {
    return Dialog.create(component, options)
  } else {
    let instance = dialogQueue[0]
    Object.assign(instance.$data, initData(component, options))
    setTimeout(() => {
      instance.visible = true
    })
    return instance
  }
}

// Create a new instance
Dialog.create = function (component, options) {
  let instance = new DialogConstructor({
    el: document.createElement('div'),
    data: initData(component, options)
  })
  instance.traceId = id++ // set instance id
  instance.$mount()
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.visible = true
  })
  // Add a dialog instance in pool
  dialogQueue.push(instance)
  return instance
}

Dialog._recover = function (targetId) {
  if (dialogQueue.length === 0) return;
  if (dialogQueue.length === 1) {
    // reset data
    dialogQueue[0].resetData()
  } else {
    const index = dialogQueue.findIndex((instance) => instance.traceId === targetId)
    const instance = dialogQueue[index]
    // remove instance
    dialogQueue.splice(index, 1)
    // remove dom
    instance.$el.parentNode.removeChild(instance.$el)
  }
}

Dialog.close = function () {
  if (dialogQueue.length === 0) return;
  const instance = dialogQueue[dialogQueue.length - 1]
  instance.visible = false
}

Dialog.closeAll = function () {
  let i = dialogQueue.length
  while (i--) {
    const instance = dialogQueue[i - 1]
    instance.visible = false
  }
}

export default Dialog