import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getAppointments, getDoctors, addDoctor, updateDoctor, deleteDoctor, updateAppointmentStatus } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Doctor form state
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorFormData, setDoctorFormData] = useState({
    name: "",
    specialty: "",
    qualifications: "",
    experience: "",
    email: "",
    phone: "",
    gender: "Male",
    availability: "",
    consultationFee: "2000",
    about: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [appointmentsData, doctorsData] = await Promise.all([
        getAppointments(),
        getDoctors(),
      ]);

      setAppointments(appointmentsData.appointments || []);
      setDoctors(doctorsData.doctors || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Statistics
  const totalAppointments = appointments.length;
  const bookedAppointments = appointments.filter(apt => apt.appointmentStatus === "Booked").length;
  const completedAppointments = appointments.filter(apt => apt.appointmentStatus === "Completed").length;
  const paidAppointments = appointments.filter(apt => apt.paymentStatus === "Paid").length;
  const totalRevenue = appointments
    .filter(apt => apt.paymentStatus === "Paid")
    .reduce((sum, apt) => sum + (apt.fee || 0), 0);

  // Doctor Form Handlers
  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;
    setDoctorFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateDoctorForm = () => {
    const errors = {};
    if (!doctorFormData.name.trim()) errors.name = "Name is required";
    if (!doctorFormData.specialty.trim()) errors.specialty = "Specialty is required";
    if (!doctorFormData.qualifications.trim()) errors.qualifications = "Qualifications required";
    if (!doctorFormData.experience) errors.experience = "Experience is required";
    if (!doctorFormData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(doctorFormData.email)) {
      errors.email = "Invalid email";
    }
    if (!doctorFormData.phone.trim()) errors.phone = "Phone is required";
    else if (!/^[0-9]{11}$/.test(doctorFormData.phone)) {
      errors.phone = "Phone must be 11 digits";
    }
    if (!doctorFormData.gender) errors.gender = "Gender is required";
    if (!doctorFormData.availability.trim()) errors.availability = "Available days are required";
    if (!doctorFormData.consultationFee) errors.consultationFee = "Fee is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDoctor = () => {
    setEditingDoctor(null);
    setDoctorFormData({
      name: "",
      specialty: "",
      qualifications: "",
      experience: "",
      email: "",
      phone: "",
      gender: "Male",
      availability: "",
      consultationFee: "2000",
      about: "",
    });
    setFormErrors({});
    setShowDoctorForm(true);
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications,
      experience: doctor.experience.toString(),
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender || "Male",
      availability: Array.isArray(doctor.availability) ? doctor.availability.join(", ") : (doctor.availableDays || ""),
      consultationFee: doctor.consultationFee.toString(),
      about: doctor.about || "",
    });
    setFormErrors({});
    setShowDoctorForm(true);
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    if (!validateDoctorForm()) return;

    setLoading(true);
    try {
      const doctorData = {
        ...doctorFormData,
        experience: parseInt(doctorFormData.experience),
        availability: doctorFormData.availability
          .split(",")
          .map((day) => day.trim())
          .filter(Boolean),
        consultationFee: parseInt(doctorFormData.consultationFee),
      };

      if (editingDoctor) {
        await updateDoctor(editingDoctor._id, doctorData);
      } else {
        await addDoctor(doctorData);
      }

      setShowDoctorForm(false);
      await fetchDashboardData();
    } catch (err) {
      setError(err.message || "Failed to save doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Are you sure you want to deactivate this doctor?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteDoctor(doctorId);
      await fetchDashboardData();
    } catch (err) {
      setError(err.message || "Failed to delete doctor");
    } finally {
      setLoading(false);
    }
  };

  const handleAppointmentStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, appointmentStatus: newStatus }
            : appointment
        )
      );
    } catch (err) {
      setError(err.message || "Failed to update appointment status");
    }
  };

  const handleCancelForm = () => {
    setShowDoctorForm(false);
    setEditingDoctor(null);
    setDoctorFormData({
      name: "",
      specialty: "",
      qualifications: "",
      experience: "",
      email: "",
      phone: "",
      gender: "Male",
      availability: "",
      consultationFee: "2000",
      about: "",
    });
    setFormErrors({});
  };

  if (loading && !showDoctorForm) {
    return <LoadingSpinner message="Loading admin dashboard..." />;
  }

  return (
    <main className="admin-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.fullName}</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
            onClick={() => setActiveTab("appointments")}
          >
            📅 Appointments
          </button>
          <button
            className={`tab-btn ${activeTab === "doctors" ? "active" : ""}`}
            onClick={() => setActiveTab("doctors")}
          >
            👨‍⚕️ Doctors
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>Total Appointments</h3>
                  <p className="stat-number">{totalAppointments}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-info">
                  <h3>Booked</h3>
                  <p className="stat-number">{bookedAppointments}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎉</div>
                <div className="stat-info">
                  <h3>Completed</h3>
                  <p className="stat-number">{completedAppointments}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">PKR {totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💳</div>
                <div className="stat-info">
                  <h3>Paid Appointments</h3>
                  <p className="stat-number">{paidAppointments}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👨‍⚕️</div>
                <div className="stat-info">
                  <h3>Total Doctors</h3>
                  <p className="stat-number">{doctors.length}</p>
                </div>
              </div>
            </div>

            <div className="recent-appointments">
              <h2>Recent Appointments</h2>
              <div className="appointments-table-wrapper">
                <table className="appointments-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Doctor</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.slice(0, 10).map((apt) => (
                      <tr key={apt._id}>
                        <td>{apt.fullName}</td>
                        <td>{apt.doctor}</td>
                        <td>{apt.date}</td>
                        <td>{apt.time}</td>
                        <td>
                          <span className={`badge badge-${apt.paymentStatus.toLowerCase()}`}>
                            {apt.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`badge badge-${apt.appointmentStatus.toLowerCase()}`}>
                            {apt.appointmentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <div className="dashboard-content">
            <div className="content-header">
              <h2>All Appointments</h2>
              <p>{totalAppointments} total appointments</p>
            </div>

            <div className="appointments-table-wrapper">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Doctor</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Fee</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr key={apt._id}>
                      <td className="id-cell">{apt._id.slice(-6)}</td>
                      <td>{apt.fullName}</td>
                      <td>{apt.email}</td>
                      <td>{apt.phone}</td>
                      <td>{apt.doctor}</td>
                      <td>{apt.date}</td>
                      <td>{apt.time}</td>
                      <td>PKR {apt.fee?.toLocaleString()}</td>
                      <td>
                        <span className={`badge badge-${apt.paymentStatus.toLowerCase()}`}>
                          {apt.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${apt.appointmentStatus.toLowerCase()}`}>
                          {apt.appointmentStatus}
                        </span>
                      </td>
                        <td>
                          <div className="admin-appointment-actions">
                            <button
                              type="button"
                              className="admin-status-btn admin-status-complete"
                              onClick={() => handleAppointmentStatusChange(apt._id, "Completed")}
                              disabled={apt.appointmentStatus === "Completed" || apt.appointmentStatus === "Cancelled"}
                            >
                              Mark Complete
                            </button>
                            <button
                              type="button"
                              className="admin-status-btn admin-status-cancel"
                              onClick={() => handleAppointmentStatusChange(apt._id, "Cancelled")}
                              disabled={apt.appointmentStatus === "Cancelled" || apt.appointmentStatus === "Completed"}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Doctors Tab */}
        {activeTab === "doctors" && (
          <div className="dashboard-content">
            <div className="content-header">
              <div>
                <h2>Manage Doctors</h2>
                <p>{doctors.length} total doctors</p>
              </div>
              <button onClick={handleAddDoctor} className="btn-primary">
                + Add New Doctor
              </button>
            </div>

            {showDoctorForm && (
              <div className="doctor-form-modal">
                <div className="modal-overlay" onClick={handleCancelForm}></div>
                <div className="doctor-form-card">
                  <h3>{editingDoctor ? "Edit Doctor" : "Add New Doctor"}</h3>
                  
                  <form onSubmit={handleSaveDoctor} className="doctor-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={doctorFormData.name}
                          onChange={handleDoctorFormChange}
                          placeholder="Dr. John Doe"
                          className={formErrors.name ? "error" : ""}
                        />
                        {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                      </div>

                      <div className="form-group">
                        <label>Specialty *</label>
                        <input
                          type="text"
                          name="specialty"
                          value={doctorFormData.specialty}
                          onChange={handleDoctorFormChange}
                          placeholder="Cardiology"
                          className={formErrors.specialty ? "error" : ""}
                        />
                        {formErrors.specialty && <span className="error-message">{formErrors.specialty}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Qualifications *</label>
                      <input
                        type="text"
                        name="qualifications"
                        value={doctorFormData.qualifications}
                        onChange={handleDoctorFormChange}
                        placeholder="MBBS, MD, FCPS"
                        className={formErrors.qualifications ? "error" : ""}
                      />
                      {formErrors.qualifications && <span className="error-message">{formErrors.qualifications}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Experience (years) *</label>
                        <input
                          type="number"
                          name="experience"
                          value={doctorFormData.experience}
                          onChange={handleDoctorFormChange}
                          min="0"
                          placeholder="10"
                          className={formErrors.experience ? "error" : ""}
                        />
                        {formErrors.experience && <span className="error-message">{formErrors.experience}</span>}
                      </div>

                      <div className="form-group">
                        <label>Consultation Fee (PKR) *</label>
                        <input
                          type="number"
                          name="consultationFee"
                          value={doctorFormData.consultationFee}
                          onChange={handleDoctorFormChange}
                          min="0"
                          placeholder="2000"
                          className={formErrors.consultationFee ? "error" : ""}
                        />
                        {formErrors.consultationFee && <span className="error-message">{formErrors.consultationFee}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          name="email"
                          value={doctorFormData.email}
                          onChange={handleDoctorFormChange}
                          placeholder="doctor@example.com"
                          className={formErrors.email ? "error" : ""}
                        />
                        {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                      </div>

                      <div className="form-group">
                        <label>Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={doctorFormData.phone}
                          onChange={handleDoctorFormChange}
                          placeholder="03001234567"
                          maxLength="11"
                          className={formErrors.phone ? "error" : ""}
                        />
                        {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Gender *</label>
                        <select
                          name="gender"
                          value={doctorFormData.gender}
                          onChange={handleDoctorFormChange}
                          className={formErrors.gender ? "error" : ""}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {formErrors.gender && <span className="error-message">{formErrors.gender}</span>}
                      </div>

                      <div className="form-group">
                        <label>Available Days *</label>
                        <input
                          type="text"
                          name="availability"
                          value={doctorFormData.availability}
                          onChange={handleDoctorFormChange}
                          placeholder="Monday, Wednesday, Friday"
                          className={formErrors.availability ? "error" : ""}
                        />
                        {formErrors.availability && <span className="error-message">{formErrors.availability}</span>}
                      </div>
                    </div>

                    <div className="form-group">
                      <label>About</label>
                      <textarea
                        name="about"
                        value={doctorFormData.about}
                        onChange={handleDoctorFormChange}
                        placeholder="Brief description about the doctor..."
                        rows="3"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="button" onClick={handleCancelForm} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Saving..." : editingDoctor ? "Update Doctor" : "Add Doctor"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="doctors-grid">
              {doctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card admin-doctor-card">
                  <div className="doctor-header admin-doctor-header">
                    <div className="doctor-avatar admin-doctor-avatar">
                      {doctor.profileImage ? (
                        <img src={doctor.profileImage} alt={doctor.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {doctor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="doctor-info admin-doctor-info">
                      <h3>{doctor.name}</h3>
                      <p className="specialty">{doctor.specialty}</p>
                      <p className="qualifications">{doctor.qualifications}</p>
                    </div>
                  </div>

                  <div className="doctor-details admin-doctor-details">
                    <div className="detail-row admin-detail-row">
                      <span>Experience:</span>
                      <strong>{doctor.experience} years</strong>
                    </div>
                    <div className="detail-row admin-detail-row">
                      <span>Fee:</span>
                      <strong>PKR {doctor.consultationFee?.toLocaleString()}</strong>
                    </div>
                    <div className="detail-row admin-detail-row">
                      <span>Email:</span>
                      <strong>{doctor.email}</strong>
                    </div>
                    <div className="detail-row admin-detail-row">
                      <span>Phone:</span>
                      <strong>{doctor.phone}</strong>
                    </div>
                    <div className="detail-row admin-detail-row">
                      <span>Gender:</span>
                      <strong>{doctor.gender || "Other"}</strong>
                    </div>
                    <div className="detail-row admin-detail-row">
                      <span>Available Days:</span>
                      <strong>{Array.isArray(doctor.availability) ? doctor.availability.join(", ") : (doctor.availableDays || "Not specified")}</strong>
                    </div>
                    <div className="detail-row admin-detail-row">
                      <span>Rating:</span>
                      <strong>⭐ {doctor.rating}/5</strong>
                    </div>
                  </div>

                  <div className="doctor-actions admin-doctor-actions">
                    <button onClick={() => handleEditDoctor(doctor)} className="btn-edit">
                      ✏️ Edit
                    </button>
                    <button onClick={() => handleDeleteDoctor(doctor._id)} className="btn-delete">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
