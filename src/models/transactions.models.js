module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define(
    'transactions',
    {
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      nonce: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payload: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      signer: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signature: {
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
      },
      processDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      processed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {},
  );
  return Model;
};
