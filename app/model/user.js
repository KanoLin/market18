'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER, DATEONLY, BOOLEAN } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: STRING(30),
	  password: STRING(128),
	  identity: INTEGER,
  	avatar: STRING(200),
	  birthday: DATEONLY,
    sex: INTEGER,
    phone: STRING(15),
    email: STRING(40),
    created_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    updated_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    underscored: true,
    tableName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  User.associate = () => {
    app.model.User.hasMany(app.model.Address, { as: 'addresses', foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.Order, { as: 'orders', foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.Mycart, { as: 'mycarts', foreignKey: 'user_id' });
    app.model.User.hasMany(app.model.Comment, { as: 'comments', foreignKey: 'user_id' });
  };

  return User;
};