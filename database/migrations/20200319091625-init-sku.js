'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DECIMAL, DATE, STRING, JSON } = Sequelize;
    await queryInterface.createTable('skus', {
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
        type: JSON,
        allowNull: false,
        comment:'主轮播图',
      },
      des_pic: {
        type: JSON,
        allowNull: false,
        comment:'详情图',
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('skus');
  }
};
