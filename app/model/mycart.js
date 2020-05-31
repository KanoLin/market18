'use strict';

const moment = require('moment');

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const Mycart = app.model.define('mycarts', {
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
    num: { type: INTEGER, allowNull: false, },
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
    tableName: 'mycarts',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  Mycart.associate = () => {
    app.model.Mycart.belongsTo(app.model.User, { as: 'user', foreignKey: 'user_id' });
    app.model.Mycart.belongsTo(app.model.Sku, { as: 'sku', foreignKey: 'sku_id' });
  };

  return Mycart;
};