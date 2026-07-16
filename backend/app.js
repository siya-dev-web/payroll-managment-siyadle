import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import payrollRoutes from "./routes/payroll.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
// ─── Request Parsing ────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Logging ────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Health Check ───────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Payroll API is running.",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ─── Error Handling ─────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
