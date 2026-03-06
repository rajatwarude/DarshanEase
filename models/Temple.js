// models/Temple.js
const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String,
    default: "https://via.placeholder.com/400x200.png?text=Temple+Image" // default image
  }
}, { timestamps: true });

module.exports = mongoose.model("Temple", templeSchema);