const { DataTypes } = require("sequelize");
const sequelize = require("./../src/lib/db");
import Store from "./Store";

const Learning = sequelize.define(
  "Learning",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    metric: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    campaignId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    statistics: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    campaignData: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
    channel: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Learnings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Learning.belongsTo(Store, {
  foreignKey: {
    name: "storeId",
    allowNull: false,
  },
  as: "store",
});

module.exports = Learning;
