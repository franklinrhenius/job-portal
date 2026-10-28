const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const jobRoutes = require("./routes/jobs");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Job Portal API is running" });
});

app.use("/api/jobs", jobRoutes);

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI. Create backend/.env using .env.example.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
