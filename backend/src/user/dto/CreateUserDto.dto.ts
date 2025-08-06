import { IsNotEmpty,IsEmail, IsString, IsEnum , IsOptional} from 'class-validator';
import { Role } from "@prisma/client";
export class CreateUserDto{

    @IsNotEmpty()
    @IsString()
    name:string;

   @IsNotEmpty()
    password: string;

    @IsEmail()
    email:string;

    @IsOptional()
   @IsString()
    image?: string;

    @IsEnum(Role,{
        message: "valid role required"
    })
    role:Role;
}