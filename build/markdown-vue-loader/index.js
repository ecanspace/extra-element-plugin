/**
 * @loader markdown-vue-loader
 * @copyright Created by https://github.com/EcanTech on 2021/5/21 
 */

const { compileTemplate } = require('@vue/component-compiler-utils')
const VueTemplateCompiler = require('vue-template-compiler')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

// register `::: vue :::` block
md.use(require('markdown-it-container'), 'vue', {
  render(tokens, idx) {
    const token = tokens[idx], nextToken = tokens[idx + 1]
    const matched = token.info.trim().match(/^vue\s*(.*)$/)

    // opening tag
    if (token.nesting === 1) {
      const description = matched && matched.length > 1 ? matched[1] : ''
      const content = nextToken.type === 'fence' ? nextToken.content : ''
      return `<elpro-demo><!--vue-component-code:${content}:vue-component-code-->`
    }

    // closing tag
    return '</elpro-demo>'
  },
})

const VUE_COMPONENT_CODE_PATTERN = /<!--vue-component-code:(.*?):vue-component-code-->/s
const TEMPLATE_PATTERN = /<template>(.*)<\/template>/s
const SCRIPT_PATTERN = /<script>(.*)<\/script>/s
const EXPORT_DEFAULT_PATTERN = /export\s+default\s*/i

function extractTemplate(str) {
  const template = str.match(TEMPLATE_PATTERN)
  return template && template[1] || '<template></template>'
}

function extractScript(str) {
  let script = null
  script = str.match(SCRIPT_PATTERN)
  script = script && script[1] || ''
  script = script.split(EXPORT_DEFAULT_PATTERN)
  return {
    code: script[0] || '',
    export: script[1] || '{}',
  }
}

function createInlineComponent(template, script) {
  const compiled = compileTemplate({
    source: '<div>' + template + '</div>',
    filename: 'inline-component',
    compiler: VueTemplateCompiler,
  })

  return `(function () {
    ${compiled.code}
    ${script.code}
    const componentOptions = ${script.export}
    return {
      render,
      staticRenderFns,
      ...componentOptions
    }
  })()`
}

function extractComponent(html, pageName = 'unknown', templateArr = [], componentArr = [], cid = 0) {
  const matched = html.match(VUE_COMPONENT_CODE_PATTERN)

  if (matched == null) {
    templateArr.push(html)
    return { templateArr, componentArr }
  }

  const index = matched.index
  templateArr.push(html.slice(0, index))

  const $1 = matched[1]
  const template = extractTemplate($1)
  const script = extractScript($1)
  const componentFn = createInlineComponent(template, script)
  const componentName = pageName + '-demo' + cid
  componentArr.push(JSON.stringify(componentName) + ': ' + componentFn)
  templateArr.push(`<template slot="source"><${componentName} /></template>`)

  return extractComponent(html.slice(index + matched[0].length), pageName, templateArr, componentArr, ++cid)
}

module.exports = function (source) {
  const html = md.render(source)
  const pageName = html.match(/<h[1-6]>(\w+).*<\/h[1-6]>/)
  const { templateArr, componentArr } = extractComponent(html, pageName && pageName[1].toLowerCase())
  let vueSource = templateArr.join('')
  vueSource = '<div class="page-wrapper">' + vueSource + '</div>'
  vueSource = '<template>' + vueSource + '</template>'
  return vueSource + `\n<script>
    export default {
      components: {
        ${componentArr.join(',\n')}
      }
    }
  </script>`
}