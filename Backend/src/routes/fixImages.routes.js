/**
 * Fix Images Route
 * One-time admin utility to repair broken /uploads/ image paths in MongoDB.
 * Replaces them with reliable public CDN URLs.
 * 
 * POST /api/fix-images  (admin auth required)
 */

const express = require('express');
const router = express.Router();
const Partner = require('../models/Partner');
const Mentor = require('../models/Mentor');
const Feedback = require('../models/Feedback');
const Technology = require('../models/Technology');
const Course = require('../models/Course');
const City = require('../models/City');

// Helper: check if a path is broken (local /uploads/ path)
const isBroken = (url) => {
    if (!url) return false;
    return url.startsWith('/uploads/') || url.startsWith('uploads/');
};

// Reliable fallback images per entity type
const FALLBACKS = {
    partner: 'https://via.placeholder.com/200x80/1e293b/6366f1?text=Partner+Logo',
    mentor: 'https://ui-avatars.com/api/?background=6366f1&color=fff&size=200&bold=true&name=',
    feedback: 'https://ui-avatars.com/api/?background=1e293b&color=6366f1&size=100&bold=true&name=',
    technology: 'https://via.placeholder.com/100x100/1e293b/6366f1?text=Tech',
    course: 'https://via.placeholder.com/400x300/1e293b/6366f1?text=Course',
    city: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
};

// City images from Unsplash (reliable, free)
const CITY_IMAGES = {
    'jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
    'jodhpur': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    'udaipur': 'https://images.unsplash.com/photo-1568454537842-d933259bb258?w=800&q=80',
    'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
    'mumbai': 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80',
    'bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
    'hyderabad': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    'chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
    'pune': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    'kolkata': 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80',
    'ahmedabad': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    'kota': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    'ajmer': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    'bikaner': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    'sikar': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    'default': 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
};

const getCityImage = (name = '') => {
    const key = name.toLowerCase().trim();
    return CITY_IMAGES[key] || CITY_IMAGES['default'];
};

router.post('/', async (req, res) => {
    const results = { fixed: 0, skipped: 0, errors: [] };

    try {
        // ── Fix Partners ──────────────────────────────────────────────────────
        const partners = await Partner.find({});
        for (const p of partners) {
            if (isBroken(p.logo)) {
                p.logo = FALLBACKS.partner;
                await p.save();
                results.fixed++;
            } else {
                results.skipped++;
            }
        }

        // ── Fix Mentors ───────────────────────────────────────────────────────
        const mentors = await Mentor.find({});
        for (const m of mentors) {
            if (isBroken(m.image)) {
                m.image = `${FALLBACKS.mentor}${encodeURIComponent(m.name || 'Mentor')}`;
                await m.save();
                results.fixed++;
            } else {
                results.skipped++;
            }
        }

        // ── Fix Feedback ──────────────────────────────────────────────────────
        const feedbacks = await Feedback.find({});
        for (const f of feedbacks) {
            if (isBroken(f.image)) {
                f.image = `${FALLBACKS.feedback}${encodeURIComponent(f.name || 'Student')}`;
                await f.save();
                results.fixed++;
            } else {
                results.skipped++;
            }
        }

        // ── Fix Technologies ──────────────────────────────────────────────────
        const techs = await Technology.find({});
        for (const t of techs) {
            if (isBroken(t.logo)) {
                t.logo = FALLBACKS.technology;
                await t.save();
                results.fixed++;
            } else {
                results.skipped++;
            }
        }

        // ── Fix Courses ───────────────────────────────────────────────────────
        const courses = await Course.find({});
        for (const c of courses) {
            if (isBroken(c.thumbnailUrl)) {
                c.thumbnailUrl = FALLBACKS.course;
                await c.save();
                results.fixed++;
            } else {
                results.skipped++;
            }
        }

        // ── Fix Cities ────────────────────────────────────────────────────────
        const cities = await City.find({});
        for (const city of cities) {
            if (isBroken(city.image)) {
                city.image = getCityImage(city.name);
                await city.save();
                results.fixed++;
            } else {
                results.skipped++;
            }
        }

        res.json({
            success: true,
            message: `Fixed ${results.fixed} broken images, skipped ${results.skipped} already-valid images.`,
            results,
        });
    } catch (err) {
        console.error('[fix-images] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
