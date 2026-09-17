import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DoctorProfile from "./pages/DoctorProfile";
import Appointment from "./pages/Appointment";
import Payment from "./pages/Payment";
import AppointmentSuccess from "./pages/AppointmentSuccess";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/doctors"
          element={<Doctors />}
        />

        <Route
          path="/doctors/nasreen-kasor"
          element={<DoctorProfile />}
        />

        <Route
          path="/appointment"
          element={<Appointment />}
        />

        <Route
          path="/payment"
          element={<Payment />}
        />

        <Route
          path="/appointment-success"
          element={<AppointmentSuccess />}
        />

        <Route
          path="/appointments"
          element={<Appointments />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;