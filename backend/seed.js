require("dotenv").config();
const mongoose = require("mongoose");
const Submission = require("./models/Submission");

const submissions = [
  {
    patient_name: "Rahul Sharma",
    age: 34,
    phone: "9876543210",
    primary_concern: "Persistent lower back pain",
    status: "new"
  },
  {
    patient_name: "Priya Mehta",
    age: 28,
    phone: "9876543211",
    primary_concern: "Recurring headaches and dizziness",
    status: "new"
  },
  {
    patient_name: "Amit Verma",
    age: 45,
    phone: "9876543212",
    primary_concern: "Chest discomfort during exercise",
    status: "in_review"
  },
  {
    patient_name: "Neha Gupta",
    age: 31,
    phone: "9876543213",
    primary_concern: "Knee pain after an old injury",
    status: "in_review"
  },
  {
    patient_name: "Rohit Singh",
    age: 52,
    phone: "9876543214",
    primary_concern: "Shoulder pain and limited movement",
    status: "approved"
  },
  {
    patient_name: "Anjali Jain",
    age: 39,
    phone: "9876543215",
    primary_concern: "Abdominal pain and discomfort",
    status: "rejected"
  },
  {
    patient_name: "Vikas Joshi",
    age: 26,
    phone: "9876543216",
    primary_concern: "Wrist pain and swelling",
    status: "new"
  },
  {
    patient_name: "Pooja Agarwal",
    age: 47,
    phone: "9876543217",
    primary_concern: "Persistent neck stiffness",
    status: "in_review"
  },
  {
    patient_name: "Karan Malhotra",
    age: 36,
    phone: "9876543218",
    primary_concern: "Hip pain while walking",
    status: "approved"
  },
  {
    patient_name: "Sneha Kapoor",
    age: 29,
    phone: "9876543219",
    primary_concern: "Frequent migraines",
    status: "new"
  },
  {
    patient_name: "Arjun Bansal",
    age: 41,
    phone: "9876543220",
    primary_concern: "Knee swelling and discomfort",
    status: "in_review"
  },
  {
    patient_name: "Riya Sharma",
    age: 33,
    phone: "9876543221",
    primary_concern: "Lower abdominal discomfort",
    status: "rejected"
  },
  {
    patient_name: "Manish Saini",
    age: 58,
    phone: "9876543222",
    primary_concern: "Difficulty breathing during activity",
    status: "approved"
  },
  {
    patient_name: "Simran Kaur",
    age: 24,
    phone: "9876543223",
    primary_concern: "Recurring ankle pain",
    status: "new"
  },
  {
    patient_name: "Nikhil Choudhary",
    age: 49,
    phone: "9876543224",
    primary_concern: "Persistent shoulder discomfort",
    status: "in_review"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Submission.deleteMany({});

    await Submission.insertMany(submissions);

    console.log("15 submissions inserted successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();