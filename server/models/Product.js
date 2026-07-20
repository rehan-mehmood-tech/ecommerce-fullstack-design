import getDb from '../config/db.js';

const col = () => getDb().collection('products');

const normalizeDoc = (doc) => {
  if (!doc.exists) return null;
  const data = doc.data();
  // Convert Firestore Timestamps to ISO strings
  if (data.createdAt && typeof data.createdAt.toDate === 'function') data.createdAt = data.createdAt.toDate().toISOString();
  if (data.updatedAt && typeof data.updatedAt.toDate === 'function') data.updatedAt = data.updatedAt.toDate().toISOString();
  return { _id: doc.id, ...data };
};

const Product = {
  async find(filter = {}) {
    const { search, category } = filter;
    let query = col().orderBy('createdAt', 'desc');

    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }
    const snapshot = await query.get();
    let products = snapshot.docs.map(normalizeDoc);

    if (search) {
      const term = search.toLowerCase();
      products = products.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.category?.toLowerCase().includes(term)
      );
    }
    return products;
  },

  async findById(id) {
    const doc = await col().doc(id).get();
    return normalizeDoc(doc);
  },

  async create(data) {
    const now = new Date().toISOString();
    const docRef = await col().add({
      name: data.name, price: data.price, image: data.image,
      description: data.description, category: data.category,
      stock: data.stock, createdAt: now, updatedAt: now
    });
    const doc = await docRef.get();
    return normalizeDoc(doc);
  },

  async findByIdAndUpdate(id, data) {
    await col().doc(id).update({ ...data, updatedAt: new Date().toISOString() });
    return this.findById(id);
  },

  async findByIdAndDelete(id) {
    const doc = await col().doc(id).get();
    if (!doc.exists) return null;
    await col().doc(id).delete();
    return normalizeDoc(doc);
  },

  async countDocuments() {
    const snapshot = await col().get();
    return snapshot.size;
  },

  async deleteMany() {
    const snapshot = await col().get();
    const batch = getDb().batch();
    snapshot.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  },

  async insertMany(items) {
    const batch = getDb().batch();
    const now = new Date().toISOString();
    const results = [];
    for (const item of items) {
      const docRef = col().doc();
      batch.set(docRef, {
        name: item.name, price: item.price, image: item.image,
        description: item.description, category: item.category,
        stock: item.stock, createdAt: now, updatedAt: now
      });
      results.push({ _id: docRef.id, ...item, createdAt: now, updatedAt: now });
    }
    await batch.commit();
    return results;
  }
};

export default Product;
