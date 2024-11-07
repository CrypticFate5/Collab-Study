import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to validate inputs
function validateUserInput(username, email, password) {
  let usernameMsg = "";
  let emailMsg = "";
  let passwordMsg = "";

  if (!username) {
    usernameMsg = "Username required";
  } else if (username.length < 2) {
    usernameMsg = "Username length must be greater than 2";
  }

  if (!email) {
    emailMsg = "Email is required";
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    emailMsg = "Invalid Email";
  }

  if (!password) {
    passwordMsg = "Password required";
  } else if (password.length < 8) {
    passwordMsg = "Password must contain more than 8 characters";
  }

  return { usernameMsg, emailMsg, passwordMsg };
}

// Signup Route
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const { usernameMsg, emailMsg, passwordMsg } = validateUserInput(
    username,
    email,
    password
  );

  // If any validation errors exist, return them
  if (usernameMsg || emailMsg || passwordMsg) {
    return res
      .status(400)
      .json({ error: { usernameMsg, emailMsg, passwordMsg } });
  }

  try {
    // Check if user already exists

    const existingUser = await prisma.users.findUnique({
      where: { username },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: { usernameMsg: "Username already in use" } });
    }
    const existingEmail = await prisma.users.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res
        .status(400)
        .json({ error: { emailMsg: "Email already in use" } });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "New user created!", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Login Route
router.post("/login", async (req, res) => {
  const { usernameOrEmail, password } = req.body;
  let usernameOrEmailMsg = "";
  let passwordMsg = "";

  // Validate input
  if (!usernameOrEmail) {
    usernameOrEmailMsg = "Username/Email is required";
  }
  if (!password) {
    passwordMsg = "Password required";
  }

  // If any validation errors exist, return them
  if (usernameOrEmailMsg || passwordMsg) {
    return res.status(400).json({ error: { usernameOrEmailMsg, passwordMsg } });
  }

  try {
    // Find user by username or email
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    // Check if user exists
    if (!user) {
      return res
        .status(400)
        .json({ usernameOrEmailMsg: "Invalid username/email" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ passwordMsg: "Invalid password" });
    }

    // Respond with success message
    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
