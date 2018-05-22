const mongoose = require('mongoose');
const Product = mongoose.model('products');

module.exports = app => {

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
      errors.push({ text: 'Nome é um campo obrigatório' });
    }
    if (!req.body.description) {
      errors.push({ text: 'Descrição é um campo obrigatório' });
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

};