import { Link, useLocation } from "react-router";

function AppointmentSuccess() {
  const location = useLocation();

  const appointment = location.state;

  return (
    <main className="success-page">

      <section className="success-container">

        {/* Success Icon */}
        <div className="success-icon">
          ✓
        </div>


        {/* Success Message */}
        <h1>
          Appointment Booked Successfully!
        </h1>

        <p className="success-message">
          Your appointment with{" "}
          {appointment?.doctor || "Dr. Nasreen Kasor"}{" "}
          has been successfully booked.
        </p>


        {/* Appointment Details */}
        <div className="success-details">

          <h2>Appointment Details</h2>


          <div className="success-detail-item">
            <span>Patient</span>

            <strong>
              {appointment?.fullName || "Not provided"}
            </strong>
          </div>


          <div className="success-detail-item">
            <span>Doctor</span>

            <strong>
              {appointment?.doctor || "Dr. Nasreen Kasor"}
            </strong>
          </div>


          <div className="success-detail-item">
            <span>Specialty</span>

            <strong>
              {appointment?.specialty ||
                "Gynecology Specialist"}
            </strong>
          </div>


          <div className="success-detail-item">
            <span>Date</span>

            <strong>
              {appointment?.date || "Not selected"}
            </strong>
          </div>


          <div className="success-detail-item">
            <span>Time</span>

            <strong>
              {appointment?.time || "Not selected"}
            </strong>
          </div>


          <div className="success-detail-item">
            <span>Hospital</span>

            <strong>
              CarePlus Hospital
            </strong>
          </div>


          <div className="success-detail-item">
            <span>Amount Paid</span>

            <strong>
              PKR {(appointment?.fee || 2000).toLocaleString()}
            </strong>
          </div>

        </div>


        {/* Confirmation Message */}
        <p className="confirmation-message">
          A confirmation message will be sent to your
          email and phone number.
        </p>


        {/* Buttons */}
        <div className="success-buttons">

          <Link
            to="/"
            className="primary-btn"
          >
            Back to Home
          </Link>


          <Link
            to="/doctors/nasreen-kasor"
            className="secondary-btn"
          >
            View Doctor Profile
          </Link>

        </div>

      </section>

    </main>
  );
}

export default AppointmentSuccess;