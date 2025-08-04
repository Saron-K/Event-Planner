import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { APP_GUARD } from '@nestjs/core';

import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  controllers: [EventController],
  providers: [EventService,{
        provide: APP_GUARD,
        useClass: RolesGuard,
      },],
})
export class EventModule {}
