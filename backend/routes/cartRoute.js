import { verifyToken } from "../middleware/auth.js"; // ✅ Correct named import
import express from 'express';
const router = express.Router();

// Example route to get all items in the cart (requires authentication)
router.get('/items', verifyToken, async (req, res) => {
  try {
    // Assuming you have a way to fetch cart items based on the authenticated user (req.user)
    // You might need a Cart model or interact with a database here
    const cartItems = [
      { id: 1, name: 'Item 1', quantity: 2 },
      { id: 2, name: 'Item 2', quantity: 1 },
      // ... more items based on user
    ];
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Example route to add an item to the cart (requires authentication)
router.post('/items', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.sub; // Assuming 'sub' contains the user ID from the token

    // Logic to add the item to the user's cart in your database
    // You would likely interact with a Cart model or database here
    console.log(`Adding product ${productId} (qty: ${quantity}) to cart of user ${userId}`);
    res.status(201).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Example route to update the quantity of an item in the cart (requires authentication)
router.put('/items/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.sub;

    // Logic to update the quantity in the user's cart in your database
    console.log(`Updating item ${itemId} (qty: ${quantity}) in cart of user ${userId}`);
    res.json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// Example route to remove an item from the cart (requires authentication)
router.delete('/items/:itemId', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.sub;

    // Logic to remove the item from the user's cart in your database
    console.log(`Removing item ${itemId} from cart of user ${userId}`);
    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

export default router;