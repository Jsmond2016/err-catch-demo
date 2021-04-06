// /app/utils/stackparser.js

'use strict';

const ErrorStackParser = require('error-stack-parser');
const { SourceMapConsumer } = require('source-map');
const path = require('path');
const fs = require('fs');

module.exports = class StackParser {
  constructor(sourceMapDir) {
    this.sourceMapDir = sourceMapDir;
    this.consumers = {};
  }

  parseStackTrack(stack, message) {
    const error = new Error(message);
    error.stack = stack;
    const stackFrame = ErrorStackParser.parse(error);
    return stackFrame;
  }

  async getOriginalErrorStack(stackFrame) {
    const origin = [];
    for (const v of stackFrame) {
      origin.push(await this.getOriginPosition(v));
    }
    return origin;
  }

  // 从 sourceMap 文件读取错误信息
  async getOriginPosition(stackFrame) {
    // console.log('stackFrame: ', stackFrame);
    let { columnNumber, lineNumber, fileName } = stackFrame;
    fileName = path.basename(fileName);
    // console.log('fileName: ', fileName);
    // 判断 consumers 是否存在
    let consumer = this.consumers[fileName];
    if (!consumer) {
      // 读取 sourceMap
      const sourceMapPath = path.resolve(this.sourceMapDir, fileName + '.map');
      // 判断文件是否存在
      if (!fs.existsSync(sourceMapPath)) {
        // 不存在则返回源文件
        return stackFrame;
      }
      const content = fs.readFileSync(sourceMapPath, 'utf-8');
      consumer = await new SourceMapConsumer(content, null);
      this.consumers[fileName] = consumer;
    }

    const parseData = consumer.originalPositionFor({ line: lineNumber, column: columnNumber });
    return parseData;

  }

};
