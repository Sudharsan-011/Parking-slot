const jwt = require("jsonwebtoken");
exports.authMiddleWare = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Token received:", token);
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};

exports.ownerOnly = (req, res, next) => {
  if (req.user.role !== "owner")
    return res.status(403).json({ error: "Access denied" });
  next();
};
