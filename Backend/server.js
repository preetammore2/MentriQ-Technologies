const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const authRoutes = require("./src/routes/auth.routes");
const courseRoutes = require("./src/routes/course.routes");
const enrollmentRoutes = require("./src/routes/enrollment.routes");
const mentorRoutes = require("./src/routes/mentor.routes");
const feedbackRoutes = require("./src/routes/feedback.routes");
const partnerRoutes = require("./src/routes/partner.routes");
const uploadRoutes = require("./src/routes/upload.routes");
const inquiryRoutes = require("./src/routes/inquiry.routes");
const settingsRoutes = require("./src/routes/settings.routes");
const userRoutes = require("./src/routes/user.routes");
const internshipRoutes = require("./src/routes/internship.routes");
const journeyRoutes = require("./src/routes/journeyRoutes");
const certificateRoutes = require("./src/routes/certificate.routes");
const serviceRoutes = require("./src/routes/service.routes");
const jobRoutes = require("./src/routes/jobPost.routes");
const contactRoutes = require("./src/routes/contact.routes");
const statsRoutes = require("./src/routes/stats.routes");
const technologyRoutes = require("./src/routes/technology.routes");
const cityRoutes = require("./src/routes/city.routes");
const { notFound, errorHandler } = require("./src/middleware/error.middleware");
const ensureSuperAdmin = require("./src/utils/ensureSuperAdmin");

dotenv.config();

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// app.use(mongoSanitize()); // Disabled due to Express 5 incompatibility
// app.use(xss()); // Disabled due to Express 5 incompatibility
app.set('trust proxy', 1);
app.use("/api/", limiter);

app.get("/api/health", (req, res) => {
  res.json({
    status: "active",
    message: "MentriQ API is running",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://mentriq-technologies-zeta.vercel.app",
    process.env.CLIENT_URL ? process.env.CLIENT_URL.trim().replace(/\/$/, "") : null,
    ...envOrigins
  ].filter(Boolean)
);

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.has(origin) ||
      /^http:\/\/localhost:\d+$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(cookieParser());
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.json({ status: "MentriQ API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/feedbacks", feedbackRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/technologies", technologyRoutes);
app.use("/api/cities", cityRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await ensureSuperAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
