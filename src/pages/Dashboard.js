import { useEffect, useState } from "react";
import { Link } from "react-router";

function Dashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/appointments"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch appointments");
                }

                const data = await response.json();

                setAppointments(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []);

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
            value: `PKR ${totalRevenue.toLocaleString()}`,
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
                    <p className="dashboard-message">
                        Loading dashboard...
                    </p>
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
                                <h2>Recent Appointments</h2>

                                <button
                                    type="button"
                                    className="dashboard-refresh-btn"
                                    onClick={() => window.location.reload()}
                                >
                                    ↻ Refresh Data
                                </button>
                            </div>

                            {appointments.length === 0 ? (
                                <p className="dashboard-message">
                                    No appointments available.
                                </p>
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
                                            {appointments
                                                .slice(0, 5)
                                                .map((appointment) => (
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
                                <Link
                                    to="/appointments"
                                    className="view-all-btn"
                                >
                                    View All Appointments
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </main>
    );
}

export default Dashboard;