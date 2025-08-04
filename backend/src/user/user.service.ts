import { Injectable,BadRequestException } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
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
        const payload = { sub: user.id, email: user.email, role: user.role};
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

 async update(id: number, updateUserDto: UpdateUserDto) {
  
    return this.databaseService.user.update({
      where:{id},
      data: updateUserDto,
    });
  }

 async remove(id: number) {
    return this.databaseService.user.delete({
      where: {id},
    });
  }


}
