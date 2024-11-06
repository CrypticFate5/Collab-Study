import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
import { PrismaClient } from "@prisma/client";
import authRoute from "./routes/authRoute.js";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
