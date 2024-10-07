/*
  Warnings:

  - A unique constraint covering the columns `[guide_id,user_id]` on the table `quizzes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "quizzes_guide_id_key";

-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_guide_id_user_id_key" ON "quizzes"("guide_id", "user_id");

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
