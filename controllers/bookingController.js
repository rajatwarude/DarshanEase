const Booking = require("../models/Booking");
const DarshanSlot = require("../models/DarshanSlot");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { slotId, numberOfPersons } = req.body;

    const slot = await DarshanSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    if (slot.availableSeats < numberOfPersons) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    // Reduce seats
    slot.availableSeats -= numberOfPersons;
    await slot.save();

    const booking = await Booking.create({
      user: req.user.id,
      temple: slot.temple,
      slot: slot._id,
      numberOfPersons,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get My Bookings (only active ones)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      status: "BOOKED",
    })
      .populate("temple")
      .populate("slot")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel Booking (soft delete)
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Check if the booking belongs to user (or admin can cancel)
    if (booking.user.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Restore seats
    const slot = await DarshanSlot.findById(booking.slot);
    if (slot) {
      slot.availableSeats += booking.numberOfPersons;
      await slot.save();
    }

    booking.status = "CANCELLED";
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: recent bookings
exports.getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "BOOKED" })
      .populate("temple")
      .populate("slot")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: recent cancellations
exports.getRecentCancellations = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "CANCELLED" })
      .populate("temple")
      .populate("slot")
      .populate("user", "name email")
      .sort({ cancelledAt: -1 })
      .limit(20);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};