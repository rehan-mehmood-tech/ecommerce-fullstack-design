import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/products
 * Query params: ?search=<term>&category=<cat>
 * Returns all products, optionally filtered by search term or category
 */
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      // Case-insensitive partial match on name or description
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      filter.category = { $regex: category, $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/products/:id
 * Returns a single product by its MongoDB _id
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST /api/products
 * Protected — requires valid Firebase ID token in Authorization header
 * Creates a new product
 */
router.post('/', authMiddleware, async (req, res) => {
  const { name, price, image, description, category, stock } = req.body;
  try {
    const product = new Product({ name, price, image, description, category, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * PUT /api/products/:id
 * Protected — updates an existing product by _id
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * DELETE /api/products/:id
 * Protected — deletes a product by _id
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
