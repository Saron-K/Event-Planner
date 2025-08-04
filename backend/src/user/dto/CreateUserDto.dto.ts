import { IsNotEmpty,IsEmail, IsString, IsEnum } from 'class-validator';
import { Role } from "@prisma/client";
export class CreateUserDto{

    @IsNotEmpty()
    @IsString()
    name:string;

   @IsNotEmpty()
    password: string;

    @IsEmail()
    email:string;

    @IsEnum(Role,{
        message: "valid role required"
    })
    role:Role;
}