require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: { ssl: { require: true } },
  },
};

// export NODE_ENV=development
// https://stackoverflow.com/questions/46694157/dialect-needs-to-be-explicitly-supplied-as-of-v4-0-0