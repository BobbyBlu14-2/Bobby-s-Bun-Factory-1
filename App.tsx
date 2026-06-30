
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CountdownBanner from './components/CountdownBanner';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Locations from './pages/Locations';
import Franchise from './pages/Franchise';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NewsletterModal from './components/NewsletterModal';
import { CartItem, OrderType, Product } from './types';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pickupDate, setPickupDate] = useState<string>('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('bobbys_user');
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (username: string) => {
    setCurrentUser(username);
    try {
      localStorage.setItem('bobbys_user', username);
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('bobbys_user');
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
    }
  };

  const handleAddToCart = useCallback((product: Product, quantity: number, modifier: Product | null = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        ((!item.modifier && !modifier) || (item.modifier?.id === modifier?.id))
      );
      
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = { 
          ...newCart[existingIndex], 
          quantity: newCart[existingIndex].quantity + quantity 
        };
        return newCart;
      }
      
      return [...prev, { product, quantity, modifier }];
    });
  }, []);

  const handleUpdateQuantity = useCallback((product: Product, quantity: number, modifier: Product | null = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        ((!item.modifier && !modifier) || (item.modifier?.id === modifier?.id))
      );

      if (quantity === 0) {
        return prev.filter((_, idx) => idx !== existingIndex);
      }

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = { ...newCart[existingIndex], quantity };
        return newCart;
      }
      return [...prev, { product, quantity, modifier }];
    });
  }, []);

  const handleRemoveFromCart = (productId: string, modifierId?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && (!modifierId || item.modifier?.id === modifierId))
    ));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => 
    cart.reduce((acc, item) => acc + item.quantity, 0), 
  [cart]);

  const getProductQuantity = (id: string) => 
    cart.find(item => item.product.id === id)?.quantity || 0;

  const cartTotal = useMemo(() => {
    // 1. Calculate base totals for non-jar items
    let grandTotal = 0;
    
    // Filter out items of type 'jar' for bundle logic
    const nonJarItems = cart.filter(item => item.product.type !== 'jar');
    const jarItems = cart.filter(item => item.product.type === 'jar');
    
    nonJarItems.forEach(item => {
      grandTotal += (item.product.price + (item.modifier?.price || 0)) * item.quantity;
    });
    
    // 2. Classify and collect jar item prices
    const smallPrices: number[] = [];
    const mediumPrices: number[] = [];
    
    jarItems.forEach(item => {
      const isSmall = item.product.id === 'petit-caviar-jar' || item.product.id === 'petit-frost-jar';
      const isMedium = item.product.id === 'coupe-caviar-jar' || item.product.id === 'coupe-frost-jar';
      
      for (let i = 0; i < item.quantity; i++) {
        if (isSmall) {
          smallPrices.push(item.product.price);
        } else if (isMedium) {
          mediumPrices.push(item.product.price);
        } else {
          grandTotal += item.product.price;
        }
      }
    });
    
    // Sort prices descending to pair the most costly ones first
    smallPrices.sort((a, b) => b - a);
    mediumPrices.sort((a, b) => b - a);
    
    // Match small jars in pairs for Le Petit Duo ($5)
    let sIdx = 0;
    while (sIdx < smallPrices.length) {
      if (sIdx + 1 < smallPrices.length) {
        grandTotal += 5.00;
        sIdx += 2;
      } else {
        grandTotal += smallPrices[sIdx];
        sIdx += 1;
      }
    }
    
    // Match medium jars in pairs for $12
    let mIdx = 0;
    while (mIdx < mediumPrices.length) {
      if (mIdx + 1 < mediumPrices.length) {
        grandTotal += 12.00;
        mIdx += 2;
      } else {
        grandTotal += mediumPrices[mIdx];
        mIdx += 1;
      }
    }
    
    return grandTotal;
  }, [cart]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col pb-20 selection:bg-brand-orange selection:text-white">
        <CountdownBanner />
        <Header 
          cartCount={cartCount} 
          onOpenCart={() => setIsCartOpen(true)} 
          currentUser={currentUser}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={handleLogout}
        />

        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                orderType={orderType} 
                setOrderType={setOrderType}
                cart={cart}
                handleAddToCart={handleAddToCart}
                pickupDate={pickupDate}
                setPickupDate={setPickupDate}
              />
            } 
          />
          <Route 
            path="/shop" 
            element={
              <Shop handleAddToCart={handleAddToCart} />
            } 
          />
          <Route path="/about" element={<About />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route 
            path="/checkout" 
            element={
              <Checkout 
                items={cart} 
                total={cartTotal} 
                pickupDate={pickupDate}
                onSuccess={handleClearCart} 
              />
            } 
          />
          <Route 
            path="/profile" 
            element={
              <Profile 
                currentUser={currentUser} 
                onOpenAuth={() => setIsAuthOpen(true)} 
              />
            } 
          />
        </Routes>

        <Footer />

        <CartDrawer 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          items={cart}
          total={cartTotal}
          onRemove={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />

        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Persistent Mobile Bottom Bar */}
        {cartCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:hidden z-40">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="w-full bg-brand-ink text-brand-ochre py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center space-x-3 active:scale-95 transition-transform border-b-4 border-black/20"
            >
              <span className="bg-brand-terracotta text-white px-2 py-0.5 rounded text-sm">{cartCount}</span>
              <span>View Box • ${cartTotal.toFixed(2)}</span>
            </button>
          </div>
        )}

        <NewsletterModal />
      </div>
    </Router>
  );
};

export default App;
