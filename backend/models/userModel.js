// models/userModel.js
import { cloudant, dbName } from "../config/db.js";

// Find user by email
export const findUserByEmail = async (email) => {
  try {
    const response = await cloudant.postFind({
      db: dbName,
      selector: {
        type: "user", // Identify user documents
        email
      }
    });

    return response.result.docs[0] || null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Find user by ID (for App ID users, _id = sub)
export const findUserById = async (userId) => {
  try {
    const response = await cloudant.getDocument({
      db: dbName,
      docId: userId
    });

    return response.result || null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    throw error;
  }
};

// Register or save user (manual or App ID)
export const registerUser = async (userData) => {
  const newUser = {
    ...userData,
    _id: userData._id || new Date().toISOString(),
    cartData: userData.cartData || {},
    type: "user"
  };

  try {
    const response = await cloudant.postDocument({
      db: dbName,
      document: newUser
    });

    return response.result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Update user's cart data
export const updateUserCart = async (userId, cartData) => {
  try {
    const currentDoc = await cloudant.getDocument({
      db: dbName,
      docId: userId
    });

    const updatedDoc = {
      ...currentDoc.result,
      cartData
    };

    const response = await cloudant.putDocument({
      db: dbName,
      docId: userId,
      document: updatedDoc
    });

    return response.result;
  } catch (error) {
    console.error("Error updating cart:", error);
    throw error;
  }
};
