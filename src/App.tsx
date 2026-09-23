import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Product, CartItem, Order, HeroSlide } from './types';
import { api } from './services/api';
import { ArrowUpDown, Sparkles, Truck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'store' | 'admin'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Load initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, ords, slides] = await Promise.all([
        api.getProducts(),
        api.getOrders(),
        api.getHeroSlides()
      ]);
      setProducts(prods);
      setOrders(ords);
      setHeroSlides(slides);
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1, selectedVariants: Record<string, string> = {}) => {
    const variants = Object.keys(selectedVariants).length > 0 ? selectedVariants : (
      product.variants?.reduce((acc, v) => {
        if (v.options.length > 0) acc[v.name] = v.options[0];
        return acc;
      }, {} as Record<string, string>) || {}
    );

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(
        item => item.product.id === product.id && JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
      );
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prevCart, { product, quantity, selectedVariants: variants }];
    });
    setIsCartOpen(true);
  };

  // Instant Cash on Delivery Checkout (Fast buy without going through multi-step cart)
  const handleFastCodOrder = (product: Product, quantity: number = 1, selectedVariants: Record<string, string> = {}) => {
    const variants = Object.keys(selectedVariants).length > 0 ? selectedVariants : (
      product.variants?.reduce((acc, v) => {
        if (v.options.length > 0) acc[v.name] = v.options[0];
        return acc;
      }, {} as Record<string, string>) || {}
    );

    // Put this item directly into the checkout
    setCart([{ product, quantity, selectedVariants: variants }]);
    setIsCartOpen(false);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Wishlist
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Filtered and Sorted Products
  const displayedProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const cartItemsCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        cartCount={cartItemsCount}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        openWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main View Switcher */}
      {currentTab === 'store' ? (
        <main className="flex-1">
          
          {/* Top Products Hero Slider (Controlled from Dashboard) */}
          <HeroSlider
            slides={heroSlides}
            products={products}
            onInstantBuy={product => handleFastCodOrder(product)}
            onQuickView={product => setQuickViewProduct(product)}
            onExploreCatalog={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Storefront Catalog Section */}
          <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
            
            {/* Catalog Controls Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#6D28D9] tracking-wider uppercase">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Trending Catalog
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-500 font-normal">Pay Cash at Delivery</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mt-0.5">
                  {selectedCategory === 'All' ? 'Viral Clothes, Kurtis & Gadgets' : `${selectedCategory} Collection`}
                </h2>
              </div>

              {/* Sorting & Filter Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span className="hidden md:inline font-medium">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-white border border-slate-200 text-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-[#6D28D9] cursor-pointer"
                  >
                    <option value="featured">Featured Viral Drops</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated by Buyers</option>
                  </select>
                </div>

                <span className="text-xs text-slate-400">
                  {displayedProducts.length} items
                </span>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse space-y-4">
                    <div className="aspect-square bg-slate-100 rounded-lg" />
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-5 bg-slate-100 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-base font-semibold text-slate-700">No products found matching your search</p>
                <p className="text-xs text-slate-400">Try adjusting your search terms or view our Clothes category.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-[#6D28D9] text-white text-xs font-bold rounded-lg hover:bg-[#5b21b6] cursor-pointer"
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
                {displayedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={prod => setQuickViewProduct(prod)}
                    onAddToCart={prod => handleAddToCart(prod)}
                    onFastCodOrder={prod => handleFastCodOrder(prod)}
                    isWishlisted={wishlist.some(w => w.id === product.id)}
                    onToggleWishlist={prod => handleToggleWishlist(prod)}
                  />
                ))}
              </div>
            )}

          </section>

        </main>
      ) : (
        /* Meesho Reseller & Dropshipping Console */
        <main className="flex-1 bg-slate-50/50">
          <AdminDashboard
            products={products}
            orders={orders}
            heroSlides={heroSlides}
            onProductsUpdated={fetchData}
            onOrdersUpdated={fetchData}
            onHeroSlidesUpdated={fetchData}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          setCurrentTab('store');
          window.scrollTo({ top: 350, behavior: 'smooth' });
        }}
        onOpenDropshipPortal={() => {
          setCurrentTab('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals & Drawers */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={(prod, qty, vars) => handleAddToCart(prod, qty, vars)}
        onInstantCheckout={(prod, qty, vars) => handleFastCodOrder(prod, qty, vars)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={prod => {
          handleAddToCart(prod);
          setIsWishlistOpen(false);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderSuccess={newOrder => {
          setCart([]);
          fetchData();
        }}
      />

      {/* Persistent Floating WhatsApp Support Button */}
      <FloatingWhatsApp storeName="Dropified" />

    </div>
  );
}
