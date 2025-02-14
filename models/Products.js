const { DataTypes } = require('sequelize');
const sequelize = require('./../src/lib/db');
import Store from './Store';

const Product = sequelize.define('Product', {
storeId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Store,
          key: 'id',
        },
    },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sku: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },

}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Product;
