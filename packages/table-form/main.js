import { Form, FormItem, Button } from 'element-ui'
import { noop } from '../../src/shared/util'

/**
 * ‘动态增减表单’
 */

export default {
  name: 'ExtraTableForm',

  props: {
    value: {},
    rules: {},
  },

  data() {
    return {
      rows: this.value || [],
    }
  },

  watch: {
    value(values) {
      if (Array.isArray(values)) {
        this.rows = values
        this.initRowsDefaults()
      } else {
        console.warn(`[extra-table-form] warning: Expect an array type, but received a ${typeof values}.`)
      }
    }
  },

  created() {
    this.initRowsDefaults()
  },

  render(h) {
    return h('div', { class: 'extra-table-form' }, this.renderForms(h))
  },

  methods: {
    renderForms(h) {
      const baseKey = Date.now().toString().slice(-5)

      return this.rows.map((row, index) => h(Form, {
        key: baseKey + index,
        props: {
          model: row,
          rules: this.rules,
          inline: true,
        }
      }, [
        this.$slots.default,
        this.renderButtons(h, row, index)
      ]))
    },

    renderButtons(h, row, index) {
      const IncreaseButton = h(Button, {
        props: {
          type: 'primary',
          icon: 'el-icon-plus'
        },
        on: {
          click: () => this.handleIncrease(row, index)
        }
      })

      const DecreaseButton = this.rows.length > 1 ? h(Button, {
        props: {
          type: 'danger',
          icon: 'el-icon-minus'
        },
        on: {
          click: () => this.handleDecrease(row, index)
        }
      }) : null

      return h(FormItem, {}, [IncreaseButton, DecreaseButton])
    },

    handleIncrease(row, index) {
      this.$children[index].validate((valid) => {
        if (valid) {
          this.rows.push({})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    handleDecrease(row, index) {
      this.rows.splice(index, 1)
    },

    validate(callback = noop) {
      const result = []
      this.$children.forEach((form) => form.validate((valid) => result.push(valid)))
      callback(result.every((valid) => valid))
    },

    initRowsDefaults() {
      if (this.rows.length === 0) {
        this.rows.push({})
      }
    }
  }
}
