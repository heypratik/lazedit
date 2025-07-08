"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Images", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Stores",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      filename: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      media_object_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB,
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

    // Create the index
    await queryInterface.addIndex("Images", {
      fields: ["store_id", "filename"],
      name: "idx_store_filename",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the index first
    await queryInterface.removeIndex("Images", "idx_store_filename");

    // Then drop the table
    await queryInterface.dropTable("Images");
  },
};
