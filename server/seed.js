import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';
import products from './seedData.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products successfully`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
