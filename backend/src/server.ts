import express from "express";
import type { Request, Response, NextFunction } from "express";
import { createServer } from "node:http";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { dataRouter } from "./routes/data.js";
import { taskRouter } from "./routes/tasks.js";
import { setupWebSocketServer } from "./ws/wsServer.js";

const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(
  cors({
    origin: [
      "http://localhost:3002",
      "http://localhost:3001",
      "http://localhost:3000",
    ],
  }),
);
app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check (no auth)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth routes (auth required — user must have a valid JWT)
app.use("/api/auth", authMiddleware, authRouter);

// Data routes (auth required)
app.use("/api/user", authMiddleware, dataRouter);

// Task routes (auth required)
app.use("/api/tasks", authMiddleware, taskRouter);

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[server] Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// Create HTTP server and attach WebSocket
const server = createServer(app);
setupWebSocketServer(server);

server.listen(port, () => {
  console.log(`[backend] Server running on http://localhost:${port}`);
});
