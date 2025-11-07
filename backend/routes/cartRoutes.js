import express from "express";
import User from "../model/User.js";
import Cart from "../model/Cart.js";

const router = express.Router();

//  Get Cart items
router.get("/", async (req, res) => {
    try {
        const user = await User.findOne({});
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) return res.json({ data: [], message: "Cart is empty" });

        res.json({ data: cart, message: "Cart fetched successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//  Add item to cart
router.post("/", async (req, res) => {
    try {
        const { productId, name, price, quantity,image } = req.body;

        console.log(req.body);
        

        const user = await User.findOne({});

        if (!user) return res.status(404).json({ message: "User not found" });

        let cart = await Cart.findOne({ userId: user._id });

        if (!cart) {
            // Create new cart
            cart = new Cart({
                userId: user._id,
                items: [{ productId, name, price, quantity,image }],
            });
        } else {
            // Check if product already in cart
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity || 1; // increase quantity
            } else {
                cart.items.push({ productId, name, price, quantity ,image});
            }
        }

        await cart.save();
        res.status(201).json({ message: "Item added to cart successfully", data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// UPDATE cart item quantity
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity} = req.body; // Assuming you send userId in request body
    
     const user = await User.findOne({});
      if (!user) return res.status(404).json({ message: "User not found" });

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1"
      });
    }
    
    let cart = await Cart.findOne({ userId: user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found for this user"
      });
    }

    // Find the item in cart items
    const itemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId.toString()
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart"
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;

    // Save the updated cart
    const updatedCart = await cart.save();

    res.json({
      success: true,
      message: "Quantity updated successfully",
      data: updatedCart
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({
      success: false,
      message: "Error updating cart"
    });
  }
});

//  Remove item from cart (optional)
router.delete("/:productId", async (req, res) => {
    try {
        const user = await User.findOne({});
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await Cart.findOne({ userId: user._id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== req.params.productId
        );

        await cart.save();
        res.json({ message: "Item removed from cart successfully", data: cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
