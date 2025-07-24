import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Put,
  Delete,
} from '@nestjs/common';
import { ServerService } from './server.service';
import { CreateServerDto } from './dto/create-server.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserDataType } from '../auth/types';
import { IsJoinedServerGuard } from './guards/is-joined-server.guard';
import { CanUpdateServer } from './guards/can-update-server.guard';
import { CanAddUserToServer } from './guards/can-add-user-to-server.guard';
import { UpdateMemberRoleDto } from '../member/dto/update-member-role.dto';

@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  create(@Body() createServerDto: CreateServerDto, @Req() req) {
    const userData: UserDataType = req.user;

    return this.serverService.createServerService(userData, createServerDto);
  }

  @Get('my-servers')
  @UseGuards(AuthGuard)
  getMyServers(@Req() req) {
    const userData: UserDataType = req.user;
    return this.serverService.getMyServersService(userData);
  }

  @Get(':serverId')
  @UseGuards(AuthGuard, IsJoinedServerGuard)
  getServerData(@Req() req, @Param('serverId') serverId: string) {
    const userData: UserDataType = req.user;
    return this.serverService.getServerDataService(userData, serverId);
  }

  @Put(':serverId/update-invite-code')
  @UseGuards(AuthGuard, CanUpdateServer)
  updateInviteCode(@Param('serverId') serverId: string) {
    return this.serverService.updateInviteCodeService(serverId);
  }

  @Post(':inviteCode/add-user')
  @UseGuards(AuthGuard, CanAddUserToServer)
  addUserToServer(@Param('inviteCode') serverId: string, @Req() req) {
    const userData: UserDataType = req.user;
    return this.serverService.addUserToServerService(serverId, userData);
  }

  @Put(':serverId/update')
  @UseGuards(AuthGuard, CanUpdateServer)
  updateServer(
    @Param('serverId') serverId: string,
    @Body() updateServerDto: CreateServerDto,
  ) {
    return this.serverService.updateServerService(serverId, updateServerDto);
  }

  @Delete(':serverId/delete')
  @UseGuards(AuthGuard, CanUpdateServer)
  deleteServer(@Param('serverId') serverId: string) {
    return this.serverService.deleteServerService(serverId);
  }
}
