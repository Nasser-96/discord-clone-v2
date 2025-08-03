import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
