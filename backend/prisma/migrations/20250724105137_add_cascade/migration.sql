-- DropForeignKey
ALTER TABLE "Channel" DROP CONSTRAINT "Channel_serverId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_serverId_fkey";

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
