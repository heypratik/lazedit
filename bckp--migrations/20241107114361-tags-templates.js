"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("templates", "brandTags", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn("templates", "campaignTypeTag", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn("templates", "industryTags", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("templates", "brandTags");
    await queryInterface.removeColumn("templates", "campaignTypeTag");
    await queryInterface.removeColumn("templates", "industryTags");
  },
};
