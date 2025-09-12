const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const leadRoutes = require("./routes/lead.routes");
const IORedis = require("ioredis");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/leads", leadRoutes);

// Connect DB
connectDB();

// Connect Redis
const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
