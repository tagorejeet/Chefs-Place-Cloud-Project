import fs from "fs";
import { cloudant, dbName } from "../config/db.js"; // Cloudant config

// ➕ Add food item
const addFood = async (req, res) => {
  const image_filename = `${req.file.filename}`;

  const food = {
    name: req.body.name,
    description: req.body.description,
    price: Number(req.body.price),
    category: req.body.category,
    image: image_filename,
    type: "food"
  };

  try {
    await cloudant.postDocument({
      db: dbName,
      document: food
    });

    res.json({ success: true, message: "Food added" });
  } catch (error) {
    console.error("❌ Error adding food:", error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// 📋 List all food items
const listFood = async (req, res) => {
  try {
    const result = await cloudant.postFind({
      db: dbName,
      selector: {
        type: "food"
      }
    });

    // ✅ Wrap the response in a consistent structure
    res.json({
      success: true,
      data: result.result.docs
    });
  } catch (error) {
    console.error("❌ Error listing food:", error);
    res.status(500).json({ success: false, message: "Error fetching food list" });
  }
};

// ❌ Remove a food item
const removeFood = async (req, res) => {
  try {
    // Step 1: Get the food item (_rev is needed for deletion)
    const food = await cloudant.getDocument({
      db: dbName,
      docId: req.body.id
    });

    // Step 2: Delete image from disk
    fs.unlink(`uploads/${food.result.image}`, () => {});

    // Step 3: Delete from Cloudant
    await cloudant.deleteDocument({
      db: dbName,
      docId: req.body.id,
      rev: food.result._rev
    });

    res.json({ success: true, message: "Food removed" });
  } catch (error) {
    console.error("❌ Error removing food:", error);
    res.status(500).json({ success: false, message: "Error removing food" });
  }
};

export { addFood, listFood, removeFood };
