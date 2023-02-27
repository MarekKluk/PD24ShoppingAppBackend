import { Controller, Get, Post, Req } from '@nestjs/common';
import ReceiptsService from './receipts.service';
import RequestWithUser from '../authentication/request-with-user.interface';

@Controller('receipts')
export default class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  createNewReceipt(@Req() request: RequestWithUser) {
    return this.receiptsService.createReceipt(
      request.body.orderId,
      request.user.id,
    );
  }

  @Get('search')
  searchReceiptsWithRequestedString(@Req() request: RequestWithUser) {
    return this.receiptsService.searchFile(
      '/user/src/app/src/receipts/receipts-storage/',
      request.body.stringToSearch,
    );
  }
}
