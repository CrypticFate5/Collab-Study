import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addPdf = async (userIdentifier, s3Id, sourceId, name) => {
  // Create PDF entry with user’s integer ID
  return await prisma.pdf.create({
    data: {
      userId: userIdentifier,
      s3Id,
      sourceId,
      name,
    },
  });
};

export const getPdfsByUser = async (userId) => {
  return await prisma.pdf.findMany({
    where: { userId },
    select: { id: true, s3Id: true, sourceId: true, name: true },
  });
};
