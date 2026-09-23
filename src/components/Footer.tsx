import React from 'react';
import { ShieldCheck, Truck, RotateCcw, MessageCircle, SlidersHorizontal, ShoppingBag } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (category: string) => void;
  onOpenDropshipPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenDropshipPortal
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      {/* Indian Trust Bar */}
      <div className="border-b border-slate-100 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#6D28D9]/10 text-[#6D28D9] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Free Cash on Delivery</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Pay ₹0 advance. Hand over cash to the delivery executive when the parcel arrives at your doorstep.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#2563EB]/10 text-[#2563EB] shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">7-Day Easy Exchange</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Size issue or style change? Doorstep pickup and hassle-free exchange within 7 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Quality Checked</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Strict multi-point quality check on all fabrics, stitches, and gadget components prior to dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">WhatsApp Updates</h4>
              <p className="text-slate-500 mt-0.5 leading-relaxed">
                Live delivery tracking updates and order confirmation sent directly to your registered WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#7C3AED] to-[#2563EB] flex items-center justify-center text-white shadow-sm">
                  <ShoppingBag className="w-4 h-4 text-white stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                </span>
              </div>
              <span className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-1 leading-none">
                <span>dropified</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]"></span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dropified curates viral social media fashion, ethnic kurtis, oversized streetwear, and smart lifestyle tech with 100% Cash on Delivery across India.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5 text-xs">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Categories
            </h5>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  onClick={() => onSelectCategory('Clothes')}
                  className="hover:text-[#6D28D9] font-medium transition-colors cursor-pointer"
                >
                  ✨ Clothes & Fashion (Kurtis, Tees, Sets)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Gadgets')}
                  className="hover:text-[#6D28D9] transition-colors cursor-pointer"
                >
                  Gadgets & Accessories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('Home Essentials')}
                  className="hover:text-[#6D28D9] transition-colors cursor-pointer"
                >
                  Home Essentials & Decor
                </button>
              </li>
            </ul>
          </div>

          {/* Shipping & Delivery Information */}
          <div className="space-y-2.5 text-xs">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Delivery & Service
            </h5>
            <ul className="space-y-1.5 text-slate-600">
              <li><span>100% Cash on Delivery (COD)</span></li>
              <li><span>Free Home Delivery Across India</span></li>
              <li><span>Auto PIN Code Delivery Check</span></li>
              <li><span>Doorstep Size Exchange Available</span></li>
            </ul>
          </div>

          {/* Customer Promise & Discreet Staff Link */}
          <div className="space-y-2.5 text-xs">
            <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Customer Promise
            </h5>
            <p className="text-slate-500 leading-relaxed">
              Never share OTP or card numbers online. Pay only in cash to the authorized delivery person after inspecting the sealed package.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenDropshipPortal}
                className="text-[11px] text-slate-400 hover:text-slate-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Staff / Order Dispatch Console</span>
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            © {new Date().getFullYear()} Dropified. All rights reserved.
          </div>
          <div>
            Cash on Delivery Store · Express Delivery Across All 28 States & UTs.
          </div>
        </div>
      </div>
    </footer>
  );
};
