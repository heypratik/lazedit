const { DataTypes } = require("sequelize");
const sequelize = require("../src/lib/db");
const Store = require("./Store");

const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Store,
        key: "id",
      },
      field: "store_id",
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
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    tableName: "Images",
    indexes: [
      {
        fields: ["store_id", "filename"],
        name: "idx_store_filename",
      },
    ],
  }
);

module.exports = Image;
