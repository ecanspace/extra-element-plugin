# tzcloud-element-pro

A super practical component library that developed by vue2.x and element-ui

## Installation

``` powershell
npm install tzcloud-element-pro -S or yarn add tzcloud-element-pro
```

## Quick Start

``` javascript
// index.js

import Vue from 'vue';
import ElementPro from 'tzcloud-element-pro';
import 'tzcloud-element-pro/lib/theme/index.css';
import App from './App.vue';

Vue.use(ElementPro);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

## Partial import

``` javascript
// index.js

import Vue from 'vue';
import { Dialog, Drawer } from 'tzcloud-element-pro';
// or
import Uploader from 'tzcloud-element-pro/lib/uploader';
import App from './App.vue';

Vue.component(Dialog.name, Dialog);
Vue.component(Drawer.name, Drawer);
Vue.component(Uploader.name, Uploader);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

## Components

`Dialog`
`Drawer`
`Puzzler`
`Uploader`
`Linkage`
`LinkageItem`

## Version

Please move to [release](https://github.com/EcanTech/tzcloud-element-pro/blob/main/VERSION.md) notes