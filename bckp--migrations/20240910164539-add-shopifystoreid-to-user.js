'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the password column to the User table
    await queryInterface.addColumn('Users', 'shopifyStoreId', {
      type: Sequelize.STRING,
      allowNull: true, 
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the password column in case of rollback
    await queryInterface.removeColumn('Users', 'shopifyStoreId');
  }
};
