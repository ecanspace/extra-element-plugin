<template>
  <div class="custom-transfer">
    <div class="custom-transfer-panel">
      <div class="custom-transfer-panel-header">
        <el-checkbox v-model="allChecked" :indeterminate="indeterminate">{{title}}</el-checkbox>
        <span>{{(filterModel || model).length}}/{{(filterData || data).length}}</span>
      </div>
      <div class="custom-transfer-panel-content">
        <el-checkbox-group v-model="model">
          <div class="custom-transfer-checkbox-item" v-for="item in data" :key="item[fields.value]" v-show="visible(item)">
            <el-checkbox :label="item[fields.value]">{{item[fields.label]}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>

    <div class="custom-transfer-exchange-area">
      <span class="custom-transfer-exchange-icon">
        <i class="el-icon-sort"></i>
      </span>
    </div>

    <div class="custom-transfer-panel">
      <div class="custom-transfer-panel-header">
        <el-checkbox v-model="modelAllChecked">已选{{title}}</el-checkbox>
        <span>{{model.length}}</span>
      </div>
      <div class="custom-transfer-panel-content">
        <el-checkbox-group v-model="model">
          <div class="custom-transfer-checkbox-item" v-for="item in checkedArray" :key="item[fields.value]">
            <el-checkbox :label="item[fields.value]">{{item[fields.label]}}</el-checkbox>
          </div>
        </el-checkbox-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExtraTransfer',

  props: {
    value: {},

    title: {
      type: String
    },

    data: {
      type: Array
    },
    
    fields: {
      type: Object
    }
  },

  data() {
    return {
      model: this.value || [],
      filterData: null,
    }
  },

  computed: {
    checkedArray() {
      const fields = this.fields
      const model = this.model
      return this.data.filter((item) => model.includes(item[fields.value]))
    },

    filterModel() {
      if (this.filterData) {
        const fields = this.fields
        const model = this.model
        return this.filterData.filter((item) => model.includes(item[fields.value]))
      }
    },

    indeterminate() {
      const model = this.filterModel || this.model
      return model.length > 0 && model.length < (this.filterData || this.data).length
    },

    allChecked: {
      get() {
        const model = this.filterModel || this.model
        return model.length !== 0 && model.length === (this.filterData || this.data).length
      },
      set(checked) {
        const fields = this.fields

        if (checked) {
          const model = this.model
          const newModel = (this.filterData || this.data).map((item) => item[fields.value])
          newModel.forEach((value) => {
            !model.includes(value) && model.push(value)
          })
        } else {
          const newModel = (this.filterData || this.data).map((item) => item[fields.value])
          this.model = this.model.filter((value) => !newModel.includes(value))
        }
      }
    },

    modelAllChecked: {
      get() {
        return this.model.length !== 0
      },
      set(checked) {
        if (!checked) {
          this.model = []
        }
      }
    },
  },

  watch: {
    value(newValue) {
      this.model = newValue
    },

    data(newData) {
      this.filterData = null
      this.updateModel(newData)
    },

    model() {
      this.$emit('input', this.model)
    }
  },

  methods: {
    filter(callback) {
      if (typeof callback === 'function') {
        this.filterData = callback(this.data)
      }
    },

    visible(current) {
      return this.filterData ? this.filterData.includes(current) : true
    },

    updateModel(data = []) {
      const newModel = []
      const fields = this.fields
      const values = data.map((item) => item[fields.value])

      this.model.forEach((value) => {
        if (values.includes(value)) {
          newModel.push(value)
        }
      })

      this.model = newModel
    }
  }
}
</script>

<style scoped>
.custom-transfer {
  display: flex;
  flex-direction: row;
  max-height: 480px;
}
.custom-transfer-panel {
  width: 46%;
  max-width: 360px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  overflow: hidden;
}
.custom-transfer-panel-header {
  padding: 0 15px;
  line-height: 44px;
  display: flex;
  justify-content: space-between;
  background-color: #f5f7fa;
  border-bottom: 1px solid #EBEEF5;
}
.custom-transfer-panel-content {
  padding: 10px 15px;
  background-color: #fff;
  min-height: 300px;
  height: calc(100% - 45px);
  overflow: auto;
}
.custom-transfer-checkbox-item {
  display: flex;
  line-height: 30px;
}
.custom-transfer-exchange-area {
  width: 8%;
  min-width: 40px;
  position: relative;
}
.custom-transfer-exchange-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  transform-origin: center;
  cursor: pointer;
}
.custom-transfer-exchange-icon i {
  font-size: 18px;
}
</style>