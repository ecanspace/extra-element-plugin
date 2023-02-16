## Linkage 联动选择器

基于 `ElSelect` 封装的上层组件，适用于前后联动的选择操作，比如：行政区域。

### 基本用法

支持添加任意个 `ElproLinkageItem` 组件，表示具有前后关联关系的选择器，通过 `v-model` 双向绑定目标值，并通过 `fetch-method` 方法属性，由外界提供下拉选项的数据源，该方法接收两个回调参数 `val` 和 `model`，分别表示：当前被选中的值、当前 `v-model` 绑定的值，必须返回一个 `data` 或 `promise` 对象（确保能在 `then` 当中获取数据）。

:::vue
```html
<template>
  <elpro-linkage v-model="value" :fetch-method="fetchMethod">
    <elpro-linkage-item></elpro-linkage-item>
    <elpro-linkage-item></elpro-linkage-item>
  </elpro-linkage>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      provinceData: [{
        label: '北京市',
        value: '110000',
      },{
        label: '天津市',
        value: '120000',
      },{
        label: '上海市',
        value: '310000',
      },{
        label: '重庆市',
        value: '500000',
      }],
      cityData: {
        '110000': [{
          label: '北京市辖区',
          value: '110100',
        }],
        '120000': [{
          label: '天津市辖区',
          value: '120100',
        }],
        '310000': [{
          label: '上海市辖区',
          value: '310100',
        }],
        '500000': [{
          label: '重庆市辖区',
          value: '500100',
        }]
      }
    }
  },
  methods: {
    fetchMethod(val) {
      return val ? this.cityData[val] : this.provinceData
    },
  }
}
</script>
```
:::

### 自定义下拉选项 label 和 value 字段

默认就是 `label` 和 `value` 字段，可以通过 `options` 对象属性自定义 `label` 和 `value` 的映射。

```html
<template>
  <elpro-linkage v-model="value" :fetch-method="fetchMethod" :options="options">
    <elpro-linkage-item></elpro-linkage-item>
    <elpro-linkage-item></elpro-linkage-item>
  </elpro-linkage>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      options: {
        label: 'name',
        value: 'code',
      }
    }
  },
  methods: {
    fetchMethod(val) {
      // TODO
    },
  }
}
</script>
```

### Linkage-Item 子组件

它只能作为 `ElproLinkage` 的子组件使用，不能单独使用。每个 `ElproLinkageItem` 组件同样支持 `fetch-method`、`options` 等属性配置，优先使用自身的配置，没有才使用父组件的公有配置。

:::vue
```html
<template>
  <elpro-linkage v-model="value" :fetch-method="fetchRegion" :options="regionOptions">
    <elpro-linkage-item></elpro-linkage-item>
    <elpro-linkage-item :fetch-method="fetchStation" :options="stationOptions"></elpro-linkage-item>
  </elpro-linkage>
</template>

<script>
export default {
  data() {
    return {
      value: [],
      regionOptions: {
        label: 'name',
        value: 'regionNo',
      },
      stationOptions: {
        label: 'name',
        value: 'stationNo',
      },
      provinceData: [{
        name: '北京市',
        regionNo: '110000',
      },{
        name: '天津市',
        regionNo: '120000',
      }],
      stationData: {
        '110000': [{
          name: '首都汽车站',
          stationNo: 'sdqcz',
        },{
          name: '大兴区高速公路客运站',
          stationNo: 'dxqgsglkyz',
        }],
        '120000': [{
          name: '天津汽车总站',
          stationNo: 'tjqczz',
        },{
          name: '天津北门车站',
          stationNo: 'tjbmcz',
        }],
      }
    }
  },
  methods: {
    fetchRegion(val) {
      return this.provinceData
    },
    fetchStation(val) {
      return this.stationData[val]
    },
  }
}
</script>
```
:::

### Attributes

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| fetch-method     | 获取下拉数据源方法，返回 selectData 数据   | function(val, model)   | — | — |
| options | 自定义字段配置 | object | label/value | — |
