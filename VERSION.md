# tzcloud-best-ui

## v0.6.0 (2021-5-14)

- `R` 移除 组件 `Cascader`；
- `U` 更新 组件 `Dialog`：
	- `F` 修复 当目标组件不存在 `submitForm` 方法时调用报错；
	- `U` 更新 `provide` 给子组件一个 `bestDialog` 参数，指向父级 `Dialog` 实例；
	- `U` 更新 调用 `loading` 时，允许传入 `options.text` 参数，来自定义 `loading` 文案；
	- `U` 更新 `Dialog` 支持 `promise` 式调用；
- `U` 修复 组件 `Drawer`  偶现操作过程中突然关闭弹窗的BUG；
- `U` 更新 组件 `Uploader`：
	- `F` 修复 在禁用状态时，仍然可以删除图片的BUG；
	- `U` 更新 支持自定义 `before-upload` 方法；
	- `U` 更新 支持自定义 `icon` 图标；
	- `U` 更新 支持自定义 `slot` 上传组件样式；

## v0.6.1 (2021-5-17)

- `F` 修复 组件 `Dialog` 增加 `loading` 调用时，默认参数占位；
- `F` 修复 组件 `Dialog` 按照 `promise` 式调用 `catch` 捕获报错；
- `F` 修复 组件 `Drawer` 点击空白处关闭组件不生效；

## v0.6.2 (2021-5-17)

- `F` 修复 组件 `Drawer` 点击内部下拉选择框自动关闭的问题；

# tzcloud-element-pro 

从 `v0.7.0` 版本开始，原 `tzcloud-best-ui` 已废弃并重新以 `tzcloud-element-pro` 的身份面向使用者。

## v0.7.0 (2021-5-20)

- `A` 新增 组件 `Linkage` 联动下拉选择组件；
- `A` 新增 组件 `LinkageItem` 作为 `Linkage` 子组件搭配使用；

## v0.7.1 (2021-5-20)

- `U` 更新 组件 `Linkage` 基础样式；
- `U` 更新 文档 `release`；

## v0.7.2 (2021-5-26)

- `U` 更新 组件 `Dialog` 调整内部方法定义；
- `U` 更新 组件 `Drawer` 调整内部代码逻辑；
- `U` 更新 组件 `Drawer` 调整 `position` 选项支持 `string/number` 类型；
- `U` 更新 API 支持 `this.$drawer` 的方式调用 Drawer 组件；