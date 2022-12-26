import { noop } from '../../src/shared/util'
import { createDialog } from '../dialog/plugin/instance'

let instance = null
let instanceArray = []

MessageBox.defaultOptions = {
  mode: 'msgbox',
  confirmButtonText: '确定',
  width: '400px',
  top: '35vh',
  onCancel: noop,
  onConfirm: noop,
}

export default function MessageBox(messageOrComponent, options = {}) {
  if (typeof options === 'string') {
    options = {
      title: options
    }
  }

  instance = createDialog(this, {
    props: Object.assign({}, MessageBox.defaultOptions, options),
    slots: {
      default: messageOrComponent
    }
  })

  instance.on('close', () => instanceArray.pop().destroy())
  instance.show()
  instanceArray.push(instance)

  return instance
}
