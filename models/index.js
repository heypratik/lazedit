const Sequelize = require("sequelize");
const pg = require("pg");

const sequelize = new Sequelize(process.env.NEXT_PUBLIC_POSTGRESS, {
  dialect: "postgres",
  dialectModule: pg,
});

const models = {
  User: require("./user")(sequelize),
  Organization: require("./organization")(sequelize),
  Project: require("./project")(sequelize),
  Image: require("./image")(sequelize), // Add the new Image model
};

// Define associations

// User - Organization associations
models.User.belongsTo(models.Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

models.Organization.hasMany(models.User, {
  foreignKey: "organization_id",
  as: "users",
});

// Project - Organization associations
models.Project.belongsTo(models.Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

models.Organization.hasMany(models.Project, {
  foreignKey: "organization_id",
  as: "projects",
});

// Project - User associations
models.Project.belongsTo(models.User, {
  foreignKey: "user_id",
  as: "user",
});

models.User.hasMany(models.Project, {
  foreignKey: "user_id",
  as: "projects",
});

// Image - User associations
models.Image.belongsTo(models.User, {
  foreignKey: "user_id",
  as: "user",
});

models.User.hasMany(models.Image, {
  foreignKey: "user_id",
  as: "images",
});

// Image - Organization associations
models.Image.belongsTo(models.Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

models.Organization.hasMany(models.Image, {
  foreignKey: "organization_id",
  as: "images",
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
