const nodeList = []
const ctx = '@@clickoutsideContext'

let mdEvent, seed = 0

document.addEventListener('mousedown', e => mdEvent = e)
document.addEventListener('mouseup', e => {
  nodeList.forEach(node => node[ctx].clickHandler(e, mdEvent))
})

function insideMe(el, mouseup) {
  const rect = el.getBoundingClientRect();
  if (mouseup.pageX < rect.left || mouseup.pageX > rect.right || mouseup.pageY < rect.top || mouseup.pageY > rect.bottom) return false;
  else return true;
}

function wrapFn(el, binding, vnode) {
  return function (mouseup = {}, mousedown = {}) {

    if (!vnode || !vnode.context || !mouseup.target || !mousedown.target || el.contains(mouseup.target) || el.contains(mousedown.target) || el === mouseup.target || (vnode.context.popperElm && (vnode.context.popperElm.contains(mouseup.target) || vnode.context.popperElm.contains(mousedown.target))) || insideMe(el, mouseup)) return;

    const methodName = binding.expression

    if (methodName && vnode.context[methodName]) {
      vnode.context[methodName]()
    }

  }
}

export default {
  bind(el, binding, vnode) {
    el[ctx] = { id: seed++, clickHandler: wrapFn(el, binding, vnode) }
    nodeList.push(el)
  },

  update(el, binding, vnode) {
    el[ctx].clickHandler = wrapFn(el, binding, vnode)
  },

  unbind(el) {
    for (let i = 0, len = nodeList.length; i < len; i++) {
      const node = nodeList[i]
      if (node[ctx].id === el[ctx].id) {
        nodeList.splice(i, 1);
        delete el[ctx];
        break;
      }
    }
  }
};