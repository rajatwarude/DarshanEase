const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  cancelBooking,
  getRecentBookings,
  getRecentCancellations,
} = require("../controllers/bookingController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

// Book a slot
router.post("/", verifyToken, createBooking);

// View my bookings
router.get("/my", verifyToken, getMyBookings);

// Cancel booking
router.delete("/:bookingId", verifyToken, cancelBooking);

// Admin: recent bookings
router.get("/admin/recent", verifyToken, isAdmin, getRecentBookings);

// Admin: recent cancellations
router.get(
  "/admin/recent-cancellations",
  verifyToken,
  isAdmin,
  getRecentCancellations
);

module.exports = router;