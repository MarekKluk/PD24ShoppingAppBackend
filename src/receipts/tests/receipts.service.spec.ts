import * as fs from 'fs';
import { faker } from '@faker-js/faker';
import ReceiptsService from '../receipts.service';
import { Test } from '@nestjs/testing';
import OrdersService from '../../orders/orders.service';

describe('searchFile', () => {
  let receiptsService: ReceiptsService;
  const testDir = 'testDir';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ReceiptsService,
        OrdersService,
        { provide: OrdersService, useValue: {} },
      ],
    }).compile();
    receiptsService = await module.get(ReceiptsService);
    fs.mkdirSync(testDir);
    for (let i = 1; i <= 3; i++) {
      const filePath = `${testDir}/testFile${i}.txt`;
      fs.writeFileSync(filePath, faker.lorem.paragraphs(50));
    }
  });

  afterAll(() => {
    for (let i = 1; i <= 3; i++) {
      const filePath = `${testDir}/testFile${i}.txt`;
      fs.unlinkSync(filePath);
    }
    fs.rmdirSync(testDir);
  });

  test('returns the path of the first file that contains the specified string', async () => {
    const searchString = faker.random.word();
    const testFileIndex = faker.datatype.number( { min: 1, max: 3 });
    const testFilePath = `${testDir}/testFile${testFileIndex}.txt`;
    const fileContent = fs.readFileSync(testFilePath, 'utf8');
    const updatedFileContent = fileContent.replace(
      /(\b\w+\b)/g,
      `${searchString} $1`,
    );
    fs.writeFileSync(testFilePath, updatedFileContent);
    const result = await receiptsService.searchFile(testDir, searchString);
    expect(result).toEqual(testFilePath);
  });

  test('returns null if no file contains the specified string', async () => {
    const searchString = faker.random.alphaNumeric(10);
    const result = await receiptsService.searchFile(testDir, searchString);
    expect(result).toBeNull();
  });
});
