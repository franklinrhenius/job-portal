const express = require("express");
const mongoose = require("mongoose");
const Job = require("../models/Job");

const router = express.Router();

// GET /api/jobs?search=developer
router.get("/", async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch jobs", error: error.message });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch job", error: error.message });
  }
});

// POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That Job ID already exists. Use a unique Job ID." });
    }
    res.status(400).json({ message: error.message || "Invalid job details" });
  }
});

// PUT /api/jobs/:id
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "That Job ID already exists." });
    }
    res.status(400).json({ message: error.message || "Unable to update job" });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete job", error: error.message });
  }
});

module.exports = router;
