"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "organizations",
          key: "id",
        },
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    // Add indexes
    await queryInterface.addIndex("images", ["user_id"], {
      name: "idx_images_user_id",
    });

    await queryInterface.addIndex("images", ["organization_id"], {
      name: "idx_images_organization_id",
    });

    await queryInterface.addIndex("images", ["user_id", "filename"], {
      name: "idx_images_user_filename",
    });

    await queryInterface.addIndex("images", ["organization_id", "filename"], {
      name: "idx_images_org_filename",
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex("images", "idx_images_user_id");
    await queryInterface.removeIndex("images", "idx_images_organization_id");
    await queryInterface.removeIndex("images", "idx_images_user_filename");
    await queryInterface.removeIndex("images", "idx_images_org_filename");

    // Drop the table
    await queryInterface.dropTable("images");
  },
};
