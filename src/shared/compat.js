import { isDef } from './util'

/**
 * 创建 ‘删除属性’ 方法
 */
export function createDeleteProperty() {
  return isDef(Reflect) ? Reflect.deleteProperty : function deleteProperty(map, prop) { delete map[prop] }
}
