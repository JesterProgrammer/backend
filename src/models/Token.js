const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Token = sequelize.define('tokens', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  whoRequest: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dataExpiration: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'tokens',
  timestamps: false
});

module.exports = Token; 