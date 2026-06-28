const jwt = require("jsonwebtoken");

// This middleware checks if the request has a valid JWT token
// It is used to protect routes like placing an order
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "Not authorized, no token found" });
  }

  try {
    // token looks like "Bearer xxxxx" so we split and take the second part
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request so next routes can use it
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = protect;
