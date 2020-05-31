'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, DATEONLY, STRING, BOOLEAN } = Sequelize;
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: STRING(30), allowNull: false, defaultValue: '新用户',},
      password: { type: STRING(255), allowNull: false, },
      identity: { type: INTEGER, defaultValue: 0, allowNull: false, },
      avater: { type: STRING(200), allowNull: false, defaultValue: '', },
      birthday: { type: DATEONLY, defaultValue: '1970-01-01', },
      sex: { type: BOOLEAN, allowNull: false, defaultValue: 0, },
      phone: { type: STRING(15), allowNull: false, },
      email: { type: STRING(40), allowNull: false, },
      created_at: DATE,
      updated_at: DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
