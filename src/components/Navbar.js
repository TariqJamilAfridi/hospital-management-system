import { useState } from "react";
import { Link, useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    closeMenu();

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
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="hospital-name"
          onClick={closeMenu}
        >
          ✚ CarePlus Hospital
        </Link>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "nav-links-open" : ""
          }`}
        >
          <Link
            to="/"
            onClick={() => {
              closeMenu();

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

          <Link
            to="/dashboard"
            onClick={closeMenu}
          >
            Dashboard
          </Link>

          <Link
            to="/appointments"
            onClick={closeMenu}
          >
            Appointments
          </Link>

          <Link
            to="/doctors"
            onClick={closeMenu}
          >
            All Doctors
          </Link>

          <Link
            to="/appointment"
            className="appointment-btn"
            onClick={closeMenu}
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;