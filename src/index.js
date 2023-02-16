import Tabel from '../packages/table/main'
import TableColumn from '../packages/table/column'
import Tag from '../packages/tag/main'
import Drawer from '../packages/drawer/index'
import Dialog from '../packages/dialog.2.0/index'
import Form from '../packages/form/main'
import FormItem from '../packages/form/item'
import MessageBox from '../packages/message-box/main'
import Pagination from '../packages/pagination/main'
import Container from '../packages/container/main'
import Subcontainer from '../packages/container/sub'
import Block from '../packages/container/block'
import SearchInput from '../packages/search/main'
import Upload from '../packages/upload/main'
import Linkage from '../packages/linkage/main'
import LinkageItem from '../packages/linkage/item'
import CompoundInput from '../packages/compound-input/main'
import Select from '../packages/select/main'

const components = [
  Tabel,
  TableColumn,
  Tag,
  Drawer,
  Dialog,
  Form,
  FormItem,
  Pagination,
  Container,
  Subcontainer,
  Block,
  SearchInput,
  Upload,
  Linkage,
  LinkageItem,
  CompoundInput,
  Select,
]

function installPlugin(Vue) {
  components.forEach((component) => Vue.component(component.name, component))
  Vue.prototype.$extraDrawer = Drawer.interface
  Vue.prototype.$extraDialog = Dialog.interface
  Vue.prototype.$extraMsgbox = MessageBox
}

export default {
  install: installPlugin,
}