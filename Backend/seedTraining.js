const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const dotenv = require('dotenv');

dotenv.config();

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')      
        .replace(/[^\w\-]+/g, '')      
        .replace(/\-\-+/g, '-')         
        .replace(/^-+/, '')            
        .replace(/-+$/, '');            
};

const trainingData = [
    {
        title: 'Full Stack Web Development Training',
        description: 'Comprehensive training in modern web technologies including React, Node.js, and MongoDB.',
        level: 'Beginner',
        price: 15000,
        duration: '6 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=400',
        mode: 'Hybrid'
    },
    {
        title: 'Data Science & Analytics',
        description: 'Master data analysis, visualization, and machine learning with Python.',
        level: 'Intermediate',
        price: 18000,
        duration: '6 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'Cyber Security Expert',
        description: 'Learn ethical hacking, network security, and risk management.',
        level: 'Advanced',
        price: 20000,
        duration: '6 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'Cloud Computing with AWS',
        description: 'Become an AWS certified solutions architect.',
        level: 'Intermediate',
        price: 16000,
        duration: '4 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'Artificial Intelligence & ML',
        description: 'Deep dive into neural networks, deep learning, and AI applications.',
        level: 'Advanced',
        price: 22000,
        duration: '8 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=400',
        mode: 'Hybrid'
    },
    {
        title: 'Digital Marketing Mastery',
        description: 'SEO, SEM, Social Media Marketing, and Content Strategy.',
        level: 'Beginner',
        price: 12000,
        duration: '3 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'DevOps Engineering',
        description: 'Master CI/CD, Docker, Kubernetes, and Infrastructure as Code.',
        level: 'Advanced',
        price: 19000,
        duration: '5 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1607799275518-d58665d099db?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'Blockchain Technology',
        description: 'Understand smart contracts, Ethereum, and decentralized apps.',
        level: 'Intermediate',
        price: 25000,
        duration: '6 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1621504450168-b8c437544372?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'UI/UX Design Professional',
        description: 'Design beautiful user interfaces and seamless user experiences.',
        level: 'Beginner',
        price: 14000,
        duration: '4 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    },
    {
        title: 'Game Development with Unity',
        description: 'Create 2D and 3D games using Unity and C#.',
        level: 'Intermediate',
        price: 17000,
        duration: '5 Months',
        category: 'Training',
        thumbnailUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400',
        mode: 'Online'
    }
].map(course => ({
    ...course,
    slug: slugify(course.title)
}));

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        try {
            await Course.deleteMany({ category: 'Training' });
            console.log('Cleared old training courses');
        } catch (e) {
            console.log("Error clearing old data (might not exist):", e.message);
        }

       
        try {
            await Course.insertMany(trainingData, { ordered: false });
            console.log('Seeded 10 Training Courses');
        } catch (e) {
            if (e.code === 11000) {
                console.log('Some courses already exist or duplicate key error. Proceeding...');
            } else {
                throw e;
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
