import { Test, TestingModule } from '@nestjs/testing';
import { TransactionSummaryController } from './transaction-summary.controller';

describe('TransactionSummaryController', () => {
  let controller: TransactionSummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionSummaryController],
    }).compile();

    controller = module.get<TransactionSummaryController>(TransactionSummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
