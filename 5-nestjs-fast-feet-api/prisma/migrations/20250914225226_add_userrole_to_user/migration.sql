-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COURIER', 'RECIPIENT');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "roles" "UserRole"[];
