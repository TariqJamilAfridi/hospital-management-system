import { useEffect } from "react";
import { Link } from "react-router";
function Home() {
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
    }, []);
    const services = [
        {
            title: "General Medicine",
            description:
                "Complete medical care for common illnesses and health conditions.",
        },
        {
            title: "Gynecology",
            description:
                "Professional healthcare services for women's health and wellness.",
        },
        {
            title: "Laboratory Services",
            description:
                "Reliable laboratory testing to support accurate diagnosis.",
        },
        {
            title: "Emergency Care",
            description:
                "Quick and professional medical care for emergency situations.",
        },
    ];

    return (
        <main>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Quality Healthcare You Can Trust</h1>

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
                            onClick={() => {
                                const section = document.getElementById("doctors");

                                if (section) {
                                    section.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                                }
                            }}
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
                    {services.map((service, index) => (
                        <div className="service-card" key={index}>
                            <div className="service-icon">
                                ✚
                            </div>

                            <h3>{service.title}</h3>

                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>


            {/* Doctors Section */}
            <section className="doctors-section" id="doctors">
                <div className="section-heading">
                    <h2>Our Doctors</h2>

                    <p>
                        Meet our experienced healthcare professionals.
                    </p>
                </div>

                <div className="doctor-card">
                    <div className="doctor-image">
                        <img
                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80"
                            alt="Dr. Nasreen Kasor"
                        />
                    </div>

                    <div className="doctor-info">
                        <h3>Dr. Nasreen Kasor</h3>

                        <p className="doctor-specialty">
                            Gynecology Specialist
                        </p>

                        <p className="doctor-availability">
                            <strong>Available:</strong> Every Monday
                        </p>

                        <div className="doctor-buttons">
                            <Link to="/doctors/nasreen-kasor" className="secondary-btn">
                                View Profile
                            </Link>

                            <a
                                href="/appointment"
                                className="primary-btn"
                            >
                                Book Appointment
                            </a>
                        </div>
                        <div className="doctors-section-action">
                            <Link
                                to="/doctors"
                                className="view-all-doctors-btn"
                            >
                                View All Doctors
                            </Link>
                        </div>
                    </div>
                </div>
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
                            <h3>Hospital Address</h3>
                            <p>
                                123 Healthcare Avenue, Karachi
                            </p>
                        </div>

                        <div className="contact-item">
                            <h3>Phone</h3>
                            <p>
                                +92 300 1234567
                            </p>
                        </div>

                        <div className="contact-item">
                            <h3>Email</h3>
                            <p>
                                info@careplushospital.com
                            </p>
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