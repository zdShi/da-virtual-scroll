module.exports = {
  // 配置基本路径，使用相对
  publicPath: "./",
  // 配置输出文件目录，使用相对路径
  outputDir: "./dist",
  // 配置 esLiqt-Loader 是否在保存的时候检查相关语法异常警告提示
  lintOnSave: true,
  // webpack配置 更多相关配置请查阅:https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // chainWebpack: () => {},
  // configureWebpack: () => {},
  // 生产环境是否生成 sourceMap 文件, 在打包后可以直接定位到bug所在的具体位置
  productionSourceMap: true,
  // CSS相关配置
  // css: {
  //   // 是否使用css分离插件 ExtractTextPlugin,
  //   extract: true,
  //   // 是否开启 CSS source maps，在打包后可以直接定位css所在位置
  //   sourceMap: false,
  //   // css预设器配置项，所有的 css-Loader 选项在这里都是支持的，
  //   loaderOptions: {
  //     css: {
  //       localIdentName: "[name]-[hash]",
  //       camelCase: "only",
  //     },
  //   },
  //   // 启用 CSS modules for all css / pre-processor files.
  //   requireModuleExtension: false,
  // },
  //是否为babel 或 ts 使用thread-loader
  parallel: require("os").cpus().length > 1,
  // pwa: {},
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: null,
    // proxy:{
    //   '/api':{
    //     target:'',
    //     ws:true,
    //     changeOrigin:true,
    //   }
    // }
  },
  //第三方的插件配置
  pluginOptions: {
    //..
  },
};
