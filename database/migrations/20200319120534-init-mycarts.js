'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE } = Sequelize;
    await queryInterface.createTable('mycarts', {
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
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('mycarts');
  }
};
