'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize;
    await queryInterface.createTable('sku_attribute_value', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      sku_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
          key: 'id',
        },
      },
      attribute_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'attributes',
          key: 'id',
        },
      },
      attribute_value_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'attribute_values',
          key: 'id',
        },
      },
    }, {
      timestamps: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sku_attribute_value');
  }
};
