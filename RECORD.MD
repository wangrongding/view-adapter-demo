# postcss-view-adapter

## 背景

希望在不同屏幕尺寸下实现更好的适配效果：

- 在较小屏幕（如小屏幕手机）上，希望元素能够根据屏幕宽度 viewport vw 进行等比缩放，而不是固定使用 `px` 单位。
- 大屏幕（>=414）则希望保持原有的 `px` 设计。

## 问题

大家都不希望，将更多的心智负担加到自己开发过程中，希望还是和之前一样写，一些适配的过程，让预处理器帮我们做掉。

为满足上述两点，我们至少需要解决以下两个问题：

1. 区分大屏幕和小屏幕
2. 根据屏幕宽度，动态调整样式值

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

但是用 js 来实现的话，每次样式变化都需要触发 js 计算，性能开销较大。不现实。CSS 实现则没有这个问题（平均在 40k/s-41.5k/s）

而纯 CSS 是无法实现上述逻辑的，因为 CSS 不支持条件判断。但用 css 变量的话，可以实现一样的效果。

借助 tailwind 的思想：诸如 w-10, border-2, mt-2, 这种类名，实际上是通过 css 变量来实现的。

我们可以将上述逻辑转换为 PostCSS 插件 `postcss-view-adapter`，在编译阶段将 `px` 单位转换为 `calc` 表达式，利用 CSS 变量来实现运行时的适配。

CSS: width < 414 ? val : val \* 0.24154vw
CSS:
