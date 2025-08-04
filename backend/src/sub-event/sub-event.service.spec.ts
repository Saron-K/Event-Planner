import { Test, TestingModule } from '@nestjs/testing';
import { SubEventService } from './sub-event.service';

describe('SubEventService', () => {
  let service: SubEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubEventService],
    }).compile();

    service = module.get<SubEventService>(SubEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
