import { Injectable } from '@nestjs/common';
import OrdersService from '../orders/orders.service';
import * as fs from 'fs';
import { receiptTemplate } from './receipt-template';

@Injectable()
export default class ReceiptsService {
  constructor(private ordersService: OrdersService) {}

  async createReceipt(orderId: number, userId: number) {
    const dataToSave = await this.ordersService.getOrderById(orderId, userId);
    const receipt = receiptTemplate(dataToSave);
    const buffer = await Buffer.from(receipt);
    return new Promise((resolve, reject) => {
      fs.open(
        `/user/src/app/src/receipts/receipts-storage/receipt3${orderId}.txt`,
        'wx',
        (err, fd) => {
          if (err) {
            if (err.code === 'EEXIST') {
              console.log('this receipt already exists');
              reject(err);
              return;
            }
            reject(err);
            return;
          }
          fs.write(fd, buffer, 0, buffer.length, null, (err, written) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(fd);
          });
        },
      );
    });
  }

  async searchFile(path: string, stringToSearch: string): Promise<string> {
    const files = await fs.promises.readdir(path);

    for (const file of files) {
      const filePath = `${path}${file}`;
      const fileContent = await fs.promises.readFile(filePath, 'utf8');
      if (fileContent.includes(stringToSearch)) {
        return filePath;
      }
    }

    return null;
  }
}
