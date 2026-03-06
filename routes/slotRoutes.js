// routes/slotRoutes.js
const express = require("express");
const router = express.Router();
const {
  createSlot,
  getSlotsByTemple,
  getSlotById,
  getSlotsByTempleAndDate,
  deleteSlot,
} = require("../controllers/slotController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

// Create Slot (admin only)
router.post("/", verifyToken, isAdmin, createSlot);

// Get single slot by ID
router.get("/slot/:id", verifyToken, getSlotById);

// Get Slots for a Temple
router.get("/:templeId", verifyToken, getSlotsByTemple);

// Get Slots for a Temple and Date
router.get("/:templeId/:date", verifyToken, getSlotsByTempleAndDate);

// Delete Slot (admin only)
router.delete("/:id", verifyToken, isAdmin, deleteSlot);

module.exports = router;