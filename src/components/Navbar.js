import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const closeMenu = () => {
    setMenuOpen(false);
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
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

  useEffect(() => {
    const sectionIds = ["home", "services", "doctors", "about", "contact"];
    if (location.pathname !== "/") {
      setActiveSection("");
      return undefined;
    }

    const updateActiveSection = () => {
      const headerOffset = 90;
      const currentSection = sectionIds
        .map((id) => document.getElementById(id))
        .filter(Boolean)
        .filter((section) => section.getBoundingClientRect().top <= headerOffset)
        .pop();

      setActiveSection(currentSection?.id || "home");
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="hospital-name"
          onClick={closeMenu}
        >
          CarePlus Hospital
        </Link>

        <button
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          Menu
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "nav-links-open" : ""
          }`}
        >
          {/* For Admin - Show only Admin Dashboard */}
          {isAuthenticated() && isAdmin() ? (
            <>
              <Link
                to="/admin/dashboard"
                onClick={closeMenu}
                className="nav-link-admin"
              >
                Admin Dashboard
              </Link>
            </>
          ) : (
            <>
              {/* For Regular Users and Guests - Show all navigation */}
              <Link
                to="/"
                className={activeSection === "home" ? "nav-link active" : "nav-link"}
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
                className={activeSection === "services" ? "nav-link active" : "nav-link"}
                onClick={() => scrollToSection("services")}
              >
                Services
              </button>

              <button
                type="button"
                className={activeSection === "doctors" ? "nav-link active" : "nav-link"}
                onClick={() => scrollToSection("doctors")}
              >
                Doctors
              </button>

              <button
                type="button"
                className={activeSection === "about" ? "nav-link active" : "nav-link"}
                onClick={() => scrollToSection("about")}
              >
                About
              </button>

              <button
                type="button"
                className={activeSection === "contact" ? "nav-link active" : "nav-link"}
                onClick={() => scrollToSection("contact")}
              >
                Contact
              </button>

              <Link
                to="/doctors"
                onClick={closeMenu}
              >
                All Doctors
              </Link>

              {/* Show Book Appointment button */}
              {isAuthenticated() ? (
                <Link
                  to="/appointment"
                  className="appointment-btn"
                  onClick={closeMenu}
                >
                  Book Appointment
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="appointment-btn"
                  onClick={closeMenu}
                >
                  Book Appointment
                </Link>
              )}
            </>
          )}

          {/* Auth buttons */}
          {isAuthenticated() ? (
            <div className="user-menu-wrapper">
              <button
                type="button"
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <span className="user-avatar">
                  {user?.fullName?.charAt(0) || "U"}
                </span>
                <span className="user-name">{user?.fullName}</span>
                <span className="dropdown-arrow">▾</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-email">{user?.email}</p>
                    <span className="user-role">
                      {user?.role === "admin" ? "Admin" : "User"}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {/* Show only Admin Dashboard for admin */}
                  {isAdmin() && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMenu}
                      className="dropdown-item"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <div className="dropdown-divider"></div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link
                to="/login"
                className="login-btn"
                onClick={closeMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="signup-btn"
                onClick={closeMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;