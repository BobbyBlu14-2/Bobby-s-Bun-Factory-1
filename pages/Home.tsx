
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, Check, Plus, Sparkles, ArrowRight, Filter, Droplet } from 'lucide-react';
import OrderTypeSelector from '../components/OrderTypeSelector';
import FlavorAssistant from '../components/FlavorAssistant';
import GearLogo from '../components/GearLogo';
import OrderingWizard from '../components/OrderingWizard';
import FlavorsCarousel from '../components/FlavorsCarousel';
import { Product, OrderType, CartItem } from '../types';
import { JAR_PRODUCTS } from '../constants';

import trioBunsBuiltDifferent from '../src/assets/images/fancy_buns_caviar_1779751177514.png';
import classicFrosting from '../src/assets/images/classic_frosting_1779749364471.png';
import lemonFrosting from '../src/assets/images/lemon_frosting_1779749381826.png';

interface HomeProps {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  cart: CartItem[];
  handleAddToCart: (product: Product, quantity: number, modifier?: Product | null) => void;
  pickupDate: string;
  setPickupDate: (date: string) => void;
}

const Home: React.FC<HomeProps> = ({ 
  orderType, 
  setOrderType, 
  cart, 
  handleAddToCart,
  pickupDate,
  setPickupDate
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (window.location.hash === '#menu-section') {
      const el = document.getElementById('menu-section');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  const handleAddJar = (baseProduct: Product) => {
    handleAddToCart(baseProduct, 1);
    setAddedItems(prev => ({ ...prev, [baseProduct.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [baseProduct.id]: false }));
    }, 2000);
  };

  return (
    <main className="flex-1 w-full bg-brand-cream selection:bg-brand-terracotta selection:text-white">
      {/* Cinematic Steampunk Hero Section - Linked to Menu */}
      <section className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
        <button 
          onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute inset-0 z-0 w-full h-full cursor-pointer group focus:outline-none"
        >
          <video 
            src="https://i.imgur.com/wzpTNlA.mp4" 
            poster="https://i.imgur.com/wzpTNlA.jpg"
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 animate-bounce">
             <div className="w-[1px] h-12 bg-brand-ink/30" />
          </div>
        </button>
        
        {/* Subtle gear decorations in corners */}
        <div className="absolute top-20 left-10 opacity-5 hidden lg:block rotate-12 pointer-events-none">
          <GearLogo className="w-64 h-64" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-5 hidden lg:block -rotate-12 pointer-events-none">
          <GearLogo className="w-48 h-48" />
        </div>
      </section>

      {/* Hero Text Content - Starting after the hero image */}
      <section className="bg-brand-ink py-24 md:py-32 text-center px-4 text-brand-cream overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-10 flex justify-center">
             <div className="bg-brand-ochre/10 backdrop-blur-xl px-8 py-2 border border-brand-ochre/20">
                <span className="mono text-brand-ochre text-[10px] font-black uppercase tracking-[0.2em]">
                  Warning: These buns ruin relationships with grocery store cinnamon rolls.
                </span>
             </div>
          </div>
          <h2 className="serif text-5xl md:text-[8rem] font-black text-brand-cream mb-10 leading-[0.8] tracking-tighter">
            Soft. Sticky. <br />
            <span className="text-brand-terracotta italic font-normal">Absolutely</span> <br />
            <span className="block mt-4 md:mt-0">Irresponsible.</span>
          </h2>
          <p className="text-brand-cream/70 text-lg md:text-2xl max-w-3xl mx-auto font-medium mb-16 leading-relaxed">
            Extra fluffy cinnamon rolls layered with brown sugar chaos, secret frost, and just enough attitude to keep you thinking about us at 2AM.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-brand-cream text-brand-ink px-16 py-6 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl transition-all overflow-hidden"
            >
              <div className="absolute inset-0 steam-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <span className="relative z-10">Build Your Box</span>
            </button>
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="mono text-brand-terracotta text-xs font-black uppercase tracking-widest hover:text-brand-cream transition-colors border-b-2 border-brand-terracotta/30 pb-2 cursor-pointer"
            >
              Get Sticky
            </button>
          </div>
        </motion.div>
      </section>

      {/* Flavors of the Month Carousel */}
      <FlavorsCarousel onAddFlavor={(product) => handleAddToCart(product, 1)} />

      <div className="max-w-7xl mx-auto w-full px-6">
        <div className="mb-24">
          <OrderTypeSelector currentType={orderType} onChange={setOrderType} />
        </div>

        <FlavorAssistant onAddBun={(product) => handleAddToCart(product, 1)} />

        {/* The Desert Gallery */}
        <section className="mt-32 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div 
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl group border-8 border-brand-cream cursor-zoom-in"
              title="Click to view full image"
            >
              <img 
                src={trioBunsBuiltDifferent} 
                alt="Peach, Caramel Apple, and Wild Berry Cinnamon Buns" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-brand-terracotta/5 group-hover:bg-brand-ink/20 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-brand-cream/90 text-brand-ink px-6 py-3 font-mono font-black text-[10px] uppercase tracking-widest flex items-center space-x-2 shadow-xl border border-brand-ink/10">
                  <ZoomIn className="w-3.5 h-3.5 text-brand-terracotta" />
                  <span>View Full Image</span>
                </div>
              </div>
            </div>
            <div className="space-y-8 pl-0 lg:pl-12">
              <span className="mono text-brand-terracotta text-sm font-black uppercase tracking-[0.4em]">Built Different</span>
              <h3 className="serif text-5xl md:text-7xl font-black text-brand-ink leading-none">
                Curves Worth <br />
                <span className="italic font-normal">Talking About.</span>
              </h3>
              <p className="text-brand-ink/60 text-xl leading-relaxed max-w-md">
                Every bun is hand-rolled for maximum swirl satisfaction. Soft centers. Golden edges. Pull-apart layers engineered to make you close your eyes after the first bite.
              </p>
              <div className="flex items-center space-x-4 pt-4">
                 <div className="w-12 h-[1px] bg-brand-ink/30" />
                 <span className="mono text-[10px] uppercase font-bold text-brand-ochre">Click image to view in ultra close-up luxury detail.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {isLightboxOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLightboxOpen(false)}
              className="fixed inset-0 z-50 bg-brand-ink/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
            >
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(false);
                }}
                className="absolute top-6 right-6 text-brand-cream hover:text-brand-terracotta transition-colors bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 z-50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </motion.button>
              
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-brand-cream border-4 border-brand-cream select-none shadow-2xl flex flex-col items-center"
              >
                <img 
                  src={trioBunsBuiltDifferent} 
                  alt="Peach, Caramel Apple, and Wild Berry Cinnamon Buns Full Screen" 
                  className="max-h-[80vh] w-auto h-auto object-contain rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="w-full bg-brand-cream p-6 border-t border-brand-sand/20 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                  <div>
                    <h4 className="serif text-xl font-black text-brand-ink">Bobby's Trio Special</h4>
                    <p className="text-xs text-brand-ink/60 font-sans mt-0.5">Featuring The Peach Outlaw, Caramel Apple Crisp, and Wild Berry Avalanche.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsLightboxOpen(false);
                      document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-brand-terracotta text-brand-cream px-6 py-2.5 font-mono font-black text-[10px] uppercase tracking-widest hover:bg-brand-ink hover:text-brand-cream transition-all duration-300 shadow-md cursor-pointer"
                  >
                    Build This 3-Pack Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <section id="menu-section" className="mt-20 mb-32">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <h3 className="serif text-5xl md:text-7xl font-black text-brand-ink uppercase tracking-tighter">Build Your Box</h3>
            <div className="w-24 h-[2px] bg-brand-terracotta" />
            <p className="mono text-brand-terracotta font-black uppercase tracking-[0.3em] text-[10px]">Six slots. Unlimited bad decisions.</p>
          </div>
          
          <OrderingWizard 
            cart={cart}
            onAddToCart={handleAddToCart}
            pickupDate={pickupDate}
            setPickupDate={setPickupDate}
          />
        </section>
            {/* Vault Jars & Secret Frost Series Showcase Section */}
        <section className="mb-48 border-t border-brand-sand/20 pt-32">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <span className="mono text-brand-terracotta text-sm font-black uppercase tracking-[0.4em]">Liquid Luxury Toppings</span>
            <h3 className="serif text-4xl md:text-6xl font-black text-brand-ink uppercase tracking-tighter">The Topping Vault Jars</h3>
            <div className="w-16 h-[2px] bg-brand-terracotta" />
            <p className="text-brand-ink/70 text-sm max-w-xl leading-relaxed animate-pulse">
              Our signature slow-simmered regional fruit caviars and Velvety Secret Frost whips are now available in a curated hierarchy of premium sizes.
              <br/>
              <span className="font-extrabold text-brand-terracotta">Le Petit Duo — $5 (Any 2 Petit Jars) • Any 2 Coupe Jars for $12!</span> Added automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            {JAR_PRODUCTS.map((product) => {
              const isAdded = !!addedItems[product.id];

              return (
                <div 
                  key={product.id} 
                  className="bg-white border border-brand-sand/30 overflow-hidden flex flex-col group hover:shadow-2xl hover:border-brand-terracotta/30 transition-all duration-500 rounded-2xl relative animate-in fade-in"
                >
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                    <span className="bg-brand-ink text-brand-ochre text-[8px] font-black uppercase tracking-widest px-2.5 py-1 shadow-md">
                      {product.id.includes('frost') ? 'Secret Frost Jar' : 'Fruit Caviar Jar'}
                    </span>
                  </div>

                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-ink/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="serif text-base font-black text-brand-ink group-hover:text-brand-terracotta transition-colors">{product.name}</h4>
                        <span className="mono text-xs font-black text-brand-ochre shrink-0">${product.price.toFixed(2)}</span>
                      </div>
                      <p className="text-brand-ink/65 text-xs leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleAddJar(product)}
                      className={`w-full py-3 font-mono font-black text-[9px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer rounded-xl ${
                        isAdded 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-brand-ink text-brand-cream hover:bg-brand-terracotta hover:text-brand-cream'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 animate-bounce" />
                          <span>Added to Box!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-brand-ochre" />
                          <span>Add Jar to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-12 animate-bounce">
            <a 
              href="/shop"
              className="mono text-brand-terracotta hover:text-brand-ink transition-colors font-black uppercase text-xs tracking-widest flex items-center space-x-2 border-b-2 border-brand-terracotta/20 pb-1 cursor-pointer"
            >
              <span>Explore Full Apothecary Flavor Specialties</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* Supporting context for the factory */}
        <section className="mt-48 mb-32 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="p-8 border border-brand-ink/5 space-y-6">
              <span className="mono text-brand-terracotta text-[10px] font-black uppercase tracking-widest">PROPULSION</span>
              <h4 className="serif text-3xl font-black italic">Hot & Ready</h4>
              <p className="text-sm text-brand-ink/50 leading-relaxed">Fresh batches dropping with dangerous frequency.</p>
           </div>
           <div className="p-8 border border-brand-ink/5 space-y-6">
              <span className="mono text-brand-terracotta text-[10px] font-black uppercase tracking-widest">COATING</span>
              <h4 className="serif text-3xl font-black italic">The Secret Frost</h4>
              <p className="text-sm text-brand-ink/50 leading-relaxed">Creamy. Smooth. Addictive. We legally shouldn’t make it this good.</p>
           </div>
           <div className="p-8 border border-brand-ink/5 space-y-6">
              <span className="mono text-brand-terracotta text-[10px] font-black uppercase tracking-widest">LOGISTICS</span>
              <h4 className="serif text-3xl font-black italic">Fast Pickup</h4>
              <p className="text-sm text-brand-ink/50 leading-relaxed">In and out like a bad decision. Grab your box before somebody else does.</p>
           </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
