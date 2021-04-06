// app/controller/monitor.js

'use strict';

const Controller = require('egg').Controller;

const path = require('path');
const fs = require('fs');


class MonitorController extends Controller {
  async index() {
    const { ctx } = this;
    const { info } = ctx.query;
    // Buffer 接受一个 base64 编码的数据
    const json = JSON.parse(Buffer.from(info, 'base64').toString('utf-8'));
    console.log('error-info', json);
    // 写入日志
    this.ctx.getLogger('frontendLogger').error(json);
    ctx.body = 'hi, json';
  }

  async upload() {
    const { ctx } = this;
    // 拿到的是一个 流
    const stream = ctx.req;
    const filename = ctx.query.name;
    const dir = path.join(this.config.baseDir, 'upload');
    // 判断 upload 是否存在
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    const target = path.join(dir, filename);
    // 创建写入流写入信息
    console.log('writeFile====', target);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
  }
}

module.exports = MonitorController;

