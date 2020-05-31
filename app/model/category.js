'use strict';

const moment = require('moment');

module.exports = app => {
  const { STRING, DATE, INTEGER } = app.Sequelize;

  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key:'id',
      },
    },
    name: { type: STRING(30), allowNull: false, },
    father_id: { type: INTEGER, defaultValue: 0, allowNull: false, },
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
    tableName: 'categories',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Category.associate = () => {
    app.model.Category.hasMany(app.model.Category, { as: 'sons', foreignKey: 'father_id' });
    app.model.Category.belongsTo(app.model.Category, { as: 'father', foreignKey: 'father_id' });
    app.model.Category.hasMany(app.model.Spu, { as: 'spus', foreignKey: 'category_id' });
    app.model.Category.hasMany(app.model.Attribute, { as: 'attributes', foreignKey: 'category_id' });
  };

  return Category;
};