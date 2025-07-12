const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Image = sequelize.define(
    "Image",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      organization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "organizations", key: "id" },
        onDelete: "CASCADE",
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mediaObjectKey: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "media_object_key",
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "images",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        {
          fields: ["user_id"],
          name: "idx_images_user_id",
        },
        {
          fields: ["organization_id"],
          name: "idx_images_organization_id",
        },
        {
          fields: ["user_id", "filename"],
          name: "idx_images_user_filename",
        },
        {
          fields: ["organization_id", "filename"],
          name: "idx_images_org_filename",
        },
      ],
    }
  );

  return Image;
};
