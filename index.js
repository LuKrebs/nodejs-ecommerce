const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const keys = require('./config/keys');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sonjaBabysBucket = 'sonjababys';
const awsKey = keys.amazonAccessKey;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/sonjababys-dev')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('err ', err));

require('./models/Product');
const Product = mongoose.model('products');

// Middlewares
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(flash());
app.use(session({
  secret: 'sonjababysecret',
  resave: true,
  saveUninitialized: true
}));

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.get('/', (req, res) => {
  const title = "Sonja Baby's Acessórios";
  res.render('index', {
    title: title
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/products/new', (req, res) => {
  res.render('products/new');
});

app.get('/products/edit/:id', (req, res) => {
  Product.findById(req.params.id)
    .then(product => {
      res.render('products/edit', {
        product: product
      });
    });
});

app.put('/products/:id', (req, res) => {
  const { name, description, noDiscountPrice, discountPrice, qty, category } = req.body;
  Product.findById(req.params.id)
    .then(product => {
      product.name = name;
      product.description = description;
      product.noDiscountPrice = noDiscountPrice;
      product.discountPrice = discountPrice;
      product.qty = qty;
      product.category = category;
      
      product
        .save()
        .then(() => {
          req.flash('success_msg', 'Produto atualizado');
          res.redirect('/products');
        });
    });
});

app.delete('/products/:id', (req, res) => {  
  Product.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Produto removido');
      res.redirect('/products');
    });
});

app.get('/products', (req, res) => {
  Product.find()
    .sort({ category: 'desc' })
    .then(products => {
      res.render('products/index', {
        products: products
      });
    })
});

app.post('/products', (req, res) => {
  console.log(req.body);
  let errors = [];

  if (!req.body.name) {
    errors.push({ text: 'Nome é um campo obrigatório'});
  }
  if (!req.body.description) {
    errors.push({ text: 'Descrição é um campo obrigatório'});
  }

  if (errors.length > 0) {
    res.render('products/new', {
      errors: errors,
      name: req.body.name,
      description: req.body.description
    });
  } else {
    console.log(req.body);
    const { price, noDiscountPrice, discountPrice, category, qty } = req.body;
    new Product(req.body)
      .save()
      .then(() => {
        req.flash('success_msg', 'Produto adicionado');
        res.redirect('/products');
      });
  }

});

const port = 5000;
app.listen(port, () => {
  console.log(`We are live on ${port}`);
});