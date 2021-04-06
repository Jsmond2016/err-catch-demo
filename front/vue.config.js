// /vue.config.js 
// refer:https://cli.vuejs.org/zh/config/#configurewebpack
const UploadSourceMapWebpackPlugin = require('./plugin/uploadSourceMapWebpackPlugin')

module.exports = {
  configureWebpack: {
    plugins:[
      new UploadSourceMapWebpackPlugin({
        uploadUrl: 'http://localhost:7001/monitor/sourcemap'
      })
    ]
  },
  // close eslint setting
  devServer: {
    overlay: {
      warning: true,
      errors: true
    }
  },
  lintOnSave: false
}
