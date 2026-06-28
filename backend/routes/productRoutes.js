const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products (anyone can view, no login needed)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.log("Get products error:", error.message);
    res.status(500).json({ message: "Server error while fetching products" });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Get product error:", error.message);
    res.status(500).json({ message: "Server error while fetching product" });
  }
});

module.exports = router;
