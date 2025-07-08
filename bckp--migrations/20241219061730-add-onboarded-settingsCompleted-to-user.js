"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Users", "onboarded", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn("Users", "settingsCompleted", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Users", "onboarded");
    await queryInterface.removeColumn("Users", "settingsCompleted");
  },
};
