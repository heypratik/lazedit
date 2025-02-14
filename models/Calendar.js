const { DataTypes } = require('sequelize');
const sequelize = require('./../src/lib/db');
import Users from './Users';

const Calendar = sequelize.define('Calendar', {
  userId: { // Connect to User
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Users,
      key: 'id',
    },
  },
  startCreateCampaign: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  generatedSchedule: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  freezeTableName: true,
});

module.exports = Calendar;
