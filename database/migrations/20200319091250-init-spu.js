'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING, JSON } = Sequelize;
    await queryInterface.createTable('spus', {
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
      spu_pic: {
        type: JSON,
        allowNull: false,
        comment:'主图',
      },
      created_at: DATE,
      updated_at: DATE,
      deleted_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('spus');
  }
};
