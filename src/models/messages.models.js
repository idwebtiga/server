module.exports = (sequelize, Sequelize) => {
  const Model = sequelize.define(
    'messages',
    {
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {},
  );
  return Model;
};
