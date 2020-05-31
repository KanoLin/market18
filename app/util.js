'use strict';

const utils = {
  make_res: (msg, code, data = {}) => {
    return Object.assign({ errmsg: msg, errcode: code }, data);
  },

  new_captcha: () => {
    return Math.floor(Math.random() * (900000 - 1)) + 100000;
  },
};

module.exports = utils;
