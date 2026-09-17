import { Link } from "react-router";

function Doctors() {
  const doctors = [
    {
      name: "Dr. Nasreen Kasor",
      specialty: "Gynecology Specialist",
      availability: "Every Monday, 9:00 AM - 2:00 PM",
      fee: 2000,
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    },
  ];

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
        <div className="doctors-list">
          {doctors.map((doctor) => (
            <div
              className="doctor-management-card"
              key={doctor.name}
            >
              <img
                src={doctor.image}
                alt={doctor.name}
              />

              <div className="doctor-management-info">
                <h2>{doctor.name}</h2>

                <p className="doctor-specialty">
                  {doctor.specialty}
                </p>

                <p>
                  <strong>Availability:</strong>{" "}
                  {doctor.availability}
                </p>

                <p>
                  <strong>Appointment Fee:</strong>{" "}
                  PKR {doctor.fee.toLocaleString()}
                </p>

                <div className="doctor-management-actions">
                  <Link
                    to="/doctors/nasreen-kasor"
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
          ))}
        </div>
      </section>
    </main>
  );
}

export default Doctors;