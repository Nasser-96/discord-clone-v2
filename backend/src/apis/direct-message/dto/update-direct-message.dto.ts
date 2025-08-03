import { PartialType } from '@nestjs/swagger';
import { CreateDirectMessageDto } from './create-direct-message.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateDirectMessageDto extends CreateDirectMessageDto {}
