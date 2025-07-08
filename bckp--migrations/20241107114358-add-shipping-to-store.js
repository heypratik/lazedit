'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the password column to the User table
    await queryInterface.addColumn('Stores', 'shipping', {
      type: Sequelize.STRING,
      allowNull: true, // Ensure the password is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the password column in case of rollback
    await queryInterface.removeColumn('Stores', 'shipping');
  }
};
