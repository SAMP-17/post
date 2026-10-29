import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');
    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas connected:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}
