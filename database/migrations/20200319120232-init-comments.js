'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, TEXT } = Sequelize;
    await queryInterface.createTable('comments', {
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
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('comments');
  }
};
