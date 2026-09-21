import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { APP_TAGLINE, SERVICES, CONTACT_INFO } from "../config/constants";
import { getDoctorAvatarData, scrollToElement } from "../utils/helpers";
import { getDoctors } from "../services/api";

function Home() {
    const [doctors, setDoctors] = useState([]);
    const [loadingDoctors, setLoadingDoctors] = useState(true);

    useEffect(() => {
        const sectionId = window.location.hash;

        if (sectionId) {
            const section = document.querySelector(sectionId);

            if (section) {
                setTimeout(() => {
                    section.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                    });
                }, 100);
            }
        }

        // Fetch doctors from database
        const fetchDoctors = async () => {
            try {
                setLoadingDoctors(true);
                const data = await getDoctors();
                console.log("📋 Fetched doctors for home page:", data);
                setDoctors(data.doctors || []);
            } catch (error) {
                console.error("❌ Error fetching doctors:", error);
                setDoctors([]);
            } finally {
                setLoadingDoctors(false);
            }
        };

        fetchDoctors();
    }, []);

    const featuredDoctors = doctors.slice(0, 3);

    return (
        <main>
            {/* Hero Section */}
            <section className="hero" id="home">
                <div className="hero-content">
                    <h1>{APP_TAGLINE}</h1>

                    <p>
                        We provide trusted healthcare services with experienced doctors
                        and easy online appointment booking.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/appointment" className="primary-btn">
                            Book an Appointment
                        </Link>

                        <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => scrollToElement("doctors")}
                        >
                            Meet Our Doctors
                        </button>
                    </div>
                </div>

                <div className="hero-image">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80"
                        alt="Doctor providing healthcare"
                    />
                </div>
            </section>


            {/* Services Section */}
            <section className="services-section" id="services">
                <div className="section-heading">
                    <h2>Our Healthcare Services</h2>

                    <p>
                        Professional healthcare services for you and your family.
                    </p>
                </div>

                <div className="services-container">
                    {SERVICES.map((service) => (
                        <div className="service-card" key={service.id}>
                            <div className="service-icon">
                                {service.title.substring(0, 2).toUpperCase()}
                            </div>

                            <h3>{service.title}</h3>

                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>


            <div className="hospital-story-section">
                {/* Doctors Section */}
                <section className="doctors-section" id="doctors">
                    <div className="section-heading">
                        <h2>Our Doctors</h2>

                        <p>
                            Meet our experienced healthcare professionals.
                        </p>
                    </div>

                    {loadingDoctors && (
                        <div className="loading-message">
                            <p>Loading doctors...</p>
                        </div>
                    )}

                    {!loadingDoctors && doctors.length === 0 && (
                        <div className="no-doctors-message">
                            <p>No doctors available at the moment.</p>
                        </div>
                    )}

                    {!loadingDoctors && featuredDoctors.length > 0 && (
                        <div className="featured-doctors-grid">
                            {featuredDoctors.map((doctor) => {
                                const avatar = getDoctorAvatarData(doctor);

                                return (
                                    <div className="featured-doctor-card" key={doctor._id || doctor.name}>
                                        <div className={`doctor-avatar doctor-avatar-${avatar.gender}`} aria-label={`${doctor.name} avatar`}>
                                            <span>{avatar.initials}</span>
                                        </div>

                                        <div className="doctor-info">
                                            <h3>{doctor.name}</h3>

                                            <p className="doctor-specialty">
                                                {doctor.specialty}
                                            </p>

                                            <p className="doctor-availability">
                                                <strong>Available:</strong> {doctor.availableDays || 'Not specified'}
                                            </p>

                                            {doctor.experience && (
                                                <p className="doctor-experience">
                                                    <strong>Experience:</strong> {doctor.experience} years
                                                </p>
                                            )}

                                            {doctor.fee && (
                                                <p className="doctor-fee">
                                                    <strong>Fee:</strong> PKR {doctor.fee.toLocaleString()}
                                                </p>
                                            )}

                                            <div className="doctor-buttons">
                                                <Link to={`/doctors/${doctor._id}`} className="secondary-btn">
                                                    View Profile
                                                </Link>

                                                <Link
                                                    to="/appointment"
                                                    className="primary-btn"
                                                >
                                                    Book Appointment
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="doctors-section-action">
                                <Link
                                    to="/doctors"
                                    className="view-all-doctors-btn"
                                >
                                    View All Doctors
                                </Link>
                            </div>
                        </div>
                    )}
                </section>


                {/* About Section */}
                <section className="about-section" id="about">
                    <div className="about-image">
                        <img
                            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80"
                            alt="CarePlus Hospital"
                        />
                    </div>

                    <div className="about-content">
                        <h2>About CarePlus Hospital</h2>

                        <p>
                            CarePlus Hospital provides quality healthcare services with
                            experienced doctors and modern facilities.
                        </p>

                        <p>
                            Our goal is to make healthcare simple, trusted, and accessible
                            for everyone.
                        </p>
                    </div>
                </section>
            </div>


            {/* Contact Section */}
            <section className="contact-section" id="contact">
                <div className="section-heading">
                    <h2>Contact Us</h2>

                    <p>
                        Have questions? We're here to help.
                    </p>
                </div>

                <div className="contact-container">

                    {/* Contact Information */}
                    <div className="contact-info">

                        <div className="contact-item">
                            <div className="contact-icon" aria-hidden="true">📍</div>
                            <div className="contact-text">
                                <h3>Hospital Address</h3>
                                <p>
                                    {CONTACT_INFO.address}
                                </p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon" aria-hidden="true">📞</div>
                            <div className="contact-text">
                                <h3>Phone</h3>
                                <p>
                                    {CONTACT_INFO.phone}
                                </p>
                            </div>
                        </div>

                        <div className="contact-item">
                            <div className="contact-icon" aria-hidden="true">✉️</div>
                            <div className="contact-text">
                                <h3>Email</h3>
                                <p>
                                    {CONTACT_INFO.email}
                                </p>
                            </div>
                        </div>

                    </div>


                    {/* Contact Form */}
                    <form className="contact-form">

                        <div className="form-group">
                            <label htmlFor="name">
                                Full Name
                            </label>

                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your full name"
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email address"
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="message">
                                Message
                            </label>

                            <textarea
                                id="message"
                                rows="5"
                                placeholder="Write your message"
                            ></textarea>
                        </div>


                        <button type="submit" className="primary-btn">
                            Send Message
                        </button>

                    </form>

                </div>
            </section>

        </main>
    );
}

export default Home;