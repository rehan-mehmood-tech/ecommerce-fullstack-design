import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import products from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const seed = async () => {
  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
    let serviceAccount = null;

    if (serviceAccountRaw) {
      serviceAccount = JSON.parse(serviceAccountRaw);
    } else if (serviceAccountPath) {
      const fullPath = resolve(__dirname, serviceAccountPath);
      serviceAccount = JSON.parse(readFileSync(fullPath, 'utf8'));
    }

    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase Admin initialized');

    await Product.deleteMany();
    console.log('Cleared existing products');

    const inserted = await Product.insertMany(products);
    console.log(`Seeded ${inserted.length} products successfully`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
