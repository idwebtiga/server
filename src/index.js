// Import packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser')
const { logReqRes } = require('./helpers/ga4');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logReqRes);
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  console.log('cookies');
  console.log(req.cookies);
  if (req.cookies && req.cookies._ga) {
    const cid = req.cookies._ga.substring(6);
    console.log(cid);
  }
  res.sendFile(path.join(__dirname, '../public/hello.html'));
});

require('./routes/messages.routes')(app);
require('./routes/users.routes')(app);
require('./routes/topups.routes')(app);
require('./routes/transactions.routes')(app);
require('./routes/payments.routes')(app);

module.exports = app;
