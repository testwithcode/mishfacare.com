import type { Product } from '../types';

const WHATSAPP_NUMBER = '+917990507301';

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

type OrderTotals = {
  subtotal?: number;
  discountAmount?: number;
  tax?: number;
  finalTotal?: number;
  appliedCouponCode?: string | null;
};

export function getWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderMessage(
  items: OrderItem[],
  total: number,
  customerDetails?: CustomerDetails,
  totals?: OrderTotals
) {
  const lines = [
    'Hello Mishfa Care, I want to place this order:',
    '',
    ...items.map(
      (item, index) =>
        `${index + 1}. ${item.product.name} x ${item.quantity} = INR ${item.product.price * item.quantity}`
    ),
    '',
  ];

  if (typeof totals?.subtotal === 'number') {
    lines.push('', `Subtotal: INR ${totals.subtotal.toFixed(0)}`);

    if (totals.discountAmount) {
      lines.push(`Discount: -INR ${totals.discountAmount.toFixed(0)}`);
    }

    if (totals.appliedCouponCode) {
      lines.push(`Coupon: ${totals.appliedCouponCode}`);
    }

    if (typeof totals.tax === 'number') {
      lines.push(`Tax: INR ${totals.tax.toFixed(0)}`);
    }

    lines.push(`Order Total: INR ${(totals.finalTotal ?? total).toFixed(0)}`);
  } else {
    lines.push('', `Order Total: INR ${total.toFixed(0)}`);
  }

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
