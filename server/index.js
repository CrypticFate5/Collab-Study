require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

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

// Endpoint example: Create a new user
app.post("/users", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "User could not be created" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
