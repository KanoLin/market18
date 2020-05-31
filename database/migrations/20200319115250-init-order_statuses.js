'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, TEXT } = Sequelize;
    await queryInterface.createTable('order_statuses', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      order_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key:'id',
        },
      },
      description: { type: TEXT, allowNull: false },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_statuses');
  }
};
