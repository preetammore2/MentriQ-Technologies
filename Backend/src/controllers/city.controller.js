const City = require('../models/City');

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res) => {
    try {
        const cities = await City.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all cities (Admin)
// @route   GET /api/cities/admin
// @access  Private/Admin
const getAdminCities = async (req, res) => {
    try {
        const cities = await City.find({}).sort({ order: 1, createdAt: -1 });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a city
// @route   POST /api/cities
// @access  Private/Admin
const createCity = async (req, res) => {
    try {
        const { name, image, order, isActive, description } = req.body;
        const city = await City.create({
            name,
            image,
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true,
            description: description || "Premium tech-enabled learning centre."
        });
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a city
// @route   PUT /api/cities/:id
// @access  Private/Admin
const updateCity = async (req, res) => {
    try {
        const { name, image, order, isActive, description } = req.body;
        const city = await City.findById(req.params.id);

        if (city) {
            city.name = name || city.name;
            city.image = image || city.image;
            city.order = order !== undefined ? order : city.order;
            city.isActive = isActive !== undefined ? isActive : city.isActive;
            city.description = description || city.description;

            const updatedCity = await city.save();
            res.json(updatedCity);
        } else {
            res.status(404).json({ message: 'City not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
const deleteCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);

        if (city) {
            await city.deleteOne();
            res.json({ message: 'City removed' });
        } else {
            res.status(404).json({ message: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCities,
    getAdminCities,
    createCity,
    updateCity,
    deleteCity
};
