'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'stripeCustomerId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });

    await queryInterface.addColumn('Users', 'stripePlanEndsAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'userType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'stripeCustomerId');
    await queryInterface.removeColumn('Users', 'stripePlanEndsAt');
    await queryInterface.removeColumn('Users', 'userType');
  }
};
