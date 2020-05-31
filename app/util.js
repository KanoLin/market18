'use strict';

const utils = {
  make_res: (msg, code, data = {}) => {
    return Object.assign({ errmsg: msg, errcode: code }, data);
  },

  random_num: () => {
    return Math.floor(Math.random() * (900000 - 1)) + 100000;
  },
};

module.exports = utils;
