import { validationResult } from "express-validator";
import { sendError } from "../utils/response.js";

/**
 * Reads the result of express-validator checks that ran before this middleware.
 * If any validation errors exist, responds immediately with 422.
 * Otherwise calls next() to continue to the controller.
 */
export function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    console.log(errors.array());
    return sendError(res, 422, "Validation failed.", formatted);
  }

  return next();
}
