const mongoose = require('mongoose');
const dotenv = require('dotenv');
const City = require('./src/models/City');
const path = require('path');

dotenv.config();

const cities = [
    {
        name: 'Jaipur',
        image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&q=80&w=1000', // Hawa Mahal
        description: "The Pink City, known for its iconic Hawa Mahal and rich history.",
        order: 1,
        isActive: true
    },
    {
        name: 'Kota',
        image: 'https://images.unsplash.com/photo-1705861144414-067885b54245?q=80&w=1000&auto=format&fit=crop', // Kota Riverfront
        description: "Education hub of India with state-of-the-art coaching facilities.",
        order: 2,
        isActive: true
    },
    {
        name: 'Jodhpur',
        image: 'https://images.unsplash.com/photo-1594548074917-7cc757563162?auto=format&fit=crop&q=80&w=1000', // Blue City
        description: "The Blue City, famous for Mehrangarh Fort and vibrant culture.",
        order: 3,
        isActive: true
    },
    {
        name: 'Udaipur',
        image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&q=80&w=1000', // Lake Palace
        description: "City of Lakes, offering a serene and royal learning environment.",
        order: 4,
        isActive: true
    },
    {
        name: 'New Delhi',
        image: 'https://images.unsplash.com/photo-1587474262715-9aa64a86d4af?auto=format&fit=crop&q=80&w=1000', // India Gate
        description: "The Capital City, blending modern infrastructure with heritage.",
        order: 5,
        isActive: true
    },
    {
        name: 'Mumbai',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1000', // Gateway of India
        description: "The Financial Capital, a hub of opportunities and innovation.",
        order: 6,
        isActive: true
    },
    {
        name: 'Dehradun',
        image: 'https://images.unsplash.com/photo-1588863266580-da9b0429f626?auto=format&fit=crop&q=80&w=1000', // Mountains/Landscape
        description: "Nestled in the Himalayas, known for prestigious institutions.",
        order: 7,
        isActive: true
    },
    {
        name: 'Bangalore',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=1000', // Vidhana Soudha
        description: "Silicon Valley of India, leading in technology and startups.",
        order: 8,
        isActive: true
    },
    {
        name: 'Hyderabad',
        image: 'https://images.unsplash.com/photo-1572455044327-7348c1be7267?auto=format&fit=crop&q=80&w=1000', // Charminar
        description: "City of Pearls, a major center for IT and biotechnology.",
        order: 9,
        isActive: true
    },
    {
        name: 'Ahmedabad',
        image: 'https://images.unsplash.com/photo-1594132808027-e435946cf61b?auto=format&fit=crop&q=80&w=1000', // Sabarmati
        description: "A growing educational hub with a rich business heritage.",
        order: 10,
        isActive: true
    },
    {
        name: 'Kolkata',
        image: 'https://images.unsplash.com/photo-1558431382-27e30314225d?auto=format&fit=crop&q=80&w=1000', // Victoria Memorial
        description: "Cultural Capital of India, known for its literary and artistic legacy.",
        order: 11,
        isActive: true
    },
    {
        name: 'Lucknow',
        image: 'https://images.unsplash.com/photo-1589552636287-9b2f63f58694?auto=format&fit=crop&q=80&w=1000', // Rumi Darwaza
        description: "City of Nawabs, famous for its culture and growing education sector.",
        order: 12,
        isActive: true
    },
    {
        name: 'Indore',
        image: 'https://images.unsplash.com/photo-1620205247953-e5d32c545084?auto=format&fit=crop&q=80&w=1000', // Rajwada
        description: "Cleanest city in India, emerging as a major education hub.",
        order: 13,
        isActive: true
    },
    {
        name: 'Pune',
        image: 'https://images.unsplash.com/photo-1698378652438-237302484050?auto=format&fit=crop&q=80&w=1000', // Pune styling
        description: "Oxford of the East, home to premier educational institutions.",
        order: 14,
        isActive: true
    },
];

const seedCities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding...');

        // Clear existing cities to avoid duplicates during dev
        await City.deleteMany({});
        console.log('Cleared existing cities');

        await City.insertMany(cities);
        console.log('Cities seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding cities:', error);
        process.exit(1);
    }
};

seedCities();
