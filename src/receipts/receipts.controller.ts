import {Body, Controller, Post, Req} from '@nestjs/common';
import ReceiptsService from './receipts.service';
import RequestWithUser from "../authentication/request-with-user.interface";

@Controller('receipts')
export default class ReceiptsController {

    constructor(private readonly receiptsService: ReceiptsService) {
    }

    @Post()
    createNewReceipt(@Body() orderId: number, @Req() request: RequestWithUser) {
        return this.receiptsService.createReceipt(orderId, request.user.id)
    }
}
