const Contact = require("../models/Contact");

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Public
const submitInquiry = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Thank you for contacting us. We will get back to you soon.",
            data: contact,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Get all inquiries
// @route   GET /api/contact
// @access  Private/Admin
const getInquiries = async (req, res) => {
    try {
        const inquiries = await Contact.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Mark inquiry as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
    try {
        const inquiry = await Contact.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }

        inquiry.isRead = true;
        await inquiry.save();

        res.json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Delete an inquiry
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteInquiry = async (req, res) => {
    try {
        const inquiry = await Contact.findById(req.params.id);
        if (!inquiry) {
            return res.status(404).json({ message: "Inquiry not found" });
        }

        await inquiry.deleteOne();
        res.json({ success: true, message: "Inquiry deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    submitInquiry,
    getInquiries,
    markAsRead,
    deleteInquiry,
};
