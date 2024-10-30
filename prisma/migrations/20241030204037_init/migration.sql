/*
  Warnings:

  - You are about to drop the `guide_completions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "guide_completions" DROP CONSTRAINT "guide_completions_guide_id_fkey";

-- DropForeignKey
ALTER TABLE "guide_completions" DROP CONSTRAINT "guide_completions_user_id_fkey";

-- DropTable
DROP TABLE "guide_completions";

-- CreateTable
CREATE TABLE "guide_completed" (
    "id" TEXT NOT NULL,
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guide_completed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "guide_completed_user_id_guide_id_key" ON "guide_completed"("user_id", "guide_id");

-- AddForeignKey
ALTER TABLE "guide_completed" ADD CONSTRAINT "guide_completed_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_completed" ADD CONSTRAINT "guide_completed_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
