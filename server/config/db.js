import mongoose from 'mongoose';

const connectDB = async () => {
  // Try real MongoDB first
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB Connected');
    return;
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    console.log('Starting in-memory MongoDB...');
  }

  // Fallback to mongodb-memory-server
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;
    await mongoose.connect(uri);
    console.log('MongoDB Memory Server Connected');
  } catch (memErr) {
    console.error('Failed to start MongoDB Memory Server:', memErr.message);
    process.exit(1);
  }
};

export default connectDB;
