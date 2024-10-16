/*
  Warnings:

  - You are about to drop the column `user_id` on the `quizzes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[guide_id]` on the table `quizzes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tags` to the `guides` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `body` on the `guides` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `body` on the `quizzes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "guides" DROP CONSTRAINT "guides_user_id_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_guide_id_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_user_id_fkey";

-- DropIndex
DROP INDEX "quizzes_guide_id_user_id_key";

-- AlterTable
ALTER TABLE "guides" ADD COLUMN     "tags" JSONB NOT NULL,
DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "quizzes" DROP COLUMN "user_id",
DROP COLUMN "body",
ADD COLUMN     "body" JSONB NOT NULL;

-- CreateTable
CREATE TABLE "guide_reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_answers" (
    "id" TEXT NOT NULL,
    "answer" JSONB NOT NULL,
    "created_ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,

    CONSTRAINT "quiz_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guide_reviews_guide_id_key" ON "guide_reviews"("guide_id");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_guide_id_key" ON "quizzes"("guide_id");

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_reviews" ADD CONSTRAINT "guide_reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_answers" ADD CONSTRAINT "quiz_answers_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;
