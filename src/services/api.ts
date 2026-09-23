import { Product, Order, CustomerDetails, HeroSlide } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';

// Default initial catalog
const defaultProducts: Product[] = [
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
    codAvailable: true,
    isTopProductHero: true,
    heroOrder: 1,
    heroTagline: 'Trending on Instagram & Reels',
    heroBadge: '🔥 Viral Fashion Pick'
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
    codAvailable: true,
    isTopProductHero: true,
    heroOrder: 2,
    heroTagline: 'Most Wanted Gadget 2026',
    heroBadge: '⚡ 20W Fast MagSafe'
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
    codAvailable: true,
    isTopProductHero: true,
    heroOrder: 3,
    heroTagline: 'Heavy 240 GSM French Terry',
    heroBadge: '⭐ Bestseller Streetwear'
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

const defaultHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    productId: 'prod-cloth-1',
    title: 'Pure Cotton Jaipur Kurti Pant & Dupatta Set',
    subtitle: 'Premium 60-60 cotton fabric with gota patti border. Viral aesthetic as seen on Instagram reels.',
    badge: '🔥 Top Viral Pick · 47% OFF',
    price: 899,
    compareAtPrice: 1699,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'Buy Cash on Delivery',
    order: 1,
    isActive: true,
    rating: 4.8,
    reviewsCount: 342,
    category: 'Ethnic Wear'
  },
  {
    id: 'slide-2',
    productId: 'prod-gadget-1',
    title: 'Magnetic Wireless 20W Fast Power Bank & Phone Stand',
    subtitle: 'Snap-and-charge 10,000mAh with fold-out kickstand and digital LED battery indicator.',
    badge: '⚡ Trending Tech · 52% OFF',
    price: 1199,
    compareAtPrice: 2499,
    imageUrl: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'Buy Cash on Delivery',
    order: 2,
    isActive: true,
    rating: 4.8,
    reviewsCount: 189,
    category: 'Gadgets'
  },
  {
    id: 'slide-3',
    productId: 'prod-cloth-2',
    title: 'Oversized Japanese Anime Heavy Streetwear Tee',
    subtitle: '240 GSM bio-washed heavy cotton with high-density puff graphic print. Drop-shoulder relaxed cut.',
    badge: '⭐ Gen-Z Bestseller · 50% OFF',
    price: 599,
    compareAtPrice: 1199,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'Buy Cash on Delivery',
    order: 3,
    isActive: true,
    rating: 4.7,
    reviewsCount: 218,
    category: 'Streetwear'
  }
];

