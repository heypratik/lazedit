const { DataTypes } = require("sequelize");
const sequelize = require("../src/lib/db");

const Templates = sequelize.define(
  "Templates",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    template: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    html: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    brandTags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
      allowNull: true, // Optional
    },
    campaignTypeTag: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
      allowNull: true, // Optional
    },
    industryTags: {
      type: DataTypes.ARRAY(DataTypes.STRING), // Array of strings
      allowNull: true, // Optional
    },
  },
  {
    tableName: "templates",
    timestamps: true,
  }
);

module.exports = Templates;
