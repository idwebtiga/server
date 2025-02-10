module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define(
    'users',
    {
      userName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      walletAddress: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {},
  );
  return Model;
};
