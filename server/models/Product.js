const mongoose = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  image: {
    type: String,
    trim: true,
    default: 'defaultimg.png'
  },
  price: {
    type: Number,
    required: true,
    trim: true,
    min: 0.99
  },
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: timestamp => dateFormat(timestamp)
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'//,
    //required: true
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  sold: {
    type: Boolean,
    default: false
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
