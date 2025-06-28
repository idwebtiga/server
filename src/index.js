// Import packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser')
const { swaggerUi, swaggerSpec } = require('./swagger');

// Middlewares
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

require('./routes/public.routes')(app);
require('./routes/messages.routes')(app);
require('./routes/users.routes')(app);
require('./routes/topups.routes')(app);
require('./routes/transactions.routes')(app);
require('./routes/payments.routes')(app);

module.exports = app;
