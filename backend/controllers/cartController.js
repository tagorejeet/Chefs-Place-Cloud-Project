import {
    findUserById,
    updateUserCart
  } from "../models/userModel.js";
  
  // Add item to cart
  const addToCart = async (req, res) => {
    try {
      const userData = await findUserById(req.body.userId);
      let cartData = userData.cartData || {};
  
      if (!cartData[req.body.itemId]) {
        cartData[req.body.itemId] = 1;
      } else {
        cartData[req.body.itemId] += 1;
      }
  
      await updateUserCart(req.body.userId, cartData);
  
      res.json({ success: true, message: "Added to Cart" });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error adding to cart" });
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (req, res) => {
    try {
      const userData = await findUserById(req.body.userId);
      let cartData = userData.cartData || {};
  
      if (cartData[req.body.itemId] > 0) {
        cartData[req.body.itemId] -= 1;
      }
  
      await updateUserCart(req.body.userId, cartData);
  
      res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error removing from cart" });
    }
  };
  
  // Get cart
  const getCart = async (req, res) => {
    try {
      const userData = await findUserById(req.body.userId);
      const cartData = userData.cartData || {};
      res.json({ success: true, cartData });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Error fetching cart" });
    }
  };
  
  export { addToCart, removeFromCart, getCart };
  