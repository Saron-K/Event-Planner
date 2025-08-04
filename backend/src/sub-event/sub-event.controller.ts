import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Req } from '@nestjs/common';
import { SubEventService } from './sub-event.service';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateSubeventDto } from './dto/CreateSubeventDto.dto';
import { RequestWithUser } from 'src/common/types';
import { UpdateSubeventDto } from './dto/UpdateSubeventDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@Roles([Role.organiser, Role.admin])
@Controller('sub-event')
export class SubEventController {
  constructor(private readonly subEventService: SubEventService) {}

  @Post(':eventId')
  
 async create(@Body() createSubEventDto: CreateSubeventDto, @Req() req: RequestWithUser,@Param('eventId') eventId: string) {
  
    const creatorId = await req.user.id;
    return await this.subEventService.create(createSubEventDto,creatorId,+eventId);
  }

  @Get()
 async findAll() {
    return await this.subEventService.findAll();
  }

  @Get(':id')
 async findOne(@Param('id') id: string) {
    return await this.subEventService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSubEventDto: UpdateSubeventDto) {
    return await this.subEventService.update(+id, updateSubEventDto);
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    return await this.subEventService.remove(+id);
  }
}
