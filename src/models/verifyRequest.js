module.exports = (sequelize, Sequelize) => {
  const VerifyRequest = sequelize.define("verifyRequest", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    telegramID: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'pending'
    },
    whoVerify: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ''
    },
    Code: {
      type: Sequelize.STRING,
      allowNull: false
    },
    gradeBook: {
      type: Sequelize.STRING  ,
      allowNull: false
    }
  }, {
    tableName: 'verifyRequests',
    timestamps: false
  });

  return VerifyRequest;
}; 