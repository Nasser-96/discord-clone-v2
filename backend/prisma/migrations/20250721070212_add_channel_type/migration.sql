-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('TEXT', 'VOICE');

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "channelType" "ChannelType" NOT NULL DEFAULT 'TEXT';
