const { DataTypes } = require("sequelize");
const sequelize = require("../src/lib/db");
const Store = require("./Store");

const Campaigns = sequelize.define(
  "Campaigns",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    klaviyoCampaignId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genEmailData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    htmlEmailTemplate: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    jsonEmailTemplate: {
      type: DataTypes.JSON,
      allowNull: true,
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
  },
  {
    tableName: "Campaigns",
    timestamps: true,
  }
);

module.exports = Campaigns;
