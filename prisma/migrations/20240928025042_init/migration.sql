/*
  Warnings:

  - You are about to drop the column `user_id` on the `Quizzes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quizzes" DROP CONSTRAINT "Quizzes_user_id_fkey";

-- AlterTable
ALTER TABLE "Quizzes" DROP COLUMN "user_id";
