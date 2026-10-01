const Submission = require("../models/Submission");

// Get all submissions with filtering and pagination
const getSubmissions = async (req, res) => {
  try {
    const filter = {};

    // Filter by status
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      50
    );

    const skip = (page - 1) * limit;

    // Count matching submissions
    const totalSubmissions = await Submission.countDocuments(filter);

    // Get submissions
    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalSubmissions / limit);

    res.status(200).json({
      submissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalSubmissions,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
};

// Get one submission
const getSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submission",
      error: error.message,
    });
  }
};

// Update submission status
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        message: "Submission not found",
      });
    }

    const allowedTransitions = {
      new: ["in_review"],
      in_review: ["approved", "rejected"],
      approved: [],
      rejected: [],
    };

    const currentStatus = submission.status;
    const validNextStatuses = allowedTransitions[currentStatus];

    // Protect against an invalid status stored in the database
    if (!validNextStatuses) {
      return res.status(400).json({
        message: `Invalid current status: ${currentStatus}`,
      });
    }

    if (!validNextStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition: ${currentStatus} → ${status}`,
      });
    }

    submission.status = status;

    await submission.save();

    res.status(200).json(submission);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

module.exports = {
  getSubmissions,
  getSubmission,
  updateStatus,
};