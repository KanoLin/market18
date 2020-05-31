/* eslint valid-jsdoc: "off" */

'use strict';

const dotenv = require('dotenv');
dotenv.config();

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
  config.keys = appInfo.name + process.env.KEY;

  // add your middleware config here
  config.middleware = [];


  config.sequelize = {
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    host: process.env.DB_HOST,
    port: process.env.PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PWD,
    timezone: '+08:00'
  };

  config.email = {
    client: {
      host: 'smtp.163.com',
      secureConnection: true,
      port: 465,
      auth: {
        user: 'sblp_market18',
        pass: process.env.EMAIL_PASS,
      },
    },
  };

  config.redis = {
    client: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      password: null,
      db: 0,
    },
  };

  config.validate = {
    convert: false,
    // validateRoot: false,
  };

  config.multipart = {
    fileSize: '4mb',
    whitelist: [
      '.png',
      '.jpg',
      '.jpeg'
    ],
  };

  config.security = {
    csrf: false,
  };

  return {
    ...config,
  };
};
