// 如何通过sourcemap手工还原错误具体信息？ https://www.zhihu.com/question/285449738
// /app/utils/stackparser.spec.js
'use strict';

const StackParser = require('../stackparser');

// const { resolve } = require('path');
// const { hasUncaughtExceptionCaptureCallback } = require('process');


const error = {
  stack: 'ReferenceError: abc is not defined\n' +
  '    at Proxy.mounted (http://127.0.0.1:8080/js/app.c82461cf.js:1:606)\n' +
  '    at i (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:8614)\n' +
  '    at c (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:8697)\n' +
  '    at Array.e.__weh.e.__weh (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:15852)\n' +
  '    at I (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:10078)\n' +
  '    at Q (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:31862)\n' +
  '    at mount (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:22532)\n' +
  '    at Object.e.mount (http://127.0.0.1:8080/js/chunk-vendors.b64c81c0.js:1:50901)\n' +
  '    at Object.8287 (http://127.0.0.1:8080/js/app.c82461cf.js:1:1066)\n' +
  '    at o (http://127.0.0.1:8080/js/app.c82461cf.js:1:1178)',
  message: 'abc is not defined',
  filename: 'http://127.0.0.1:8080/js/app.c82461cf.js:1:606',
};


it('test==========>', async () => {
  const stackParser = new StackParser(__dirname);
  // console.log('Stack:', error.stack);
  const stackFrame = stackParser.parseStackTrack(error.stack, error);
  stackFrame.map(v => {
    // console.log('stackFrame: ', v);
    return v;
  });

  const originStack = await stackParser.getOriginalErrorStack(stackFrame);

  console.log('originStack', originStack);

  // 断言，需要手动修改下面的断言信息，只测试第 0 个例子
  // eslint-disable-next-line no-undef
  expect(originStack[0]).toMatchObject({
    columnNumber: 606,
    lineNumber: 1,
    fileName: 'http://127.0.0.1:8080/js/app.c82461cf.js',
    functionName: 'Proxy.mounted',
    source: '    at Proxy.mounted (http://127.0.0.1:8080/js/app.c82461cf.js:1:606)',
  });
});
