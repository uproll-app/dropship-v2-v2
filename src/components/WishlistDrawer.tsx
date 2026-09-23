import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-slate-900">Saved Wishlist</h2>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {wishlist.length}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close wishlist"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <Heart className="w-10 h-10 stroke-1" />
              <p className="text-sm font-semibold text-slate-700">No items saved yet</p>
              <p className="text-xs text-slate-400 max-w-xs">
                Tap the heart on any trendy clothes or gadgets from reels to save them here.
              </p>
            </div>
          ) : (
            wishlist.map(product => (
              <div
                key={product.id}
                className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0 items-center"
              >
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {product.title}
                  </h4>
                  <div className="text-xs font-black text-slate-950 mt-1">
                    ₹{product.price}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="px-2.5 py-1 bg-[#6D28D9] text-white text-[11px] font-bold rounded hover:bg-[#5b21b6] flex items-center gap-1 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Add to Bag
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            ← Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};
