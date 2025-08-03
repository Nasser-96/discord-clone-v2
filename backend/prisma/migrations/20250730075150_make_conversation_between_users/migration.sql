/*
  Warnings:

  - You are about to drop the column `memberOneId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `memberTwoId` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `DirectMessage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userOneId,userTwoId]` on the table `Conversation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userOneId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userTwoId` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `DirectMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_memberOneId_fkey";

-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_memberTwoId_fkey";

-- DropForeignKey
ALTER TABLE "DirectMessage" DROP CONSTRAINT "DirectMessage_memberId_fkey";

-- DropIndex
DROP INDEX "Conversation_memberOneId_idx";

-- DropIndex
DROP INDEX "Conversation_memberOneId_memberTwoId_key";

-- DropIndex
DROP INDEX "Conversation_memberTwoId_idx";

-- DropIndex
DROP INDEX "DirectMessage_memberId_idx";

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "memberOneId",
DROP COLUMN "memberTwoId",
ADD COLUMN     "userOneId" TEXT NOT NULL,
ADD COLUMN     "userTwoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Conversation_userOneId_idx" ON "Conversation"("userOneId");

-- CreateIndex
CREATE INDEX "Conversation_userTwoId_idx" ON "Conversation"("userTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_userOneId_userTwoId_key" ON "Conversation"("userOneId", "userTwoId");

-- CreateIndex
CREATE INDEX "DirectMessage_userId_idx" ON "DirectMessage"("userId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
