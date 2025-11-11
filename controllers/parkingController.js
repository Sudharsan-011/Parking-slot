const ParkingSpace = require("../models/ParkingSpace");
const axios = require("axios");

// Create
async function createParkingSpace(req, res) {
  try {
    const { title, location, pricePerHour, totalSlots, facilities } = req.body;
    if (!title || !location?.address || pricePerHour == null || totalSlots == null) {
      return res.status(400).json({ message: "title, location.address, pricePerHour, totalSlots are required" });
    }
    const space = await ParkingSpace.create({
      title,
      location,
      pricePerHour,
      totalSlots,
      availableSlots: totalSlots,
      facilities
    });
    res.status(201).json({ message: "created", data: space });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// List available
async function getAvailableParkingSpaces(_req, res) {
  try {
    const spaces = await ParkingSpace.find({ isActive: true, availableSlots: { $gt: 0 } });
    res.json({ count: spaces.length, data: spaces });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// Update
async function updateParkingSpace(req, res) {
  try {
    const { id } = req.params;
    const updated = await ParkingSpace.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "not found" });
    res.json({ message: "updated", data: updated });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// Delete
async function deleteParkingSpace(req, res) {
  try {
    const { id } = req.params;
    const deleted = await ParkingSpace.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "not found" });
    res.json({ message: "deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// Search Nearby (within 2km)
async function searchNearby(req, res) {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: "lat and lng are required" });
    }

    const spaces = await ParkingSpace.find({
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 2000 // 2km radius
        }
      },
      isActive: true,
      availableSlots: { $gt: 0 }
    });

    res.json({ count: spaces.length, data: spaces });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

// Search by Pincode or Location
async function searchParking(req, res) {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ message: "Search value is required (pincode or location name)" });
    }

    // If pincode entered (6 digits)
    if (/^\d{6}$/.test(search)) {
      const spaces = await ParkingSpace.find({
        "location.pincode": search,
        availableSlots: { $gt: 0 },
        isActive: true
      });

      return res.json({ type: "pincode", count: spaces.length, data: spaces });
    }

    // Convert location name → coordinates
    const geoResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1`
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ message: "Location not found" });
    }

    const lat = parseFloat(geoResponse.data[0].lat);
    const lng = parseFloat(geoResponse.data[0].lon);

    const spaces = await ParkingSpace.find({
      "location.coordinates": {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: 2000 // 2 KM
        }
      },
      availableSlots: { $gt: 0 },
      isActive: true
    });

    res.json({ type: "location", search, lat, lng, count: spaces.length, data: spaces });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Export CommonJS
module.exports = {
  createParkingSpace,
  getAvailableParkingSpaces,
  updateParkingSpace,
  deleteParkingSpace,
  searchNearby,
  searchParking
};
