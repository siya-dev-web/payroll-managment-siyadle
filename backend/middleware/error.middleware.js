import { sendError } from "../utils/response.js";

/**
 * 404 handler — must be registered AFTER all routes.
 */
export function notFoundHandler(req, res) {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

/**
 * Global error handler — must be registered last with four parameters.
 * @param {Error} err
 */
export function errorHandler(err, _req, res, _next) {
  console.error("💥 Unhandled error:", err);

  // MySQL duplicate entry
  if (err.code === "ER_DUP_ENTRY") {
    return sendError(res, 409, "A record with that value already exists.");
  }

  // MySQL foreign key violation
  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return sendError(res, 400, "Referenced record does not exist.");
  }

  // JWT errors forwarded from middleware
  if (err.name === "JsonWebTokenError") {
    return sendError(res, 401, "Invalid token.");
  }
  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, "Token has expired.");
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error.";
  return sendError(res, statusCode, message);
}
