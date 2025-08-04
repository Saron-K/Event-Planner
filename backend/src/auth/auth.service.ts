import { Injectable,UnauthorizedException,BadRequestException   } from '@nestjs/common';
import { PrismaClient, Prisma} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/SignUp.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService){}
  private prisma = new PrismaClient();

     async signIn(email: string, pass: string) {
    const user = await this.prisma.user.findUnique({
        where: {email}
    });

     if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
     const payload = { sub:  user.id,  role: user.role, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
   
}
    async signUp(signupdto: SignUpDto) {
    const { email, name, password } = signupdto
    const existingUser= await this.prisma.user.findUnique({where: {email}})
    if(existingUser){
      throw new BadRequestException('Email already in use');
    }
     
     const hashedPassword = await bcrypt.hash(password, 10);
    const user= await this.prisma.user.create({
      data: 
        {email,
        name,
      password: hashedPassword,}
    });
     const payload = { sub: user.id, email: user.email, role: user.role};
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
   
}
}
