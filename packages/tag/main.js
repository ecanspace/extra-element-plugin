import { Tag } from 'element-ui'

const rawRender = Tag.render

export default {
  name: 'ExtraTag',

  mixins: [Tag],

  props: {
    mode: String,
  },

  data() {
    return {
      isTextTag: this.mode === 'text',
    }
  },

  render(h) {
    if (this.isTextTag) {
      return this.renderTextTag(h)
    } else {
      return rawRender.call(this, h)
    }
  },

  methods: {
    renderTextTag(h) {
      return (
        <label class={['extra-tag', 'extra-tag--' + this.type]}>
          <span class="extra-tag-icon"></span>
          <span class="extra-tag-text">{this.$slots.default}</span>
        </label>
      )
    }
  }
}
