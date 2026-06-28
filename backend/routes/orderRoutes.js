const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/orders
// @desc    Place a new order (ONLY after payment is verified)
// @access  Private (must be logged in)
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentInfo, paymentStatus } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // we only allow order creation if payment was actually marked as paid
    // this is checked again on frontend before calling this route
    if (paymentStatus !== "paid") {
      return res.status(400).json({ message: "Payment not completed, cannot place order" });
    }

    const newOrder = await Order.create({
      user: req.user.id, // comes from the JWT token via protect middleware
      items,
      totalAmount,
      shippingAddress,
      paymentInfo,
      paymentStatus,
    });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.log("Order creation error:", error.message);
    res.status(500).json({ message: "Server error while placing order" });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in user's order history
// @access  Private
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.log("Get orders error:", error.message);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
});

module.exports = router;
