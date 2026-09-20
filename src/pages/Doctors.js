import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "../services/api";
import { getDoctorAvatarData } from "../utils/helpers";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getDoctors();
        console.log("📋 Fetched doctors:", data);
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("❌ Error fetching doctors:", error);
        setError("Unable to load doctors. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <main className="doctors-page">
      <div className="doctors-back-container">
        <Link to="/" className="doctors-back-btn">
          ← Back to Home
        </Link>
      </div>
      <section className="doctors-page-header">
        <h1>Our Doctors</h1>

        <p>
          Meet our qualified doctors at CarePlus Hospital.
        </p>
      </section>

      <section className="doctors-page-section">
        {loading && (
          <div className="loading-message">
            <p>Loading doctors...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && doctors.length === 0 && (
          <div className="no-doctors-message">
            <p>No doctors available at the moment.</p>
          </div>
        )}

        {!loading && !error && doctors.length > 0 && (
          <div className="doctors-list">
            {doctors.map((doctor) => {
              const avatar = getDoctorAvatarData(doctor);

              return (
                <div
                  className="doctor-management-card"
                  key={doctor._id}
                >
                  <div className={`doctor-avatar doctor-avatar-${avatar.gender}`} aria-label={`${doctor.name} avatar`}>
                    <span>{avatar.initials}</span>
                  </div>

                  <div className="doctor-management-info">
                    <h2>{doctor.name}</h2>

                    <p className="doctor-specialty">
                      {doctor.specialty}
                    </p>

                    <p>
                      <strong>Availability:</strong>{" "}
                      {doctor.availableDays} - {doctor.availableTime}
                    </p>

                    <p>
                      <strong>Appointment Fee:</strong>{" "}
                      PKR {(doctor.fee || 0).toLocaleString()}
                    </p>

                    {doctor.experience && (
                      <p>
                        <strong>Experience:</strong> {doctor.experience} years
                      </p>
                    )}

                    <div className="doctor-management-actions">
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="view-doctor-btn"
                      >
                        View Profile
                      </Link>

                      <Link
                        to="/appointment"
                        className="book-doctor-btn"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Doctors;