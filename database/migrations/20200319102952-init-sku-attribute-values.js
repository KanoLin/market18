'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize;
    await queryInterface.createTable('sku_attribute_value', {
      sku_id: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'skus',
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
    await queryInterface.addIndex(
      'sku_attribute_value',
      {
        unique: true,
        fields:['sku_id','attribute_value_id'] 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sku_attribute_value');
  }
};
