# postcss-view-adapter

视图适配插件 demo （WIP），[开发记录文档](./RECORD.MD)

自用的 postcss plugin，将 px 按规则编译成指定的适配方案

## 开发

```bash
npm run dev
# 或其它包管理器
yarn || pnpm || bun dev
```

## 使用

目前还不是单独的 npm 包，需要 clone 下来，注册到你的 postcss 配置中

```js
import viewAdapter from './path/to/postcss-view-adapter.mjs'
export default {
  plugins: [
    viewAdapter({
      ignore1px: false, // 是否忽略 1px，不进行转换
      viewportWidth: 414, // 设计稿宽度
    }),
  ],
}
```

后续，单独发布成 npm 包，方便大家安装使用。

```sh
npm i postcss-view-adapter
```

然后在 postcss 配置中引入即可。

## Fi

以下项目为该 plugin 提供灵感。

- https://github.com/evrone/postcss-px-to-viewport
- https://github.com/lkxian888/postcss-px-to-viewport-8-plugin
