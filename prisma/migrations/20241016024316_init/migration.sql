-- AlterTable
ALTER TABLE "guide_reviews" ALTER COLUMN "created_ts" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_ts" DROP DEFAULT,
ALTER COLUMN "updated_ts" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "guides" ALTER COLUMN "created_ts" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_ts" DROP DEFAULT,
ALTER COLUMN "updated_ts" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "quiz_answers" ALTER COLUMN "created_ts" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_ts" DROP DEFAULT,
ALTER COLUMN "updated_ts" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "quizzes" ALTER COLUMN "created_ts" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_ts" DROP DEFAULT,
ALTER COLUMN "updated_ts" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_ts" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_ts" DROP DEFAULT,
ALTER COLUMN "updated_ts" SET DATA TYPE TIMESTAMPTZ(3);
