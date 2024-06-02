/*
  Warnings:

  - You are about to alter the column `salary` on the `JobListing` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropForeignKey
ALTER TABLE "JobApplication" DROP CONSTRAINT "JobApplication_jobListing_id_fkey";

-- AlterTable
ALTER TABLE "JobListing" ALTER COLUMN "salary" SET DATA TYPE INTEGER;

-- AddForeignKey
ALTER TABLE "JobApplication" ADD CONSTRAINT "JobApplication_jobListing_id_fkey" FOREIGN KEY ("jobListing_id") REFERENCES "JobListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
