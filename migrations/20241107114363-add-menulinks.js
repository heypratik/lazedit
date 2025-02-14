"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Stores", "menuLinks", {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: [],
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Stores", "menuLinks");
  },
};
