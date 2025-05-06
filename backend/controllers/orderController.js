import { cloudant, dbName } from "../config/db.js";
import { updateUserCart } from "../models/userModel.js";

// 🛒 Place order (from frontend)
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    // 1. Create a new order document
    const newOrder = {
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      type: "order", // helpful for filtering
      createdAt: new Date().toISOString()
    };

    await cloudant.postDocument({
      db: dbName,
      document: newOrder
    });

    // 2. Clear the user's cart
    await updateUserCart(req.body.userId, {});

    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.error("❌ Error placing order:", error);
    res.json({ success: false, message: "Error placing order" });
  }
};

export { placeOrder };
