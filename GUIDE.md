# tzcloud-best-ui v0.5.7

A vue 2.x mini ui component library based on element-ui 2.x

## Installation

``` powershell
npm install tzcloud-best-ui -S 或 yarn add tzcloud-best-ui
```

## Quick Start

``` javascript
import Vue from 'vue';
// Complete
import BestUI from 'tzcloud-best-ui';
import 'tzcloud-best-ui/lib/theme/index.css';

Vue.use(BestUI);

// Partial
import {
  Puzzler,
  Uploader,
  // ...
} from 'tzcloud-best-ui'

Vue.component(Puzzler.name, Puzzler)
Vue.component(Uploader.name, Uploader)

```

## Components

### Dialog 对话框

#### 基本用法

``` javascript
this.$dialog(component, options)
```

#### 多层对话框

支持一层一层弹出多个对话框，当调用 create 方法时，会创建新的对话框实例

``` javascript
this.$dialog.create(component, options)
```

> 默认情况下，对话框采用单例模式，避免反复的销毁和重建。

#### 手动关闭

支持如下几种关闭方式：

``` javascript
// 方式一：通过返回的组件实例进行关闭
const instance = this.$dialog(component, options)
instance.visible = false

// 方式二：全局 close 或 closeAll 方法
this.$dialog.close() // 默认关闭当前对话框
this.$dialog.closeAll() // 关闭全部
```

#### Options 选项

除了以下扩展属性外，同时支持 el-dialog 所有属性，请参考 [ElementUI Dialog](https://element.eleme.cn/#/zh-CN/component/dialog#attributes)

| 参数 | 说明 | 类型 | 默认值 |
| :--------------------------------------------- |
| showFooter | 是否展示 Dialog 按钮操作区 | boolean | true |
| cancelText | 取消按钮的文本内容 | string | 取消 |
| confirmText | 确定按钮的文本内容 | string | 确定 |
| props | 容器内目标组件接收的 props 属性 | object | {} |
| onClosed | Dialog 关闭之后用户回调 | function | none |

### Drawer 抽屉

#### 基本用法

通过服务的方式调用

``` javascript
import { Drawer } from 'tzcloud-best-ui'
const instance = Drawer(component, options)
// 关闭
instance.visible = false 或 Drawer.close()
```

#### 自定义全局配置

针对业务调用中的一些公共参数，可以先进行全局预设置，避免重复配置

``` javascript
import { Drawer } from 'tzcloud-best-ui'
// 示例：全局设置抽屉弹出的边界
const contentRect = this.$el.querySelector('#defaultContent').getBoundingClientRect()
Drawer.setDefaults({
  position: {
    top: contentRect.top + 'px',
    left: contentRect.left + 'px',
  },
  // ...
})
```

#### Options 选项

除了以下扩展属性外，同时支持 el-drawer 所有属性，请参考 [ElementUI Drawer](https://element.eleme.cn/#/zh-CN/component/dialog#attributes)

| 参数 | 说明 | 类型 | 默认值 |
| :--------------------------------------------- |
| position | 控制 Drawer 弹出的边界 | object | {} |
| props | 容器内目标组件接收的 props 属性 | object | {} |
| onClosed | Drawer 关闭之后用户回调 | function | none |

### Puzzler 滑块拼图

#### 基本用法

通过组件的方式引用

``` html
<template>
    <best-puzzler 
	    :imgs="imgs" 
	    :position="position" 
	    :on-change="handleChange" 
	    :on-success="handleSuccess" 
	    :on-fail="handleFail">
    </best-puzzler>
</template>
```

#### 弹窗调用

通过引入服务的方式调用，以对话框的形式展示

``` javascript
import { Puzzler } from 'tzcloud-best-ui'
export default {
  methods: {
	// 验证码弹窗
    showPuzzler(data) {
      const vm = this, options = {}
      options.imgs = [data.bigImg, data.smlImg]
      options.position = data.position
      // when slide end
      options.onChange = function (answer) {
	    // must return a promise
        return vm.checkPuzzle(answer)
      }
      // when puzzler callback success
      // receive from checkPuzzle response as args
      options.onSuccess = vm.handleSuccess.bind(vm)
      // when puzzler callback fail
      options.onFail = function () {
        const puzzler = this // `this`指向滑块组件
        vm.getPuzzle().then((res) => {
          const body = res.body
          if (body.code == 200) {
            // update puzzler
            puzzler.imgs = [body.bigImg, body.smlImg]
            puzzler.position = body.position
          }
        })
      }
      Puzzler.service(options)
    }
  }
}
```

#### Puzzler Attributes

| 参数 | 说明 | 类型 | 默认值 |
| :--------------------------------------------- |
| imgs | Puzzler 图片集合，大图在前，小图在后 | array | [] |
| position | 拼图原始位置（后端告诉）目前只支持垂直方向 | number, string | none |
| onChange | 滑动结束时回调，发送请求验证拼图的准确性 | function | none |
| onSuccess | 拼图成功时回调，执行下一步 | function | none |
| onFail | 拼图失败时回调，更新拼图 | function | none |

### Uploader 图片上传

#### 基本用法

``` html
<template>
  <best-uploader v-model="iconFid" :url="iconUrl" text="正面"></best-uploader>
</template>
```

#### 上传Base64

``` html
<!-- type default: 'image' -->
<template>
  <best-uploader type="base64" v-model="base64Url"></best-uploader>
</template>
```