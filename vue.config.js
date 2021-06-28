// https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-cli/config.md
module.exports = {
  pwa: {
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png'
    },
    name: 'Freyala',
    themeColor: '#c1c1c1',
    msTileColor: '#c1c1c1',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // configure the workbox plugin
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'service-worker.js'
    }
  },

  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  publicPath: '',

  // where to output built files
  outputDir: 'dist',

  // whether to use eslint-loader for lint on save.
  // valid values: true | false | 'error'
  // when set to 'error', lint errors will cause compilation to fail.
  lintOnSave: true,

  // https://cli.vuejs.org/config/#runtimecompiler
  runtimeCompiler: false,

  // generate sourceMap for production build?
  productionSourceMap: process.env.NODE_ENV !== 'production',

  configureWebpack: {
    plugins: [
      require('tailwindcss'),
      require('autoprefixer')
    ]
  }
}
