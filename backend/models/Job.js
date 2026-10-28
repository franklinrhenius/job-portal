const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: [true, "Job ID is required"],
      trim: true,
      unique: true
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true
    },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"]
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"]
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
