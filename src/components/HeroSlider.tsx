import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Eye,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Star,
  Flame,
  ArrowRight,
  PackageCheck
} from 'lucide-react';
import { HeroSlide, Product } from '../types';

interface HeroSliderProps {
  slides?: HeroSlide[];
  products?: Product[];
  onInstantBuy: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onExploreCatalog: () => void;
}

const DEFAULT_SAMPLE_SLIDES: HeroSlide[] = [
  {
    id: 'sample-1',
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
    id: 'sample-2',
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
    id: 'sample-3',
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

export const HeroSlider: React.FC<HeroSliderProps> = ({
  slides = [],
  products = [],
  onInstantBuy,
  onQuickView,
  onExploreCatalog
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Guarantee valid active slides list
  const validUserSlides = (slides || []).filter(s => s && s.isActive);
  const activeSlides: HeroSlide[] = validUserSlides.length > 0
    ? validUserSlides
    : (products && products.length > 0)
      ? products.slice(0, 3).map((p, idx) => ({
          id: `slide-fb-${p.id}`,
          productId: p.id,
          title: p.title || 'Trending Viral Product',
          subtitle: p.subtitle || (p.description ? p.description.slice(0, 120) + '...' : 'Available on Cash on Delivery'),
          badge: idx === 0 ? '🔥 Instagram Reels Viral Trend' : '⭐ Top Rated Bestseller',
          price: p.price || 699,
          compareAtPrice: p.compareAtPrice || 1299,
          imageUrl: p.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
          ctaText: 'Buy Cash on Delivery',
          order: idx + 1,
          isActive: true,
          rating: p.rating || 4.8,
          reviewsCount: p.reviewsCount || 120,
          category: p.category || 'Trending'
        }))
      : DEFAULT_SAMPLE_SLIDES;

  const totalSlides = activeSlides.length;

  // Auto-advance slides every 5.5 seconds unless hovered/paused
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    slideTimerRef.current = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
    }, 5500);

    return () => {
      if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    };
  }, [totalSlides, isPaused]);

  // Ensure currentSlideIndex stays within bounds
  const safeIndex = currentSlideIndex >= totalSlides ? 0 : currentSlideIndex;
  const currentSlide: HeroSlide = activeSlides[safeIndex] || DEFAULT_SAMPLE_SLIDES[0];

  const handlePrev = () => {
    setCurrentSlideIndex(prev => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
  };

  const linkedProduct = products.find(p => p.id === currentSlide.productId) || (products[0] ? products[0] : {
    id: currentSlide.productId,
    title: currentSlide.title,
    subtitle: currentSlide.subtitle,
    description: currentSlide.subtitle,
    price: currentSlide.price,
    compareAtPrice: currentSlide.compareAtPrice,
    supplierCost: Math.round(currentSlide.price * 0.5),
    supplierPlatform: 'Meesho',
    supplierProductCode: 's-9481028',
    supplierUrl: 'https://meesho.com',
    stock: 50,
    shippingDaysMin: 3,
    shippingDaysMax: 6,
    rating: currentSlide.rating || 4.8,
    reviewsCount: currentSlide.reviewsCount || 150,
    category: currentSlide.category || 'Trending',
    tags: ['Trending', 'COD Available'],
    images: [currentSlide.imageUrl],
    variants: [{ name: 'Size', options: ['M', 'L', 'XL'] }],
    featured: true,
    freeDelivery: true,
    codAvailable: true
  } as Product);

  const discountPercent = currentSlide.compareAtPrice > currentSlide.price
    ? Math.round(((currentSlide.compareAtPrice - currentSlide.price) / currentSlide.compareAtPrice) * 100)
    : 45;

  return (
    <section
      aria-label="Top Featured Products Slider"
      className="relative overflow-hidden bg-gradient-to-b from-[#F3EEFF]/60 via-[#F8FAFC] to-[#F8FAFC] border-b border-slate-200/80 pt-4 sm:pt-6 pb-6 sm:pb-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Tag */}
        <div className="flex items-center justify-between pb-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#6D28D9]">
            <span className="flex items-center gap-1 bg-violet-100/80 text-[#6D28D9] px-2.5 py-1 rounded-full text-[11px] tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              TOP CURATED PRODUCTS
            </span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
              100% Cash on Delivery
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className="font-semibold text-slate-700">
              {safeIndex + 1} / {totalSlides}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                aria-label="Previous slide"
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next slide"
                className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Slider Card Showcase */}
        <div className="relative bg-white rounded-3xl border border-slate-200 shadow-md shadow-violet-900/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px] sm:min-h-[460px]">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                {/* Badge and Category */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-900 border border-amber-500/20">
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    {currentSlide?.badge || 'Viral Trend'}
                  </span>

                  {currentSlide?.category && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {currentSlide.category}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    ₹0 Advance · Pay Cash at Doorstep
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl lg:text-4xl font-black text-slate-950 tracking-tight leading-[1.2]">
                  {currentSlide?.title || 'Trending Product'}
                </h1>

                {/* Subtitle / Narrative */}
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                  {currentSlide?.subtitle || 'Verified bestseller with 100% Cash on Delivery across India.'}
                </p>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 text-xs pt-1">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{currentSlide?.rating || 4.8}</span>
                  </div>
                  <span className="text-slate-500">
                    ({currentSlide?.reviewsCount || 250}+ verified Indian buyers)
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> In Stock & Dispatched in 24h
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                    ₹{(currentSlide?.price || 699).toLocaleString('en-IN')}
                  </span>
                  {(currentSlide?.compareAtPrice || 0) > (currentSlide?.price || 0) && (
                    <>
                      <span className="text-base sm:text-lg text-slate-400 line-through font-medium">
                        ₹{(currentSlide.compareAtPrice).toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Order Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <button
                    onClick={() => linkedProduct && onInstantBuy(linkedProduct)}
                    className="py-3.5 px-6 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#6D28D9]/25 transition-all cursor-pointer group"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{currentSlide?.ctaText || 'Order Cash on Delivery'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => linkedProduct && onQuickView(linkedProduct)}
                    className="py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#6D28D9]" />
                    <span>Quick View & Sizes</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Instant booking · No OTP or card required · Pay courier person upon arrival</span>
                </div>
              </div>

            </div>

            {/* Right Product Image Visual Column */}
            <div className="lg:col-span-5 relative bg-gradient-to-br from-slate-100 to-slate-200/80 min-h-[300px] lg:min-h-full flex items-center justify-center p-6 sm:p-8 overflow-hidden group">
              
              {/* Product Image */}
              <img
                src={currentSlide?.imageUrl || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80'}
                alt={currentSlide?.title || 'Product'}
                className="w-full h-full max-h-[360px] sm:max-h-[420px] object-cover rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />

              {/* Float Cash on Delivery Stamp */}
              <div className="absolute top-8 right-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-xl px-3 py-2 shadow-md flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                  COD
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</div>
                  <div className="text-xs font-black text-slate-900">Cash on Delivery</div>
                </div>
              </div>

              {/* Float Delivery Time Tag */}
              <div className="absolute bottom-8 left-8 bg-slate-950/85 backdrop-blur-md text-white rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#2563EB]" />
                <div className="text-xs font-medium">
                  <span className="font-bold text-white">Free Doorstep Delivery</span>
                  <span className="text-slate-300 text-[10px] block">Dispatches via Delhivery & Shadowfax</span>
                </div>
              </div>

            </div>

          </div>

          {/* Slider Pagination Dots & Preview Pills */}
          {totalSlides > 1 && (
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeSlides.map((slide, index) => (
                  <button
                    key={slide.id || index}
                    onClick={() => setCurrentSlideIndex(index)}
                    aria-label={`Go to slide ${index + 1}: ${slide.title}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      safeIndex === index
                        ? 'w-8 bg-[#6D28D9]'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                {activeSlides.map((slide, index) => (
                  <button
                    key={slide.id || index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`transition-colors cursor-pointer text-[11px] truncate max-w-[140px] ${
                      safeIndex === index
                        ? 'text-[#6D28D9] font-bold underline underline-offset-4'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    #{index + 1} {(slide?.title || '').split(' ')[0]} {(slide?.title || '').split(' ')[1] || ''}
                  </button>
                ))}
              </div>

              <button
                onClick={onExploreCatalog}
                className="text-xs font-bold text-[#6D28D9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Browse Full Store ({products.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

        {/* Doorstep Trust Highlights Ribbon */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-slate-900 leading-tight">100% Cash on Delivery</div>
              <div className="text-[11px] text-slate-500">₹0 advance payment required</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <span className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-slate-900 leading-tight">Free Express Shipping</div>
              <div className="text-[11px] text-slate-500">All India PIN codes covered</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <span className="w-8 h-8 rounded-lg bg-violet-50 text-[#6D28D9] flex items-center justify-center shrink-0">
              <PackageCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-slate-900 leading-tight">Inspect at Doorstep</div>
              <div className="text-[11px] text-slate-500">Verify parcel before cash payment</div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2.5 shadow-2xs">
            <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <div className="font-bold text-slate-900 leading-tight">7-Day Easy Exchange</div>
              <div className="text-[11px] text-slate-500">Free pickup for size replacements</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
