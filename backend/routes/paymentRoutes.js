const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// setting up razorpay instance with our keys from .env
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/create-order
// @desc    Create a razorpay order (this happens BEFORE actual payment)
// @access  Private (must be logged in)
router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees coming from frontend

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      // razorpay needs amount in paise, so multiply by 100
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // frontend needs this to open checkout
    });
  } catch (error) {
    console.log("Razorpay order creation error:", error.message);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify the payment signature after user pays
// @access  Private
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // this is how razorpay wants us to verify the signature
    // we create a hash using order_id + payment_id and our secret key
    // then compare it with the signature razorpay sent us
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Payment verification failed", verified: false });
    }

    res.status(200).json({ message: "Payment verified successfully", verified: true });
  } catch (error) {
    console.log("Payment verification error:", error.message);
    res.status(500).json({ message: "Server error during payment verification" });
  }
});

module.exports = router;
