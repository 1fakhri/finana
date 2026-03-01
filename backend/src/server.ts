import express from "express";
import cors from "cors";
import { authMiddleware } from "./middleware/auth.js";
import { dataRouter } from "./routes/data.js";

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

// Health check (no auth)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Data routes (auth required)
app.use("/api/user", authMiddleware, dataRouter);

app.listen(port, () => {
  console.log(`[backend] Server running on http://localhost:${port}`);
});
