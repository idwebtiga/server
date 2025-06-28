require('dotenv').config();
const app = require(`./index.js`);
const port = process.env.PORT | 3000;
const { setAdminPassword } = require('./controllers/users.controllers.js');

app.listen(port, async () => {
  console.log(`Localhost app listening on port ${port}`);
  await setAdminPassword(process.env.ADMIN_PASSWORD);
});
