import { PartialType } from '@nestjs/swagger';
import { CreateLiveKitDto } from './create-live-kit.dto';

export class UpdateLiveKitDto extends PartialType(CreateLiveKitDto) {}
