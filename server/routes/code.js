import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createUser() {
  try {
    const newUser = await prisma.users.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123', // Ensure password is hashed if needed
      },
    });
    console.log('New user created:', newUser);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
