import React, { useState } from 'react';
import {
  Package, ShoppingCart, Plus, Trash2, Check,
  Search, ExternalLink, DollarSign, TrendingUp, Clock, Truck,
  CheckCircle2, Copy, MessageCircle, Phone, MapPin, X, AlertTriangle, ShieldCheck,
  Sparkles, ArrowUp, ArrowDown, Edit3, Eye, Flame, Layers
} from 'lucide-react';
import { Product, Order, OrderStatus, HeroSlide } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  heroSlides: HeroSlide[];
  onProductsUpdated: () => void;
  onOrdersUpdated: () => void;
  onHeroSlidesUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  heroSlides,
  onProductsUpdated,
  onOrdersUpdated,
  onHeroSlidesUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'hero_slider' | 'guide'>('orders');

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Meesho Order ID and Courier Input modal state
  const [meeshoInput, setMeeshoInput] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [courierInput, setCourierInput] = useState<'Delhivery' | 'Shadowfax' | 'Xpressbees' | 'Ecom Express' | 'BlueDart'>('Delhivery');

  // Add Product modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: 699,
    compareAtPrice: 1299,
    supplierCost: 299,
    supplierPlatform: 'Meesho' as 'Meesho' | 'Amazon' | 'Myntra',
    supplierProductCode: 's-48102931',
    supplierUrl: 'https://meesho.com',
    category: 'Clothes',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80',
    variantName: 'Size',
    variantOptions: 'M, L, XL, XXL'
  });

  // Hero Slide modal & state
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [slideForm, setSlideForm] = useState<{
    productId: string;
    title: string;
    subtitle: string;
    badge: string;
    price: number;
    compareAtPrice: number;
    imageUrl: string;
    ctaText: string;
    order: number;
    isActive: boolean;
    category: string;
  }>({
    productId: products[0]?.id || 'prod-cloth-1',
    title: 'Pure Cotton Jaipur Kurti Pant & Dupatta Set',
    subtitle: 'Viral 60-60 cotton kurti set with gota border. Trending on Instagram Reels.',
    badge: '🔥 Top Viral Pick · 47% OFF',
    price: 899,
    compareAtPrice: 1699,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    ctaText: 'Buy Cash on Delivery',
    order: 1,
    isActive: true,
    category: 'Ethnic Wear'
  });

  // Calculate totals
  const totalCodRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalResellerProfit = orders.reduce((acc, o) => acc + o.resellerProfitMargin, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending_confirmation').length;

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch) ||
      (o.customer.alternatePhone && o.customer.alternatePhone.includes(orderSearch)) ||
      o.customer.city.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.pinCode.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // 1-Click Copy Customer Address formatted for Meesho app
  const copyAddressForMeesho = (order: Order) => {
    const postOfficeLine = order.customer.postOffice ? `\nPost Office / Area: ${order.customer.postOffice}` : '';
    const districtPart = order.customer.district ? ` (${order.customer.district})` : '';
    const formatted = `${order.customer.name}
Phone: ${order.customer.phone}${order.customer.alternatePhone ? ` / ${order.customer.alternatePhone}` : ''}
Address: ${order.customer.address}${postOfficeLine}
Landmark: ${order.customer.landmark}
City/District/State: ${order.customer.city}${districtPart}, ${order.customer.state}
PIN Code: ${order.customer.pinCode}
Collect Cash: ₹${order.total}`;

    navigator.clipboard.writeText(formatted);
    setCopiedId(order.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // WhatsApp Customer Confirmation Link (Zero RTO tactic!)
  const openWhatsAppConfirmation = (order: Order) => {
    const productTitle = order.items.map(i => i.title).join(', ');
    const postOfficeText = order.customer.postOffice ? `, ${order.customer.postOffice}` : '';
    const msg = `Hello ${order.customer.name}, we received your Cash on Delivery order (${order.orderNumber}) for ${productTitle} of ₹${order.total}. 

Delivery Address: ${order.customer.address}, ${order.customer.landmark}${postOfficeText}, ${order.customer.city} - ${order.customer.pinCode}.
Alternate Phone: ${order.customer.alternatePhone || 'None'}

Please reply *YES* to confirm and dispatch your parcel via Delhivery / Meesho. Thank you!`;
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${order.customer.phone}?text=${encoded}`, '_blank');
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    await api.updateOrder(orderId, { status });
    onOrdersUpdated();
  };

  const handleSaveMeeshoDetails = async () => {
    if (!selectedOrder) return;
    await api.updateOrder(selectedOrder.id, {
      status: 'ordered_on_meesho',
      meeshoOrderId: meeshoInput || undefined,
      courierPartner: courierInput,
      trackingNumber: trackingInput || undefined,
      whatsappConfirmed: true
    });
    setSelectedOrder(null);
    setMeeshoInput('');
    setTrackingInput('');
    onOrdersUpdated();
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = newProductForm.variantOptions
      .split(',')
      .map(o => o.trim())
      .filter(Boolean);

    await api.createProduct({
      title: newProductForm.title,
      subtitle: newProductForm.subtitle,
      description: newProductForm.description,
      price: newProductForm.price,
      compareAtPrice: newProductForm.compareAtPrice,
      supplierCost: newProductForm.supplierCost,
      supplierPlatform: newProductForm.supplierPlatform,
      supplierProductCode: newProductForm.supplierProductCode,
      supplierUrl: newProductForm.supplierUrl,
      category: newProductForm.category,
      images: [newProductForm.imageUrl],
      variants: [
        {
          name: newProductForm.variantName,
          options: options.length ? options : ['Default']
        }
      ],
      featured: true,
      freeDelivery: true,
      codAvailable: true
    });

    setIsAddModalOpen(false);
    onProductsUpdated();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this product from the catalog?')) {
      await api.deleteProduct(id);
      onProductsUpdated();
    }
  };

  // HERO SLIDER HANDLERS
  const handleOpenAddSlide = (productToSeed?: Product) => {
    const baseProd = productToSeed || products[0];
    setEditingSlideId(null);
    setSlideForm({
      productId: baseProd?.id || 'prod-custom',
      title: baseProd?.title || 'Trending Product',
      subtitle: baseProd?.subtitle || 'Viral trend as seen on Instagram and TikTok Reels.',
      badge: '🔥 Top Viral Pick · 45% OFF',
      price: baseProd?.price || 799,
      compareAtPrice: baseProd?.compareAtPrice || 1499,
      imageUrl: baseProd?.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      ctaText: 'Buy Cash on Delivery',
      order: heroSlides.length + 1,
      isActive: true,
      category: baseProd?.category || 'Clothes'
    });
    setIsSlideModalOpen(true);
  };

  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      productId: slide.productId,
      title: slide.title,
      subtitle: slide.subtitle,
      badge: slide.badge,
      price: slide.price,
      compareAtPrice: slide.compareAtPrice,
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText,
      order: slide.order,
      isActive: slide.isActive,
      category: slide.category || 'Trending'
    });
    setIsSlideModalOpen(true);
  };

  const handleSelectProductForSlide = (prodId: string) => {
    const p = products.find(prod => prod.id === prodId);
    if (!p) return;
    setSlideForm(prev => ({
      ...prev,
      productId: p.id,
      title: p.title,
      subtitle: p.subtitle || p.description.slice(0, 100) + '...',
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      imageUrl: p.images[0] || prev.imageUrl,
      category: p.category
    }));
  };

  const handleSaveSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingSlideId || `slide-${Date.now()}`;
    const slideToSave: HeroSlide = {
      id,
      productId: slideForm.productId,
      title: slideForm.title,
      subtitle: slideForm.subtitle,
      badge: slideForm.badge,
      price: Number(slideForm.price) || 699,
      compareAtPrice: Number(slideForm.compareAtPrice) || 1299,
      imageUrl: slideForm.imageUrl,
      ctaText: slideForm.ctaText || 'Buy Cash on Delivery',
      order: Number(slideForm.order) || 1,
      isActive: slideForm.isActive,
      category: slideForm.category
    };

    await api.saveHeroSlide(slideToSave);
    setIsSlideModalOpen(false);
    onHeroSlidesUpdated();
  };

  const handleToggleSlideActive = async (slide: HeroSlide) => {
    await api.saveHeroSlide({
      ...slide,
      isActive: !slide.isActive
    });
    onHeroSlidesUpdated();
  };

  const handleDeleteSlide = async (id: string) => {
    if (confirm('Remove this slide from the hero slider?')) {
      await api.deleteHeroSlide(id);
      onHeroSlidesUpdated();
    }
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroSlides.length) return;

    const currentSlide = heroSlides[index];
    const targetSlide = heroSlides[targetIndex];

    const currentOrder = currentSlide.order;
    const targetOrder = targetSlide.order;

    await api.saveHeroSlide({ ...currentSlide, order: targetOrder });
    await api.saveHeroSlide({ ...targetSlide, order: currentOrder });
    onHeroSlidesUpdated();
  };

  // Quick 1-Click Feature Product to Hero Slider
  const handleQuickFeatureProduct = async (product: Product) => {
    const existingSlide = heroSlides.find(s => s.productId === product.id);
    if (existingSlide) {
      await api.saveHeroSlide({
        ...existingSlide,
        isActive: !existingSlide.isActive
      });
    } else {
      await api.saveHeroSlide({
        id: `slide-feat-${product.id}`,
        productId: product.id,
        title: product.title,
        subtitle: product.subtitle || product.description.slice(0, 100) + '...',
        badge: '🔥 Top Viral Pick · 45% OFF',
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        imageUrl: product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
        ctaText: 'Buy Cash on Delivery',
        order: heroSlides.length + 1,
        isActive: true,
        category: product.category,
        rating: product.rating,
        reviewsCount: product.reviewsCount
      });
    }
    onHeroSlidesUpdated();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-[#6D28D9] border border-purple-200">
              DROPSHIP OPERATING CONSOLE
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firebase Connected: dropshing-70790
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Storefront & Fulfillment Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage top product hero slider, live catalog pricing, and Meesho/Delhivery COD dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => handleOpenAddSlide()}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>+ Add Hero Slider Product</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product (Meesho SKU)</span>
          </button>
        </div>
      </div>

      {/* Financial Overview KPIs (INR ₹) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Total Customer COD Value</div>
          <div className="text-xl sm:text-2xl font-black text-slate-950 mt-1">
            ₹{totalCodRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Across {orders.length} orders
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Your Realized Profit Margin</div>
          <div className="text-xl sm:text-2xl font-black text-[#6D28D9] mt-1">
            +₹{totalResellerProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-0.5">
            Avg ₹{orders.length ? Math.round(totalResellerProfit / orders.length) : 0} per parcel
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Top Hero Slider Products</div>
          <div className="text-xl sm:text-2xl font-black text-amber-600 mt-1">
            {heroSlides.filter(s => s.isActive).length} Active
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {heroSlides.length} total slides configured
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-medium">Pending Meesho Entry</div>
          <div className="text-xl sm:text-2xl font-black text-rose-600 mt-1">
            {pendingOrders} Pending
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Ready to dispatch via Delhivery
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero_slider')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'hero_slider'
              ? 'border-[#6D28D9] text-[#6D28D9] bg-violet-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>Hero Slider & Top Products ({heroSlides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'orders'
              ? 'border-[#6D28D9] text-[#6D28D9] bg-violet-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Customer Orders to Dispatch ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'products'
              ? 'border-[#6D28D9] text-[#6D28D9] bg-violet-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Catalog & Meesho Margins ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
            activeTab === 'guide'
              ? 'border-[#6D28D9] text-[#6D28D9] bg-violet-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Reseller Quick-Start Blueprint
        </button>
      </div>

      {/* ================= TAB 0: HERO SLIDER & TOP PRODUCTS CONTROLLER ================= */}
      {activeTab === 'hero_slider' && (
        <div className="space-y-4">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-violet-900 to-indigo-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Flame className="w-4 h-4 fill-amber-400" />
                <span>STOREFRONT HOMEPAGE HERO SLIDER</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Featured Top Products Controller
              </h2>
              <p className="text-xs text-violet-200 leading-relaxed">
                Directly control which viral products appear on the homepage slider banner. Customize promotional badges (e.g. &quot;Viral Trend 🔥&quot;, &quot;50% OFF&quot;), adjust slide sequence, and toggle visibility. Changes update in real-time.
              </p>
            </div>

            <button
              onClick={() => handleOpenAddSlide()}
              className="px-4 py-2.5 bg-white text-[#6D28D9] hover:bg-violet-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Top Product Slide</span>
            </button>
          </div>

          {/* Slides List */}
          <div className="space-y-3">
            {heroSlides.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="font-bold text-slate-900 text-sm">No Hero Slides Configured Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Add top products to showcase them prominently at the very top of your storefront.
                </p>
                <button
                  onClick={() => handleOpenAddSlide()}
                  className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Create First Slide
                </button>
              </div>
            ) : (
              (heroSlides || []).filter(Boolean).map((slide, index) => (
                <div
                  key={slide.id || index}
                  className={`bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    slide.isActive ? 'border-slate-200 shadow-2xs' : 'border-slate-200 opacity-60 bg-slate-50'
                  }`}
                >
                  {/* Left: Position & Preview Thumbnail */}
                  <div className="flex items-center gap-3.5">
                    {/* Reorder Buttons */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveSlide(index, 'up')}
                        disabled={index === 0}
                        aria-label="Move slide up"
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-black text-xs text-slate-700 font-mono">
                        #{slide.order || index + 1}
                      </span>
                      <button
                        onClick={() => handleMoveSlide(index, 'down')}
                        disabled={index === heroSlides.length - 1}
                        aria-label="Move slide down"
                        className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-slate-600 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <img
                      src={slide.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'}
                      alt={slide.title || 'Slide'}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                    />

                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {slide?.badge || 'Viral Pick'}
                        </span>
                        {slide?.category && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            {slide.category}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          slide.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {slide.isActive ? 'Active on Storefront' : 'Hidden'}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-950 text-sm sm:text-base leading-tight">
                        {slide.title || 'Untitled Slide'}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 max-w-lg">
                        {slide.subtitle || ''}
                      </p>

                      <div className="flex items-center gap-3 text-xs pt-0.5">
                        <span className="font-black text-slate-900">
                          ₹{(slide.price || 0).toLocaleString('en-IN')}
                        </span>
                        {(slide.compareAtPrice || 0) > (slide.price || 0) && (
                          <span className="text-slate-400 line-through text-[11px]">
                            ₹{(slide.compareAtPrice || 0).toLocaleString('en-IN')}
                          </span>
                        )}
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          100% Cash on Delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 sm:self-center ml-auto">
                    <button
                      onClick={() => handleToggleSlideActive(slide)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                        slide.isActive
                          ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {slide.isActive ? 'Turn Off' : 'Turn On'}
                    </button>

                    <button
                      onClick={() => handleOpenEditSlide(slide)}
                      className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Slide Content"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 1: ORDER DISPATCH & MEESHO ROUTING ================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by customer name, phone, PIN, or city..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#6D28D9]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'pending_confirmation', label: 'Pending Confirmation' },
                { id: 'ordered_on_meesho', label: 'Ordered on Meesho' },
                { id: 'shipped', label: 'Shipped (Delhivery)' },
                { id: 'delivered', label: 'Delivered (Margin Paid)' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0 ${
                    statusFilter === st.id
                      ? 'bg-[#6D28D9] text-white'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Cards Grid */}
          <div className="space-y-3">
            {filteredOrders.map(order => {
              const statusBadgeMap: Record<string, { bg: string; label: string }> = {
                pending_confirmation: { bg: 'bg-amber-50 border-amber-200 text-amber-800', label: 'Pending Meesho Entry' },
                confirmed_on_whatsapp: { bg: 'bg-blue-50 border-blue-200 text-blue-800', label: 'WhatsApp Confirmed' },
                ordered_on_meesho: { bg: 'bg-purple-50 border-purple-200 text-purple-800', label: 'Ordered on Meesho' },
                shipped: { bg: 'bg-sky-50 border-sky-200 text-sky-800', label: 'Shipped via Courier' },
                delivered: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', label: 'Delivered & Margin Earned' },
                cancelled: { bg: 'bg-rose-50 border-rose-200 text-rose-800', label: 'Cancelled' },
                rto: { bg: 'bg-rose-50 border-rose-200 text-rose-800', label: 'RTO / Returned' }
              };

              const badge = statusBadgeMap[order.status] || { bg: 'bg-slate-100 border-slate-200 text-slate-700', label: order.status };

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-950">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                      <span className="text-slate-500">
                        Collect Cash: <strong className="text-slate-950 text-sm">₹{order.total}</strong>
                      </span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Net Profit: +₹{order.resellerProfitMargin}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Ordered Items
                      </div>
                      <div className="space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                            <img
                              src={it.image}
                              alt=""
                              className="w-11 h-11 rounded-lg object-cover border border-slate-200"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-slate-900 text-xs truncate">
                                {it.title}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {it.variant} · Qty: {it.quantity}
                              </div>
                              <div className="flex items-center justify-between text-[11px] mt-0.5">
                                <span className="text-slate-600 font-medium">Selling: ₹{it.unitPrice}</span>
                                <span className="text-[#6D28D9] font-bold">Meesho Cost: ₹{it.supplierCost || 300}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="md:col-span-7 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{order.customer.name}</span>
                        <button
                          onClick={() => copyAddressForMeesho(order)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-md font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        >
                          {copiedId === order.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied for Meesho!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Address for Meesho</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#6D28D9]" />
                          <span className="font-mono font-bold">+91 {order.customer.phone}</span>
                        </div>
                        {order.customer.alternatePhone && (
                          <div className="flex items-center gap-1 text-slate-500">
                            <span>(Alt: +91 {order.customer.alternatePhone})</span>
                          </div>
                        )}
                        <button
                          onClick={() => openWhatsAppConfirmation(order)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 text-[11px] ml-auto cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Confirm</span>
                        </button>
                      </div>

                      <div className="text-slate-600 text-[11px] leading-relaxed">
                        <span className="font-medium text-slate-800">Address: </span>
                        {order.customer.address}
                        {order.customer.postOffice && (
                          <span className="text-purple-700 font-semibold ml-1">
                            (Post: {order.customer.postOffice})
                          </span>
                        )}
                      </div>

                      <div className="text-slate-600 text-[11px]">
                        <span className="font-medium text-slate-800">Landmark: </span>
                        <span className="text-amber-800 font-medium">{order.customer.landmark}</span>
                      </div>

                      <div className="text-slate-800 font-bold text-[11px]">
                        {order.customer.city}
                        {order.customer.district && order.customer.district !== order.customer.city ? ` (${order.customer.district})` : ''}
                        , {order.customer.state} — PIN: {order.customer.pinCode}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      {order.meeshoOrderId ? (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Meesho Order ID:</span>
                          <span className="font-mono font-bold text-[#6D28D9]">{order.meeshoOrderId}</span>
                          {order.trackingNumber && (
                            <span className="text-slate-600 font-mono text-[11px]">
                              ({order.courierPartner || 'Delhivery'}: {order.trackingNumber})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-700 font-medium text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Not yet ordered on Meesho app
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                      <select
                        value={order.status}
                        onChange={e => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-[#6D28D9] cursor-pointer"
                      >
                        <option value="pending_confirmation">Pending Confirmation</option>
                        <option value="confirmed_on_whatsapp">Confirmed on WhatsApp</option>
                        <option value="ordered_on_meesho">Ordered on Meesho (COD)</option>
                        <option value="shipped">Shipped via Delhivery</option>
                        <option value="delivered">Delivered & Margin Paid</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="rto">RTO (Returned)</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-[#6D28D9] hover:bg-[#5b21b6] text-white font-bold rounded-lg text-xs cursor-pointer"
                      >
                        Record Meesho / Tracking
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 2: PRODUCT CATALOG & MARGINS ================= */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Catalog Inventory & Reseller Profit Calculator
              </h2>
              <p className="text-xs text-slate-500">
                Control customer price, supplier wholesale cost, and feature top items in the homepage hero slider.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Product</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Supplier Platform</th>
                  <th className="py-3 px-4">Meesho Code / SKU</th>
                  <th className="py-3 px-4">Wholesale Buying Price</th>
                  <th className="py-3 px-4">Customer Selling Price</th>
                  <th className="py-3 px-4">Your Profit Margin</th>
                  <th className="py-3 px-4 text-center">Hero Slider</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map(product => {
                  const profit = product.price - product.supplierCost;
                  const marginPercent = Math.round((profit / product.price) * 100);
                  const isFeaturedInHero = heroSlides.some(s => s.productId === product.id && s.isActive);

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-bold text-slate-900 max-w-xs truncate">
                            {product.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {product.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-violet-50 text-[#6D28D9] border border-violet-200">
                          {product.supplierPlatform}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">
                        {product.supplierProductCode}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700">
                        ₹{product.supplierCost}
                      </td>
                      <td className="py-3 px-4 font-black text-slate-950">
                        ₹{product.price}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-700 font-black">
                          +₹{profit}
                        </span>
                        <span className="text-slate-400 text-[10px] ml-1">
                          ({marginPercent}%)
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleQuickFeatureProduct(product)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors cursor-pointer inline-flex items-center gap-1 ${
                            isFeaturedInHero
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-purple-50 text-[#6D28D9] border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{isFeaturedInHero ? '★ In Slider' : '+ Add Slide'}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RESELLER QUICK-START BLUEPRINT ================= */}
      {activeTab === 'guide' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-black text-slate-950">
              The Indian Zero-Investment Social Media Reselling Machine
            </h2>
            <p className="text-xs text-slate-500">
              How thousands of Instagram sellers make ₹50,000–₹1,50,000 net profit monthly with ₹0 inventory risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#6D28D9] text-white flex items-center justify-center font-bold text-xs">
                1
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Post Viral Reels on Instagram</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Take product reels from Meesho/supplier catalogs or shoot aesthetic unboxing videos. Put your store link in bio. Indian buyers order directly on Cash on Delivery with ₹0 advance.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs">
                2
              </span>
              <h3 className="font-bold text-slate-900 text-sm">WhatsApp Verification (0% RTO)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Use the 1-click &quot;WhatsApp Confirm&quot; button in your Orders console to message the customer. Buyers who reply &quot;YES&quot; almost never reject the delivery boy.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-sm">Order on Meesho & Collect Margin</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click &quot;Copy Address for Meesho&quot;. Open Meesho app, search supplier SKU, choose COD, toggle &quot;Reselling this order? YES&quot;, paste selling price. Meesho delivers and deposits cash into your bank account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: RECORD MEESHO ORDER ID & TRACKING ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Record Meesho Dispatch for {selectedOrder.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Meesho Order ID / Reference</label>
                <input
                  type="text"
                  placeholder="e.g. MSH-9481028"
                  value={meeshoInput}
                  onChange={e => setMeeshoInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Courier Partner</label>
                <select
                  value={courierInput}
                  onChange={e => setCourierInput(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="Shadowfax">Shadowfax</option>
                  <option value="Xpressbees">Xpressbees</option>
                  <option value="Ecom Express">Ecom Express</option>
                  <option value="BlueDart">BlueDart</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">AWB Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. DEL39102849102"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMeeshoDetails}
                className="px-5 py-2 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
              >
                Save Details & Mark Ordered
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT HERO SLIDE ================= */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingSlideId ? 'Edit Top Product Slide' : 'Create Top Product Slide for Hero Slider'}
                </h3>
              </div>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlideSubmit} className="space-y-3.5 text-xs">
              
              {/* Select from existing products */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Select Product from Catalog (Auto-Fills Details)
                </label>
                <select
                  value={slideForm.productId}
                  onChange={e => handleSelectProductForSlide(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} (₹{p.price}) — {p.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Promotional Badge */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Promotional Badge Tag</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🔥 Top Viral Pick · 47% OFF"
                    value={slideForm.badge}
                    onChange={e => setSlideForm({ ...slideForm, badge: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    '🔥 Instagram Viral Trend',
                    '⭐ Top Rated Bestseller #1',
                    '⚡ Deal of the Day · 50% OFF',
                    '🎉 Limited Drop'
                  ].map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSlideForm({ ...slideForm, badge: b })}
                      className="text-[10px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer"
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Slide Main Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Cotton Jaipur Kurti Pant & Dupatta Set"
                  value={slideForm.title}
                  onChange={e => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-bold"
                />
              </div>

              {/* Subtitle / Pitch */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Slide Subtitle / Pitch *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Premium 60-60 cotton fabric with gota patti border. Viral aesthetic as seen on Instagram reels."
                  value={slideForm.subtitle}
                  onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              {/* Price & Compare Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Display Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={slideForm.price}
                    onChange={e => setSlideForm({ ...slideForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Compare At Price (₹)</label>
                  <input
                    type="number"
                    value={slideForm.compareAtPrice}
                    onChange={e => setSlideForm({ ...slideForm, compareAtPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Slide Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={slideForm.imageUrl}
                  onChange={e => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              {/* Order & Button CTA */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Sequence / Order Position</label>
                  <input
                    type="number"
                    min={1}
                    value={slideForm.order}
                    onChange={e => setSlideForm({ ...slideForm, order: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Button Call-To-Action</label>
                  <input
                    type="text"
                    value={slideForm.ctaText}
                    onChange={e => setSlideForm({ ...slideForm, ctaText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Show on Storefront</div>
                  <div className="text-[11px] text-slate-500">Active slides rotate in the hero banner</div>
                </div>
                <input
                  type="checkbox"
                  checked={slideForm.isActive}
                  onChange={e => setSlideForm({ ...slideForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#6D28D9] rounded cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save to Hero Slider</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Add Viral Product from Meesho / Supplier
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pure Cotton Floral Printed Kurti Pant Set"
                  value={newProductForm.title}
                  onChange={e => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Subtitle / Reel Pitch</label>
                <input
                  type="text"
                  placeholder="e.g. Trending on Instagram · Sourced directly from Jaipur textile hub"
                  value={newProductForm.subtitle}
                  onChange={e => setNewProductForm({ ...newProductForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Meesho Cost Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.supplierCost}
                    onChange={e => setNewProductForm({ ...newProductForm, supplierCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Your Customer Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 flex justify-between font-bold">
                <span>Calculated Profit Margin:</span>
                <span>+₹{newProductForm.price - newProductForm.supplierCost} per sale!</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Supplier Platform</label>
                  <select
                    value={newProductForm.supplierPlatform}
                    onChange={e => setNewProductForm({ ...newProductForm, supplierPlatform: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  >
                    <option value="Meesho">Meesho</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Myntra">Myntra</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Supplier Product Code / SKU</label>
                  <input
                    type="text"
                    placeholder="e.g. s-38491024"
                    value={newProductForm.supplierProductCode}
                    onChange={e => setNewProductForm({ ...newProductForm, supplierProductCode: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={newProductForm.imageUrl}
                  onChange={e => setNewProductForm({ ...newProductForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Available Sizes / Options (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. M, L, XL, XXL"
                  value={newProductForm.variantOptions}
                  onChange={e => setNewProductForm({ ...newProductForm, variantOptions: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-lg font-bold shadow-xs cursor-pointer"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
