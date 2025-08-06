import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateSubeventDto } from './dto/CreateSubeventDto.dto';
import { UpdateSubeventDto } from './dto/UpdateSubeventDto.dto';

@Injectable()
export class SubEventService {
    constructor(private readonly databaseSevrice: DatabaseService){}

  async create(createSubEventDto: CreateSubeventDto, creatorId: number, eventId: number) {
    return await this.databaseSevrice.subEvent.create({
      data:{ ...createSubEventDto,
        startDate: new Date(createSubEventDto.startDate),
        endDate: new Date(createSubEventDto.endDate),
        creatorId,
      eventId,
}
  });
}

 async findAll(eventId: number) {
     return await this.databaseSevrice.subEvent.findMany({
            where: { eventId },
        });
  }

  async findOne(id: number, eventId: number) {
   return await this.databaseSevrice.subEvent.findUnique({
            where: { id: id, eventId },
        });
  }

  async update(id: number,eventId: number, updateSubEventDto: UpdateSubeventDto) {
    return await this.databaseSevrice.subEvent.update({
            where: { id: id, eventId },
            data: updateSubEventDto,
        });
  }

 async  remove(id: number, eventId: number) {
    return await this.databaseSevrice.subEvent.delete({
            where: { id: id, eventId },
        });
  }
}
