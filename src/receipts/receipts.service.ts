import {Injectable} from "@nestjs/common";
import OrdersService from "../orders/orders.service";
import fs from "fs";

@Injectable()
export default class ReceiptsService {
    constructor(
        private ordersService: OrdersService
    ) {}

    async createReceipt(orderId: number, userId: number) {
        const dataToSave = this.ordersService.getOrderById(orderId, userId);
        return new Promise((resolve, reject) => {
            fs.open(`receipt${orderId}`, 'wx', (err, fd) => {
                if(err) {
                    if(err.code === 'EEXIST') {
                        console.log('this receipt already exists');
                        reject(err);
                        return;
                    }
                    reject(err);
                    return;
                }
                resolve(fd)
            });
        });
    }
}
