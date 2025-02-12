require('dotenv').config();
const app = require(`./index.js`);
const port = process.env.PORT | 3000;
const db = require("./models");

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
  db.sequelize.sync({ alter: true });
});
