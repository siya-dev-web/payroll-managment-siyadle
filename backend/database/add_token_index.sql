-- Run this once against your live payroll_db database.
-- It adds the index on password_resets.token if it does not already exist.
-- Safe to run multiple times — IF NOT EXISTS prevents duplicate errors.

USE payroll_db;

-- Index on the hashed token column for fast lookups during reset validation.
CREATE INDEX IF NOT EXISTS idx_password_resets_token
  ON password_resets (token);

-- Index on user_id for fast invalidation of old tokens on new forgot-password requests.
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id
  ON password_resets (user_id);
