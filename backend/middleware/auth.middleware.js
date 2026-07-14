import { verifyToken } from "../utils/jwt.js";
import { sendError } from "../utils/response.js";
import pool from "../config/db.js";

/**
 * Protect a route — verifies the Bearer JWT and attaches the user to req.user.
 */
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "No token provided. Authorization denied.");
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const [rows] = await pool.execute(
      "SELECT id, full_name, email, is_verified FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) {
      return sendError(res, 401, "User belonging to this token no longer exists.");
    }

    req.user = rows[0];
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return sendError(res, 401, "Token has expired. Please log in again.");
    }
    if (err.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid token. Authorization denied.");
    }
    return next(err);
  }
}
