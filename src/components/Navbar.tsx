import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Heart, Truck, Sparkles, CheckCircle2, LayoutDashboard, SlidersHorizontal } from 'lucide-react';

interface NavbarProps {
  currentTab: 'store' | 'admin';
  setCurrentTab: (tab: 'store' | 'admin') => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  cartCount: number;
  openCart: () => void;
  wishlistCount: number;
  openWishlist: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  cartCount,
  openCart,
  wishlistCount,
  openWishlist,
  searchQuery,
  setSearchQuery
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Top category navigation with Clothes prominently featured
  const categories = ['All', 'Clothes', 'Gadgets', 'Home Essentials'];

  return (
    <header className="sticky top-0 z-40 bg-[#F8FAFC]/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Customer Trust Top Banner */}
      <div className="bg-[#6D28D9] text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-xs">
              Cash on Delivery (COD) Available All Over India · Free Shipping · 7-Day Easy Doorstep Exchange
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-purple-100 text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> ₹0 Advance Payment
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5 text-blue-200" /> Fast Express Courier
            </span>
            <span>·</span>
            {currentTab === 'admin' ? (
              <button
                onClick={() => setCurrentTab('store')}
                className="text-white hover:text-purple-200 font-bold underline flex items-center gap-1 cursor-pointer bg-purple-800/60 px-2 py-0.5 rounded"
              >
                <span>← Back to Storefront</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentTab('admin')}
                className="text-white hover:text-purple-200 font-bold underline flex items-center gap-1 cursor-pointer bg-purple-800/60 px-2 py-0.5 rounded"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Admin Dashboard →</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => {
                setCurrentTab('store');
                setSelectedCategory('All');
              }}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#7C3AED] to-[#2563EB] flex items-center justify-center text-white shadow-md shadow-violet-500/25 transition-transform group-hover:scale-105">
                  <ShoppingBag className="w-5 h-5 text-white stroke-[2.2]" />
                </div>
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 flex items-center gap-1 leading-none">
                  <span>dropified</span>
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#6D28D9] to-[#2563EB]"></span>
                </span>
                <span className="hidden sm:block text-[9.5px] tracking-wider text-slate-500 font-extrabold uppercase mt-0.5">
                  100% Cash on Delivery Store
                </span>
              </div>
            </button>
          </div>

          {/* Center Category Navigation (Visible in Storefront Mode, with Clothes prominently featured) */}
          {currentTab === 'store' && (
            <nav className="hidden md:flex items-center space-x-1">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-sm font-semibold transition-colors relative cursor-pointer ${
                      isActive
                        ? 'text-[#6D28D9]'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    <span className="flex items-center gap-1">
                      {cat === 'Clothes' && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                      {cat}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#6D28D9] rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Input / Button */}
            {searchOpen ? (
              <div className="relative flex items-center">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search clothes, kurtis, gadgets..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-40 sm:w-56 pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search items"
                className="p-2 text-slate-600 hover:text-[#6D28D9] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Indian Rupee Badge Indicator */}
            <div className="hidden sm:flex items-center px-2 py-1 bg-violet-50 text-[#6D28D9] border border-violet-200/80 rounded-lg text-xs font-bold">
              <span>INR (₹)</span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={openWishlist}
              aria-label="Saved products"
              className="p-2 text-slate-600 hover:text-[#6D28D9] hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              aria-label="View cart"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6D28D9] hover:bg-[#5b21b6] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag ({cartCount})</span>
            </button>

            {/* Admin / Storefront Mode Switcher */}
            <button
              onClick={() => setCurrentTab(currentTab === 'store' ? 'admin' : 'store')}
              aria-label={currentTab === 'admin' ? 'Return to Storefront' : 'Open Admin Dashboard'}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                currentTab === 'admin'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-violet-50 text-slate-700 hover:text-[#6D28D9] border-slate-200 hover:border-violet-300'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{currentTab === 'admin' ? '← Storefront' : 'Dashboard'}</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-3">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Browse Categories
            </p>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentTab('store');
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                    selectedCategory === cat ? 'bg-violet-50 text-[#6D28D9] font-bold border border-violet-200' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  {cat === 'Clothes' ? '✨ Clothes / Fashion' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Admin Switcher */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setCurrentTab(currentTab === 'store' ? 'admin' : 'store');
                setMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                currentTab === 'admin'
                  ? 'bg-[#6D28D9] text-white'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{currentTab === 'admin' ? '← Return to Storefront' : 'Open Admin Dashboard & Orders'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
