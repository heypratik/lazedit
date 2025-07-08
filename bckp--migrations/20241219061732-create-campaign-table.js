'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Campaigns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      klaviyoCampaignId: {
        type: Sequelize.STRING,
        allowNull: true
      },
      genEmailData: {
        type: Sequelize.JSON,
        allowNull: true
      },
      htmlEmailTemplate: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      jsonEmailTemplate: {
        type: Sequelize.JSON,
        allowNull: true
      },
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Stores',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Campaigns');
  }
};