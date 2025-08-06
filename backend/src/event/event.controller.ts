import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req, BadRequestException, UploadedFile  } from '@nestjs/common';
import { EventService } from './event.service';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { RolesGuard } from './../auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from './../auth/decorators/roles.decorator';
import { CreateDecoratorOptions } from '@nestjs/core';
import { CreateEventDto } from './dto/CreateEventDto.dto';
import { UpdateEventDto } from './dto/UpdateEventDto.dto';
import { RequestWithUser } from '.././common/types';
import { UploadImage } from '.././common/interceptors/uploadImage.interceptor';
//import { Roles } from 'src/auth/decorator/roles.decorator';


@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

@UseGuards(RolesGuard)
@Roles([Role.admin])
  @Post()
  @UploadImage('events')
 async create(@UploadedFile() image: Express.Multer.File, @Body() createEventDto: CreateEventDto,@Req() req: RequestWithUser) {
   const creatorId =req.user?.id; 
    const imagePath = image ? `/uploads/events/${image.filename}` : undefined;

  return this.eventService.create({...createEventDto, image : imagePath}, creatorId);
  }

  @Public()
  @Get()
 async findAll() {
    return this.eventService.findAll();
  }

 @UseGuards(RolesGuard)
@Roles([Role.admin,Role.organiser])
  @Get(':id')
 async findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }
/*
  @UseGuards(RolesGuard)
@Roles([Role.admin])
  @Get(':id/sub-events')
  async findSubEvents(@Param('id') id: string) {
  return this.eventService.findSubEvents(+id);
}*/

  @UseGuards(RolesGuard)
 @Roles([Role.admin])
  @Patch(':id')
  @UploadImage('events')
  async update(@UploadedFile() image: Express.Multer.File, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
     const imagePath = image?.filename ? `/uploads/events/${image.filename}` : undefined;

  const updateData = imagePath
    ? { ...updateEventDto, image: imagePath }
    : updateEventDto;

  return this.eventService.update(+id, updateData);
  }

  @UseGuards(RolesGuard)
 @Roles([Role.admin])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
