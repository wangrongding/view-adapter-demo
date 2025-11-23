# postcss-view-adapter

本项目通过 PostCSS 插件 `postcss-view-adapter` 实现了基于屏幕宽度的响应式适配，主要用于在不同屏幕尺寸下调整 CSS 样式中的 `px` 单位。

## 背景

GZ 希望在不同屏幕尺寸下实现更好的适配效果：

- 在较小屏幕（如手机）上，希望元素能够根据屏幕宽度 viewport vw 进行等比缩放，而不是固定使用 `px` 单位。
- 大屏幕（>=414）则希望保持原有的 `px` 设计。

## 问题

大家都不希望，将更多的心智负担加到自己开发过程中，希望还是和之前一样写，一些适配的过程，让预处理器帮我们做掉。

这里面会涉及到运行时代码，所以会借助 css 变量来实现。我们通过 PostCSS 插件，在编译阶段将 `px` 单位转换为 calc 表达式，利用 css 变量来实现运行时的适配。

## 解决方案以及核心原理

如果是用 js 来实现，核心逻辑如下：

```js
// JS: width = screenWidth >= 414 ? val : val * (100 / 414)

function pxToRp(val) {
  const screenWidth = window.innerWidth
  if (screenWidth > 414) {
    return val // 大屏幕，保持 px 不变
  } else {
    return val * (100 / 414) + 'vw' // 小屏幕，根据屏幕宽度缩放
  }
}
```

但是用 js 来实现的话，每次样式变化都需要触发 js 计算，性能开销较大。不现实。

但用 css 变量的话，性能会好很多。

而纯 CSS 是无法实现上述逻辑的，因为 CSS 不支持条件判断。

借助 tailwind 的思想，我们可以将上述逻辑转换为 PostCSS 插件 `postcss-view-adapter`，在编译阶段将 `px` 单位转换为 `calc` 表达式，利用 CSS 变量来实现运行时的适配。

CSS: width < 414 ? val : val \* 0.24154vw
CSS:
