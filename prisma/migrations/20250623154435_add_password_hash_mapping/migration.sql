
-- AlterTable
-- First add the new column as nullable
ALTER TABLE "users" ADD COLUMN "password_hash" TEXT;

-- Copy existing password data to password_hash (assuming passwords are already hashed)
UPDATE "users" SET "password_hash" = "password" WHERE "password" IS NOT NULL;

-- Make the column required
ALTER TABLE "users" ALTER COLUMN "password_hash" SET NOT NULL;

-- Drop the old password column
ALTER TABLE "users" DROP COLUMN "password";
