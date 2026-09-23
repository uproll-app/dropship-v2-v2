import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Star, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onFastCodOrder: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  onFastCodOrder,
  isWishlisted,
  onToggleWishlist
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const discountPercent = product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) setImageIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
      className="group relative bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col transition-all duration-300 hover:border-[#6D28D9]/40 hover:shadow-xl hover:shadow-[#6D28D9]/5"
    >
      {/* Product Image Frame */}
      <div
        className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.images[imageIndex] || product.images[0]}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {discountPercent > 0 && (
            <span className="bg-[#6D28D9] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-100" /> 100% Cash on Delivery
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Save item"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-white text-rose-600 shadow-sm'
              : 'bg-white/85 text-slate-600 hover:bg-white hover:text-slate-950'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Quick Action Bar */}
        <div
          className={`absolute bottom-3 left-3 right-3 flex flex-col gap-1.5 transition-all duration-300 z-10 ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between gap-1 py-1 px-2.5 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-lg shadow-sm">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3 h-3" /> 100% Cash on Delivery
            </span>
            <span className="text-slate-300">₹0 Advance</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFastCodOrder(product);
              }}
              className="flex-1 py-2 px-3 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              aria-label="Add to cart"
              className="flex-1 py-2 px-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-bold text-[#6D28D9] uppercase tracking-wider text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-slate-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900">{product.rating}</span>
              <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-sm font-bold text-slate-900 group-hover:text-[#6D28D9] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Subtitle */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Delivery */}
        <div className="pt-2 border-t border-slate-100 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-950">
                ₹{product.price}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.compareAtPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
              <Truck className="w-3 h-3 text-[#2563EB]" />
              <span>Free Delivery in {product.shippingDaysMin}-{product.shippingDaysMax} Days</span>
            </div>
          </div>

          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            Verified Quality
          </span>
        </div>

        {/* Prominent '100% Cash on Delivery' Trust Badge & Action Buttons */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          {/* Prominent Trust Badge reinforcing no advance payment */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-emerald-50/95 border border-emerald-200 rounded-lg text-emerald-900 text-xs font-bold shadow-2xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Cash on Delivery</span>
            </span>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-white border border-emerald-200 px-1.5 py-0.5 rounded shadow-2xs">
              No Advance Payment
            </span>
          </div>

          {/* Action Buttons: Buy Now & Add to Cart */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFastCodOrder(product);
              }}
              className="flex-1 py-2.5 px-3 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Buy Now</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 py-2.5 px-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              aria-label="Quick view"
              title="Quick view"
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Dropified Team! I'm interested in *${product.title}* (₹${product.price}). Could you please help me with size fit and shipping to my PIN code?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp about size & delivery"
              className="p-2.5 bg-emerald-50 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-emerald-200 hover:border-[#25D366] rounded-lg transition-colors cursor-pointer flex items-center justify-center"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
