import type { Product } from '../types';

const WHATSAPP_NUMBER = '919990507301';

type OrderItem = {
  product: Product;
  quantity: number;
};

type CustomerDetails = {
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  payment_method?: string;
};

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderMessage(
  items: OrderItem[],
  total: number,
  customerDetails?: CustomerDetails
) {
  const lines = [
    'Hello Mishfa Care, I want to place this order:',
    '',
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} x ${item.quantity} = INR ${item.product.price * item.quantity}`
    ),
    '',
    `Order Total: INR ${total.toFixed(0)}`,
  ];

  if (customerDetails) {
    const address = [customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.pincode]
      .filter(Boolean)
      .join(', ');

    lines.push('', 'Customer Details:');
    if (customerDetails.customer_name) lines.push(`Name: ${customerDetails.customer_name}`);
    if (customerDetails.customer_phone) lines.push(`Phone: ${customerDetails.customer_phone}`);
    if (customerDetails.customer_email) lines.push(`Email: ${customerDetails.customer_email}`);
    if (address) lines.push(`Address: ${address}`);
    if (customerDetails.payment_method) lines.push(`Payment Method: ${customerDetails.payment_method.toUpperCase()}`);
  }

  return lines.join('\n');
}
