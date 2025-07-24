import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { UserDataType } from '../auth/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { MemberRole } from '@prisma/client';
import ReturnResponse from 'src/helper/returnResponse';

@Injectable()
export class MemberService {
  constructor(private readonly prisma: PrismaService) {}
  async updateMemberRoleService(
    serverId: string,
    memberId: string,
    role: MemberRole,
  ) {
    const updateMember = await this.prisma.member.update({
      where: {
        id: memberId,
        serverId: serverId,
      },
      data: { role: role },
    });

    const returnResponse = ReturnResponse({
      response: updateMember,
      success: 'Member role updated successfully',
      is_successful: true,
    });
    return returnResponse;
  }

  async deleteMemberService(
    serverId: string,
    { memberId, userId }: { memberId?: string; userId?: string },
  ) {
    if (memberId) {
      // If memberId is provided, it means the server owner or admin is deleting a member
      const deleteMember = await this.prisma.member.delete({
        where: {
          id: memberId, // This allows the server owner or admin to delete a member
          serverId: serverId,
        },
      });

      const returnResponse = ReturnResponse({
        response: deleteMember,
        success: 'Member deleted successfully',
        is_successful: true,
      });
      return returnResponse;
    } else {
      // If userId is provided, it means the user is leaving the server
      const foundMember = await this.prisma.member.findFirst({
        where: {
          serverId: serverId,
          userId: userId,
        },
      });

      if (!foundMember) {
        throw new NotFoundException(
          ReturnResponse({
            error_msg: 'Member not found',
            is_successful: false,
          }),
        );
      }

      await this.prisma.member.delete({
        where: {
          id: foundMember.id, // This allows the user to leave the server
          serverId: serverId,
          userId: userId,
        },
      });
      const returnResponse = ReturnResponse({
        success: 'Leaved successfully',
        is_successful: true,
      });
      return returnResponse;
    }
  }
}
