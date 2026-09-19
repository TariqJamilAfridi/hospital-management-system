# CarePlus Hospital Management System

A modern, full-stack hospital management system built with React and Node.js. This application enables patients to book appointments online, manage their bookings, and make secure payments through an intuitive interface.

[![React](https://img.shields.io/badge/React-19.3.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey)](https://expressjs.com/)

## ✨ Features

### Patient Features
- 📅 **Online Appointment Booking** - Schedule appointments with available doctors
- 🔍 **Doctor Profiles** - View detailed information about medical professionals
- 💳 **Secure Payments** - Integrated Safepay payment gateway
- 📱 **Responsive Design** - Seamless experience across all devices
- 📊 **Appointment Management** - View and manage your appointments
- ⏰ **Real-time Availability** - Check doctor availability in real-time

### Admin Features
- 📈 **Dashboard** - Comprehensive overview of appointments and statistics
- 👥 **Appointment Management** - Manage all patient appointments
- ✅ **Status Updates** - Update appointment and payment statuses
- 📋 **Filtering & Search** - Easily find specific appointments

### Technical Features
- 🔒 **Input Validation** - Comprehensive client and server-side validation
- 🛡️ **Security** - XSS protection and input sanitization
- ⚡ **Performance** - Optimized API calls and state management
- 📱 **Progressive Web App** - Can be installed as a mobile app
- 🔄 **Error Handling** - Graceful error boundaries and user feedback
- 🎨 **Modern UI/UX** - Clean, professional interface with smooth animations

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hospital-management-system.git
   cd hospital-management-system
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000

   # Database
   MONGO_URI=mongodb://localhost:27017/hospital_management

   # Safepay Configuration (Optional)
   SAFEPAY_API_KEY=your_safepay_api_key
   SAFEPAY_SECRET_KEY=your_safepay_secret_key
   SAFEPAY_ENVIRONMENT=sandbox
   SAFEPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

   Create a `.env` file in the root directory (optional):
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   ```

6. **Run the application**

   Open two terminal windows:

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   npm start
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - API Status: http://localhost:5000/api/status

## 📁 Project Structure

```
hospital-management-system/
├── backend/
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   ├── validators.js        # Input validation
│   │   └── logger.js            # Request logging
│   ├── models/
│   │   └── Appointment.js       # Appointment schema
│   ├── routes/
│   │   ├── appointmentRoutes.js # Appointment endpoints
│   │   ├── paymentRoutes.js     # Payment endpoints
│   │   └── safepayRoutes.js     # Safepay integration
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.js     # Error boundary component
│   │   ├── LoadingSpinner.js    # Loading component
│   │   ├── Navbar.js            # Navigation bar
│   │   └── Footer.js            # Footer component
│   ├── pages/
│   │   ├── Home.js              # Landing page
│   │   ├── Doctors.js           # Doctors listing
│   │   ├── DoctorProfile.js     # Doctor details
│   │   ├── Appointment.js       # Booking form
│   │   ├── Payment.js           # Payment page
│   │   ├── Appointments.js      # Appointments list
│   │   ├── Dashboard.js         # Admin dashboard
│   │   └── AppointmentSuccess.js # Success page
│   ├── services/
│   │   └── api.js               # API service layer
│   ├── hooks/
│   │   └── useForm.js           # Form management hook
│   ├── utils/
│   │   ├── validators.js        # Validation utilities
│   │   └── helpers.js           # Helper functions
│   ├── config/
│   │   └── constants.js         # App constants
│   ├── App.js                   # Main app component
│   ├── App.css                  # Global styles
│   └── index.js                 # Entry point
├── public/
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Appointments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/appointments` | Create a new appointment |
| GET | `/api/appointments` | Get all appointments (with filters) |
| PUT | `/api/appointments/:id/status` | Update appointment status |

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Initiate payment |
| PUT | `/api/payments/:id/status` | Update payment status |

### Safepay

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/safepay/checkout` | Create checkout session |
| POST | `/api/safepay/webhook` | Handle payment webhooks |

## 🛠️ Technologies Used

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Custom Hooks** - Reusable logic
- **CSS3** - Styling with modern features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

### Payment Integration
- **Safepay** - Payment gateway

### Development Tools
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing
- **axios** - HTTP client

## 🔐 Security Features

- Input validation on both client and server
- XSS protection through input sanitization
- CORS configuration for API security
- Environment variables for sensitive data
- Error handling without exposing sensitive information
- Secure payment processing with Safepay

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px and up)
- 📱 Tablets (768px and up)
- 💻 Desktops (1024px and up)
- 🖥️ Large screens (1440px and up)

## 🧪 Testing

To run tests:
```bash
npm test
```

## 🏗️ Build for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

3. **Deploy** using your preferred hosting service

## 📈 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications
- [ ] SMS reminders
- [ ] Multi-doctor scheduling
- [ ] Patient medical records
- [ ] Prescription management
- [ ] Lab test results
- [ ] Video consultations
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React documentation
- Express.js documentation
- MongoDB documentation
- Safepay API documentation
- Unsplash for placeholder images

## 📞 Support

For support, email info@careplushospital.com or open an issue in the repository.

---

Made with ❤️ by Your Name
