import { Injectable } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { CreateEventDto } from './dto/CreateEventDto.dto';
import { UpdateEventDto } from './dto/UpdateEventDto.dto';


@Injectable()
export class EventService {
  constructor(private readonly databaseSevrice: DatabaseService){}
  async create(createEventDto: CreateEventDto, creatorId: number) {
    return await this.databaseSevrice.event.create({
      data:{ ...createEventDto,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        creatorId,}
    });
  }

  async findAll() {
    return await this.databaseSevrice.event.findMany();
  }

  async findOne(id: number) {
    return await this.databaseSevrice.event.findUnique({
      where: {id},
    });
  } 
  
  async findSubEvents(eventId: number) {
    return await this.databaseSevrice.subEvent.findMany({
      where: { eventId },
    });
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    return await this.databaseSevrice.event.update({
      where: {id},
      data: updateEventDto,
          
    });
  }

 async remove(id: number) {
    return await this.databaseSevrice.event.delete({
      where: {id},
    });
  }
}
