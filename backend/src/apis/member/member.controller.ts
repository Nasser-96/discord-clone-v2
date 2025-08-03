import {
  Controller,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CanUpdateMemberGuard } from './guards/can-update-member.guard';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('self/:serverId')
  @UseGuards(AuthGuard)
  async getSelfMember(@Req() req: any, @Param('serverId') serverId: string) {
    // Assuming req.user contains the user data
    const userId = req.user.id; //
    return this.memberService.getSelfMemberService(userId, serverId);
  }

  @UseGuards(AuthGuard, CanUpdateMemberGuard)
  @Put('update-role/:serverId/:memberId')
  async updateMemberRole(
    @Param('serverId') serverId: string,
    @Param('memberId') memberId: string,
    @Body() updateRoleDto: UpdateMemberRoleDto,
  ) {
    return this.memberService.updateMemberRoleService(
      serverId,
      memberId,
      updateRoleDto.role,
    );
  }

  @Delete('leave/:serverId')
  @UseGuards(AuthGuard)
  async leaveServer(
    @Param('serverId') serverId: string,
    @Req() req: any, // Assuming req contains user data
  ) {
    // Assuming req.user contains the user data
    const userId = req.user.id; //
    return this.memberService.deleteMemberService(serverId, { userId: userId });
  }

  @Delete('delete/:serverId/:memberId')
  @UseGuards(AuthGuard, CanUpdateMemberGuard)
  async deleteMember(
    @Param('serverId') serverId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.memberService.deleteMemberService(serverId, {
      memberId: memberId,
    });
  }
}
