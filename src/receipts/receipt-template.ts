import { Order } from '../orders/order.entity';

export const receiptTemplate = (orderToSave: Order): string => {
  const cartProducts = orderToSave.cart.cartProduct;
  const orderId = orderToSave.id;
  const ownerName = orderToSave.cart.owner.name;
  const paymentStatus = orderToSave.paymentFinished;
  return `
 Receipt
 ----------------------------
 PRODUCTS:
 ${cartProducts
   .map(
     (cartProduct) =>
       ` - ${cartProduct.product.name}: price:${cartProduct.product.priceInDollars}$, amount: ${cartProduct.numberOfProducts}`,
   )
   .join('\n')}
 ----------------------------
 Order ID: ${orderId}
 Owner name: ${ownerName}
 Payment status: ${paymentStatus}
 `;
};
