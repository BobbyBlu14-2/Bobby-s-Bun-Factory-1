import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Plus, Sparkles, Filter, Droplet, Percent, Info } from 'lucide-react';
import { Product } from '../types';
import { JAR_PRODUCTS, CAVIAR_FLAVORS } from '../constants';

interface ShopProps {
  handleAddToCart: (product: Product, quantity: number, modifier?: Product | null) => void;
}

export const Shop: React.FC<ShopProps> = ({ handleAddToCart }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'frost' | 'caviar'>('all');
  const [selectedFlavors, setSelectedFlavors] = useState<Record<string, string>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const filteredJars = JAR_PRODUCTS.filter(item => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'frost') return item.id.includes('frost');
    if (activeCategory === 'caviar') return item.id.includes('caviar');
    return true;
  });

  const getAvailableFlavors = (itemId: string) => {
    if (itemId.includes('caviar')) {
      return CAVIAR_FLAVORS.filter(f => f.id !== 'none').map(f => f.name);
    } else {
      return ['Classic Vanilla Cream', 'Meyer Lemon Zest', 'Orange Creamsicle'];
    }
  };

  const handleAddJar = (baseProduct: Product) => {
    const available = getAvailableFlavors(baseProduct.id);
    const selectedFlavor = selectedFlavors[baseProduct.id] || available[0];
    
    const customProduct: Product = {
      ...baseProduct,
      id: `${baseProduct.id}-${selectedFlavor.replace(/\s+/g, '-').toLowerCase()}`,
      name: `${baseProduct.name} — ${selectedFlavor}`,
      description: `${baseProduct.description} (Selected Flavor: ${selectedFlavor})`
    };

    handleAddToCart(customProduct, 1);

    // Dynamic UI confirmation feedback
    setAddedItems(prev => ({ ...prev, [baseProduct.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [baseProduct.id]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-brand-cream py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Cinematic Apothecary Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto">
          <span className="mono text-brand-terracotta text-[10px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta animate-pulse" />
            Liquid Luxury Add-Ons
          </span>
          <h2 className="serif text-5xl md:text-7xl font-black text-brand-ink uppercase tracking-tight leading-none">
            The Topping <span className="text-brand-terracotta italic font-normal">Vault</span>
          </h2>
          <div className="w-24 h-[2px] bg-brand-terracotta" />
          <p className="text-brand-ink/75 text-sm md:text-base leading-relaxed">
            By popular demand, our formulaic master stocks are now available as bonus add-ons. 
            Acquire Bobby's signature <span className="font-bold text-brand-terracotta">Secret Frost jars</span> or 
            meticulously slow-simmered <span className="font-bold text-brand-ochre">Fruit Caviars</span> in simple, curated sizing. 
            Dip, spoon, or drench at home.
          </p>

          {/* Bundle Discount Banner */}
          <div className="flex items-center space-x-3 bg-brand-terracotta/[0.06] border border-brand-terracotta/20 px-6 py-4 rounded-xl max-w-lg mt-4 shadow-sm animate-pulse">
            <Percent className="w-5 h-5 text-brand-terracotta shrink-0" />
            <p className="text-xs text-brand-ink font-heading text-left leading-normal">
              <span className="font-black text-brand-terracotta uppercase tracking-wider block">Automatic Bundle Pricing Unlock</span>
              <span className="font-extrabold text-brand-terracotta">Le Petit Duo — $5 (Any 2 Petit Jars)</span> (Save up to $1!) • Buy <span className="font-extrabold text-brand-terracotta">Any 2 Coupe Jars for $12</span>! Added automatically at checkout.
            </p>
          </div>
        </div>

        {/* Categories Navigation Filter */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4 border-b border-brand-sand/30 pb-8 max-w-xl mx-auto">
          {(['all', 'frost', 'caviar'] as const).map((cat) => {
            const labels = {
              all: 'All Stocks',
              frost: 'Secret Frost Jars',
              caviar: 'Fruit Caviar Jars'
            };
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-none font-mono text-[10px] uppercase font-black tracking-widest transition-all duration-300 cursor-pointer flex items-center space-x-2 border ${
                  active 
                    ? 'bg-brand-ink text-brand-cream border-brand-ink shadow-lg shadow-brand-ink/10 font-bold' 
                    : 'bg-white text-brand-ink/60 hover:text-brand-ink border-brand-sand/10 hover:border-brand-sand/40'
                }`}
              >
                {cat === 'all' && <Filter className="w-3 h-3" />}
                {cat === 'frost' && <Sparkles className="w-3 h-3 text-brand-terracotta" />}
                {cat === 'caviar' && <Droplet className="w-3 h-3 text-brand-ochre" />}
                <span>{labels[cat]}</span>
              </button>
            );
          })}
        </div>

        {/* Product Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredJars.map((item) => {
              const availableFlavors = getAvailableFlavors(item.id);
              const activeFlavor = selectedFlavors[item.id] || availableFlavors[0];
              const isAdded = !!addedItems[item.id];

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                  className="bg-white border border-brand-sand/30 rounded-2xl overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:border-brand-terracotta/20 transition-all duration-500 relative"
                >
                  {/* Sizing badge */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 shadow-md ${
                      item.id.includes('frost') 
                        ? 'bg-brand-ink text-brand-cream' 
                        : 'bg-brand-ochre text-brand-ink'
                    }`}>
                      {item.id.includes('frost') ? 'SECRET FROST JAR' : 'FRUIT CAVIAR JAR'}
                    </span>
                  </div>

                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="serif text-xl font-black text-brand-ink group-hover:text-brand-terracotta transition-colors leading-tight">
                          {item.name}
                        </h4>
                        <span className="mono text-base font-black text-brand-terracotta block shrink-0">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-brand-ink/75 text-xs leading-relaxed min-h-[2.5rem]">
                        {item.description}
                      </p>

                      {/* Flavor selector on card drop-down */}
                      <div className="space-y-1.5">
                        <label className="mono text-[8.5px] uppercase font-black text-brand-ochre tracking-wider block">
                          Configure Flavor Specialty:
                        </label>
                        <select
                          value={activeFlavor}
                          onChange={(e) => setSelectedFlavors(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="w-full bg-brand-cream/80 border border-brand-sand/30 p-2.5 rounded-lg mono text-[10px] uppercase font-bold text-brand-ink focus:outline-none focus:border-brand-terracotta cursor-pointer"
                        >
                          {availableFlavors.map(fl => (
                            <option key={fl} value={fl} className="font-mono">
                              {fl.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddJar(item)}
                      className={`w-full py-4 font-mono font-black text-[9px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 rounded-xl cursor-pointer shadow-md active:scale-95 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-ink text-brand-cream hover:bg-brand-terracotta hover:text-brand-cream'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 animate-bounce" />
                          <span>Acquired in Box!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-brand-ochre" />
                          <span>Order This Jar Add-On</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Trust info pillars */}
        <section className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-brand-sand/30">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-brand-terracotta/[0.05] text-brand-terracotta rounded-xl">
              <span className="mono font-black text-xs">A1</span>
            </div>
            <div>
              <h5 className="font-serif font-black text-brand-ink text-base">Perfect Drizzle Temp</h5>
              <p className="text-xs text-brand-ink/60 mt-1 leading-relaxed">Our Secret Frost is slow-churned and stabilized at exactly 104°F so it drips flawlessly onto your warm buns.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-brand-ochre/[0.05] text-brand-ochre rounded-xl">
              <span className="mono font-black text-xs">B2</span>
            </div>
            <div>
              <h5 className="font-serif font-black text-brand-ink text-base">Simmered in Batches</h5>
              <p className="text-xs text-brand-ink/60 mt-1 leading-relaxed">Each fruit caviar jar is loaded with plump local berries simmered down slowly to lock in that dense cobbler energy.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-brand-terracotta/[0.05] text-brand-terracotta rounded-xl">
              <span className="mono font-black text-xs">C3</span>
            </div>
            <div>
              <h5 className="font-serif font-black text-brand-ink text-base">Long Shelf Life</h5>
              <p className="text-xs text-brand-ink/60 mt-1 leading-relaxed">Keep your jars cold at home! Simply microwave for 15 seconds to recreate that warm, indulgent bakery drizzle.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Shop;
