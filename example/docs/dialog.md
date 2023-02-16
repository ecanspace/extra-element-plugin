## Dialog 对话框

基于 `ElDialog` 封装扩展的组件，通过插件的方式调用。

### 基本用法

调用 `this.$dialog(component, options)` 方法。

:::vue
```html
<template>
  <el-button type="primary" @click="openDialog">打开对话框</el-button>
</template>

<script>
// if you: import SomeForm from '@/components/SomeForm'
const SomeForm = {
  render(h) {
    return (
      <div>这是一段信息</div>
    )
  }
}
export default {
  methods: {
    openDialog() {
      this.$dialog(SomeForm, {
        title: '我是对话框',
      })
    }
  }
}
</script>
```
:::

### 给目标组件传参

我们知道 Dialog 只是一个容器组件，可以通过 `props` 选项给它里面的 **目标组件** 传递参数

:::vue
```html
<template>
  <el-button type="primary" @click="openDialog">打开对话框</el-button>
</template>

<script>
// if you: import SomeForm from '@/components/SomeForm'
const SomeForm = {
  props: {
    message: String,
  },
  render(h) {
    return (
      <div>{this.message}</div>
    )
  }
}
export default {
  methods: {
    openDialog() {
      this.$dialog(SomeForm, {
        title: '我是对话框',
        props: {
          message: '哈哈，我是从外面传进来的',
        }
      })
    }
  }
}
</script>
```
:::

### 嵌套对话框

如果你想在一个 Dialog 内部嵌套另一个 Dialog，需要在 Dialog 内部调用 `this.$dialog.create(component, options)` 方法。

:::vue
```html
<template>
  <el-button type="primary" @click="openDialog">打开对话框</el-button>
</template>

<script>
// if you: import SomeForm from '@/components/SomeForm'

const SomeForm = {
  render(h) {
    return (
      <el-button type="primary" vOn:click={this.openDialog}>打开内层对话框</el-button>
    )
  },
  methods: {
    openDialog() {
      const component = {
        render(h) {
          return (
            <div>我是嵌套的对话框</div>
          )
        }
      }

      this.$dialog.create(component, {
        title: '内层对话框',
        width: '40%',
      })
    }
  }
}

export default {
  methods: {
    openDialog() {
      this.$dialog(SomeForm, {
        title: '外层对话框',
      })
    }
  }
}
</script>
```
:::

> 默认情况下，`ElproDialog` 是单例模式的，内部共用一个对话框实例。对于存在嵌套的应用场景，请使用 `this.$dialog.create` 方法，它会每次调用都创建一个新的对话框实例。

### 取消和确定

点击 `cancel` 按钮直接关闭对话框；

点击 `confirm` 按钮，默认会自动调用 **目标组件** 内定义的 `submitForm` 方法，并回调其两个参数：一个关闭对话框的 `done` 方法和一个控制提交状态的 `loading` 对象（包含 `start` 和 `finish` 两个方法）。

:::vue
```html
<template>
  <el-button type="primary" @click="openDialog">打开对话框</el-button>
</template>

<script>
// if you: import SomeForm from '@/components/SomeForm'

const SomeForm = {
  props: {
    success: Function,
  },
  data() {
    return {
      form: {},
    }
  },
  render(h) {
    const form = this.form
    return (
      <el-form vModel={form} label-width="80px">
        <el-form-item label="活动名称">
          <el-input vModel={form.name} placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select vModel={form.region} placeholder="请选择活动区域">
            <el-option label="成都" value="chengdu"></el-option>
            <el-option label="重庆" value="chongqin"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    )
  },
  methods: {
    submitForm(done, loading) {
      loading.start()
      this.$axios.post('/api/xxx', {}).then((res) => {
        // TODO
        done && done()
        this.success && this.success()
      }).finally(() => {
        loading.finish()
      })
    }
  }
}

export default {
  methods: {
    openDialog() {
      this.$dialog(SomeForm, {
        title: '对话框',
        props: {
          success: () => {},
        }
      })
    }
  }
}
</script>
```
:::

> 调用 `loading.start` 时，允许传入一个 `{}` 对象，目前只有一个 `text` 选项用于控制加载文案。

### 自定义尾部操作按钮

大多数情况下使用 Dialog 默认提供的按钮（取消和确定）即可。如果需要自定义，可以通过 `showFooter` 属性隐藏默认的 Footer。

