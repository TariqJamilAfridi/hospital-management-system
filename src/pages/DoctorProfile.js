import { Link } from "react-router";

function DoctorProfile() {
  return (
    <main className="doctor-profile-page">

      {/* Doctor Header */}
      <section className="doctor-profile-header">

        <div className="doctor-profile-image">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=80"
            alt="Dr. Nasreen Kasor"
          />
        </div>

        <div className="doctor-profile-info">
          <p className="doctor-profile-label">Our Doctor</p>

          <h1>Dr. Nasreen Kasor</h1>

          <h2>Gynecology Specialist</h2>

          <p>
            Dr. Nasreen Kasor is an experienced gynecology specialist
            providing professional healthcare services for women's health
            and wellness.
          </p>

          <div className="doctor-profile-details">
            <p>
              <strong>Hospital:</strong> CarePlus Hospital
            </p>

            <p>
              <strong>Specialty:</strong> Gynecology
            </p>

            <p>
              <strong>Available:</strong> Every Monday
            </p>

            <p>
              <strong>Appointment Fee:</strong> PKR 2,000
            </p>
          </div>

          <Link to="/appointment" className="primary-btn">
            Book Appointment
          </Link>
        </div>

      </section>

      {/* About Doctor */}
      <section className="doctor-about-section">

        <div className="doctor-about-content">
          <h2>About Dr. Nasreen Kasor</h2>

          <p>
            Dr. Nasreen Kasor is a gynecology specialist at CarePlus
            Hospital. She focuses on providing professional and
            compassionate healthcare services for women.
          </p>

          <p>
            Patients can book an appointment online and visit the
            hospital on the available day.
          </p>
        </div>

        <div className="doctor-availability-box">
          <h3>Availability</h3>

          <p>
            <strong>Day:</strong> Monday
          </p>

          <p>
            <strong>Time:</strong> 9:00 AM - 2:00 PM
          </p>

          <p>
            <strong>Fee:</strong> PKR 2,000
          </p>
        </div>

      </section>

    </main>
  );
}

export default DoctorProfile;