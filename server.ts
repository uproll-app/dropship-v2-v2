import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Order, MeeshoSyncSettings } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initial Indian Social Media Dropshipping Catalog (Meesho / Amazon / Myntra Sourced)
let products: Product[] = [
  {
    id: 'prod-cloth-1',
    title: 'Pure Cotton Floral Printed Kurti Pant Set with Dupatta',
    subtitle: 'Trending on Instagram · Premium 60-60 cotton fabric with gota patti lace border',
    description: 'Trending ethnic ensemble perfect for daily wear and festive outings. Crafted with skin-friendly 100% breathable cotton, straight cut silhouette, elasticated trousers with side pocket, and matching printed mulmul dupatta. Sourced directly from verified Jaipur textile hubs on Meesho.',
    price: 899,
    compareAtPrice: 1699,
    supplierCost: 449,
    supplierPlatform: 'Meesho',
    supplierProductCode: 's-38491024',
    supplierUrl: 'https://meesho.com/s/p/6d3x9a',
    stock: 85,
    shippingDaysMin: 3,
    shippingDaysMax: 6,
    rating: 4.8,
    reviewsCount: 342,
    category: 'Clothes',
    tags: ['Ethnic Wear', 'Kurti Set', 'Cotton', 'Trending on Reels'],
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { name: 'Size', options: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'] },
      { name: 'Color', options: ['Royal Violet', 'Electric Indigo', 'Teal Green', 'Rust Orange'] }
    ],
    featured: true,
    freeDelivery: true,
    codAvailable: true
  },
  {
    id: 'prod-cloth-2',
    title: 'Oversized Japanese Anime Streetwear Graphic T-Shirt',
    subtitle: '240 GSM heavy french terry cotton with high-density puff print',
    description: 'Viral Gen-Z streetwear aesthetic. Drop-shoulder relaxed boxy fit, bio-washed pre-shrunk cotton, ribbed crew neck that retains structure after repeated machine washes. Top trending aesthetic tee on Instagram & TikTok reels.',
    price: 599,
    compareAtPrice: 1199,
    supplierCost: 289,
    supplierPlatform: 'Meesho',
    supplierProductCode: 's-29401928',
    supplierUrl: 'https://meesho.com/s/p/4v9k2p',
    stock: 120,
    shippingDaysMin: 3,
    shippingDaysMax: 5,
    rating: 4.7,
    reviewsCount: 218,
    category: 'Clothes',
    tags: ['Streetwear', 'T-Shirts', 'Oversized', 'Unisex'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { name: 'Size', options: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', options: ['Obsidian Black', 'Violet Fog', 'Off-White'] }
    ],
    featured: true,
    freeDelivery: true,
    codAvailable: true
  },
  {
    id: 'prod-cloth-3',
    title: 'Women Ribbed Knit Bodycon Co-ord Set (Top & Wide Leg Pant)',
    subtitle: 'Instagram viral airport look · Ultra-soft stretchy elastane rib knit',
    description: 'Effortless chic styling seen on fashion influencers. High-waisted wide-leg palazzo trousers with elasticated waistband and matching boat-neck crop top. Zero see-through, wrinkle-resistant travel fabric.',
    price: 799,
    compareAtPrice: 1499,
    supplierCost: 380,
    supplierPlatform: 'Meesho',
    supplierProductCode: 's-41092831',
    supplierUrl: 'https://meesho.com/s/p/8w2m9k',
    stock: 64,
    shippingDaysMin: 4,
    shippingDaysMax: 7,
    rating: 4.9,
    reviewsCount: 164,
    category: 'Clothes',
    tags: ['Co-ord Set', 'Western', 'Airport Look', 'Trending'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { name: 'Size', options: ['Free Size (Fits S to XL)', 'Plus Size (XXL)'] },
      { name: 'Color', options: ['Deep Violet', 'Slate Charcoal', 'Mocha Beige'] }
    ],
    featured: true,
    freeDelivery: true,
    codAvailable: true
  },
  {
    id: 'prod-gadget-1',
    title: 'Magnetic Wireless Power Bank & Phone Stand with LED Display',
    subtitle: '10,000mAh 20W PD fast charge with fold-out kickstand for reels watching',
    description: 'Snap-and-charge wireless magnetic power monolith. Compatible with all MagSafe iPhones and Qi Android phones. Includes digital LED percentage battery indicator and heat protection chip.',
    price: 1199,
    compareAtPrice: 2499,
    supplierCost: 599,
    supplierPlatform: 'Meesho',
    supplierProductCode: 's-19028341',
    supplierUrl: 'https://meesho.com/s/p/3b8x1w',
    stock: 40,
    shippingDaysMin: 3,
    shippingDaysMax: 6,
    rating: 4.8,
    reviewsCount: 189,
    category: 'Gadgets',
    tags: ['Power Bank', 'Wireless', 'MagSafe', 'Tech'],
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Midnight Violet', 'Matte Titanium', 'Pearl White'] }
    ],
    featured: true,
    freeDelivery: true,
    codAvailable: true
  },
  {
    id: 'prod-gadget-2',
    title: 'Ultra-Comfort Bluetooth Wireless Neckband Earphones (60h Battery)',
    subtitle: 'ENC quad mic for crystal clear calling with environmental noise cancelling',
    description: 'Sweat-resistant silicone neckband with magnetic buds. Instant auto-pairing Bluetooth 5.3, dual device connectivity, vibration alert for incoming calls, and Type-C fast charging (10 mins charge = 10 hours playtime).',
    price: 649,
    compareAtPrice: 1299,
    supplierCost: 310,
    supplierPlatform: 'Amazon',
    supplierProductCode: 'B0CHY9210',
    supplierUrl: 'https://amazon.in/dp/B0CHY9210',
    stock: 55,
    shippingDaysMin: 2,
    shippingDaysMax: 5,
    rating: 4.75,
    reviewsCount: 310,
    category: 'Gadgets',
    tags: ['Audio', 'Neckband', 'Calling', 'Sports'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { name: 'Color', options: ['Electric Blue & Black', 'Deep Violet Trim', 'Gunmetal Grey'] }
    ],
    featured: false,
    freeDelivery: true,
    codAvailable: true
  },
  {
    id: 'prod-home-1',
    title: 'Rechargeable Sunset Projector Atmosphere Lamp',
    subtitle: '16-color RGB with remote control & 360-degree rotating golden hour lens',
    description: 'The number 1 aesthetic photo background lighting on Instagram & Pinterest. Cast hypnotic warm sunset gradients across bedroom walls for selfies, room decor, and night ambience.',
    price: 499,
    compareAtPrice: 999,
    supplierCost: 219,
    supplierPlatform: 'Meesho',
    supplierProductCode: 's-58190241',
    supplierUrl: 'https://meesho.com/s/p/9x2m4r',
    stock: 75,
    shippingDaysMin: 3,
    shippingDaysMax: 6,
    rating: 4.85,
    reviewsCount: 420,
    category: 'Home Essentials',
    tags: ['Decor', 'Sunset Lamp', 'Aesthetic', 'Reels Viral'],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80'
    ],
    variants: [
      { name: 'Type', options: ['USB Powered + Remote', 'Wireless Rechargeable + App Control'] }
    ],
    featured: true,
    freeDelivery: true,
    codAvailable: true
  }
];

