import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments } from "../services/api";
import { formatCurrency } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAppointments();
            
            console.log("📊 Dashboard - API Response:", data);
            
            // Handle both response formats
            const appointmentList = data.appointments || data;
            
            console.log("📊 Dashboard - Appointments Count:", appointmentList.length);
            console.log("📊 Dashboard - Appointments List:", appointmentList);
            
            setAppointments(appointmentList);
        } catch (error) {
            console.error("❌ Dashboard - Error fetching appointments:", error);
            setError(error.message || "Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    const totalAppointments = appointments.length;

    const paidAppointments = appointments.filter(
        (appointment) =>
            appointment.paymentStatus === "Paid"
    ).length;

    const pendingPayments = appointments.filter(
        (appointment) =>
            appointment.paymentStatus === "Pending"
    ).length;

    const completedAppointments = appointments.filter(
        (appointment) =>
            appointment.appointmentStatus === "Completed"
    ).length;

    const cancelledAppointments = appointments.filter(
        (appointment) =>
            appointment.appointmentStatus === "Cancelled"
    ).length;

    const totalRevenue = appointments
        .filter(
            (appointment) =>
                appointment.paymentStatus === "Paid"
        )
        .reduce(
            (total, appointment) =>
                total + (appointment.fee || 0),
            0
        );

    const stats = [
        {
            title: "Total Appointments",
            value: totalAppointments,
            icon: "📅",
        },
        {
            title: "Paid Appointments",
            value: paidAppointments,
            icon: "💳",
        },
        {
            title: "Pending Payments",
            value: pendingPayments,
            icon: "⏳",
        },
        {
            title: "Completed",
            value: completedAppointments,
            icon: "✅",
        },
        {
            title: "Cancelled",
            value: cancelledAppointments,
            icon: "❌",
        },
        {
            title: "Total Revenue",
            value: formatCurrency(totalRevenue),
            icon: "💰",
        },
    ];

    return (
        <main className="dashboard-page">
            <section className="dashboard-header">
                <h1>Hospital Dashboard</h1>

                <p>
                    Overview of CarePlus Hospital appointments.
                </p>
            </section>

            <section className="dashboard-section">
                {loading ? (
                    <LoadingSpinner message="Loading dashboard..." />
                ) : error ? (
                    <div className="dashboard-error">
                        <p>{error}</p>
                        <button 
                            onClick={fetchAppointments}
                            className="primary-btn"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="dashboard-stats">
                            {stats.map((stat) => (
                                <div
                                    className="dashboard-card"
                                    key={stat.title}
                                >
                                    <div className="dashboard-card-icon">
                                        {stat.icon}
                                    </div>

                                    <div>
                                        <p>{stat.title}</p>
                                        <h2>{stat.value}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="recent-appointments">
                            <div className="recent-appointments-header">
                                <h2>All Appointments ({appointments.length})</h2>

                                <button
                                    type="button"
                                    className="dashboard-refresh-btn"
                                    onClick={fetchAppointments}
                                >
                                    ↻ Refresh Data
                                </button>
                            </div>

                            {appointments.length === 0 ? (
                                <div className="dashboard-message">
                                    <p>No appointments available.</p>
                                    <Link to="/appointment" className="primary-btn">
                                        Book First Appointment
                                    </Link>
                                </div>
                            ) : (
                                <div className="recent-appointments-table">
                                    <table>
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
                                            {appointments.map((appointment) => (
                                                <tr key={appointment._id}>
                                                    <td>
                                                        {appointment.fullName}
                                                    </td>

                                                    <td>
                                                        {appointment.doctor}
                                                    </td>

                                                    <td>
                                                        {appointment.date}
                                                    </td>

                                                    <td>
                                                        {appointment.time}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                appointment.paymentStatus ===
                                                                    "Paid"
                                                                    ? "status-paid"
                                                                    : "status-pending"
                                                            }
                                                        >
                                                            {appointment.paymentStatus}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                appointment.appointmentStatus ===
                                                                    "Completed"
                                                                    ? "status-paid"
                                                                    : appointment.appointmentStatus ===
                                                                        "Cancelled"
                                                                        ? "status-pending"
                                                                        : "status-booked"
                                                            }
                                                        >
                                                            {
                                                                appointment.appointmentStatus
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="recent-appointments-footer">
                                <p>Total: {appointments.length} appointments</p>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default Dashboard;