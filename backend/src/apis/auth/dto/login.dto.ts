import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  //it can be username or email
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
