import TableColumn from '../packages/table/column'
import Tabs from '../packages/tabs/main'
import Form from '../packages/form/main'
import FormItem from '../packages/form/item'
import Linkage from '../packages/linkage/main'
import LinkageItem from '../packages/linkage/item'
import TableForm from '../packages/table-form/main'
import TableFormItem from '../packages/table-form/item'
import Transfer from '../packages/transfer/main'
import Drawer from '../packages/drawer/index'
import Select from '../packages/select/main'

const components = [
  TableColumn,
  Tabs,
  Form,
  FormItem,
  Linkage,
  LinkageItem,
  TableForm,
  TableFormItem,
  Transfer,
  Drawer,
  Select,
]

function install(Vue) {
  components.forEach((component) => Vue.component(component.name, component))
  Vue.prototype.$extraDrawer = Drawer.interface
}

export default {
  install
}
