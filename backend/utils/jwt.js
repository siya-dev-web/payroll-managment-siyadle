import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Sign a JWT for the given payload.
 * @param {{ id: number, email: string }} payload
 * @returns {string}
 */
export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

/**
 * Verify a JWT and return its decoded payload.
 * Throws if the token is invalid or expired.
 * @param {string} token
 * @returns {{ id: number, email: string, iat: number, exp: number }}
 */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
