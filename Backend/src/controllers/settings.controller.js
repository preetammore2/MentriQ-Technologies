const Settings = require("../models/Settings");

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({}); // Create default if not exists
        }
        res.json(settings);
    } catch (error) {
        console.error("Get settings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        const { email, phone, address, mapLink, socialLinks } = req.body;

        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        settings.email = email || settings.email;
        settings.phone = phone || settings.phone;
        settings.address = address || settings.address;
        settings.mapLink = mapLink || settings.mapLink;

        if (socialLinks) {
            settings.socialLinks = { ...settings.socialLinks, ...socialLinks };
        }

        settings.updatedBy = req.user._id;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);
    } catch (error) {
        console.error("Update settings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getSettings,
    updateSettings
};
