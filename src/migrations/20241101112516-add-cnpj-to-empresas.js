'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('empresas', 'cnpj', {
      type: Sequelize.STRING,
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('empresas', 'cnpj');
  }
};
