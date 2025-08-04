import { Test, TestingModule } from '@nestjs/testing';
import { SubEventController } from './sub-event.controller';
import { SubEventService } from './sub-event.service';

describe('SubEventController', () => {
  let controller: SubEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubEventController],
      providers: [SubEventService],
    }).compile();

    controller = module.get<SubEventController>(SubEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
