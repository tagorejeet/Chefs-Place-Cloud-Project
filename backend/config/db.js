import { CloudantV1 } from '@ibm-cloud/cloudant';
import { IamAuthenticator } from 'ibm-cloud-sdk-core';
import 'dotenv/config';

export let cloudant;
export const dbName = process.env.CLOUDANT_DB;
export const usersDbName = process.env.USERS_DB || "users";

export const connectDB = async () => {
  console.log("➡️ connectDB() called"); // ✅ Log at the start

  try {
    const authenticator = new IamAuthenticator({
      apikey: process.env.CLOUDANT_API_KEY,
    });

    cloudant = CloudantV1.newInstance({ authenticator });
    cloudant.setServiceUrl(process.env.CLOUDANT_URL);

    console.log("✅ Cloudant client initialized in connectDB:", cloudant);

    const dbsResult = await cloudant.getAllDbs();
    console.log("✅ getAllDbs() result:", dbsResult);

    if (!dbsResult.result.includes(dbName)) {
      const createDbResult = await cloudant.putDatabase({ db: dbName });
      console.log(`✅ Created Cloudant DB: ${dbName}`, createDbResult);
    } else {
      console.log(`✅ DB ${dbName} already exists`);
    }

    if (!dbsResult.result.includes(usersDbName)) {
      const createUsersDbResult = await cloudant.putDatabase({ db: usersDbName });
      console.log(`✅ Created Cloudant DB: ${usersDbName}`, createUsersDbResult);
    } else {
      console.log(`✅ DB ${usersDbName} already exists`);
    }

    console.log("✅ Connected to Cloudant");
  } catch (err) {
    console.error("❌ Cloudant connection failed:", err);
  } finally {
    console.log("⬅️ connectDB() finished. cloudant value:", cloudant); // ✅ Log at the end
  }
};