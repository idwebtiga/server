module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define(
    'topups',
    {
      userId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      invoiceId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      fee: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      uniqueCode: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      total: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      confirmDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cancelDate: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      toAddress: {
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
    },
    {},
  );
  return Model;
};
