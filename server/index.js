import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
import { PrismaClient } from "@prisma/client";
import authRoute from "./routes/authRoute.js";
import pdfRoute from "./routes/pdfRoute.js";

const app = express();
const prisma = new PrismaClient();

// Configure CORS with credentials support
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Allow requests from your frontend
    credentials: true, // Allow cookies (important for authentication)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

app.use(express.json());
app.use(cookieParser()); // Add cookie parser middleware

// Check DB connection
async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the application if the DB connection fails
  }
}

// Call checkDatabaseConnection function when the server starts
checkDatabaseConnection();

//routes declaration
app.use("/", authRoute);
app.use("/pdf", pdfRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});