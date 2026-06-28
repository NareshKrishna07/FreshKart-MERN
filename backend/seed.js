require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google's DNS servers
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const Product = require("./models/Product");


const sampleProducts = [
  {
    name: "Fresh Bananas (1 dozen)",
    description: "Farm fresh ripe bananas, rich in potassium. Perfect for breakfast.",
    price: 49,
    category: "Fruits & Vegetables",
    image: "/images/OIP (1).jpeg",
    stock: 100,
  },
  {
    name: "Amul Toned Milk 1L",
    description: "Fresh toned milk pouch, pasteurized and packed hygienically.",
    price: 56,
    category: "Dairy",
    image: "/images/OIP (2).jpeg",
    stock: 80,
  },
  {
    name: "Britannia Brown Bread",
    description: "Healthy whole wheat brown bread, soft and fresh.",
    price: 45,
    category: "Bakery",
    image: "/images/OIP (3).jpeg",
    stock: 60,
  },
  {
    name: "Tata Salt 1kg",
    description: "Iodized salt for daily cooking needs.",
    price: 28,
    category: "Grocery",
    image: "/images/OIP (4).jpeg",
    stock: 150,
  },
  {
    name: "Fortune Sunflower Oil 1L",
    description: "Refined sunflower oil, light and healthy for cooking.",
    price: 145,
    category: "Grocery",
    image: "/images/OIP (5).jpeg",
    stock: 70,
  },
  {
    name: "Maggi 2-Minute Noodles (Pack of 4)",
    description: "Quick and tasty instant noodles, masala flavor.",
    price: 56,
    category: "Snacks",
    image: "/images/OIP (6).jpeg",
    stock: 200,
  },
  {
    name: "Red Apples (1kg)",
    description: "Crisp and juicy red apples, imported quality.",
    price: 180,
    category: "Fruits & Vegetables",
    image: "/images/OIP (7).jpeg",
    stock: 90,
  },
  {
    name: "Onion (1kg)",
    description: "Fresh red onions, essential for everyday cooking.",
    price: 35,
    category: "Fruits & Vegetables",
    image: "/images/OIP (8).jpeg",
    stock: 120,
  },
  {
    name: "Potato (1kg)",
    description: "Farm fresh potatoes, great for curries and fries.",
    price: 30,
    category: "Fruits & Vegetables",
    image: "/images/OIP (9).jpeg",
    stock: 130,
  },
  {
    name: "Tomato (1kg)",
    description: "Fresh and ripe tomatoes for cooking and salads.",
    price: 40,
    category: "Fruits & Vegetables",
    image: "/images/OIP (10).jpeg",
    stock: 100,
  },
  {
    name: "Cadbury Dairy Milk Chocolate",
    description: "Classic creamy milk chocolate bar, 50g.",
    price: 50,
    category: "Snacks",
    image: "/images/OIP (11).jpeg",
    stock: 150,
  },
  {
    name: "Lay's Classic Salted Chips",
    description: "Crispy potato chips with classic salted flavor.",
    price: 20,
    category: "Snacks",
    image: "/images/OIP (12).jpeg",
    stock: 200,
  },
  {
    name: "Real Mixed Fruit Juice 1L",
    description: "100% mixed fruit juice with no added sugar.",
    price: 110,
    category: "Beverages",
    image: "/images/OIP (13).jpeg",
    stock: 60,
  },
  {
    name: "Nescafe Classic Coffee 50g",
    description: "Rich and aromatic instant coffee powder.",
    price: 165,
    category: "Beverages",
    image: "/images/OIP (14).jpeg",
    stock: 50,
  },
  {
    name: "Colgate Strong Teeth Toothpaste",
    description: "Cavity protection toothpaste, 150g pack.",
    price: 89,
    category: "Personal Care",
    image: "/images/OIP (15).jpeg",
    stock: 90,
  },
  {
    name: "Dettol Handwash 200ml",
    description: "Germ protection liquid handwash, original variant.",
    price: 99,
    category: "Personal Care",
    image: "/images/OIP (16).jpeg",
    stock: 75,
  },
  {
    name: "Surf Excel Detergent Powder 1kg",
    description: "Powerful stain removal detergent for all fabrics.",
    price: 130,
    category: "Household",
    image: "/images/OIP (17).jpeg",
    stock: 65,
  },
  {
    name: "Eggs (Pack of 6)",
    description: "Farm fresh eggs, rich in protein.",
    price: 42,
    category: "Dairy",
    image: "/images/OIP (18).jpeg",
    stock: 100,
  },
  {
    name: "Coca-Cola 750ml",
    description: "Refreshing carbonated drink, perfect for any occasion.",
    price: 45,
    category: "Beverages",
    image: "/images/OIP (19).jpeg",
    stock: 80,
  },
  {
    name: "Oreo Original Biscuits 120g",
    description: "Crunchy chocolate biscuits with a creamy center.",
    price: 35,
    category: "Snacks",
    image: "/images/OIP (20).jpeg",
    stock: 150,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // clear existing products first so we don't get duplicates
    await Product.deleteMany({});
    console.log("Old products removed");

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products added successfully!`);

    process.exit();
  } catch (error) {
    console.log("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
