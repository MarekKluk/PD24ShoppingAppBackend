import ReceiptsController from './receipts.controller';
import ReceiptsService from './receipts.service';
import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';

@Module({
  controllers: [ReceiptsController],
  providers: [ReceiptsService],
  imports: [OrdersModule],
})
export class ReceiptsModule {}
