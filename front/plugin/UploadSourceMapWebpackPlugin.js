const path = require('path')
const glob = require('glob')
const fs = require('fs')
const http = require('http')


class UploadSourceMapWebpackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    console.log('UploadSourceMapWebpackPlugin apply')
    // 定义在打包后执行
    compiler.hooks.done.tap('UploadSourceMapWebpackPlugin', async status => {
      // 读取 sourceMap 文件
      const list = glob.sync(path.join(status.compilation.outputOptions.path, `./**/*.{js.map,}`))
      console.log('list', list)
      // list [
      //   '/mnt/d/Desktop/err-catch-demo/vue-app/dist/js/app.d15f69c0.js.map',
      //   '/mnt/d/Desktop/err-catch-demo/vue-app/dist/js/chunk-vendors.f3b66fea.js.map'
      // ]
      for (let filename of list) {
        await this.upload(this.options.uploadUrl, filename)
      }
    })

  }
  upload(url, file) {
    return new Promise(resolve => {
      console.log('upload Map: ', file)

      const req = http.request(`${url}?name=${path.basename(file)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          Connection: 'keep-alive',
          'Transfer-Encoding': 'chunked'
        }
      });
      fs.createReadStream(file).on('data', (chunk) => {
        req.write(chunk)
      }).on('end', () => {
        req.end()
        resolve()
      })
    })
  }
}

module.exports = UploadSourceMapWebpackPlugin
