import { Injectable,BadRequestException,UnauthorizedException } from '@nestjs/common';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService,private readonly jwtService:JwtService){}

 async create(createUserDto: CreateUserDto) {
  const { email, name, password,role, } = createUserDto
      const existingUser= await this.databaseService.user.findUnique({where: {email}})
      if(existingUser){
        throw new BadRequestException('Email already exists');
      }
    const hashedPassword = await bcrypt.hash(password, 10);
       const user= await this.databaseService.user.create({
         data: 
           {email,
           name,
         password: hashedPassword,
        role}
       });
        const payload = { id: user.id, email: user.email, role: user.role};
       return {
         access_token: await this.jwtService.signAsync(payload),
       };
      }

 async findAll() {
  return await this.databaseService.user.findMany();
  }

 async findOne(email: string) {
    return this.databaseService.user.findUnique({
      where:{email},
     
    });
  }

async update(id: number, updateUserDto: UpdateUserDto, updaterRole: Role) {
  const { email, password, role: newRole } = updateUserDto;


  if (email) {
    const existingUser = await this.databaseService.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== id) {
      throw new BadRequestException('Email already exists');
    }
  }

  const dataToUpdate: any = {};

  if (email) dataToUpdate.email = email;

  if (password) {
    dataToUpdate.password = await bcrypt.hash(password, 10);
  }

  if (newRole) {
    if (updaterRole !== Role.admin) {
      throw new UnauthorizedException('Only admins can change user roles');
    }
    dataToUpdate.role = newRole;
  }

  return this.databaseService.user.update({
    where: { id },
    data: dataToUpdate,
  });
}


 async remove(id: number) {
    return this.databaseService.user.delete({
      where: {id},
    });
  }


}
