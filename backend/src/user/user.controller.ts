import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req, UploadedFile} from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaClient, Prisma,Role } from '@prisma/client';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { UpdateUserDto } from './dto/UpdateUserDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RequestWithUser } from 'src/common/types';
import { UploadImage } from 'src/common/interceptors/uploadImage.interceptor';

@UseGuards(RolesGuard)
@Roles([Role.admin])
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Post()
  @UploadImage('events')
  async create(@UploadedFile() image: Express.Multer.File, @Body() createUserDto: CreateUserDto) {
    const imagePath = image ? `/uploads/users/${image.filename}` : undefined;
    return this.userService.create({...createUserDto, image: imagePath});
  }


  @Get()
 async findAll() {
    return this.userService.findAll();
  }


  @Get(':email')
 async findOne(@Param('email') email: string) {
    return this.userService.findOne(email);
  }

@Roles([Role.admin,Role.viewer, Role.organiser])
  @Patch(':id')
  @UploadImage('users')
 async update(@UploadedFile() image: Express.Multer.File, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto,@Req() req: RequestWithUser) {
  const imagePath = image?.filename ? `/uploads/users/${image.filename}` : undefined;
  const role = req.user.role;
  const updateData = imagePath
    ? { ...updateUserDto, image: imagePath } : updateUserDto;
  return this.userService.update(+id, updateData, role);
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
 
}
