'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Stores', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      domain: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      mediaObjectKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      socials: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      colors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      klaviyoKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Stores');
  }
};
