const { DataTypes } = require("sequelize");
const sequelize = require("./../src/lib/db");
import Store from "./Store";

const Projects = sequelize.define(
  "Project",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Store",
        key: "id",
      },
    },
    json: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isTemplate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

// Define the association
Projects.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});

module.exports = Projects;