:::vue
```html
<template>
  <el-button type="primary" @click="openDialog">打开对话框</el-button>
</template>

<script>
// if you: import SomeForm from '@/components/SomeForm'

const SomeForm = {
  inject: ['elproDialog'],
  props: {
    success: Function,
  },
  data() {
    return {
      form: {},
    }
  },
  render(h) {
    const form = this.form
    return (
      <el-form vModel={form} label-width="80px">
        <el-form-item label="活动名称">
          <el-input vModel={form.name} placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select vModel={form.region} placeholder="请选择活动区域">
            <el-option label="成都" value="chengdu"></el-option>
            <el-option label="重庆" value="chongqin"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" vOn:click={this.handleSubmit}>提交</el-button>
          <el-button vOn:click={this.handleCancel}>取消</el-button>
        </el-form-item>
      </el-form>
    )
  },
  methods: {
    handleCancel() {
      this.elproDialog.visible = false // or: this.$dialog.close()
    },
    handleSubmit() {
      this.elproDialog.showLoading()
      this.$axios.post('/api/xxx', {}).then((res) => {
        // TODO
        this.elproDialog.visible = false
        this.success && this.success()
      }).finally(() => {
        this.elproDialog.hideLoading()
      })
    }
  }
}

export default {
  methods: {
    openDialog() {
      this.$dialog(SomeForm, {
        title: '对话框',
        showFooter: false,
        props: {
          success: () => {},
        }
      })
    }
  }
}
</script>
```
:::

> 说明：`ElproDialog` 组件内部使用 [ Vue provide](https://cn.vuejs.org/v2/api/#provide-inject) 特性，向下注入了一个名为 `elproDialog` 的 Dialog 上下文。在目标组件内，可以通过 `inject: ['elproDialog']` 配置引入该对象，并在后续编码过程中调用 `this.elproDialog` 进行使用，指向的是当前 Dialog 实例。**注意：请谨慎使用 elproDialog 对象，避免造成组件污染，除非你知道该怎么使用它**

### Promise 式调用

这里说的 `promise` 并不是真正意义上的 `ES6 promise` 对象，只是在调用 `this.$dialog` 时，会返回一个具有 `then` 和 `catch` 方法的 Dialog 实例对象，你可以像 `promise` 那样使用它，点击 `confirm` 时执行 `then` 回调函数，点击 `cancel` 时执行 `catch` 回调函数，不支持循环 `then` 和 `catch`

:::vue
```html
<template>
  <el-button type="primary" @click="openDialog">打开对话框</el-button>
</template>

<script>
// if you: import SomeForm from '@/components/SomeForm'

const SomeForm = {
  render(h) {
    return (
      <div>这是一段信息</div>
    )
  }
}

export default {
  methods: {
    openDialog() {
      this.$dialog(SomeForm, {
        title: '我是对话框',
      }).then(() => {
        console.log('Dialog confirm')
      }).catch(() => {
        console.log('Dialog cancel')
      })
    }
  }
}
</script>
```
:::

### 全局关闭

可以通过 `this.$dialog.close` 或 `this.$dialog.closeAll` 方法手动关闭对话框。

### Component

一个 `.vue` 文件导出对象 或 `Vue` 选项对象，接收参数与 [Vue 内置 component](https://cn.vuejs.org/v2/api/#component) 组件 `is` 属性一致。

### Options

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title     | Dialog 的标题 | string    | — | — |
| width     | Dialog 的宽度 | string    | — | 50% |
| fullscreen     | 是否为全屏 Dialog | boolean    | — | false |
| top       | Dialog CSS 中的 margin-top 值 | string | — | 15vh |
| modal     | 是否需要遮罩层   | boolean   | — | true |
| modalAppendToBody     | 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上   | boolean   | — | true |
| appendToBody     | Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true   | boolean   | — | false |
| lockScroll | 是否在 Dialog 出现时将 body 滚动锁定 | boolean | — | true |
| customClass      | Dialog 的自定义类名 | string    | — | — |
| closeOnClickModal | 是否可以通过点击 modal 关闭 Dialog | boolean    | — | false |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭 Dialog | boolean    | — | true |
| showClose | 是否显示关闭按钮 | boolean    | — | true |
| beforeClose | 关闭前的回调，会暂停 Dialog 的关闭 | function(done)，done 用于关闭 Dialog | — | — |
| center | 是否对头部和底部采用居中布局 | boolean | — | false |
| destroyOnClose | 关闭时销毁 Dialog 中的元素 | boolean | — | false |
| showFooter | 控制 Dialog 尾部显示 | boolean | — | true |
| showCancelButton | 控制是否显示 取消 按钮 | boolean | — | true |
| showConfirmButton | 控制是否显示 确定 按钮 | boolean | — | true |
| cancelButtonText | 自定义 取消 按钮文本 | string | — | 取消 |
| confirmButtonText | 自定义 确定 按钮文本 | string | — | 确定 |
| props | 传给目标组件的参数对象 | object | — | — |
