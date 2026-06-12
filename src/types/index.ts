export interface Product {
  id: string;
  category: 'sanitary_pads' | 'baby_diapers' | 'women_care' | 'baby_care';
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  features: string[];
  is_featured: boolean;
  stock_count: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: CartItem[];
  total_amount: number;
  status: string;
  created_at: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface DistributorApplication {
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  state: string;
  business_name: string;
  current_business_type: string;
  monthly_expected_order: string;
  message?: string;
}
