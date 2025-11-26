// 用于匹配文件路径
const matches = (filePath, rule) => {
  if (!rule) return false
  if (Array.isArray(rule)) {
    return rule.some(r => matches(filePath, r))
  }
  if (rule instanceof RegExp) {
    return rule.test(filePath)
  }
  if (typeof rule === 'string') {
    return filePath.includes(rule)
  }
  return false
}

/**
 * PostCSS 插件：使用 CSS 变量将 px 转换为可缩放单位。
 * 它查找像素值并将其转换为 `calc(VALUE * var(--unit))`。
 */
const plugin = (opts = {}) => {
  const ignore1px = opts.ignore1px !== false
  const viewportWidth = opts.viewportWidth || 414
  // 默认仅在以 globals.css 结尾的文件中注入，以避免重复
  const injectFile = opts.injectFile || /globals\.css$/
  const { include, exclude } = opts

  const shouldProcess = filePath => {
    if (!filePath) return true // 如果没有文件路径，默认处理（或者根据需求调整）
    if (exclude && matches(filePath, exclude)) return false
    if (include && !matches(filePath, include)) return false
    return true
  }

  return {
    postcssPlugin: 'postcss-view-adapter',
    Once(root, { Rule, AtRule, Declaration }) {
      const filePath = root.source?.input?.file || ''

      // 检查是否应在此文件中注入定义
      let shouldInject = false
      if (injectFile instanceof RegExp) {
        shouldInject = injectFile.test(filePath)
      } else if (typeof injectFile === 'string') {
        shouldInject = filePath.includes(injectFile)
      } else if (injectFile === true) {
        shouldInject = true
      }

      if (!shouldInject) return

      const rootRule = new Rule({ selector: ':root' })
      rootRule.append(new Declaration({ prop: '--unit', value: '1px' }))
      // 添加注释以解释单位
      rootRule.prepend({ text: ` 默认：屏幕 > ${viewportWidth}px 时，1unit = 1px ` })

      const mediaRule = new AtRule({ name: 'media', params: `(max-width: ${viewportWidth}px)` })
      const mediaRoot = new Rule({ selector: ':root' })
      // 100vw / viewportWidth
      // 我们保留 calc 表达式让浏览器处理，或者如果我们想要固定精度也可以预先计算。
      // 但保留 calc(100vw / N) 对于响应式布局更精确。
      mediaRoot.append(new Declaration({ prop: '--unit', value: `calc(100vw / ${viewportWidth})` }))
      mediaRoot.prepend({ text: ` 屏幕 <= ${viewportWidth}px 时，1unit = 100vw / ${viewportWidth} ` })

      mediaRule.append(mediaRoot)

      // 插入到根节点前
      // root.prepend(mediaRule)
      // root.prepend(rootRule)

      root.append(rootRule)
      root.append(mediaRule)
    },
    Declaration(decl) {
      const filePath = decl.source?.input?.file || ''
      if (!shouldProcess(filePath)) return

      // 仅处理包含 "px" 的声明
      if (!decl.value.includes('px')) return

      // 将 px 值替换为 calc(N * var(--unit))
      decl.value = decl.value.replace(/(\d*\.?\d+)px/g, (match, p1) => {
        const numericVal = parseFloat(p1)

        // 忽略 1px 值的选项，通常用于边框。
        if (ignore1px && numericVal === 1) {
          return match // 保持为 1px
        }

        return `calc(${numericVal} * var(--unit))`
      })
    },
  }
}

plugin.postcss = true
export default plugin
