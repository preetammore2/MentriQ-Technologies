import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Preloader from './components/common/Preloader';
import AppErrorBoundary from './components/common/AppErrorBoundary';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import MyEnrollmentsPage from "./pages/MyEnrollmentsPage";
// import EnrollmentSuccessPage from './pages/EnrollmentSuccessPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminRoute from './components/auth/AdminRoute';
import AdminLogin from './pages/Admin/AdminLogin';
import Dashboard from './pages/Admin/Dashboard';
import CourseManagement from './pages/Admin/CourseManagement';
import EnrollmentManagement from './pages/Admin/EnrollmentManagement';
import MentorManagement from './pages/Admin/MentorManagement';
import FeedbackManagement from './pages/Admin/FeedbackManagement';
import PartnerManagement from './pages/Admin/PartnerManagement';
import UserManagement from './pages/Admin/UserManagement';
import InternshipManagement from './pages/Admin/InternshipManagement';
import JourneyManagement from './pages/Admin/JourneyManagement';
import CertificateManagement from './pages/Admin/CertificateManagement';
import ServiceManagement from './pages/Admin/ServiceManagement';
import CityManagement from './pages/Admin/CityManagement';
import JobPostManagement from './pages/Admin/JobPostManagement';

// ... (existing imports)


import InquiryManagement from './pages/Admin/InquiryManagement';
import StaffManagement from './pages/Admin/StaffManagement';
import InternshipApplicationPage from './pages/InternshipApplicationPage';
import UserAuthPage from './pages/UserAuthPage';
import TrainingPage from './pages/TrainingPage';
import TrainingDetailPage from './pages/TrainingDetailPage';
import EnrollmentFormPage from "./pages/EnrollmentFormPage";
import ServicesPage from './pages/ServicesPage';
import TrainingEnrollmentFormPage from './pages/TrainingEnrollmentFormPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import RecruitPage from './pages/RecruitPage';
import ScrollToTop from './pages/ScrollToTop';
import DemoTypewriter from './pages/DemoTypewriter';
import DemoSplinePage from './pages/DemoSplinePage';

import { useAuth } from './context/AuthContext';

import EnrollmentSuccessWrapper from './pages/EnrollmentSuccessWrapper';
// import Test from './pages/Test';



function App() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., waiting for assets or initial checks)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AppErrorBoundary>
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" />}
      </AnimatePresence>

      {!loading && (
        <>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/courses" element={<Layout><CoursesPage /></Layout>} />
            <Route path="/courses/:id" element={<Layout><CourseDetailPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/services" element={<Layout><ServicesPage /></Layout>} />
            <Route path="/training" element={<Layout><TrainingPage /></Layout>} />
            <Route path="/training/:id" element={<Layout><TrainingDetailPage /></Layout>} />
            {/* <Route path='/test' element={<Layout><Test/></Layout>}/> */}
            <Route path="/enroll/:courseId" element={<Layout><EnrollmentFormPage /></Layout>} />
            <Route path="/enrollf/:courseId" element={<Layout><TrainingEnrollmentFormPage /></Layout>} />

            <Route path="/enrollment-success" element={<EnrollmentSuccessWrapper />} />

            <Route
              path="/my-enrollments"
              element={
                isAuthenticated ? (
                  <Layout>
                    <MyEnrollmentsPage />
                  </Layout>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
            <Route path="/verify-certificate" element={<Layout><VerifyCertificatePage /></Layout>} />
            <Route path="/recruit" element={<Layout><RecruitPage /></Layout>} />
            <Route path="/internship/apply/:internshipId" element={<Layout><InternshipApplicationPage /></Layout>} />
            <Route path="/login" element={<UserAuthPage />} />
            <Route path="/register" element={<UserAuthPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CourseManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/enrollments"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <EnrollmentManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/mentors"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <MentorManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <FeedbackManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <JobPostManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/staff"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <StaffManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/inquiries"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <InquiryManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/partners"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <PartnerManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/internships"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <InternshipManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/journey"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <JourneyManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CertificateManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/services"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <ServiceManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/admin/cities"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <CityManagement />
                  </AdminLayout>
                </AdminRoute>
              }
            />
            <Route path="/demo-typewriter" element={<Layout><DemoTypewriter /></Layout>} />
            <Route path="/demo-spline" element={<Layout><DemoSplinePage /></Layout>} />
            <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
          </Routes>
        </>
      )}
    </AppErrorBoundary>
  );
}

export default App;
