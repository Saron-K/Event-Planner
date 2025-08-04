import { Module } from '@nestjs/common';
import { SubEventService } from './sub-event.service';
import { SubEventController } from './sub-event.controller';

@Module({
  controllers: [SubEventController],
  providers: [SubEventService],
})
export class SubEventModule {}
