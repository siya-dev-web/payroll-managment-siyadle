import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";
import { signToken } from "../utils/jwt.js";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

export const authService = {
  /**
   * Register a new user.
   * Hashes the password, generates a verification token, inserts the record.
   * Returns the signed JWT and the new user's public data.
   */
  async register(full_name, email, password) {
    const [existing] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      const error = new Error("An account with this email already exists.");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, password, verification_token)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, hashedPassword, verificationToken]
    );

    const userId = result.insertId;
    const token = signToken({ id: userId, email });

    return {
      token,
      user: { id: userId, full_name, email, is_verified: 0 },
      verificationToken,
    };
  },

  /**
   * Login an existing user.
   * Compares password, returns JWT on success.
   */
  async login(email, password) {
    const [rows] = await pool.execute(
      "SELECT id, full_name, email, password, is_verified FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid email or password.");
      error.statusCode = 401;
      throw error;
    }

    const token = signToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        is_verified: user.is_verified,
      },
    };
  },

  /**
   * Return the authenticated user's profile (no password).
   */
  async getMe(userId) {
    const [rows] = await pool.execute(
      "SELECT id, full_name, email, is_verified, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    return rows[0];
  },

  /**
   * Generate and store a password-reset token valid for 1 hour.
   * Returns the raw token (caller should email it).
   */
  async forgotPassword(email) {
    const [rows] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    // Always return success to avoid email enumeration.
    if (rows.length === 0) return null;

    const userId = rows[0].id;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any previous tokens for this user.
    await pool.execute("DELETE FROM password_resets WHERE user_id = ?", [userId]);

    await pool.execute(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, token, expiresAt]
    );

    return token;
  },

  /**
   * Validate a reset token and update the user's password.
   */
  async resetPassword(token, newPassword) {
    const [rows] = await pool.execute(
      "SELECT user_id, expires_at FROM password_resets WHERE token = ?",
      [token]
    );

    if (rows.length === 0) {
      const error = new Error("Invalid or expired reset token.");
      error.statusCode = 400;
      throw error;
    }

    const { user_id, expires_at } = rows[0];

    if (new Date() > new Date(expires_at)) {
      await pool.execute("DELETE FROM password_resets WHERE token = ?", [token]);
      const error = new Error("Reset token has expired. Please request a new one.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, user_id]
    );

    await pool.execute("DELETE FROM password_resets WHERE token = ?", [token]);
  },

  /**
   * Mark a user's email as verified using their verification token.
   */
  async verifyEmail(token) {
    const [rows] = await pool.execute(
      "SELECT id FROM users WHERE verification_token = ?",
      [token]
    );

    if (rows.length === 0) {
      const error = new Error("Invalid verification token.");
      error.statusCode = 400;
      throw error;
    }

    await pool.execute(
      "UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?",
      [rows[0].id]
    );
  },
};
