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

-- CreateTable
CREATE TABLE "GuideCompleted" (
    "id" TEXT NOT NULL,
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuideCompleted_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuideCompleted_user_id_guide_id_key" ON "GuideCompleted"("user_id", "guide_id");

-- AddForeignKey
ALTER TABLE "GuideCompleted" ADD CONSTRAINT "GuideCompleted_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuideCompleted" ADD CONSTRAINT "GuideCompleted_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
