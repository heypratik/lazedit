'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the password column to the User table
    await queryInterface.addColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false, // Ensure the password is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the password column in case of rollback
    await queryInterface.removeColumn('Users', 'password');
  }
};
