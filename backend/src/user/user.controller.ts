import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClient, Prisma,Role } from '@prisma/client';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Roles([Role.admin])
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }


  @Get()
 async findAll() {
    return this.userService.findAll();
  }


  @Get(':email')
 async findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }
@Roles([Role.admin,Role.viewer])
  @Patch(':id')
 async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
 
}
