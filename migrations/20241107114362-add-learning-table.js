"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Learnings", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      metric: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      campaignId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      storeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Stores",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      statistics: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      campaignData: {
        type: Sequelize.JSONB,
        allowNull: true,
        defaultValue: {},
      },
      channel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("Learnings", ["storeId"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Learnings");
  },
};
