const db = require('./connection');
const { Category } = require('../models');

db.once('open', async () => {
    await Category.deleteMany();
  
    const categories = await Category.insertMany([
      { name: 'Automotive' },
      { name: 'Home' },
      { name: 'Electronics' },
      { name: 'Books' },
      { name: 'Toys' },
      { name: 'Furniture' },
      { name: 'miscellaneous' }
    ]);
    console.log('categories seeded');

})