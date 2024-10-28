/*
  Warnings:

  - Added the required column `mimeType` to the `images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images" ADD COLUMN     "mimeType" TEXT NOT NULL;
