const Service = require("../models/Service");

// Get all services (Public - Active Only)
const getAllServices = async (req, res) => {
    try {
        const services = await Service.find({ active: true }).sort({ createdAt: 1 });
        res.json(services);
    } catch (error) {
        console.error("Get all services error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all services (Admin - All)
const getAdminServices = async (req, res) => {
    try {
        const services = await Service.find({}).sort({ createdAt: 1 });
        res.json(services);
    } catch (error) {
        console.error("Get admin services error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Create a new service
const createService = async (req, res) => {
    try {
        const { title, description, icon } = req.body;

        if (!title || !description || !icon) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const service = await Service.create({
            title,
            description,
            icon,
        });

        res.status(201).json(service);
    } catch (error) {
        console.error("Create service error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update a service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, icon, active } = req.body;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        service.title = title || service.title;
        service.description = description || service.description;
        service.icon = icon || service.icon;
        if (active !== undefined) service.active = active;

        const updatedService = await service.save();

        res.json(updatedService);
    } catch (error) {
        console.error("Update service error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        const service = await Service.findById(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        await service.deleteOne();

        res.json({ message: "Service removed" });
    } catch (error) {
        console.error("Delete service error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Seed Services
const seedServices = async (req, res) => {
    try {
        await Service.deleteMany({}); // Clear existing

        const services = [
            {
                icon: 'Code',
                title: 'Custom Software Development',
                description: 'Tailored software solutions to address your unique business challenges. We build scalable, secure, and high-performance applications.',
                active: true
            },
            {
                icon: 'Globe',
                title: 'Web Application Development',
                description: 'Create powerful, responsive, and user-centric web applications. From e-commerce platforms to enterprise portals, we deliver excellence.',
                active: true
            },
            {
                icon: 'Smartphone',
                title: 'Mobile App Development',
                description: 'Reach your audience on the go with native and cross-platform mobile apps. We design and develop for both iOS and Android.',
                active: true
            },
            {
                icon: 'Cloud',
                title: 'Cloud & DevOps Services',
                description: 'Accelerate your digital transformation with our cloud and DevOps services. We help you migrate, manage, and optimize your cloud infrastructure.',
                active: true
            },
            {
                icon: 'Shield',
                title: 'Cybersecurity Solutions',
                description: 'Safeguard your digital assets with our comprehensive cybersecurity services. We offer audits, penetration testing, and risk management.',
                active: true
            },
            {
                icon: 'BarChart',
                title: 'Data Analytics & AI',
                description: 'Unlock the power of your data. We provide advanced analytics and AI solutions to help you make informed business decisions.',
                active: true
            }
        ];

        const createdServices = await Service.insertMany(services);
        res.json({ message: "Services seeded successfully", count: createdServices.length });
    } catch (error) {
        console.error("Seed services error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllServices,
    getAdminServices,
    createService,
    updateService,
    deleteService,
    seedServices
};
