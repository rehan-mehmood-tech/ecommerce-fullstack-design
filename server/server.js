import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import Product from './models/Product.js';
import productRoutes from './routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

let serviceAccount = null;
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountRaw) {
  try {
    serviceAccount = JSON.parse(serviceAccountRaw);
  } catch (err) {
    console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT env var:', err.message);
  }
} else if (serviceAccountPath) {
  try {
    const fullPath = resolve(__dirname, serviceAccountPath);
    serviceAccount = JSON.parse(readFileSync(fullPath, 'utf8'));
  } catch (err) {
    console.warn('Failed to read service account file:', err.message);
  }
}

if (serviceAccount) {
  try {
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

const count = await Product.countDocuments();
if (count === 0) {
  const { default: products } = await import('./seedData.js');
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
}

const PORT = process.env.PORT || 5000;
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
