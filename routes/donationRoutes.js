const express = require("express");
const router = express.Router();
const {
  createDonation,
  getDonationsByTemple,
  getMyDonations,
  getDonationStats,
} = require("../controllers/donationController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

// Create donation (logged-in users)
router.post("/", verifyToken, createDonation);

// Get donations for a single temple (optional, for admin/analytics)
router.get("/temple/:templeId", verifyToken, getDonationsByTemple);

// Get donations made by the logged-in user
router.get("/me", verifyToken, getMyDonations);

// Admin stats: totals across all temples
router.get("/stats/summary", verifyToken, isAdmin, getDonationStats);

module.exports = router;

