// controllers/templeController.js
const Temple = require("../models/Temple");

// Admin: Create Temple
exports.createTemple = async (req, res) => {
  try {
    const { name, location, description, imageUrl } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required" });
    }

    const temple = await Temple.create({
      name,
      location,
      description,
      imageUrl // will use default if undefined
    });

    res.status(201).json(temple);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Temples
exports.getTemples = async (req, res) => {
  try {
    const temples = await Temple.find();
    res.json(temples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Temple (logged-in users)
exports.getTempleById = async (req, res) => {
  try {
    const { id } = req.params;
    const temple = await Temple.findById(id);
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }
    res.json(temple);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Delete Temple
exports.deleteTemple = async (req, res) => {
  try {
    const { id } = req.params;

    const temple = await Temple.findById(id);
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }

    await temple.deleteOne();

    res.json({ message: "Temple deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update Temple
exports.updateTemple = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description, imageUrl } = req.body;

    const temple = await Temple.findById(id);
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }

    temple.name = name || temple.name;
    temple.location = location || temple.location;
    temple.description = description || temple.description;
    temple.imageUrl = imageUrl || temple.imageUrl;

    const updated = await temple.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};