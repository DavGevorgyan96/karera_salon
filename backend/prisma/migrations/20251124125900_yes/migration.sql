/*
  Warnings:

  - You are about to drop the column `specialization` on the `Staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Setting" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "specialization",
ADD COLUMN     "specializationId" TEXT;

-- CreateTable
CREATE TABLE "Specialization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialization_name_key" ON "Specialization"("name");

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
