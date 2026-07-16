import bcrypt from "bcrypt";
import crypto from "crypto";
import pool from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/email.js";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);

/**
 * Hash a token with SHA-256 for safe database storage.
 * The raw token is sent to the user; only the hash is stored.
 * On verification we hash the incoming token and compare to the stored hash.
 *
 * @param {string} rawToken
 * @returns {string}
 */
function hashToken(rawToken) {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export const authService = {
  /**
   * Register a new user.
   * Hashes the password, generates a verification token, inserts the record.
   * Sends a verification email then returns the signed JWT and public user data.
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

    // Generate raw token for the email link, store only the hash in the DB.
    const rawVerificationToken = crypto.randomBytes(32).toString("hex");
    const hashedVerificationToken = hashToken(rawVerificationToken);

    const [result] = await pool.execute(
      `INSERT INTO users (full_name, email, password, verification_token)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, hashedPassword, hashedVerificationToken]
    );

    const userId = result.insertId;
    const token = signToken({ id: userId, email });

    // Send raw token in the email link — fire and forget.
    sendVerificationEmail(email, full_name, rawVerificationToken).catch((err) => {
      console.error("Failed to send verification email:", err.message);
    });

    return {
      token,
      user: { id: userId, full_name, email, is_verified: 0 },
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
   * Generate a password-reset token valid for 1 hour.
   * Stores a SHA-256 hash of the token — never the raw value.
   * Sends the raw token inside the email link only.
   */
  async forgotPassword(email) {
    const [rows] = await pool.execute(
      "SELECT id, full_name FROM users WHERE email = ?",
      [email]
    );

    // Always return success to prevent email enumeration attacks.
    if (rows.length === 0) return null;

    const { id: userId, full_name } = rows[0];

    // Raw token goes in the email. Hashed token goes in the database.
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Invalidate any previous reset tokens for this user.
    await pool.execute(
      "DELETE FROM password_resets WHERE user_id = ?",
      [userId]
    );

    // Store the hash — not the raw token.
    await pool.execute(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, hashedToken, expiresAt]
    );

    // Email the raw token inside the reset link — fire and forget.
    sendPasswordResetEmail(email, full_name, rawToken).catch((err) => {
      console.error("Failed to send password reset email:", err.message);
    });

    return null; // Never return the token to the caller
  },

  /**
   * Validate a reset token and update the user's password.
   * Hashes the incoming token and looks up the hash — never the raw value.
   */
  async resetPassword(rawToken, newPassword) {
    const hashedToken = hashToken(rawToken);

    const [rows] = await pool.execute(
      "SELECT user_id, expires_at FROM password_resets WHERE token = ?",
      [hashedToken]
    );

    if (rows.length === 0) {
      const error = new Error("Invalid or expired reset token.");
      error.statusCode = 400;
      throw error;
    }

    const { user_id, expires_at } = rows[0];

    if (new Date() > new Date(expires_at)) {
      await pool.execute(
        "DELETE FROM password_resets WHERE token = ?",
        [hashedToken]
      );
      const error = new Error("Reset token has expired. Please request a new one.");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await pool.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, user_id]
    );

    // Delete the used token so it cannot be reused.
    await pool.execute(
      "DELETE FROM password_resets WHERE token = ?",
      [hashedToken]
    );
  },

  /**
   * Mark a user's email as verified.
   * Hashes the incoming token and looks up the hash in the DB.
   */
  async verifyEmail(rawToken) {
    const hashedToken = hashToken(rawToken);

    const [rows] = await pool.execute(
      "SELECT id FROM users WHERE verification_token = ?",
      [hashedToken]
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
