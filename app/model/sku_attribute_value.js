'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const SkuAttributeValue = app.model.define('sku_attribute_value', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    sku_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'skus',
        key: 'id',
      },
    },
    attribute_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'attributes',
        key: 'id',
      },
    },
    attribute_value_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'attribute_values',
        key: 'id',
      },
    },
  }, {
    underscored: true,
    tableName: 'sku_attribute_value',
    timestamps:false,
  });

  SkuAttributeValue.associate = () => {
    app.model.SkuAttributeValue.belongsTo(app.model.AttributeValue, { as: 'values', foreignKey: 'attribute_value_id' });
    app.model.SkuAttributeValue.belongsTo(app.model.Sku, { as: 'skus', foreignKey: 'sku_id' });
    app.model.SkuAttributeValue.belongsTo(app.model.Attribute, { as: 'attribute', foreignKey: 'attribute_id' });

  };

  return SkuAttributeValue;
};