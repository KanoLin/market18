'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('attribute_values', {
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
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('attribute_values');
  }
};
