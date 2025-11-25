import viewAdapter from './postcss-view-adapter.mjs'

/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    // 'tailwindcss/postcss-nesting',
    // tailwindcss: {},
    // autoprefixer: {},

    // 'postcss-px-to-viewport': {
    //   unitToConvert: 'px', // 需要转换的单位，默认为"px"
    //   viewportWidth: 414, // 设计稿宽度
    //   unitPrecision: 5, // 转换后的精度，即小数点位数
    //   propList: ['*'], // 哪些属性需要转
    //   viewportUnit: 'vw', // 转换成的视窗单位
    //   fontViewportUnit: 'vw', // 字体转换成的视窗单位
    //   selectorBlackList: ['ignore-vw'], // 需要忽略的类
    //   minPixelValue: 1, // 小于或等于1px不转换
    //   mediaQuery: false, // 是否在媒体查询中转换px ==================
    //   replace: true, // 是否直接更换属性值，而不是添加备用属性
    //   exclude: [/node_modules/, /globals.css/, /\.excl\.scss/], // 忽略某些文件
    // },

    // 自定义插件
    viewAdapter({
      ignore1px: false,
      viewportWidth: 414,
    }),
  ],
}

//  '@tailwindcss/postcss': {},
export default config
