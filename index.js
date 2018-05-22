const express = require('express');
const keys = require('./config/keys');
const mongoose = require('mongoose');
const app = express();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sonjaBabysBucket = 'sonjababys';
const awsKey = keys.amazonAccessKey;

mongoose.connect('mongodb://localhost/sonjababys-dev')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('err ', err));

// Models
require('./models/Product');

// Middlewares
require('./middlewares/bodyParser')(app);
require('./middlewares/handlebars')(app);
require('./middlewares/methodOverride')(app);
require('./middlewares/session')(app);
require('./middlewares/flashMessage')(app);

// Routes
require('./routes/productRoutes')(app);
require('./routes/landingRoutes')(app);
require('./routes/userRoutes')(app);

const port = 5000;
app.listen(port, () => {
  console.log(`We are live on ${port}`);
});