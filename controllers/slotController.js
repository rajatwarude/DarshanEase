const DarshanSlot = require("../models/DarshanSlot");

// Create Slot
exports.createSlot = async (req, res) => {
  try {
    const { templeId, date, time, availableSeats } = req.body;

    if (!templeId || !date || !time || !availableSeats) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const slot = await DarshanSlot.create({
      temple: templeId, // map templeId to the schema field
      date,
      time,
      availableSeats
    });

    res.status(201).json(slot);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Slots By Temple
exports.getSlotsByTemple = async (req, res) => {
  try {
    const slots = await DarshanSlot.find({ temple: req.params.templeId })
      .populate("temple");
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/slotController.js
exports.getSlotById = async (req, res) => {
  try {
    const slot = await DarshanSlot.findById(req.params.id).populate("temple");
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// controllers/slotController.js
exports.getSlotsByTempleAndDate = async (req, res) => {
  const { templeId, date } = req.params;
  try {
    // Convert the incoming date string to a JS Date range for the whole day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0); // start of day

    const end = new Date(date);
    end.setHours(23, 59, 59, 999); // end of day

    const slots = await DarshanSlot.find({
      temple: templeId,
      date: { $gte: start, $lte: end }, // match any time on that day
    }).populate("temple");

    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Delete Slot
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const slot = await DarshanSlot.findById(id);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    await slot.deleteOne();

    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};