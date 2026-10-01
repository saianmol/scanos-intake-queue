const express = require("express");

const {
  getSubmissions,
  getSubmission,
  updateStatus,
} = require("../controllers/submissionController");

const router = express.Router();

// GET all submissions
router.get("/", getSubmissions);

// GET one submission
router.get("/:id", getSubmission);

// UPDATE submission status
router.patch("/:id/status", updateStatus);

module.exports = router;