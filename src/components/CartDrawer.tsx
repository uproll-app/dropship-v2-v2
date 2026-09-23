import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#6D28D9]" />
            <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, it) => acc + it.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 text-xs flex items-center justify-between text-emerald-800 font-semibold">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-600" /> Free Home Delivery Across India
          </span>
          <span className="font-bold">₹0 Shipping</span>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-slate-400 space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Your bag is empty</p>
              <p className="text-xs max-w-xs text-slate-400">
                Discover trending viral clothes, ethnic sets, oversized tees and gadgets from reels.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-[#6D28D9] text-white text-xs font-bold rounded-lg hover:bg-[#5b21b6] cursor-pointer"
              >
                Browse Trending Catalog
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(index)}
                        aria-label="Remove item"
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                      <div className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                        {Object.entries(item.selectedVariants)
                          .map(([key, val]) => `${key}: ${val}`)
                          .join(' · ')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-slate-200 rounded-md overflow-hidden bg-white">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-xs font-black text-slate-950">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">₹{rawSubtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Delivery Charges</span>
                <span className="font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                <span>Total Cash on Delivery</span>
                <span>₹{rawSubtotal}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-xl text-sm font-extrabold shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Place Cash on Delivery Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Pay Cash at Doorstep to Delivery Person</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
