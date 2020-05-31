'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const Attribute = app.model.define('attribute', {
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
    tableName: 'attributes',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Attribute.associate = () => {
    app.model.Attribute.belongsTo(app.model.Category, { as: 'category', foreignKey: 'category_id' });
    app.model.Attribute.hasMany(app.model.AttributeValue, { as: 'values', foreignKey: 'attribute_id' });
  };

  return Attribute;
};