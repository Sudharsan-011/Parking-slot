const mongoose = require("mongoose");

const parkingSpaceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },

    location: {
      address: { type: String, required: true },
      pincode: { type: String, required: true },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },

    pricePerHour: { type: Number, required: true },
    totalSlots: { type: Number, required: true },
    availableSlots: { type: Number, required: true },
    facilities: { type: [String], default: [] },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Geo index to enable 2km nearby search
parkingSpaceSchema.index({ "location.coordinates": "2dsphere" });

module.exports = mongoose.model("ParkingSpace", parkingSpaceSchema);
