import { Test, TestingModule } from '@nestjs/testing';
import { TransactionSummaryService } from './transaction-summary.service';

describe('TransactionSummaryService', () => {
  let service: TransactionSummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionSummaryService],
    }).compile();

    service = module.get<TransactionSummaryService>(TransactionSummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
