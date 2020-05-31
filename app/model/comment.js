'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE, TEXT } = app.Sequelize;

  const Comment = app.model.define('comment', {
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
    order_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key:'id',
      },
    },
    star: { type: INTEGER, allowNull: false, defaultValue: 5 },
    comment: { type: TEXT, allowNull: false },
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
    tableName: 'comments',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Comment.associate = () => {
    app.model.Comment.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Comment.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
    app.model.Comment.belongsTo(app.model.Order, { as: 'order', foreignKey: 'order_id' });
  };

  return Comment;
};