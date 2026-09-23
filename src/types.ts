export interface ProductVariant {
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number; // in INR ₹
  compareAtPrice: number;
  supplierCost: number; // Meesho/Supplier price in ₹
  supplierPlatform: 'Meesho' | 'Amazon' | 'Myntra' | 'Direct Supplier';
  supplierProductCode: string;
  supplierUrl: string;
  stock: number;
  shippingDaysMin: number;
  shippingDaysMax: number;
  rating: number;
  reviewsCount: number;
  category: string; // 'Clothes', 'Gadgets', 'Home Essentials', 'Footwear', 'Accessories'
  tags: string[];
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
  freeDelivery: boolean;
  codAvailable: boolean;
  isTopProductHero?: boolean;
  heroOrder?: number;
  heroTagline?: string;
  heroBadge?: string;
}

export interface HeroSlide {
  id: string;
  productId: string;
  title: string;
  subtitle: string;
  badge: string; // e.g. "Viral Trend 🔥", "Top Seller #1", "Deal of the Day"
  price: number;
  compareAtPrice: number;
  imageUrl: string;
  ctaText: string;
  order: number;
  isActive: boolean;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface CustomerDetails {
  name: string;
  phone: string; // 10-digit WhatsApp/calling number
  alternatePhone?: string; // Delivery boy backup number
  address: string; // House/Flat No, Street, Colony
  landmark: string; // e.g. Near Temple, Opp. Govt School
  pinCode: string; // 6-digit Indian PIN code
  city: string;
  district?: string;
  postOffice?: string;
  state: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  variant: string;
  quantity: number;
  unitPrice: number; // Selling price ₹
  supplierCost: number; // Meesho cost ₹
  image: string;
}

export type OrderStatus =
  | 'pending_confirmation' // Customer placed COD order on site
  | 'confirmed_on_whatsapp' // Customer confirmed on call/WhatsApp
  | 'ordered_on_meesho' // Reseller placed COD order on Meesho with customer address
  | 'shipped' // Meesho/Delhivery dispatched parcel
  | 'delivered' // Customer paid cash to delivery boy, margin credited
  | 'cancelled' // Cancelled or RTO (Return to Origin)
  | 'rto';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number; // Total COD amount to collect from customer
  supplierTotalCost: number; // Meesho buying price
  resellerProfitMargin: number; // Your net cash profit (Total - Supplier Cost)
  status: OrderStatus;
  paymentMethod: 'Cash on Delivery (COD)';
  paymentStatus: 'Cash to Collect on Delivery' | 'Cash Collected & Margin Credited';
  supplierPlatform: 'Meesho' | 'Amazon' | 'Myntra';
  meeshoOrderId?: string;
  meeshoTrackingUrl?: string;
  courierPartner?: 'Delhivery' | 'Shadowfax' | 'Xpressbees' | 'Ecom Express' | 'BlueDart';
  trackingNumber?: string;
  whatsappConfirmed?: boolean;
  notes?: string;
}

export interface MeeshoSyncSettings {
  defaultProfitMarginRupees: number;
  autoWhatsappNotification: boolean;
  defaultCourier: string;
  codVerificationRequired: boolean;
}
