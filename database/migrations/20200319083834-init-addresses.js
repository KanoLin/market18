'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, TEXT, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('addresses', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key:'id',
        },
        onDelete:'CASCADE'
      },
      default: { type: BOOLEAN, allowNull: false, defaultValue: false, },
      province:{ type: STRING(20), allowNull: false, },
      city: { type: STRING(20), allowNull: false, },
      county: { type: STRING(20), allowNull: false, },
      postal_code: { type: STRING(6), allowNull: false, },
      address: { type: TEXT, allowNull: false, },
      recipient: { type: STRING(30), allowNull: false, },
      phone: { type: STRING(15), allowNull: false, },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('addresses');
  }
};
