const mongoose = require('mongoose');

const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const Order = require('./Order');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  first: {
    type: String,
    trim: true
  },
  last: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  image: {
    type: String,
    trim: true,
    default: 'defaultProfile.png'
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  orders: [Order.schema],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],
  products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
  sold: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
});

// set up pre-save middleware to create password
userSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
