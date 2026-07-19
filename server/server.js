import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import productRoutes from './routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });
await connectDB();
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (serviceAccountPath) {
  try {
    const fullPath = resolve(__dirname, serviceAccountPath);
    const serviceAccount = JSON.parse(readFileSync(fullPath, 'utf8'));
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase Admin initialized');
  } catch (err) {
    console.warn('Firebase Admin init failed:', err.message);
  }
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

// Auto-seed if empty
const count = await Product.countDocuments();
if (count === 0) {
  const { default: products } = await import('./seedData.js');
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
