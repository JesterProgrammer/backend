const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  telegramID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  inst: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Ugroup: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gradeBook: {
    type: DataTypes.STRING,
    allowNull: false
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  admissionYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  program: {
    type: DataTypes.STRING,
    allowNull: false
  },
  FoE: {
    type: DataTypes.STRING,
    allowNull: false
  },
  typeOfSet: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User; 