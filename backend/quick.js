import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const adminDb = client.db().admin();

    const dbs = await adminDb.listDatabases();
    console.log("📂 Found databases:");

    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();

      const foodCol = collections.find(c => c.name === 'foods');
      if (foodCol) {
        const count = await db.collection('foods').countDocuments();
        console.log(`🍱 '${dbInfo.name}.foods' has ${count} documents`);
      }
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await client.close();
  }
}

run();