const defaultOrders: Order[] = [
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
      district: 'Jaipur',
      postOffice: 'Mansarovar S.O',
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
    resellerProfitMargin: 450,
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
      district: 'Gurugram',
      postOffice: 'Gurgaon H.O',
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

// In-memory cache for ultra-fast UI rendering and offline resilience
let localProducts: Product[] = [...defaultProducts];
let localHeroSlides: HeroSlide[] = [...defaultHeroSlides];
let localOrders: Order[] = [...defaultOrders];

export const api = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const firestoreList: Product[] = [];
        snap.forEach(d => {
          firestoreList.push({ ...d.data(), id: d.id } as Product);
        });
        localProducts = firestoreList;
        return firestoreList;
      } else {
        // Seed default products to Firestore on first launch
        for (const p of defaultProducts) {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch {
            // non-fatal if security rules or offline
          }
        }
      }
    } catch (err) {
      console.warn('Firestore products fetch notice (using cache):', err);
    }
    return localProducts;
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const id = productData.id || `prod-${Date.now()}`;
    const newProd: Product = {
      id,
      title: productData.title || 'Trending Product',
      subtitle: productData.subtitle || '',
      description: productData.description || '',
      price: Number(productData.price) || 699,
      compareAtPrice: Number(productData.compareAtPrice) || 1299,
      supplierCost: Number(productData.supplierCost) || 300,
      supplierPlatform: productData.supplierPlatform || 'Meesho',
      supplierProductCode: productData.supplierProductCode || `s-${Math.floor(10000000 + Math.random() * 90000000)}`,
      supplierUrl: productData.supplierUrl || 'https://meesho.com',
      stock: Number(productData.stock) || 50,
      shippingDaysMin: 3,
      shippingDaysMax: 6,
      rating: 4.8,
      reviewsCount: 1,
      category: productData.category || 'Clothes',
      tags: productData.tags || ['Trending', 'COD Available'],
      images: productData.images?.length
        ? productData.images
        : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'],
      variants: productData.variants || [{ name: 'Size', options: ['M', 'L', 'XL'] }],
      featured: Boolean(productData.featured),
      freeDelivery: true,
      codAvailable: true,
      isTopProductHero: Boolean(productData.isTopProductHero),
      heroOrder: productData.heroOrder || 99,
      heroTagline: productData.heroTagline || '',
      heroBadge: productData.heroBadge || ''
    };

    localProducts.unshift(newProd);

    try {
      await setDoc(doc(db, 'products', id), newProd);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `products/${id}`);
    }

    return newProd;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    const idx = localProducts.findIndex(p => p.id === id);
    if (idx !== -1) {
      localProducts[idx] = { ...localProducts[idx], ...updates };
    }

    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `products/${id}`);
    }

    return localProducts[idx] || (updates as Product);
  },

  async deleteProduct(id: string): Promise<boolean> {
    localProducts = localProducts.filter(p => p.id !== id);

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }

    return true;
  },

  // HERO SLIDES & TOP PRODUCTS SLIDER
  async getHeroSlides(): Promise<HeroSlide[]> {
    try {
      const q = query(collection(db, 'hero_slides'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const slides: HeroSlide[] = [];
        snap.forEach(d => {
          slides.push({ ...d.data(), id: d.id } as HeroSlide);
        });
        localHeroSlides = slides.filter(s => s.isActive);
        return localHeroSlides;
      } else {
        // Seed default slides into Firestore
        for (const s of defaultHeroSlides) {
          try {
            await setDoc(doc(db, 'hero_slides', s.id), s);
          } catch {
            // non-fatal
          }
        }
      }
    } catch (err) {
      console.warn('Firestore hero_slides fetch notice (using cache):', err);
    }
    return localHeroSlides;
  },

  async getAllHeroSlidesAdmin(): Promise<HeroSlide[]> {
    try {
      const snap = await getDocs(collection(db, 'hero_slides'));
      if (!snap.empty) {
        const slides: HeroSlide[] = [];
        snap.forEach(d => {
          slides.push({ ...d.data(), id: d.id } as HeroSlide);
        });
        slides.sort((a, b) => a.order - b.order);
        localHeroSlides = slides;
        return slides;
      }
    } catch (err) {
      console.warn('Hero slides admin fetch notice:', err);
    }
    return localHeroSlides;
  },

  async saveHeroSlide(slide: HeroSlide): Promise<HeroSlide> {
    const existingIdx = localHeroSlides.findIndex(s => s.id === slide.id);
    if (existingIdx !== -1) {
      localHeroSlides[existingIdx] = slide;
    } else {
      localHeroSlides.push(slide);
    }
    localHeroSlides.sort((a, b) => a.order - b.order);

    try {
      await setDoc(doc(db, 'hero_slides', slide.id), slide);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `hero_slides/${slide.id}`);
    }

    return slide;
  },

  async deleteHeroSlide(id: string): Promise<boolean> {
    localHeroSlides = localHeroSlides.filter(s => s.id !== id);

    try {
      await deleteDoc(doc(db, 'hero_slides', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `hero_slides/${id}`);
    }

    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const ordersList: Order[] = [];
        snap.forEach(d => {
          ordersList.push({ ...d.data(), id: d.id } as Order);
        });
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        localOrders = ordersList;
        return ordersList;
      } else {
        // Seed initial orders into Firestore
        for (const o of defaultOrders) {
          try {
            await setDoc(doc(db, 'orders', o.id), o);
          } catch {
            // non-fatal
          }
        }
      }
    } catch (err) {
      console.warn('Firestore orders fetch notice (using cache):', err);
    }
    return localOrders;
  },

  async createOrder(payload: { customer: CustomerDetails; items: any[]; userId?: string }): Promise<Order> {
    const subtotal = payload.items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const cost = payload.items.reduce((acc, it) => acc + (it.supplierCost || 0) * it.quantity, 0);
    const orderId = `ord-in-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: `IND-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      customer: payload.customer,
      items: payload.items,
      subtotal,
      shippingCost: 0,
      total: subtotal,
      supplierTotalCost: cost,
      resellerProfitMargin: subtotal - cost,
      status: 'pending_confirmation',
      paymentMethod: 'Cash on Delivery (COD)',
      paymentStatus: 'Cash to Collect on Delivery',
      supplierPlatform: 'Meesho',
      whatsappConfirmed: false
    };

    localOrders.unshift(newOrder);

    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${orderId}`);
    }

    return newOrder;
  },

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order> {
    const ord = localOrders.find(o => o.id === orderId);
    if (ord) {
      Object.assign(ord, updates);
    }

    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }

    if (!ord) throw new Error('Order not found');
    return ord;
  }
};
