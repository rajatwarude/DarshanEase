const Donation = require("../models/Donation");
const Temple = require("../models/Temple");

// Create Donation
exports.createDonation = async (req, res) => {
  try {
    const { templeId, amount, message } = req.body;

    if (!templeId || !amount) {
      return res.status(400).json({ message: "Temple and amount are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }

    const donation = await Donation.create({
      temple: templeId,
      user: req.user.id,
      amount,
      message,
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get donations for a temple (for future use / admin)
exports.getDonationsByTemple = async (req, res) => {
  try {
    const { templeId } = req.params;
    const donations = await Donation.find({ temple: templeId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get donations made by logged-in user
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id })
      .populate("temple", "name location")
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin stats: total donation amount, count of donations, count of temples
exports.getDonationStats = async (req, res) => {
  try {
    const [agg] = await Donation.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          totalDonations: { $sum: 1 },
        },
      },
    ]);

    const templeCount = await Temple.countDocuments();

    res.json({
      totalAmount: agg ? agg.totalAmount : 0,
      totalDonations: agg ? agg.totalDonations : 0,
      templeCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

