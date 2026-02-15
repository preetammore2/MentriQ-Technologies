const Feedback = require("../models/Feedback");

const getFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const createFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        res.status(201).json(feedback);
    } catch (error) {
        res.status(400).json({ message: "Invalid Data" });
    }
};

const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });
        res.json(feedback);
    } catch (error) {
        res.status(400).json({ message: "Update Failed" });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });
        res.json({ message: "Feedback Removed" });
    } catch (error) {
        res.status(500).json({ message: "Delete Failed" });
    }
};

const seedFeedbacks = async (req, res) => {
    try {
        await Feedback.deleteMany({});
        const feedbacks = [
            {
                name: "Rakshit Chasta",
                role: "Student",
                company: "MentriQ Technology",
                message: "MentriQ helped me build real projects and crack my first job.",
                rating: 5,
                image: "/images/rakshit.jpeg"
            },
            {
                name: "Bhupendra Shekhawat",
                role: "Student",
                company: "MentriQ Technology",
                message: "Live classes and mentor support were outstanding.",
                rating: 5,
                image: "/images/bhupendra.jpg"
            },
            {
                name: "Amit Naruka",
                role: "Student",
                company: "MentriQ Technology",
                message: "I gained confidence after completing hands-on projects.",
                rating: 5,
                image: "/images/amit.jpg"
            },
            {
                name: "Aryan Barot",
                role: "Student",
                company: "MentriQ Technology",
                message: "The course helped me understand core programming concepts in a very practical way.",
                rating: 5,
                image: "/images/barot.jpg"
            },
            {
                name: "Krishan Rajawat",
                role: "Student",
                company: "MentriQ Technology",
                message: "Hands-on projects made learning technology much easier and more interesting.",
                rating: 5,
                image: "/images/krishnarajawat.jpg"
            },
            {
                name: "Bhanu Pratap",
                role: "Student",
                company: "MentriQ Technology",
                message: "The instructor explained complex topics like backend and databases very clearly.",
                rating: 5,
                image: "/images/bhanu2.jpeg"
            },
            {
                name: "Disha sharma",
                role: "Student",
                company: "MentriQ Technology",
                message: "Real-world examples helped me understand how tech is used in the industry.",
                rating: 5,
                image: "/images/disha3.jpeg"
            },
            {
                name: "Saloni Choudhary",
                role: "Student",
                company: "MentriQ Technology",
                message: "The learning materials were up to date with current technologies.",
                rating: 5,
                image: "/images/saloni.jpg"
            },
            {
                name: "Garv Bhatiya",
                role: "Student",
                company: "MentriQ Technology",
                message: "I learned how frontend and backend work together in real applications.",
                rating: 5,
                image: "/images/garv.jpg"
            },
            {
                name: "Vaibhav Sharma",
                role: "Student",
                company: "MentriQ Technology",
                message: "The course structure was well-organized and beginner-friendly.",
                rating: 5,
                image: "/images/vaibhav.jpg"
            },
            {
                name: "Shikhar Singhal",
                role: "Student",
                company: "MentriQ Technology",
                message: "Mentors helped me improve my logical thinking and coding practices.",
                rating: 5,
                image: "/images/sikhar.jpg"
            },
            {
                name: "Rohit Sharma",
                role: "Student",
                company: "MentriQ Technology",
                message: "Industry-level projects gave me a clear idea of real software development.",
                rating: 5,
                image: "/images/rohit.jpg"
            },
            {
                name: "Krati Khandelwal",
                role: "Student",
                company: "MentriQ Technology",
                message: "Practical labs helped me gain hands-on experience with tools and frameworks.",
                rating: 5,
                image: "/images/krati.jpg"
            },
            {
                name: "Pratyush Shrivastav",
                role: "Student",
                company: "MentriQ Technology",
                message: "The course helped me prepare for internships and technical interviews.",
                rating: 5,
                image: "/images/praytush.jpg"
            },
            {
                name: "Aditya Pratap",
                role: "Student",
                company: "MentriQ Technology",
                message: "Support from mentors was quick and very helpful.",
                rating: 5,
                image: "/images/aditya.jpg"
            },
            {
                name: "Anushka Jain",
                role: "Student",
                company: "MentriQ Technology",
                message: "Overall, this tech course was very useful and career-oriented.",
                rating: 5,
                image: "/images/anushka.jpg"
            },
            {
                name: "Harsh Singh",
                role: "Student",
                company: "MentriQ Technology",
                message: "Regular assessments helped me track my learning progress.",
                rating: 5,
                image: "/images/harsh.jpg"
            },
            {
                name: "Mohit Kumar",
                role: "Student",
                company: "MentriQ Technology",
                message: "Doubt-clearing sessions were very helpful and interactive.",
                rating: 5,
                image: "/images/mohit.jpg"
            },
            {
                name: "Prince Sharma",
                role: "Student",
                company: "MentriQ Technology",
                message: "I enjoyed learning new technologies like React.js and Node.js through this course.",
                rating: 5,
                image: "/images/prince.jpg"
            },
            {
                name: "Kunal Pandey",
                role: "Student",
                company: "MentriQ Technology",
                message: "Learning in a project-based way made it easier to remember concepts.",
                rating: 5,
                image: "/images/kunal.jpg"
            }
        ];
        await Feedback.insertMany(feedbacks);
        res.status(200).json({ message: "Feedbacks seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getFeedbacks, createFeedback, updateFeedback, deleteFeedback, seedFeedbacks };
