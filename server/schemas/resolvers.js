const { AuthenticationError } = require('apollo-server-express');
const { User, Product, Category, Order } = require('../models');
const { signToken } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

const resolvers = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    me: async (parent, args, context) => {
        if (context.user) {
          const userData = await User.findOne({ _id: context.user._id })
            .select('-__v -password')
            .populate('products')
            .populate({
              path:'products',
              populate: 'category'
            })
            .populate('following')
            .populate('messages')
            .populate('sold')
            .populate({
              path: 'sold',
              populate: 'category'
            })
            .populate({
              path: 'orders.products',
              populate: 'category'
            });
       
          return userData;
        }
      
        throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find().populate('products');
    },
    user: async (parent, {username}) => { 
      const user = await (await User.findOne({ username })
        .populate('products')
        .populate({
          path:'products',
          populate: 'category'
        })
        .populate('following')
        .populate('messages')
        .populate('sold')
        .populate({
          path: 'sold',
          populate: 'category'
        })
        .populate({
          path: 'orders.products',
          populate: 'category'
        })); 

      return user
    },
    allProducts: async (parent, { sold } ) => {
      const products = await Product.find( { sold: false } );
      return products;
    },
    products: async ( parent, { category, name }) => {
        const params = {};
        if (category){
            params.category = category;
        }

        if (name) {
            params.name = {
                $regex: name
            }
        }

        return await Product.find(params).populate('category').populate('seller');
    },
    product: async (parent, { _id }) => {
        return await (await Product.findById(_id)).populate('category').populate('seller');
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: args.products });
      const line_items = [];

      const { products } = await order.populate('products').execPopulate();

      for (let i = 0; i < products.length; i++) {
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/uploads/${products[i].image}`]
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: products[i].price * 100,
          currency: 'usd',
        });

        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });

      return { session: session.id };
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
        const user = await User.create(args);
        const token = signToken(user);
      
        return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
      
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
      
        const correctPw = await user.isCorrectPassword(password);
      
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
      
        const token = signToken(user);
        return { token, user };
    },
    addProduct: async (parent, args, { user }) => {
      if (user){
        const product = await (await Product.create({ ...args, seller: user._id })).populate('seller').populate('category');

        await User.findByIdAndUpdate(
          { _id: user._id},
          { $push: { products: product }},
          { new: true }
        );
        return product;
        
    }

      throw new AuthenticationError('Log in!');
    },
    removeProduct: async (parent, { _id }, { user }) => {
      if(user){
        const product = await Product.findOne({ _id });

        await User.findByIdAndUpdate(
          { _id: user._id},
          { $pull: { products: product._id}},
          { new: true }
        );

        await Product.findByIdAndDelete( _id );
        return product;
      }
      throw new AuthenticationError('Log in!');
    },
    addFollow: async (parent, { followId }, { user }) => {
      if(user){
        const follow = await User.findByIdAndUpdate(
          { _id: user._id },
          { $addToSet: { following: followId } },
          { new: true }
        ).populate('following');

        return follow;
      }
      throw new AuthenticationError('Log in!');
    },
    removeFollow: async (parent, { followId }, { user }) => {
      if(user){
        const follow = await User.findByIdAndUpdate(
          { _id: user._id },
          { $pull: { following: followId } },
          { new: true }
        ).populate('following');

        return follow;
      }
      throw new AuthenticationError('Log in!');
    },
    sold: async (parent, { _id }, { user }) => {
      if(user){
        const product = await Product.findByIdAndUpdate(
            { _id },
            { sold: true },
            { new: true }
          );

        return product;
      }
      throw new AuthenticationError('Log in!');
    },
    addOrder: async (parent, { products }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ products });

        await Product.findByIdAndUpdate(
          { _id: products },
          { sold: true },
          { new: true }
        )

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        await User.findByIdAndUpdate()

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
  }
};

module.exports = resolvers;