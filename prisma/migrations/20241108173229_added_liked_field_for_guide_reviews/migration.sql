/*
  Warnings:

  - You are about to drop the column `rating` on the `guide_reviews` table. All the data in the column will be lost.
  - Added the required column `liked` to the `guide_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guide_reviews" DROP COLUMN "rating",
ADD COLUMN     "liked" BOOLEAN NOT NULL;
