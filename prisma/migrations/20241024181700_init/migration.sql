/*
  Warnings:

  - You are about to drop the `guide_taken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "guide_taken" DROP CONSTRAINT "guide_taken_guide_id_fkey";

-- DropForeignKey
ALTER TABLE "guide_taken" DROP CONSTRAINT "guide_taken_user_id_fkey";

-- DropTable
DROP TABLE "guide_taken";
