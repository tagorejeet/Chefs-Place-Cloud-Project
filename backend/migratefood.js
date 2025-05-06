import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log("MONGO_URL:", process.env.MONGO_URL);

const { cloudant, dbName } = await import('./config/db.js');

const Food = mongoose.model('Food', new mongoose.Schema({}, { strict: false }));

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

async function migrateData() {
  try {
    await connectToMongoDB();

    const foodItems = await Food.find();
    console.log(`✅ Found ${foodItems.length} food items in MongoDB`);

    if (foodItems.length === 0) {
      console.warn("⚠️ No food items found in MongoDB.");
      return;
    }

    // Format and sanitize documents
    const sanitizedDocs = foodItems.map(food => {
      const obj = food.toObject();
      obj._id = obj._id.toString(); // Cloudant needs string _id
      delete obj.__v;
      return obj;
    });

    // Migrate in bulk
    const response = await cloudant.postBulkDocs({
      db: dbName,
      bulkDocs: { docs: sanitizedDocs }
    });

    console.log("🎉 Migration to Cloudant successful:", response.result);
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
  } finally {
    try {
      await mongoose.connection.close();
    } catch (closeErr) {
      console.error("Error closing MongoDB connection", closeErr);
    }
  }
}

migrateData();
