import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import DoctorProfile from "./pages/DoctorProfile";
import Appointment from "./pages/Appointment";
import Payment from "./pages/Payment";
import AppointmentSuccess from "./pages/AppointmentSuccess";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import "./App.css";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
}

function SeoManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seoByPath = [
      { match: /^\/$/, title: "CarePlus Hospital | Trusted Healthcare", description: "CarePlus Hospital provides trusted healthcare services, experienced doctors, and convenient online appointment booking in Karachi." },
      { match: /^\/doctors$/, title: "Our Doctors | CarePlus Hospital", description: "Meet the experienced doctors and healthcare professionals at CarePlus Hospital." },
      { match: /^\/doctors\//, title: "Doctor Profile | CarePlus Hospital", description: "View doctor specialties, experience, availability, and appointment information at CarePlus Hospital." },
      { match: /^\/appointment$/, title: "Book an Appointment | CarePlus Hospital", description: "Choose a doctor and book your CarePlus Hospital appointment online." },
      { match: /^\/login$/, title: "Login | CarePlus Hospital", description: "Log in to your CarePlus Hospital account." },
      { match: /^\/signup$/, title: "Create an Account | CarePlus Hospital", description: "Create your CarePlus Hospital account to book and manage appointments." },
      { match: /^\/admin\//, title: "Admin Dashboard | CarePlus Hospital", description: "Manage CarePlus Hospital appointments and doctors." },
    ];

    const pageSeo = seoByPath.find((entry) => entry.match.test(pathname)) || {
      title: "CarePlus Hospital | Trusted Healthcare",
      description: "CarePlus Hospital provides trusted healthcare services and convenient online appointment booking.",
    };

    document.title = pageSeo.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", pageSeo.description);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}${pathname}`);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <SeoManager />
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:doctorId" element={<DoctorProfile />} />
            <Route path="/doctors/nasreen-kasor" element={<DoctorProfile />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

            {/* Protected Routes - Require Login */}
            <Route
              path="/appointment"
              element={
                <ProtectedRoute>
                  <Appointment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointment-success"
              element={
                <ProtectedRoute>
                  <AppointmentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
