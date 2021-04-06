import { createApp } from 'vue'
import App from './App.vue'

const Vue = createApp(App)


// src/main.js

// 在 vue 里面统一使用这个 方式捕获错误
Vue.config.errorHandler = (err, vm, info) => {
  console.log('errHandler:', err)
  uploadError(err)
}

function uploadError({ message, stack, filename }) {
  console.log('uploadError---')
  // 整理我们要的错误信息
  const errorInfo = {
    stack,
    message,
    filename,
  }
  console.log("errorInfo", errorInfo);
  // 错误信息序列化后使用 base64 编码，避免出现特殊字符导致的错误
  const str = window.btoa(JSON.stringify(errorInfo))

  // 创建图片，使用图片给错误收集的后端服务器发送一个 get 请求，
  // 上传的信息：错误资源，错误时间
  new Image().src = `http://localhost:7001/monitor/error?info=${str}`
}

Vue.mount('#app')
