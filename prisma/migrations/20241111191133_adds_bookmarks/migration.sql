-- CreateTable
CREATE TABLE "bookmarks" (
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("user_id","guide_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_guide_id_key" ON "bookmarks"("user_id", "guide_id");

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