// Sample Orders placed by Indian social media shoppers
let orders: Order[] = [
  {
    id: 'ord-in-101',
    orderNumber: 'IND-90421',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    customer: {
      name: 'Pooja Sharma',
      phone: '9876543210',
      alternatePhone: '9876543211',
      address: 'Flat 402, Sai Residency, Near Hanuman Mandir',
      landmark: 'Opposite State Bank of India',
      pinCode: '302020',
      city: 'Jaipur',
      state: 'Rajasthan'
    },
    items: [
      {
        productId: 'prod-cloth-1',
        title: 'Pure Cotton Floral Printed Kurti Pant Set with Dupatta',
        variant: 'Size: L (40), Color: Royal Violet',
        quantity: 1,
        unitPrice: 899,
        supplierCost: 449,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 899,
    shippingCost: 0,
    total: 899,
    supplierTotalCost: 449,
    resellerProfitMargin: 450, // Reseller earns ₹450 clean profit via Meesho COD!
    status: 'pending_confirmation',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Cash to Collect on Delivery',
    supplierPlatform: 'Meesho',
    whatsappConfirmed: false
  },
  {
    id: 'ord-in-102',
    orderNumber: 'IND-90422',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    customer: {
      name: 'Rohit Verma',
      phone: '9123456789',
      alternatePhone: '9988776655',
      address: 'House No. 128, Sector 15, Urban Estate',
      landmark: 'Near D.A.V Public School',
      pinCode: '122001',
      city: 'Gurugram',
      state: 'Haryana'
    },
    items: [
      {
        productId: 'prod-cloth-2',
        title: 'Oversized Japanese Anime Streetwear Graphic T-Shirt',
        variant: 'Size: XL, Color: Obsidian Black',
        quantity: 1,
        unitPrice: 599,
        supplierCost: 289,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'
      }
    ],
    subtotal: 599,
    shippingCost: 0,
    total: 599,
    supplierTotalCost: 289,
    resellerProfitMargin: 310,
    status: 'ordered_on_meesho',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Cash to Collect on Delivery',
    supplierPlatform: 'Meesho',
    meeshoOrderId: 'MSH-8940192',
    courierPartner: 'Delhivery',
    trackingNumber: 'DEL9940182910',
    whatsappConfirmed: true
  }
];

let syncSettings: MeeshoSyncSettings = {
  defaultProfitMarginRupees: 350,
  autoWhatsappNotification: true,
  defaultCourier: 'Delhivery / Shadowfax (via Meesho)',
  codVerificationRequired: true
};

// API Endpoints

// GET products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json(result);
});

