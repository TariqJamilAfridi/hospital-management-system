import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        const section = document.getElementById(sectionId);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    } else {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Hospital Information */}
        <div className="footer-column">

          <h3>✚ CarePlus Hospital</h3>

          <p>
            Quality healthcare you can trust.
          </p>

        </div>


        {/* Quick Links */}
        <div className="footer-column">

          <h4>Quick Links</h4>

          <Link
            to="/"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Home
          </Link>

          <button
            type="button"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("services")}
          >
            Services
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("doctors")}
          >
            Doctors
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>

          <Link to="/appointment">
            Book Appointment
          </Link>
          <Link to="/doctors">
            All Doctors
          </Link>

          <Link to="/appointments">
            Appointments
          </Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

        </div>


        {/* Contact Information */}
        <div className="footer-column">

          <h4>Contact</h4>

          <p>
            123 Healthcare Avenue, Karachi
          </p>

          <p>
            +92 300 1234567
          </p>

          <p>
            info@careplushospital.com
          </p>

        </div>

      </div>


      {/* Copyright */}
      <div className="footer-bottom">

        <p>
          © 2026 CarePlus Hospital. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;