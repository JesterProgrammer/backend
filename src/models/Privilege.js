const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Privilege = sequelize.define('privileges', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegramID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  permGroup: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'privileges',
  timestamps: false
});

module.exports = Privilege; 