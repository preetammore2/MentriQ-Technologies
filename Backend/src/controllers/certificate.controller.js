const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Course = require('../models/Course');
const QRCode = require('qrcode');

// @desc    Generate certificate for a user
// @route   POST /api/certificates/generate
// @access  Private/Admin
exports.generateCertificate = async (req, res) => {
    try {
        const { userId, courseId, grade, completionDate } = req.body;

        // Validate user and course exist
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if certificate already exists
        const existingCert = await Certificate.findOne({ user: userId, course: courseId });
        if (existingCert) {
            return res.status(400).json({
                message: 'Certificate already exists for this user and course',
                certificateId: existingCert.certificateId
            });
        }

        // Generate unique certificate ID
        let certificateId;
        let isUnique = false;

        while (!isUnique) {
            certificateId = Certificate.generateCertificateId();
            const existing = await Certificate.findOne({ certificateId });
            if (!existing) isUnique = true;
        }

        // Generate QR code with certificate verification URL
        const verificationUrl = `${process.env.CLIENT_URL}/verify-certificate?id=${certificateId}`;
        const qrCodeData = await QRCode.toDataURL(verificationUrl);

        // Create certificate
        const certificate = new Certificate({
            certificateId,
            user: userId,
            course: courseId,
            studentName: user.name,
            courseName: course.title,
            qrCodeData,
            grade: grade || 'Pass',
            completionDate: completionDate || new Date()
        });

        await certificate.save();

        res.status(201).json({
            message: 'Certificate generated successfully',
            certificate: {
                certificateId: certificate.certificateId,
                studentName: certificate.studentName,
                courseName: certificate.courseName,
                issueDate: certificate.issueDate,
                qrCodeData: certificate.qrCodeData
            }
        });

    } catch (error) {
        console.error('Certificate generation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify certificate by ID
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
exports.verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({ certificateId })
            .populate('user', 'name email')
            .populate('course', 'title category duration modules');

        if (!certificate) {
            return res.status(404).json({
                valid: false,
                message: 'Certificate not found. Please check the certificate ID and try again.'
            });
        }

        if (certificate.status === 'Revoked') {
            return res.status(200).json({
                valid: false,
                message: 'This certificate has been revoked and is no longer valid.'
            });
        }

        res.status(200).json({
            valid: true,
            certificateId: certificate.certificateId,
            studentName: certificate.studentName,
            courseName: certificate.courseName,
            duration: certificate.course?.duration || 'N/A',
            modules: certificate.course?.modules || [],
            issueDate: certificate.issueDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            completionDate: certificate.completionDate ? certificate.completionDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : null,
            grade: certificate.grade,
            status: certificate.status
        });

    } catch (error) {
        console.error('Certificate verification error:', error);
        res.status(500).json({
            valid: false,
            message: 'Error verifying certificate. Please try again later.'
        });
    }
};

// @desc    Get certificate by user and course
// @route   GET /api/certificates/user/:userId/course/:courseId
// @access  Private
exports.getCertificate = async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        const certificate = await Certificate.findOne({
            user: userId,
            course: courseId
        });

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.status(200).json(certificate);

    } catch (error) {
        console.error('Get certificate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all certificates for a user
// @route   GET /api/certificates/user/:userId
// @access  Private
exports.getUserCertificates = async (req, res) => {
    try {
        const { userId } = req.params;

        const certificates = await Certificate.find({ user: userId })
            .populate('course', 'title category thumbnailUrl')
            .sort({ issueDate: -1 });

        res.status(200).json(certificates);

    } catch (error) {
        console.error('Get user certificates error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all certificates (Admin)
// @route   GET /api/certificates
// @access  Private/Admin
exports.getAllCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .populate('user', 'name email')
            .populate('course', 'title category')
            .sort({ issueDate: -1 });

        res.status(200).json(certificates);

    } catch (error) {
        console.error('Get all certificates error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Revoke certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private/Admin
exports.revokeCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        certificate.status = 'Revoked';
        await certificate.save();

        res.status(200).json({
            message: 'Certificate revoked successfully',
            certificate
        });

    } catch (error) {
        console.error('Revoke certificate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        await Certificate.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        console.error('Delete certificate error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
