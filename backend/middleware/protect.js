
const jwt = require("jsonwebtoken");
const pool = require("../db/connections");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Not authorized, no token provided", });}

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      "SELECT id, email FROM users WHERE id = $1",
      [decoded.id] );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "User no longer exists",});}

    req.user = result.rows[0];

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, invalid or expired token",
    });
  }
};

module.exports = protect;
