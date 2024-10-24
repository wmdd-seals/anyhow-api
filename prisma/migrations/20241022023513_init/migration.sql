-- CreateTable
CREATE TABLE "chat_history" (
    "id" TEXT NOT NULL,
    "message" JSONB NOT NULL,
    "created_ts" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_ts" TIMESTAMPTZ(3) NOT NULL,
    "guide_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "chat_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chat_history_guide_id_key" ON "chat_history"("guide_id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_history_user_id_guide_id_key" ON "chat_history"("user_id", "guide_id");

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_history" ADD CONSTRAINT "chat_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
