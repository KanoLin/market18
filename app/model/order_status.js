'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, TEXT } = app.Sequelize;

  const OrderStatus = app.model.define('order_status', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    order_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key:'id',
      },
    },
    description: { type: TEXT, allowNull: false },
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
    tableName: 'order_statuses',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  OrderStatus.associate = () => {
    app.model.OrderStatus.belongsTo(app.model.Order, { as: 'order', foreignKey: 'order_id' });
  };

  return OrderStatus;
};