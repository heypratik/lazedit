const { DataTypes } = require("sequelize");
const sequelize = require("./../src/lib/db");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shopifyStoreId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    stripePlanEndsAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    onboarded: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    settingsCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = User;
