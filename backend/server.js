import express from "express";
import cors from "cors";
import { connectDB, usersDbName } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import appIDSetup from "./middleware/auth.js";
import passport from "passport";
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

appIDSetup(app);

async function startServer() {
  console.log("About to call connectDB...");
  await connectDB();
  console.log("connectDB finished.");

  const { cloudant } = await import("./config/db.js");
  console.log("cloudant after dynamic import:", cloudant);

  if (!cloudant) {
    console.error("🚨 cloudant is still undefined after connectDB!");
    return;
  }

  // Helper function to get or create user in Cloudant
  const getOrCreateUser = async (profile) => {
    try {
      const userId = profile.email;

      try {
        const userDoc = await cloudant.getDocument({
          db: usersDbName,
          docId: userId,
        });

        // Update lastLogin timestamp
        await cloudant.putDocument({
          db: usersDbName,
          docId: userId,
          document: {
            ...userDoc.result,
            lastLogin: new Date().toISOString(),
          },
        });

        return userDoc.result;
      } catch (err) {
        if (err.status === 404) {
          const newUser = {
            _id: userId,
            email: profile.email,
            name: profile.name,
            provider: "appid",
            signUpTimestamp: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          };

          await cloudant.postDocument({
            db: usersDbName,
            document: newUser,
          });

          return newUser;
        } else {
          throw err;
        }
      }
    } catch (error) {
      console.error("Error in getOrCreateUser:", error);
      throw error;
    }
  };

  // Routes
  app.use("/api/food", foodRouter);
  app.use("/images", express.static("uploads"));
  app.use("/api/user", userRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/order", orderRouter);

  // App ID Auth Routes
  app.get("/appid/login", passport.authenticate("appid"));

  app.get("/appid/callback",
    passport.authenticate("appid", { failureRedirect: "/" }),
    async (req, res) => {
      try {
        const userProfile = req.user;
        const user = await getOrCreateUser(userProfile);
        res.redirect("http://localhost:3000");
      } catch (error) {
        console.error("Error during callback:", error);
        res.status(500).send("Authentication Error");
      }
    }
  );

  // Health check
  app.get("/", (req, res) => {
    res.send("API Working ✅");
  });

  app.listen(port, () => {
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
}

startServer();
