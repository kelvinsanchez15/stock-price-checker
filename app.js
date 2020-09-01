const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const apiRouter = require('./routers/api');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connection to the database and error handling
// const url =
//   process.env.NODE_ENV === 'production'
//     ? process.env.DB_URI
//     : 'mongodb://127.0.0.1:27017/stockPriceCheckerDB';

// mongoose
//   .connect(url, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .catch((error) => console.log(error));

// mongoose.connection.on('error', (error) => console.log(error));

// Main route defined
app.get('/', (req, res) => res.sendFile(`${process.cwd()}/views/index.html`));

// Routing for API
app.use('/api/stock-prices', apiRouter);

module.exports = app;
