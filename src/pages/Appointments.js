import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAppointments, updateAppointmentStatus as updateStatus } from "../services/api";
import { formatCurrency } from "../utils/helpers";
import LoadingSpinner from "../components/LoadingSpinner";

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAppointments();
            
            // Handle both response formats
            const appointmentList = data.appointments || data;
            setAppointments(appointmentList);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            setError(error.message || "Unable to load appointments.");
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(
        (appointment) => {
            const searchValue = search.toLowerCase();

            const matchesSearch =
                appointment.fullName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                appointment.email
                    ?.toLowerCase()
                    .includes(searchValue) ||
                appointment.phone
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesPayment =
                paymentFilter === "All" ||
                appointment.paymentStatus === paymentFilter;

            const matchesStatus =
                statusFilter === "All" ||
                appointment.appointmentStatus === statusFilter;

            return (
                matchesSearch &&
                matchesPayment &&
                matchesStatus
            );
        }
    );
    const updateAppointmentStatusHandler = async (
        appointmentId,
        newStatus
    ) => {
        try {
            const result = await updateStatus(appointmentId, newStatus);

            // Update local state
            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? {
                            ...appointment,
                            appointmentStatus: newStatus,
                        }
                        : appointment
                )
            );

            // Show success message (you can add toast notification here)
            console.log("Appointment status updated:", result);
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.message || "Unable to update appointment status.");
        }
    };

    return (
        <main className="appointments-page">

            {/* Page Header */}
            <section className="appointments-header">

                <h1>Appointment Management</h1>

                <p>
                    View and manage patient appointments at
                    CarePlus Hospital.
                </p>

            </section>


            {/* Appointments Content */}
            <section className="appointments-section">
                <div className="appointments-top-bar">
                    <Link to="/dashboard" className="view-dashboard-btn">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="appointments-filters">

                    <div className="appointment-search">

                        <input
                            type="text"
                            placeholder="Search patient, email or phone..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />

                    </div>


                    <div className="appointment-filter">

                        <select
                            value={paymentFilter}
                            onChange={(event) =>
                                setPaymentFilter(event.target.value)
                            }
                        >

                            <option value="All">
                                All Payments
                            </option>

                            <option value="Paid">
                                Paid
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                        </select>

                    </div>


                    <div className="appointment-filter">

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                        >

                            <option value="All">
                                All Status
                            </option>

                            <option value="Booked">
                                Booked
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>

                </div>


                {/* Loading */}
                {loading && (
                    <LoadingSpinner message="Loading appointments..." />
                )}


                {/* Error */}
                {error && !loading && (
                    <div className="appointments-error">
                        <p>{error}</p>
                        <button onClick={fetchAppointments} className="primary-btn">
                            Try Again
                        </button>
                    </div>
                )}


                {/* No Results */}
                {!loading &&
                    !error &&
                    filteredAppointments.length === 0 && (
                        <p className="appointments-message">
                            No appointments found.
                        </p>
                    )}


                {/* Appointment Table */}
                {!loading &&
                    !error &&
                    filteredAppointments.length > 0 && (

                        <div className="appointments-table-container">

                            <table className="appointments-table">

                                <thead>

                                    <tr>
                                        <th>Patient</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Fee</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredAppointments.map(
                                        (appointment) => (

                                            <tr key={appointment._id}>

                                                <td>
                                                    {appointment.fullName}
                                                </td>

                                                <td>
                                                    {appointment.email}
                                                </td>

                                                <td>
                                                    {appointment.phone}
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
                                                    {formatCurrency(appointment.fee)}
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
                                                            appointment.appointmentStatus === "Completed"
                                                                ? "status-paid"
                                                                : appointment.appointmentStatus === "Cancelled"
                                                                    ? "status-pending"
                                                                    : "status-booked"
                                                        }
                                                    >
                                                        {appointment.appointmentStatus}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="appointment-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedAppointment(appointment)
                                                            }
                                                        >
                                                            View
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateAppointmentStatusHandler(
                                                                    appointment._id,
                                                                    "Completed"
                                                                )
                                                            }
                                                            disabled={appointment.appointmentStatus === "Completed"}
                                                        >
                                                            Complete
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateAppointmentStatusHandler(
                                                                    appointment._id,
                                                                    "Cancelled"
                                                                )
                                                            }
                                                            disabled={appointment.appointmentStatus === "Cancelled"}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </section>
            {selectedAppointment && (
                <div
                    className="appointment-modal-overlay"
                    onClick={() =>
                        setSelectedAppointment(null)
                    }
                >
                    <div
                        className="appointment-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="appointment-modal-header">
                            <h2>Appointment Details</h2>

                            <button
                                type="button"
                                className="modal-close-btn"
                                onClick={() =>
                                    setSelectedAppointment(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="appointment-modal-body">
                            <div className="modal-detail">
                                <span>Patient</span>
                                <strong>
                                    {selectedAppointment.fullName}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Email</span>
                                <strong>
                                    {selectedAppointment.email}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Phone</span>
                                <strong>
                                    {selectedAppointment.phone}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Doctor</span>
                                <strong>
                                    {selectedAppointment.doctor}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Specialty</span>
                                <strong>
                                    {selectedAppointment.specialty}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Date</span>
                                <strong>
                                    {selectedAppointment.date}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Time</span>
                                <strong>
                                    {selectedAppointment.time}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Appointment Fee</span>
                                <strong>
                                    {formatCurrency(selectedAppointment.fee)}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Payment</span>
                                <strong>
                                    {selectedAppointment.paymentStatus}
                                </strong>
                            </div>

                            <div className="modal-detail">
                                <span>Status</span>
                                <strong>
                                    {selectedAppointment.appointmentStatus}
                                </strong>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </main>
    );
}

export default Appointments;