-- CreateTable
CREATE TABLE "PDF" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "s3Id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PDF_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PDF_s3Id_key" ON "PDF"("s3Id");

-- CreateIndex
CREATE UNIQUE INDEX "PDF_sourceId_key" ON "PDF"("sourceId");

-- AddForeignKey
ALTER TABLE "PDF" ADD CONSTRAINT "PDF_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
