'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER, BOOLEAN, TEXT } = app.Sequelize;

  const Address = app.model.define('address', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key:'id',
      },
    },
    default: { type: BOOLEAN, allowNull: false, defaultValue: false, },
    province:{ type: STRING(20), allowNull: false, },
    city: { type: STRING(20), allowNull: false, },
    county: { type: STRING(20), allowNull: false, },
    postal_code: { type: STRING(6), allowNull: false, },
    address: { type: TEXT, allowNull: false, },
    recipient: { type: STRING(30), allowNull: false, },
    phone: { type: STRING(15), allowNull: false, },
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
    tableName: 'addresses',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Address.associate = () => {
    app.model.Address.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
  };

  return Address;
};