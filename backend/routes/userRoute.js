import express from "express";
import {
  loginUser,
  registerUser,
  handleAppIDCallback,
  getAllUsers // optional
} from "../controllers/userController.js";

const userRouter = express.Router();

// Manual registration
userRouter.post("/register", async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error("Error in registration route:", error);
    res.status(500).json({ error: "Error processing registration request" });
  }
});

// Manual login
userRouter.post("/login", async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ error: "Error processing login request" });
  }
});

// IBM App ID callback route (called after login)
userRouter.get("/appid/callback", handleAppIDCallback);

// Optional route to get all users (for admin panel/debugging)
userRouter.get("/all", getAllUsers);

export default userRouter;
