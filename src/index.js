// Import packages
const express = require('express');
const cors = require('cors');
const path = require('path');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.send('OK')
});

require('./routes/messages.routes')(app);
require('./routes/users.routes')(app);
require('./routes/topups.routes')(app);
require('./routes/transactions.routes')(app);

module.exports = app;
