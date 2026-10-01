import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://scanos-intake-queue.onrender.com/api/submissions";

const statusConfig = {
  new: {
    label: "New",
    className: "status-new",
  },
  in_review: {
    label: "In Review",
    className: "status-review",
  },
  approved: {
    label: "Approved",
    className: "status-approved",
  },
  rejected: {
    label: "Rejected",
    className: "status-rejected",
  },
};

function App() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  const limit = 10;

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const statusQuery =
        statusFilter === "all"
          ? ""
          : `&status=${statusFilter}`;

      const response = await fetch(
        `${API_URL}?page=${currentPage}&limit=${limit}${statusQuery}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();

      setSubmissions(data.submissions);
      setTotalPages(Math.max(data.pagination.totalPages, 1));
      setTotalSubmissions(data.pagination.totalSubmissions);
    } catch (err) {
      console.error(err);
      setError("Unable to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [currentPage, statusFilter]);

  const handleFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setSelectedSubmission(null);
    setUpdateError("");
  };

  const handleSelectSubmission = (submission) => {
    setSelectedSubmission(submission);
    setUpdateError("");
  };

  const updateSubmissionStatus = async (nextStatus) => {
    if (!selectedSubmission) return;

    try {
      setUpdating(true);
      setUpdateError("");

      const response = await fetch(
        `${API_URL}/${selectedSubmission._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      setSelectedSubmission(data);

      setSubmissions((current) =>
        current.map((submission) =>
          submission._id === data._id
            ? data
            : submission
        )
      );
    } catch (err) {
      console.error(err);
      setUpdateError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatStatus = (status) => {
    return (
      statusConfig[status] || {
        label: status,
        className: "",
      }
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <h2>Loading intake queue</h2>
          <p>Fetching the latest submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-shell">
        <div className="error-screen">
          <div className="error-icon">!</div>

          <h2>Something went wrong</h2>

          <p>{error}</p>

          <button
            className="primary-button"
            onClick={fetchSubmissions}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const selectedStatus = selectedSubmission
    ? formatStatus(selectedSubmission.status)
    : null;

  return (
    <div className="app-shell">

      {/* Main Dashboard */}
      <main className="main-content">

        {/* Header */}
        <header className="topbar">

          <div>
            <div className="breadcrumb">
              Dashboard <span>/</span> Intake Queue
            </div>

            <h1>Patient Intake Queue</h1>

            <p className="page-description">
              Review and manage incoming patient submissions.
            </p>
          </div>

          <div className="topbar-right">

            <div className="live-indicator">
              <span></span>
              Live
            </div>

            <div className="avatar">
              SA
            </div>

          </div>

        </header>

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">
                Total Submissions
              </span>

              <div className="stat-icon blue">
                ▦
              </div>
            </div>

            <div className="stat-number">
              {totalSubmissions}
            </div>

            <div className="stat-description">
              All intake submissions
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">
                Current Page
              </span>

              <div className="stat-icon purple">
                #
              </div>
            </div>

            <div className="stat-number">
              {currentPage}
            </div>

            <div className="stat-description">
              Of {totalPages} pages
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">
                Showing
              </span>

              <div className="stat-icon orange">
                ◷
              </div>
            </div>

            <div className="stat-number">
              {submissions.length}
            </div>

            <div className="stat-description">
              Submissions on this page
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-label">
                Queue Status
              </span>

              <div className="stat-icon green">
                ✓
              </div>
            </div>

            <div className="stat-number">
              Active
            </div>

            <div className="stat-description">
              Intake system operational
            </div>
          </div>

        </section>

        {/* Queue */}
        <section className="queue-card">

          <div className="queue-header">

            <div>
              <h2>Submission Queue</h2>

              <p>
                Select a submission to view complete details.
              </p>
            </div>

            <div className="filter-wrapper">

              <label htmlFor="status-filter">
                Status
              </label>

              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) =>
                  handleFilterChange(e.target.value)
                }
              >
                <option value="all">
                  All submissions
                </option>

                <option value="new">
                  New
                </option>

                <option value="in_review">
                  In Review
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>

            </div>

          </div>

          {/* Table */}
          <div className="table-wrapper">

            <table className="submission-table">

              <thead>
                <tr>
                  <th className="patient-column">
                    Patient
                  </th>

                  <th className="age-column">
                    Age
                  </th>

                  <th className="concern-column">
                    Primary Concern
                  </th>

                  <th className="status-column">
                    Status
                  </th>

                  <th className="created-column">
                    Created
                  </th>

                  <th className="arrow-column"></th>
                </tr>
              </thead>

              <tbody>

                {submissions.map((submission) => {

                  const status = formatStatus(
                    submission.status
                  );

                  return (
                    <tr
                      key={submission._id}
                      onClick={() =>
                        handleSelectSubmission(
                          submission
                        )
                      }
                      className={
                        selectedSubmission?._id ===
                        submission._id
                          ? "selected-row"
                          : ""
                      }
                    >

                      <td>
                        <div className="patient-cell">

                          <div className="patient-avatar">
                            {getInitials(
                              submission.patient_name
                            )}
                          </div>

                          <div className="patient-info">

                            <div className="patient-name">
                              {submission.patient_name}
                            </div>

                            <div className="patient-phone">
                              {submission.phone}
                            </div>

                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="age-value">
                          {submission.age}
                        </span>
                      </td>

                      <td>
                        <div className="concern-cell">
                          {submission.primary_concern.length >
                          65
                            ? submission.primary_concern.substring(
                                0,
                                65
                              ) + "..."
                            : submission.primary_concern}
                        </div>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${status.className}`}
                        >
                          <span className="status-dot"></span>

                          {status.label}
                        </span>
                      </td>

                      <td>
                        <span className="date-value">
                          {formatDate(
                            submission.createdAt
                          )}
                        </span>
                      </td>

                      <td>
                        <span className="arrow">
                          →
                        </span>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* Empty */}
          {submissions.length === 0 && (
            <div className="empty-state">

              <div className="empty-icon">
                ▦
              </div>

              <h3>No submissions found</h3>

              <p>
                There are no submissions matching the
                selected status.
              </p>

            </div>
          )}

          {/* Pagination */}
          <div className="pagination">

            <div className="pagination-info">
              Showing{" "}
              <strong>
                {submissions.length}
              </strong>{" "}
              of{" "}
              <strong>
                {totalSubmissions}
              </strong>{" "}
              submissions
            </div>

            <div className="pagination-controls">

              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(
                    (page) => page - 1
                  );

                  setSelectedSubmission(null);
                }}
              >
                ← Previous
              </button>

              <div className="page-number">
                Page {currentPage} of {totalPages}
              </div>

              <button
                className="pagination-button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() => {
                  setCurrentPage(
                    (page) => page + 1
                  );

                  setSelectedSubmission(null);
                }}
              >
                Next →
              </button>

            </div>

          </div>

        </section>

        {/* Detail */}
        {selectedSubmission && (
          <section className="detail-card">

            <div className="detail-header">

              <div className="detail-title">

                <div className="detail-avatar">
                  {getInitials(
                    selectedSubmission.patient_name
                  )}
                </div>

                <div>

                  <div className="detail-eyebrow">
                    SUBMISSION DETAILS
                  </div>

                  <h2>
                    {selectedSubmission.patient_name}
                  </h2>

                  <p>
                    Submitted{" "}
                    {formatDate(
                      selectedSubmission.createdAt
                    )}
                  </p>

                </div>

              </div>

              <button
                className="close-button"
                onClick={() => {
                  setSelectedSubmission(null);
                  setUpdateError("");
                }}
              >
                ×
              </button>

            </div>

            <div className="detail-grid">

              <div className="detail-item">
                <span>Patient Name</span>

                <strong>
                  {selectedSubmission.patient_name}
                </strong>
              </div>

              <div className="detail-item">
                <span>Age</span>

                <strong>
                  {selectedSubmission.age} years
                </strong>
              </div>

              <div className="detail-item">
                <span>Phone</span>

                <strong>
                  {selectedSubmission.phone}
                </strong>
              </div>

              <div className="detail-item">
                <span>Current Status</span>

                <strong>
                  <span
                    className={`status-badge ${selectedStatus.className}`}
                  >
                    <span className="status-dot"></span>

                    {selectedStatus.label}
                  </span>
                </strong>
              </div>

            </div>

            <div className="concern-detail">

              <span>Primary Concern</span>

              <p>
                {selectedSubmission.primary_concern}
              </p>

            </div>

            <div className="status-action-area">

              <div>

                <div className="action-title">
                  Status Action
                </div>

                <div className="action-description">

                  {selectedSubmission.status === "new" &&
                    "Move this submission into review."}

                  {selectedSubmission.status ===
                    "in_review" &&
                    "Choose whether to approve or reject this submission."}

                  {selectedSubmission.status ===
                    "approved" &&
                    "This submission has been approved. No further changes are available."}

                  {selectedSubmission.status ===
                    "rejected" &&
                    "This submission has been rejected. No further changes are available."}

                </div>

              </div>

              <div className="action-buttons">

                {selectedSubmission.status === "new" && (
                  <button
                    className="review-button"
                    onClick={() =>
                      updateSubmissionStatus(
                        "in_review"
                      )
                    }
                    disabled={updating}
                  >
                    {updating
                      ? "Updating..."
                      : "Move to In Review →"}
                  </button>
                )}

                {selectedSubmission.status ===
                  "in_review" && (
                  <>
                    <button
                      className="reject-button"
                      onClick={() =>
                        updateSubmissionStatus(
                          "rejected"
                        )
                      }
                      disabled={updating}
                    >
                      {updating
                        ? "Updating..."
                        : "Reject"}
                    </button>

                    <button
                      className="approve-button"
                      onClick={() =>
                        updateSubmissionStatus(
                          "approved"
                        )
                      }
                      disabled={updating}
                    >
                      {updating
                        ? "Updating..."
                        : "Approve"}
                    </button>
                  </>
                )}

                {selectedSubmission.status ===
                  "approved" && (
                  <span className="completed-message">
                    ✓ Approved
                  </span>
                )}

                {selectedSubmission.status ===
                  "rejected" && (
                  <span className="rejected-message">
                    × Rejected
                  </span>
                )}

              </div>

            </div>

            {updateError && (
              <div className="update-error">
                {updateError}
              </div>
            )}

          </section>
        )}

      </main>
    </div>
  );
}

export default App;