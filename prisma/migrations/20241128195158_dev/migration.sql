/*
  Warnings:

  - A unique constraint covering the columns `[user_id,guide_id]` on the table `guide_reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "guide_reviews_guide_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "guide_reviews_user_id_guide_id_key" ON "guide_reviews"("user_id", "guide_id");
