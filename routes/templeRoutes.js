const express = require("express");
const router = express.Router();
const {
  createTemple,
  getTemples,
  getTempleById,
  deleteTemple,
  updateTemple,
} = require("../controllers/templeController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");

// Only logged-in users can view temples
router.get("/", verifyToken, getTemples);

// Only logged-in users can view a temple
router.get("/:id", verifyToken, getTempleById);

// Only admin can create temple
router.post("/", verifyToken, isAdmin, createTemple);

// Only admin can update temple
router.put("/:id", verifyToken, isAdmin, updateTemple);

// Only admin can delete temple
router.delete("/:id", verifyToken, isAdmin, deleteTemple);

module.exports = router;