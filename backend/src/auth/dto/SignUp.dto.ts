import { IsNotEmpty,IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
@IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

 
}