/*
  Warnings:

  - The values [VOICE] on the enum `ChannelType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChannelType_new" AS ENUM ('TEXT', 'AUDIO', 'VIDEO');
ALTER TABLE "Channel" ALTER COLUMN "channelType" DROP DEFAULT;
ALTER TABLE "Channel" ALTER COLUMN "channelType" TYPE "ChannelType_new" USING ("channelType"::text::"ChannelType_new");
ALTER TYPE "ChannelType" RENAME TO "ChannelType_old";
ALTER TYPE "ChannelType_new" RENAME TO "ChannelType";
DROP TYPE "ChannelType_old";
ALTER TABLE "Channel" ALTER COLUMN "channelType" SET DEFAULT 'TEXT';
COMMIT;
