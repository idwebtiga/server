module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define(
    'payments',
    {
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      requestId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nameItem: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      transferDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      transfered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      fromAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      txHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      errMsg: {
        type: Sequelize.STRING,
        allowNull: true,
      }
    },
    {},
  );
  return Model;
};
