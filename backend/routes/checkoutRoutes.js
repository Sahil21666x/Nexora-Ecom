import express from 'express';
const router = express.Router();
import Checkout from '../model/Checkout.js';
import User from '../model/User.js';



// api endpoint for checkout
router.post("/", async (req, res) => {
  try {
    const {
      shippingInfo,
      deliveryMethod,
      paymentMethod,
      cartItems,
      subtotal,
      deliveryCost,
      taxes,
      total,
    } = req.body;

    // Validate required fields
    if (!shippingInfo || !cartItems || !subtotal || !total) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

      const user = await User.findOne({});
          if (!user) return res.status(404).json({ message: "User not found" });

    // Create new order
    const order = new Checkout({
      userId: user._id ,
      shippingInfo,
      items: cartItems,
      deliveryMethod,
      paymentMethod,
      subtotal,
      deliveryCost,
      taxes,
      total,
      status: "pending",
    });

    // Save order to database
    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
});

export default router;