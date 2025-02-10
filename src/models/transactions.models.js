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
      mintDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      minted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      txHash: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      errMsg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {},
  );
  return Model;
};
