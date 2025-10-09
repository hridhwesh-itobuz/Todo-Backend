import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const uri_pass = process.env.MONGO_PASS;

const uri = `mongodb+srv://hridhwesh_db_user:${uri_pass}@cluster0.ad3z5gu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export default async function connectDB() {
  try {
    await mongoose.connect(uri);

    console.log('MongoDB connected successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
