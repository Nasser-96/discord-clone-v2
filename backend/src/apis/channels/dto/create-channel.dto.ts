import { ChannelType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?!general$).*/i, {
    message: '"general" is a reserved channel name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ChannelType)
  channelType: ChannelType;
}
