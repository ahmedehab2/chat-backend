import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDTO {
  @IsEmail()
  email: string;

  @IsString({})
  name: string;

  @IsStrongPassword()
  password: string;
}
