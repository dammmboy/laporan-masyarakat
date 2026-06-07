const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const isAdmin = require("../middleware/roleMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  updateStatus,
} = require("../controllers/reportController");

const {
  getCommentsByReportId,
  createComment,
} = require("../controllers/commentController");

// PUBLIC
router.get("/", getReports);
router.get("/:id", getReportById);
router.get("/:id/comments", getCommentsByReportId);

// USER
router.post("/", verifyToken, upload.single("foto"), createReport);
router.post("/:id/comments", verifyToken, createComment);

router.put("/:id", verifyToken, updateReport);

router.delete("/:id", verifyToken, deleteReport);

// ADMIN
router.put("/status/:id", verifyToken, isAdmin, updateStatus);

module.exports = router;
