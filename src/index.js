// Import packages
const express = require('express');
const cors = require('cors');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('v1.0.1');
});

require('./routes/messages.routes')(app);
require('./routes/users.routes')(app);
require('./routes/topups.routes')(app);
require('./routes/transactions.routes')(app);

module.exports = app;
