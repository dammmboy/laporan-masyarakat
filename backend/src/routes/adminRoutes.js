const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");
const {
  getStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllReports,
  updateReportStatus,
  deleteReport,
} = require("../controllers/adminController");

// All admin routes require auth + admin role
router.use(verifyToken, isAdmin);

// Statistics
router.get("/stats", getStats);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Report Management
router.get("/reports", getAllReports);
router.put("/reports/:id/status", updateReportStatus);
router.delete("/reports/:id", deleteReport);

module.exports = router;
