/*
  Warnings:

  - A unique constraint covering the columns `[user_id,quiz_id]` on the table `quiz_answers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "quiz_answers_user_id_quiz_id_key" ON "quiz_answers"("user_id", "quiz_id");
