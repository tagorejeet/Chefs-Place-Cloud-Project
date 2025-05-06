import { findUserByEmail, registerUser as saveUserToCloudant } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { cloudant, dbName } from "../config/db.js"; // Add this line if not already present

// 👤 IBM App ID Callback Controller
export const handleAppIDCallback = async (req, res) => {
  const { name, email, sub } = req.user; // sub is unique user id from App ID

  try {
    let user = await findUserByEmail(email);

    if (!user) {
      const newUser = {
        _id: sub,
        name,
        email,
        provider: "appid"
      };
      await saveUserToCloudant(newUser);
    }

    // Redirect to frontend with success (or token, optional)
    res.redirect("http://localhost:3000"); // Adjust to your frontend
  } catch (error) {
    console.error("Error during App ID callback:", error);
    res.status(500).json({ error: "Error handling App ID callback" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await findUserByEmail(email);
  
    if (user && user.password === password) {  // Compare passwords (you should hash passwords in production)
      // Create a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Error logging in user" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const response = await cloudant.postFind({
      db: dbName,
      selector: { type: "user" }
    });

    res.json(response.result.docs);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = {
      name,
      email,
      password,
      _id: new Date().toISOString()
    };

    await saveUserToCloudant(newUser);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};

