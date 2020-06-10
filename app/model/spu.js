'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const Spu = app.model.define('spu', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(255), allowNull: false, },
    category_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key:'id',
      },
    },
    spu_pic: {
      type: STRING,
      allowNull: false,
      comment:'主图',
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
    tableName: 'spus',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });

  Spu.associate = () => {
    app.model.Spu.belongsTo(app.model.Category, { as: 'category', foreignKey: 'category_id' });
    app.model.Spu.hasMany(app.model.Sku, { as: 'skus', foreignKey: 'spu_id' });
  };

  return Spu;
};