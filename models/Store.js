const { DataTypes } = require("sequelize");
const sequelize = require("./../src/lib/db");

const Store = sequelize.define(
  "Store",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    klaviyoKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mediaObjectKey: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shipping: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    menuLinks: {
      type: DataTypes.JSONB,
      defaultValue: [],
      allowNull: true,
    },
    socials: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    colors: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "Stores",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

const User = require("./Users");

Store.belongsTo(User, {
  foreignKey: {
    allowNull: false,
    name: "userId",
  },
  as: "user",
});

module.exports = Store;
