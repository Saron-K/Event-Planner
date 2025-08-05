import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Req,UseInterceptors, UploadedFile } from '@nestjs/common';
import { SubEventService } from './sub-event.service';
import { PrismaClient, Prisma, Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateSubeventDto } from './dto/CreateSubeventDto.dto';
import { RequestWithUser } from 'src/common/types';
import { UpdateSubeventDto } from './dto/UpdateSubeventDto.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UploadImage } from 'src/common/interceptors/uploadImage.interceptor';


@UseGuards(RolesGuard)
@Roles([Role.organiser, Role.admin])
@Controller('event/:eventId/sub-event')
export class SubEventController {
  constructor(private readonly subEventService: SubEventService) {}


  @Post()
   @UploadImage('sub-events')
  async create( @UploadedFile() image: Express.Multer.File, @Body() createSubEventDto: CreateSubeventDto, @Req() req: RequestWithUser,@Param('eventId') eventId: string) {
  
    const creatorId = await req.user.id;
    const imagePath = image ? `/uploads/sub-events/${image.filename}` : undefined;

    return await this.subEventService.create({...createSubEventDto, image : imagePath},creatorId,+eventId);
  }

 @Get()
  async findAll(@Param('eventId') eventId: string) {
    return await this.subEventService.findAll(+eventId);
  }
/*
  @Get(':id')
  async findOneByEvent(
    @Param('eventId') eventId: string,
    @Param('id') subEventId: string,
  ) {
    return await this.subEventService.findOne(+id, +eventId);
  }
*/
 @Get(':id')
  async findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
  ) {
    return await this.subEventService.findOne(+id, +eventId);
  }
   @Patch(':id')
   @UploadImage('sub-events')
  async update(
    @UploadedFile() image: Express.Multer.File, 
    @Param('id') id: string,
    @Param('eventId') eventId: string,
    @Body() updateSubEventDto: UpdateSubeventDto,
  ) {
     const imagePath = image?.filename ? `/uploads/sub-events/${image.filename}` : undefined;

  const updateData = imagePath
    ? { ...updateSubEventDto, image: imagePath }
    : updateSubEventDto;

  return this.subEventService.update(+id, +eventId, updateData);
  }

   @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Param('eventId') eventId: string,
  ) {
    return await this.subEventService.remove(+id, +eventId);
  }
}
