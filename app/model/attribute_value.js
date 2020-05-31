'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const AttributeValue = app.model.define('attribute_value', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(255), allowNull: false, },
    attribute_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'attributes',
        key:'id',
      },
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
  }, {
    underscored: true,
    tableName: 'attribute_values',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  AttributeValue.associate = () => {
    app.model.AttributeValue.belongsTo(app.model.Attribute, { as: 'attribute', foreignKey: 'attribute_id' });
    app.model.AttributeValue.belongsToMany(app.model.Sku, { as: 'skus', through: app.model.SkuAttributeValue });
  };

  return AttributeValue;
};