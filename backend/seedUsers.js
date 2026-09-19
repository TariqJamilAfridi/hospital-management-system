require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Demo users to create
const demoUsers = [
  {
    fullName: "Admin User",
    email: "admin@careplus.com",
    password: "admin123",
    phone: "03001234567",
    role: "admin",
    dateOfBirth: new Date("1985-01-15"),
    gender: "Male",
    address: "123 Admin Street, Karachi, Pakistan",
    isEmailVerified: true,
  },
  {
    fullName: "John Doe",
    email: "user@example.com",
    password: "user123",
    phone: "03001234568",
    role: "user",
    dateOfBirth: new Date("1990-06-20"),
    gender: "Male",
    address: "456 User Avenue, Lahore, Pakistan",
    isEmailVerified: true,
  },
  {
    fullName: "Sarah Ahmed",
    email: "sarah@example.com",
    password: "user123",
    phone: "03001234569",
    role: "user",
    dateOfBirth: new Date("1995-03-10"),
    gender: "Female",
    address: "789 Example Road, Islamabad, Pakistan",
    isEmailVerified: true,
  },
];

async function seedUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log("🗑️  Cleared existing users");

    // Check if users already exist
    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        continue;
      }

      // Create new user
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    console.log("\n🎉 User seeding completed!");
    console.log("\n📝 Demo Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("Admin:");
    console.log("  Email: admin@careplus.com");
    console.log("  Password: admin123");
    console.log("\nUser:");
    console.log("  Email: user@example.com");
    console.log("  Password: user123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
