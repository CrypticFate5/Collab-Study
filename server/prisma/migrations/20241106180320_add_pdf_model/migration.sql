/*
  Warnings:

  - You are about to drop the `PDF` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PDF" DROP CONSTRAINT "PDF_userId_fkey";

-- DropTable
DROP TABLE "PDF";

-- CreateTable
CREATE TABLE "Pdf" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "s3Id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pdf_userId_idx" ON "Pdf"("userId");

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
