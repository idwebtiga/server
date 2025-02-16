const pg = require('pg');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: { ssl: { require: true } },
  dialectModule: pg,
  dialect: 'postgres',
});
// fix vercel deployment:
// https://stackoverflow.com/questions/76647645/getting-error-error-please-install-pg-package-manually-when-using-sequelize-w
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// const Op = db.Sequelize.Op;

db.payments = require('./payments.models.js')(sequelize, Sequelize);
db.transactions = require('./transactions.models.js')(sequelize, Sequelize);
db.topups = require('./topups.models.js')(sequelize, Sequelize);
db.users = require('./users.models.js')(sequelize, Sequelize);
db.messages = require('./messages.models.js')(sequelize, Sequelize);

module.exports = db;
