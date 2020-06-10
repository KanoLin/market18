'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DECIMAL, DATE, STRING, JSON } = app.Sequelize;

  const Sku = app.model.define('sku', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(255), allowNull: false, },
    spu_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'spus',
        key:'id',
      },
    },
    price: { type: DECIMAL(12,2), allowNull: false, defaultValue: 0.0, },
    stock: { type: INTEGER, allowNull: false, defaultValue: 0, },
    sales: { type: INTEGER, allowNull: false, defaultValue: 0, },
    sku_pic: {
      type: STRING,
      allowNull: false,
      comment:'主轮播图',
    },
    des_pic: {
      type: STRING,
      allowNull: false,
      comment:'详情图',
    },
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
    tableName: 'skus',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Sku.associate = () => {
    app.model.Sku.belongsTo(app.model.Spu, { as: 'spu', foreignKey: 'spu_id' });
    app.model.Sku.belongsToMany(app.model.AttributeValue, { as: 'values', through: app.model.SkuAttributeValue });
    app.model.Sku.hasMany(app.model.SkuAttributeValue, { as: 'aavs', foreignKey: 'sku_id' });
    app.model.Sku.hasMany(app.model.Order, { as: 'orders', foreignKey: 'sku_id' });
    app.model.Sku.hasMany(app.model.Comment, { as: 'comments', foreignKey: 'sku_id' });
  };

  return Sku;
};