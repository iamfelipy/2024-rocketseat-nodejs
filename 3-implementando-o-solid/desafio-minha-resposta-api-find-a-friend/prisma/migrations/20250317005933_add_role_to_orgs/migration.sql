-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN');

-- AlterTable
ALTER TABLE "orgs" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ADMIN';
