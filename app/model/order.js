'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const Order = app.model.define('order', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key:'id',
      },
    },
    sku_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'skus',
        key:'id',
      },
    },
    address_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'addresses',
        key:'id',
      },
    },
    num: { type: INTEGER, allowNull: false, },
    anonymous: { type: BOOLEAN, allowNull: false, defaultValue: false, },
    status: { type: INTEGER, allowNull: false, defaultValue: 0 },
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
    deleted_at: {
      type: DATE,
      get() {
        return moment(this.getDataValue('deleted_at')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  }, {
    underscored: true,
    paranoid: true,
    tableName: 'orders',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Order.associate = () => {
    app.model.Order.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Order.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
    app.model.Order.belongsTo(app.model.Address, { as: 'address', foreignKey: 'address_id' });
    app.model.Order.hasMany(app.model.OrderStatus, { as: 'status', foreignKey: 'order_id' });
  };

  return Order;
};