/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1617677729860_2744';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    // 可能存在 scrf 风险，这里设置关闭
    csrf: {
      enable: false,
    },
  };


  config.customLogger = {
    frontendLogger: {
      file: path.join(appInfo.root, 'logs/frontend.log'),
    },
  };


  return {
    ...config,
    ...userConfig,
  };
};
