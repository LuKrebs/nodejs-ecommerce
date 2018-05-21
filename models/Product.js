const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  noDiscountPrice: {
    type: String,
    required: true
  },
  discountPrice: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  photos: {
    type: [String],
    default: []
  }
});

mongoose.model('products', productSchema);