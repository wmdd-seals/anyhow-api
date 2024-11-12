-- CreateTable
CREATE TABLE "guide_views" (
    "id" TEXT NOT NULL,
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT,
    "created_ts" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "guide_views_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "guide_views" ADD CONSTRAINT "guide_views_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guide_views" ADD CONSTRAINT "guide_views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
