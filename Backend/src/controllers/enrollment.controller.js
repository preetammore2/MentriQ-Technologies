const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const { sendEnrollmentEmail } = require("../utils/emailService");

const enrollInCourse = async (req, res) => {
  try {
    const { courseId, name, email, fatherName, motherName, dob, contact, parentContact, address, image } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existing = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      name: name || req.user.name,
      email: email || req.user.email,
      fatherName: fatherName || "",
      motherName: motherName || "",
      dob: dob || "",
      contact: contact || "",
      parentContact: parentContact || "",
      address: address || "Not provided",
      image: image || "",
      pricePaid: 0,
      totalFee: course.price || 0,
    });

    // Send confirmation email
    await sendEnrollmentEmail(
      email || req.user.email,
      name || req.user.name,
      course.title
    );

    return res.status(201).json({
      success: true,
      enrollment,
    });
  } catch (error) {
    console.error("ENROLL ERROR 👉", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate("course");

    return res.json(enrollments);
  } catch (error) {
    console.error("GET ENROLLMENTS ERROR 👉", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({})
      .populate("user", "name email")
      .populate("course", "title price category");


    return res.json(enrollments);
  } catch (error) {
    console.error("GET ALL ENROLLMENTS ERROR", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const { pricePaid, totalFee, status, paymentStatus, certificateNo, courseRegistrationNo } = req.body;

    const updates = {};
    if (pricePaid !== undefined) updates.pricePaid = pricePaid;
    if (totalFee !== undefined) updates.totalFee = totalFee;
    if (status !== undefined) updates.status = status;
    if (paymentStatus !== undefined) updates.paymentStatus = paymentStatus;
    if (certificateNo !== undefined) updates.certificateNo = certificateNo;
    if (courseRegistrationNo !== undefined) updates.courseRegistrationNo = courseRegistrationNo;

    const enrollment = await Enrollment.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    )
      .populate("user", "name email")
      .populate("course", "title price category");

    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });

    return res.json({ success: true, enrollment });
  } catch (error) {
    console.error("UPDATE ENROLLMENT ERROR", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteEnrollment = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByIdAndDelete(id);
    if (!enrollment) return res.status(404).json({ message: "Enrollment not found" });
    return res.json({ success: true, message: "Enrollment deleted" });
  } catch (error) {
    console.error("DELETE ENROLLMENT ERROR", error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { enrollInCourse, getMyEnrollments, getAllEnrollments, updateEnrollment, deleteEnrollment };
