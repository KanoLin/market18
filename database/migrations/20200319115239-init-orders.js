'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, BOOLEAN, DECIMAL } = Sequelize;
    await queryInterface.createTable('orders', {
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
      address_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'addresses',
          key:'id',
        },
      },
      num: { type: INTEGER, allowNull: false, },
      price:{ type: DECIMAL(12,2), allowNull: false, },
      anonymous: { type: BOOLEAN, allowNull: false, defaultValue: false, },
      status: { type: INTEGER, allowNull: false, defaultValue: 0 },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};
