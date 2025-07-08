const Sequelize = require("sequelize");
const pg = require("pg");

const sequelize = new Sequelize(process.env.NEXT_PUBLIC_POSTGRESS, {
  dialect: "postgres",
  dialectModule: pg,
});

const models = {
  User: require("./user")(sequelize),
  Organization: require("./organization")(sequelize),
};

// Define associations
models.User.belongsTo(models.Organization, {
  foreignKey: "organization_id",
  as: "organization",
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
