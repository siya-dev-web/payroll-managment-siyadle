import { authService } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../utils/response.js";

export const authController = {
  async register(req, res, next) {
    try {
      const { full_name, email, password } = req.body;
      const result = await authService.register(full_name, email, password);

      return sendSuccess(res, 201, "Registration successful. Please verify your email.", {
        token: result.token,
        user: result.user,
      });
    } catch (err) {
      return next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      return sendSuccess(res, 200, "Login successful.", result);
    } catch (err) {
      return next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return sendSuccess(res, 200, "User profile retrieved.", user);
    } catch (err) {
      return next(err);
    }
  },

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.forgotPassword(email);

      // Always return the same message to prevent email enumeration.
      return sendSuccess(
        res,
        200,
        "If that email is registered, a reset link has been sent."
      );
    } catch (err) {
      return next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      await authService.resetPassword(token, password);

      return sendSuccess(res, 200, "Password reset successfully. You can now log in.");
    } catch (err) {
      return next(err);
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;
      await authService.verifyEmail(token);

      return sendSuccess(res, 200, "Email verified successfully.");
    } catch (err) {
      return next(err);
    }
  },
};
