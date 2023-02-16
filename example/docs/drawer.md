## Drawer 抽屉

基于 `ElDrawer` 封装扩展的组件，通过插件或模块的方式调用。

### 基本用法

调用 `this.$drawer(component, options)` 方法。

:::vue
```html
<template>
  <el-button type="primary" @click="openDrawer">打开抽屉</el-button>
</template>

<script>
const SomeForm = {
  render(h) {
    return (
      <div>这是一段信息</div>
    )
  }
}
export default {
  methods: {
    openDrawer() {
      this.$drawer(SomeForm, {
        title: '抽屉组件',
      })
    }
  }
}
</script>
```
:::

### 自定义弹出边界

抽屉默认 **从右到左** 弹出，铺满整个屏幕。可以通过 `position` 属性设置其 top、right、bottom、left 四个方位的具体值。

:::vue
```html
<template>
  <el-button type="primary" @click="openDrawer">打开抽屉</el-button>
</template>

<script>
const SomeForm = {
  render(h) {
    return (
      <div>这是一段信息</div>
    )
  }
}
export default {
  methods: {
    openDrawer() {
      this.$drawer(SomeForm, {
        title: '抽屉组件',
        position: {
          top: 81,
          left: 592,
        }
      })
    }
  }
}
</script>
```
:::

### 全局预设

在一个项目开发过程中，大多数打开场景都是固化的，所以一些公共参数我们需要提前预设，避免每次调用都传的麻烦。可以通过 `Drawer.setDefaults` 静态方法设置，它接收一个 `options` 对象作为参数。

#### 应用场景

比如：产品要求抽屉每次打开需要距离 **顶部** 一个 Header 的高度，距离 **左侧** 一个 Aside 的宽度。

#### 提前预设

一般在入口文件，具体请根据自己的项目结构而定。

```javascript
// main.js
import { Drawer } from 'tzcloud-element-pro'

Drawer.setDefaults({
  position: {
    top: 100, // 这里是假设值，实际场景中可能需要你自己计算
    left: 300,
  }
})
```

#### 页面调用

在页面中直接调用 `this.$drawer` 即可，现在无须每次都传。

```html
<template>
  <el-button type="primary" @click="openDrawer">打开抽屉</el-button>
</template>

<script>
const SomeForm = {
  render(h) {
    return (
      <div>这是一段信息</div>
    )
  }
}
export default {
  methods: {
    openDrawer() {
      this.$drawer(SomeForm, {
        title: '抽屉组件',
      })
    }
  }
}
</script>
```

### 全局关闭

抽屉组件是单例模式的，可以通过 `this.$drawer.close` 方法手动关闭组件。

### Component

一个 `.vue` 文件导出对象 或 `Vue` 选项对象，接收参数与 [Vue 内置 component](https://cn.vuejs.org/v2/api/#component) 组件 `is` 属性一致。

### Options

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| appendToBody     | Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true   | boolean   | — | false |
| beforeClose | 关闭前的回调，会暂停 Drawer 的关闭 | function(done)，done 用于关闭 Drawer | — | — |
| closeOnPressEscape | 是否可以通过按下 ESC 关闭 Drawer | boolean    | — | true |
| customClass      | Drawer 的自定义类名 | string    | — | — |
| destroyOnClose | 控制是否在关闭 Drawer 之后将子元素全部销毁 | boolean | — | false |
| modal     | 是否需要遮罩层   | boolean   | — | false |
| modalAppendToBody     | 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Drawer 的父元素上   | boolean   | — | true |
| direction | Drawer 打开的方向 | Direction | rtl / ltr / ttb / btt | rtl |
| showClose | 是否显示关闭按钮 | boolean    | — | true |
| size | Drawer 窗体的大小, 当使用 `number` 类型时, 以像素为单位, 当使用 `string` 类型时, 请传入 'x%', 否则便会以 `number` 类型解释 | number / string | — | '100%' |
| title     | Drawer 的标题，也可通过具名 slot （见下表）传入 | string    | — | — |
| wrapperClosable | 点击遮罩层是否可以关闭 Drawer | boolean | — | true |
| withHeader | 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效 | boolean | — | true |
| position | 设置 Drawer 上下左右边距 | object | — | — |
| props | 传给目标组件的参数对象 | object | — | — |
