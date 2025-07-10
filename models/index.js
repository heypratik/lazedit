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
};

// Define associations
models.User.belongsTo(models.Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

models.Organization.hasMany(models.User, {
  foreignKey: "organization_id",
  as: "users",
});

// Project associations
models.Project.belongsTo(models.Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

models.Project.belongsTo(models.User, {
  foreignKey: "user_id",
  as: "user",
});

models.Organization.hasMany(models.Project, {
  foreignKey: "organization_id",
  as: "projects",
});

models.User.hasMany(models.Project, {
  foreignKey: "user_id",
  as: "projects",
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
