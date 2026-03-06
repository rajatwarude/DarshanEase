const express = require("express");
const router = express.Router();
const DarshanSlot = require("../models/DarshanSlot");

router.post("/add", async (req, res) => {
  try {
    const { temple, date, time, availableSeats } = req.body;

    const slot = new DarshanSlot({
      temple,
      date,
      time,
      availableSeats
    });

    await slot.save();

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error });
  }
});

module.exports = router;