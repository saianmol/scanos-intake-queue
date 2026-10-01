const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const submissionRoutes = require("./routes/submissionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/submissions", submissionRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "ScanOS Intake Queue API is running",
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  });