// POST new product
app.post('/api/products', (req: Request, res: Response) => {
  const data = req.body;
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    title: data.title || 'Trending Product',
    subtitle: data.subtitle || '',
    description: data.description || '',
    price: Number(data.price) || 699,
    compareAtPrice: Number(data.compareAtPrice) || Number(data.price) * 1.8,
    supplierCost: Number(data.supplierCost) || 300,
    supplierPlatform: data.supplierPlatform || 'Meesho',
    supplierProductCode: data.supplierProductCode || `s-${Math.floor(10000000 + Math.random() * 90000000)}`,
    supplierUrl: data.supplierUrl || 'https://meesho.com',
    stock: Number(data.stock) || 50,
    shippingDaysMin: Number(data.shippingDaysMin) || 3,
    shippingDaysMax: Number(data.shippingDaysMax) || 6,
    rating: 4.8,
    reviewsCount: 1,
    category: data.category || 'Clothes',
    tags: data.tags || ['Trending', 'Meesho Sourced', 'COD Available'],
    images: data.images?.length ? data.images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'],
    variants: data.variants || [{ name: 'Size', options: ['M', 'L', 'XL'] }],
    featured: Boolean(data.featured),
    freeDelivery: true,
    codAvailable: true
  };

  products.unshift(newProduct);
  res.status(201).json(newProduct);
});

// DELETE product
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    const deleted = products.splice(index, 1)[0];
    return res.json({ success: true, deleted });
  }
  res.status(404).json({ error: 'Product not found' });
});

// GET orders
app.get('/api/orders', (req: Request, res: Response) => {
  res.json(orders);
});

// POST new customer order (From Social Media Storefront Cash on Delivery flow)
app.post('/api/orders', (req: Request, res: Response) => {
  const data = req.body;
  if (!data.customer || !data.items || !data.items.length) {
    return res.status(400).json({ error: 'Customer details and items required' });
  }

  const subtotal = data.items.reduce((acc: number, item: any) => acc + item.unitPrice * item.quantity, 0);
  const supplierTotalCost = data.items.reduce((acc: number, item: any) => acc + (item.supplierCost || 0) * item.quantity, 0);
  const profitMargin = subtotal - supplierTotalCost;

  const newOrder: Order = {
    id: `ord-in-${Date.now()}`,
    orderNumber: `IND-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    customer: {
      name: data.customer.name,
      phone: data.customer.phone,
      alternatePhone: data.customer.alternatePhone || '',
      address: data.customer.address,
      landmark: data.customer.landmark || '',
      pinCode: data.customer.pinCode,
      city: data.customer.city,
      state: data.customer.state
    },
    items: data.items,
    subtotal,
    shippingCost: 0, // Free Delivery across India
    total: subtotal,
    supplierTotalCost,
    resellerProfitMargin: profitMargin,
    status: 'pending_confirmation',
    paymentMethod: 'Cash on Delivery (COD)',
    paymentStatus: 'Cash to Collect on Delivery',
    supplierPlatform: data.items[0]?.supplierPlatform || 'Meesho',
    whatsappConfirmed: false
  };

  orders.unshift(newOrder);
  res.status(201).json(newOrder);
});

// PATCH update order status, Meesho Order ID, WhatsApp confirmation
app.patch('/api/orders/:id', (req: Request, res: Response) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (req.body.status) order.status = req.body.status;
  if (req.body.meeshoOrderId) order.meeshoOrderId = req.body.meeshoOrderId;
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.courierPartner) order.courierPartner = req.body.courierPartner;
  if (req.body.whatsappConfirmed !== undefined) order.whatsappConfirmed = req.body.whatsappConfirmed;
  if (req.body.notes !== undefined) order.notes = req.body.notes;

  res.json(order);
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
