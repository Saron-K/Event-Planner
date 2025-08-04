import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req  } from '@nestjs/common';
import { EventService } from './event.service';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateDecoratorOptions } from '@nestjs/core';
import { CreateEventDto } from './dto/CreateEventDto.dto';
import { UpdateEventDto } from './dto/UpdateEventDto.dto';
import { RequestWithUser } from 'src/common/types';
//import { Roles } from 'src/auth/decorator/roles.decorator';

@UseGuards(RolesGuard)
@Roles([Role.admin])
@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}


  @Post()
 async create(@Body() createEventDto: CreateEventDto,@Req() req: RequestWithUser) {
    const creatorId= req.user.id; 
    return this.eventService.create(createEventDto,creatorId);
  }

  @Public()
  @Get()
 async findAll() {
    return this.eventService.findAll();
  }

 
  @Get(':id')
 async findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }
  
  @Get(':id/sub-events')
  async findSubEvents(@Param('id') id: string) {
  return this.eventService.findSubEvents(+id);
}
 
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
