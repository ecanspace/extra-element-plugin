import { Form, FormItem, Button } from 'element-ui'
import { noop } from '../../src/shared/util'

let seed = 0

function genNumberKey(length = 6) {
  return Date.now().toString().slice(1 - length) + seed++
}

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
      }
    }
  },

  created() {
    if (this.rows.length === 0) {
      this.rows.push({})
    }
  },

  render(h) {
    const FormList = this.rows.map((row, index) => h(Form, {
      key: genNumberKey(),
      props: {
        model: row,
        rules: this.rules,
        inline: true,
      }
    }, [
      this.$slots.default,
      this.renderButtons(h, row, index)
    ]))

    return h('div', { class: 'extra-table-form' }, FormList)
  },

  methods: {
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

    // Interface: 
    validate(callback = noop) {
      let result = []
      this.$children.forEach((form) => form.validate((valid) => result.push(valid)))
      callback(result.every((valid) => !!valid))
    }
  }
}
