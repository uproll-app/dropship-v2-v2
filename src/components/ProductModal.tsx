import React, { useState } from 'react';
import { X, Star, ShoppingBag, Truck, RefreshCw, Check, ArrowRight, CheckCircle2, ShieldCheck, MessageCircle } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
  onInstantCheckout: (product: Product, quantity: number, selectedVariants: Record<string, string>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onInstantCheckout
}) => {
  if (!product) return null;

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants?.forEach(v => {
      if (v.options.length > 0) initial[v.name] = v.options[0];
    });
    return initial;
  });
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleVariantSelect = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedVariants);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleInstantBuy = () => {
    onInstantCheckout(product, quantity, selectedVariants);
  };

  const getWhatsAppInquiryUrl = (queryType: 'size' | 'shipping' | 'general' | 'photos' = 'general') => {
    // Official WhatsApp store inquiry number
    const storePhone = '919876543210';
    const variantDetails = Object.entries(selectedVariants).length > 0
      ? ` (${Object.entries(selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')})`
      : '';

    let message = `Hello Dropified Store! I am looking at *${product.title}* (₹${product.price})${variantDetails}.\n\n`;

    if (queryType === 'size') {
      message += `Could you please assist me with the sizing and fit details so I can choose the right option?`;
    } else if (queryType === 'shipping') {
      message += `I want to check delivery time to my PIN code with 100% Cash on Delivery. How many days will it take to arrive?`;
    } else if (queryType === 'photos') {
      message += `Could you share real photos or fabric close-up videos of this item before I order?`;
    } else {
      message += `I would like more details about this product and placing a Cash on Delivery order.`;
    }

    return `https://wa.me/${storePhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-white/90 hover:bg-slate-100 rounded-full z-20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Image Gallery */}
          <div className="p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-white border border-slate-200">
                <img
                  src={product.images[activeImage] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImage === i
                          ? 'border-[#6D28D9] ring-2 ring-[#6D28D9]/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Indian COD Trust Box */}
            <div className="mt-5 p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5 text-xs text-emerald-900">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                100% Cash on Delivery Available
              </div>
              <div className="text-[11px] text-emerald-700">
                No advance money required. Pay ₹{product.price * quantity} cash when Delhivery / Shadowfax delivers at your door.
              </div>
            </div>
          </div>

          {/* Right Column: Product Details & Variant Selectors */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3.5">
              
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#6D28D9] uppercase tracking-wider">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-slate-700">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                  {product.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {product.subtitle}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-950">
                  ₹{product.price}
                </span>
                {product.compareAtPrice > product.price && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Free Delivery All India
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selectors (Sizes for Clothes, Colors, etc.) */}
              {product.variants?.map(variant => (
                <div key={variant.name} className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700">Select {variant.name}:</span>
                    <span className="text-slate-900 font-semibold">{selectedVariants[variant.name]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => {
                      const isSelected = selectedVariants[variant.name] === option;
                      return (
                        <button
                          key={option}
                          onClick={() => handleVariantSelect(variant.name, option)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#6D28D9] bg-violet-50 text-[#6D28D9] shadow-xs'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quantity Selector */}
              <div className="pt-1 flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 text-sm font-semibold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 text-sm font-semibold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Fast COD Action Buttons & Prominent Trust Badge */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              {/* Prominent 100% Cash on Delivery Trust Badge */}
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold shadow-2xs">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Cash on Delivery Guaranteed</span>
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded shadow-2xs">
                  No Advance Payment Required
                </span>
              </div>

              {/* Order Buttons */}
              <button
                onClick={handleInstantBuy}
                className="w-full py-3.5 px-4 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#6D28D9]/25 transition-all cursor-pointer"
              >
                <span>Buy Now — Cash on Delivery (₹{product.price * quantity})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className={`py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    addedAnimation
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#6D28D9]" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* Prominent Chat on WhatsApp Button */}
                <a
                  href={getWhatsAppInquiryUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs shadow-[#25D366]/20 transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              {/* Direct Store Owner Inquiry Box for Size & Shipping Assistance */}
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                    Ask Store Owner on WhatsApp:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-white px-2 py-0.5 rounded shadow-2xs border border-emerald-100">
                    Direct Support (5 min reply)
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <a
                    href={getWhatsAppInquiryUrl('size')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-900 bg-white hover:bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>👗 Ask Size & Fit Help</span>
                  </a>
                  <a
                    href={getWhatsAppInquiryUrl('shipping')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-900 bg-white hover:bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>🚚 Check PIN Delivery Speed</span>
                  </a>
                  <a
                    href={getWhatsAppInquiryUrl('photos')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-emerald-900 bg-white hover:bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>📸 Ask Real Photos/Video</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#2563EB]" /> Free Express Shipping
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-600" /> 7-Day Easy Return
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
