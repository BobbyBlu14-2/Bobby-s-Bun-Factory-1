import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShoppingBag, 
  Calendar, 
  Zap, 
  Sparkles, 
  Flame, 
  Trophy, 
  Star, 
  Layers, 
  Percent, 
  ChevronRight, 
  Plus, 
  Minus 
} from 'lucide-react';
import { 
  SINGLES_MENU, 
  BOXED_4_PACKS, 
  BOXED_6_PACKS, 
  CAVIAR_FLAVORS, 
  JAR_PRODUCTS,
  classicFrosting,
  classicSingleBun,
  fourPackBuns,
  sixPackHorizontal,
  singleFruitCaviarBun,
  chocolateCherryCaviar,
  cookiesCreamTopping,
  fourPackCaviarUpgrade,
  petitDuoCups,
  petitFrostCup,
  petitCaviarCup
} from '../constants';
import { Product, CartItem } from '../types';
import { useNavigate } from 'react-router-dom';

interface OrderingWizardProps {
  onAddToCart: (product: Product, quantity: number, modifier?: Product | null) => void;
  cart: CartItem[];
  pickupDate: string;
  setPickupDate: (date: string) => void;
}

type OrderPhase = 'PACKAGE_SELECTION' | 'CAVIAR_SELECTION' | 'ADD_ONS' | 'LOGISTICS';

const getNextSaturdays = (count: number = 12) => {
  const dates = [];
  const today = new Date();
  const currentDay = today.getDay();
  
  today.setHours(12, 0, 0, 0);
  
  const daysUntilSaturday = (6 - currentDay + 7) % 7;
  const firstSaturday = new Date(today);
  firstSaturday.setDate(today.getDate() + daysUntilSaturday);
  
  for (let i = 0; i < count; i++) {
    const nextSat = new Date(firstSaturday);
    nextSat.setDate(firstSaturday.getDate() + (i * 7));
    dates.push(nextSat);
  }
  return dates;
};

const formatDateISO = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateDisplayForUI = (d: Date) => {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const OrderingWizard: React.FC<OrderingWizardProps> = ({ 
  onAddToCart, 
  cart,
  pickupDate,
  setPickupDate
}) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<OrderPhase>('PACKAGE_SELECTION');
  
  const wizardRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Scroll to wizard top on phase change with offset for sticky header
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (wizardRef.current) {
      const headerOffset = 100;
      const elementPosition = wizardRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, [phase]);
  
  // Package configuration state
  const [selectedSize, setSelectedSize] = useState<'single' | '4pack' | '6pack'>('6pack');
  const [selectedStyle, setSelectedStyle] = useState<'classic' | 'mixed' | 'signature'>('mixed');
  
  // Caviar customizable slots state
  // Singles choose 1, 4packs choose 4, 6packs choose 6
  const maxCaviarSlots = useMemo(() => {
    if (selectedSize === 'single') return 1;
    if (selectedSize === '4pack') return 4;
    return 6;
  }, [selectedSize]);

  const [caviarSlots, setCaviarSlots] = useState<string[]>(new Array(6).fill('strawberry'));
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);

  // Auto reset or update caviar slots when package changes
  useEffect(() => {
    const defaultFlavor = (selectedSize === 'single' && selectedStyle === 'signature') ? 'cherry-bomb' : 'strawberry';
    setCaviarSlots(new Array(maxCaviarSlots).fill(defaultFlavor));
    setActiveSlotIdx(0);
  }, [maxCaviarSlots, selectedStyle, selectedSize]);

  // Premium seasonal check: returns true if any premium seasonal flavor is used in custom slots
  const hasPremiumCaviar = useMemo(() => {
    // Classic style has no caviar customizations at all!
    if (selectedStyle === 'classic') return false;

    // Caviar Bun has caviar, Loaded Bun has caviar. Classic Bun under Single matches Classic style
    const activeFlavors = caviarSlots.slice(0, maxCaviarSlots);
    return activeFlavors.some(flavorId => {
      const fl = CAVIAR_FLAVORS.find(f => f.id === flavorId);
      return fl?.category === 'premium';
    });
  }, [caviarSlots, maxCaviarSlots, selectedStyle]);

  // Upgrade & add-ons state
  const [extraCaviarDrizzle, setExtraCaviarDrizzle] = useState(false);
  const [extraSecretFrost, setExtraSecretFrost] = useState(false);
  const [add1CaviarTopping, setAdd1CaviarTopping] = useState(false);
  
  // Box add-on upgrades (4pack / 6pack only)
  const [addCaviarToBox, setAddCaviarToBox] = useState(false);
  const [extraHeavyToppingBox, setExtraHeavyToppingBox] = useState(false);

  // Reset modifiers when style or size shifts to avoid cross-size leakage
  useEffect(() => {
    setExtraCaviarDrizzle(false);
    setExtraSecretFrost(false);
    setAdd1CaviarTopping(false);
    setAddCaviarToBox(false);
    setExtraHeavyToppingBox(false);
  }, [selectedSize, selectedStyle]);

  // Optional jars add-on list (direct quantity modifier state)
  const [jarQuantities, setJarQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    JAR_PRODUCTS.forEach(jar => {
      initial[jar.id] = 0;
    });
    return initial;
  });

  // Selected caviar flavors for each ordered jar. Key: jarId, Value: array of flavor ids (one per jar unit ordered)
  const [selectedJarFlavors, setSelectedJarFlavors] = useState<Record<string, string[]>>({});

  const incrementJar = (id: string) => {
    setJarQuantities(prev => {
      const newQty = (prev[id] || 0) + 1;
      if (id.includes('caviar')) {
        setSelectedJarFlavors(prevFlavors => {
          const currentList = prevFlavors[id] ? [...prevFlavors[id]] : [];
          const countToAdd = id === 'double-grande-caviar-jars' ? 2 : 1;
          for (let i = 0; i < countToAdd; i++) {
            currentList.push('blueberry'); // Default flavor to blueberry
          }
          return { ...prevFlavors, [id]: currentList };
        });
      }
      return { ...prev, [id]: newQty };
    });
  };

  const decrementJar = (id: string) => {
    setJarQuantities(prev => {
      const newQty = Math.max(0, (prev[id] || 0) - 1);
      if (id.includes('caviar')) {
        setSelectedJarFlavors(prevFlavors => {
          const currentList = prevFlavors[id] ? [...prevFlavors[id]] : [];
          const countToRemove = id === 'double-grande-caviar-jars' ? 2 : 1;
          for (let i = 0; i < countToRemove; i++) {
            if (currentList.length > 0) currentList.pop();
          }
          return { ...prevFlavors, [id]: currentList };
        });
      }
      return { ...prev, [id]: newQty };
    });
  };

  // Logistics state
  const saturdays = useMemo(() => getNextSaturdays(12), []);
  const thisSaturdayISO = useMemo(() => formatDateISO(saturdays[0]), [saturdays]);
  
  const [pickupOption, setPickupOption] = useState<'this-sat' | 'different-sat'>('this-sat');

  // Keep pickupDate in sync
  useEffect(() => {
    if (pickupOption === 'this-sat') {
      setPickupDate(thisSaturdayISO);
    } else if (pickupOption === 'different-sat' && (!pickupDate || pickupDate === thisSaturdayISO)) {
      setPickupDate(formatDateISO(saturdays[1]));
    }
  }, [pickupOption, thisSaturdayISO, setPickupDate, saturdays, pickupDate]);

  const handleDateChange = (dateVal: string) => {
    if (!dateVal) return;
    const selectedDate = new Date(dateVal + 'T12:00:00');
    if (selectedDate.getDay() !== 6) {
      const currentDay = selectedDate.getDay();
      const diffToSaturday = 6 - currentDay;
      const correctSaturday = new Date(selectedDate);
      correctSaturday.setDate(selectedDate.getDate() + diffToSaturday);
      setPickupDate(formatDateISO(correctSaturday));
    } else {
      setPickupDate(dateVal);
    }
  };

  // --- MATH CALCULATION ENGINE ---
  
  // 1. Base Package Price
  const basePackagePrice = useMemo(() => {
    if (selectedSize === 'single') {
      if (selectedStyle === 'classic') return 5; // Classic Bun ($5)
      if (selectedStyle === 'mixed') return 6;   // Caviar Bun ($6)
      return 7;                                 // Premium Bun ($7)
    }
    if (selectedSize === '4pack') {
      if (selectedStyle === 'classic') return 18; // Classic 4-Pack ($18)
      if (selectedStyle === 'mixed') return 22;   // Mixed 4-Pack ($22)
      return 25;                                 // Premium 4-Pack ($25)
    }
    // 6-pack (Hero)
    if (selectedStyle === 'classic') return 26;   // Classic 6-Pack ($26)
    if (selectedStyle === 'mixed') return 32;     // Mixed 6-Pack ($32)
    return 36;                                   // Premium 6-Pack ($36)
  }, [selectedSize, selectedStyle]);

  // 2. Premium seasonal upgrade
  const premiumUpgradePrice = useMemo(() => {
    if (selectedSize === 'single') return 0; // Menu-matched flat $7.00 price for premium single buns
    if (!hasPremiumCaviar) return 0;
    if (selectedSize === '4pack') return 3.00;  // Mixed 4-pack ($21) -> Premium ($24) is $3.00 upgrade
    return 4.00; // 6pack (Mixed $32 -> Premium $36 custom caviar choice upgrade)
  }, [hasPremiumCaviar, selectedSize]);

  // 3. Topping Selection Add-ons prices
  const addonsPrice = useMemo(() => {
    let sum = 0;
    if (selectedSize === 'single') {
      if (add1CaviarTopping) sum += 3.00;
      if (extraCaviarDrizzle) sum += 5.00;
      if (extraSecretFrost) sum += 3.00;
    } else {
      // 4-pack or 6-pack
      if (selectedSize === '4pack') {
        if (addCaviarToBox) sum += 4.00;
        if (extraHeavyToppingBox) sum += 5.00;
      } else {
        // 6-pack
        if (addCaviarToBox) sum += 6.00;
        if (extraHeavyToppingBox) sum += 7.00;
      }
    }
    return sum;
  }, [
    selectedSize, 
    add1CaviarTopping, 
    extraCaviarDrizzle, 
    extraSecretFrost, 
    addCaviarToBox, 
    extraHeavyToppingBox
  ]);

  // 4. Jars Prices (including dynamic bundle calculation right here)
  const jarsStats = useMemo(() => {
    let unbundledPrice = 0;
    const smallPrices: number[] = [];
    const mediumPrices: number[] = [];
    let standalonePrice = 0;

    // Gather jar details
    JAR_PRODUCTS.forEach(jar => {
      const qty = jarQuantities[jar.id] || 0;
      unbundledPrice += jar.price * qty;

      const isIndividualSmall = jar.id === 'petit-caviar-jar' || jar.id === 'petit-frost-jar';
      const isIndividualMedium = jar.id === 'coupe-caviar-jar' || jar.id === 'coupe-frost-jar';

      for (let i = 0; i < qty; i++) {
        if (isIndividualSmall) smallPrices.push(jar.price);
        else if (isIndividualMedium) mediumPrices.push(jar.price);
        else standalonePrice += jar.price;
      }
    });

    let bundledPrice = standalonePrice;
    // Small jars bundle
    smallPrices.sort((a, b) => b - a);
    let sIdx = 0;
    while (sIdx < smallPrices.length) {
      if (sIdx + 1 < smallPrices.length) {
        bundledPrice += 5.00; // Bundle Offer (Petit Duo)
        sIdx += 2;
      } else {
        bundledPrice += smallPrices[sIdx];
        sIdx += 1;
      }
    }

    // Medium jars bundle
    mediumPrices.sort((a, b) => b - a);
    let mIdx = 0;
    while (mIdx < mediumPrices.length) {
      if (mIdx + 1 < mediumPrices.length) {
        bundledPrice += 12.00; // Bundle Offer (Coupe Duo)
        mIdx += 2;
      } else {
        bundledPrice += mediumPrices[mIdx];
        mIdx += 1;
      }
    }

    const discount = unbundledPrice - bundledPrice;

    return {
      unbundledPrice,
      totalPrice: bundledPrice,
      discount
    };
  }, [jarQuantities]);

  const grandTotal = useMemo(() => {
    return basePackagePrice + premiumUpgradePrice + addonsPrice + jarsStats.totalPrice;
  }, [basePackagePrice, premiumUpgradePrice, addonsPrice, jarsStats]);

  // Helper description text for configured items
  const summaryText = useMemo(() => {
    const sizeName = selectedSize === 'single' ? 'Single Bun' : selectedSize === '4pack' ? '4-Pack Box' : '6-Pack Box';
    const styleName = selectedStyle === 'signature' ? 'PREMIUM' : selectedStyle.toUpperCase();
    const caviarDesc = selectedStyle === 'classic' 
      ? 'All Classic Secret Frost' 
      : `Toppings: ${caviarSlots.slice(0, maxCaviarSlots).map(id => {
          const fl = CAVIAR_FLAVORS.find(f => f.id === id);
          return fl?.name;
        }).join(', ')}`;

    // Add selected premium ad-on / upgrade names
    const activeUpgrades: string[] = [];
    if (selectedSize === 'single') {
      if (add1CaviarTopping) activeUpgrades.push('Petit Caviar Cup (3.5 oz)');
      if (extraCaviarDrizzle) activeUpgrades.push('Le Petit Duo (Frost & Caviar Cups)');
      if (extraSecretFrost) activeUpgrades.push('Petit Frost Cup (3.5 oz)');
    } else {
      if (addCaviarToBox) activeUpgrades.push(selectedSize === '4pack' ? 'Add Caviar to 4-Pack' : 'Add Caviar to 6-Pack');
      if (extraHeavyToppingBox) activeUpgrades.push('Extra-Heavy Grand Topping Upgrade');
    }
    const upgradesDesc = activeUpgrades.length > 0 ? ` [Upgrades: ${activeUpgrades.join(', ')}]` : '';

    return `${sizeName} (${styleName} style). ${caviarDesc}.${upgradesDesc}`;
  }, [
    selectedSize,
    selectedStyle,
    caviarSlots,
    maxCaviarSlots,
    add1CaviarTopping,
    extraCaviarDrizzle,
    extraSecretFrost,
    addCaviarToBox,
    extraHeavyToppingBox
  ]);

  // --- SUBMIT COMPONENT FUNCTION ---
  const handleCheckoutProtocol = () => {
    // 1. Create and add configured main package product
    const displayStyleName = selectedStyle === 'signature' ? 'PREMIUM' : selectedStyle.toUpperCase();
    const finalPackageName = `${
      selectedSize === 'single'
        ? selectedStyle === 'classic'
          ? 'Classic Single Bun'
          : selectedStyle === 'mixed'
          ? 'Single Caviar Bun'
          : 'Premium Single Bun'
        : selectedSize === '4pack'
        ? 'Bobby’s 4-Pack'
        : 'Bobby’s 6-Pack'
    } [${displayStyleName}]`;
    const finalPackageDesc = summaryText + (selectedSize !== 'single' && hasPremiumCaviar ? ' + Includes Premium Flavor Upgrade' : '') + (addonsPrice > 0 ? ' + Upgraded Drizzle Customizations' : '');
    
    const configuredMainProduct: Product = {
      id: `configured-${selectedSize}-${selectedStyle}-${Date.now()}`,
      name: finalPackageName,
      description: finalPackageDesc,
      price: basePackagePrice + premiumUpgradePrice + addonsPrice,
      image: selectedSize === 'single' 
        ? SINGLES_MENU.find(x => x.id === (selectedStyle === 'classic' ? 'classic-bun' : selectedStyle === 'mixed' ? 'caviar-bun' : 'loaded-bun'))?.image || ''
        : (selectedSize === '4pack' ? BOXED_4_PACKS : BOXED_6_PACKS).find(y => y.id.includes(selectedStyle))?.image || '',
      type: 'bun',
      color: 'border-brand-terracotta text-brand-cream bg-brand-ink'
    };

    onAddToCart(configuredMainProduct, 1);

    // 2. Add individual Jars to cart separately (allows App.tsx's smart bundle discount matching to pair them easily!)
    JAR_PRODUCTS.forEach(jar => {
      const qty = jarQuantities[jar.id] || 0;
      if (qty > 0) {
        if (jar.id.includes('caviar')) {
          const flavors = selectedJarFlavors[jar.id] || [];
          if (flavors.length > 0) {
            const flavorNames = flavors.map(fid => {
              const fl = CAVIAR_FLAVORS.find(f => f.id === fid);
              return fl ? fl.name : fid;
            });
            const jarWithFlavor: Product = {
              ...jar,
              name: `${jar.name} — ${flavorNames.join(', ')}`,
              description: `${jar.description} Selected custom flavored caviar: ${flavorNames.join(', ')}.`
            };
            onAddToCart(jarWithFlavor, qty);
          } else {
            onAddToCart(jar, qty);
          }
        } else {
          onAddToCart(jar, qty);
        }
      }
    });

    // 3. Immediately dispatch navigation to checkout
    navigate('/checkout');
  };

  return (
    <div ref={wizardRef} className="bg-brand-ink text-brand-cream p-6 md:p-12 border border-brand-ochre/15 shadow-2xl relative overflow-hidden transition-all duration-500 rounded-3xl">
      {/* Dynamic phase progression track */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-ochre/10">
        <div 
          className="h-full bg-brand-terracotta transition-all duration-300"
          style={{ 
            width: 
              phase === 'PACKAGE_SELECTION' ? '25%' :
              phase === 'CAVIAR_SELECTION' ? '50%' :
              phase === 'ADD_ONS' ? '75%' : '100%'
          }}
        />
      </div>

      {/* Header phase status indicator */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 pb-8 border-b border-brand-ochre/10 gap-4">
        <div>
          <span className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-[0.3em] block mb-1">
            {phase === 'PACKAGE_SELECTION' && 'Phase 01 / Package Architecture'}
            {phase === 'CAVIAR_SELECTION' && 'Phase 02 / Topping Customization'}
            {phase === 'ADD_ONS' && 'Phase 03 / Upgrade & Jar Vault'}
            {phase === 'LOGISTICS' && 'Phase 04 / Dispatched Date'}
          </span>
          <h3 className="serif text-3xl md:text-5xl font-black text-brand-cream uppercase tracking-tight leading-none">
            {phase === 'PACKAGE_SELECTION' && 'Select Your Box Setup'}
            {phase === 'CAVIAR_SELECTION' && 'Select Caviar Toppings'}
            {phase === 'ADD_ONS' && 'Premium Upgrades'}
            {phase === 'LOGISTICS' && 'Secured Pick-up Date'}
          </h3>
        </div>

        <div className="hidden md:flex space-x-1.5">
          {(['PACKAGE_SELECTION', 'CAVIAR_SELECTION', 'ADD_ONS', 'LOGISTICS'] as OrderPhase[]).map((p, idx) => {
            const labels = ['01', '02', '03', '04'];
            const active = phase === p;
            return (
              <div 
                key={p}
                className={`flex items-center justify-center w-12 h-8 font-mono text-[10px] font-black border transition-all ${
                  active 
                    ? 'bg-brand-terracotta border-brand-terracotta text-brand-cream' 
                    : 'border-brand-ochre/20 text-brand-cream/40'
                }`}
              >
                {labels[idx]}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Total & Quick Navigation Bar */}
      <div className="flex flex-row justify-between items-center bg-white/[0.02] border border-brand-ochre/15 rounded-2xl px-4 md:px-6 py-3.5 mb-10 gap-4">
        <div className="flex items-center space-x-2 md:space-x-3">
          <span className="mono text-[8px] md:text-[9px] text-brand-cream/40 uppercase tracking-widest font-black block">Total:</span>
          <p className="serif text-xl md:text-2xl font-black text-brand-ochre leading-none">
            ${grandTotal.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
          {phase !== 'PACKAGE_SELECTION' && (
            <button
              onClick={() => {
                if (phase === 'LOGISTICS') setPhase('ADD_ONS');
                else if (phase === 'ADD_ONS') {
                  if (selectedStyle === 'classic') setPhase('PACKAGE_SELECTION');
                  else setPhase('CAVIAR_SELECTION');
                }
                else if (phase === 'CAVIAR_SELECTION') setPhase('PACKAGE_SELECTION');
              }}
              className="flex items-center space-x-1.5 text-brand-cream/60 hover:text-brand-cream font-mono text-[9px] uppercase font-black tracking-widest px-2.5 py-2 hover:bg-white/5 rounded border border-brand-ochre/10 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          )}

          {phase !== 'LOGISTICS' ? (
            <button
              onClick={() => {
                if (phase === 'PACKAGE_SELECTION') {
                  if (selectedStyle === 'classic') {
                    setPhase('ADD_ONS');
                  } else {
                    setPhase('CAVIAR_SELECTION');
                  }
                } else if (phase === 'CAVIAR_SELECTION') {
                  setPhase('ADD_ONS');
                } else if (phase === 'ADD_ONS') {
                  setPhase('LOGISTICS');
                }
              }}
              className="bg-brand-cream text-brand-ink px-4 py-2 rounded font-mono text-[9px] font-black uppercase tracking-widest flex items-center justify-center space-x-1.5 hover:bg-brand-terracotta hover:text-brand-cream transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleCheckoutProtocol}
              className="bg-brand-terracotta text-brand-cream px-4 py-2 rounded font-mono text-[9px] font-black uppercase tracking-wider shadow-lg hover:bg-brand-ochre hover:text-brand-ink transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Secure Allocation Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic wizard panels */}
      <div className="min-h-[400px] flex flex-col justify-between">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {/* PHASE 01: PACKAGE SELECTION */}
            {phase === 'PACKAGE_SELECTION' && (
              <div className="space-y-12">
                {/* 1. Pick Size Category */}
                <div className="space-y-4">
                  <label className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                    Choose Your Box Container Size:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* SINGLE BUN (START HERE ENTRY POINT) */}
                    <button
                      onClick={() => {
                        setSelectedSize('single');
                        setSelectedStyle('classic'); // Default style is classic
                      }}
                      className={`group relative text-left border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-2xl ${
                        selectedSize === 'single'
                          ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-lg'
                          : 'border-brand-ochre/20 hover:border-brand-ochre hover:bg-white/[0.01]'
                      }`}
                    >
                      <div className="w-full aspect-[16/10] relative bg-brand-ink/40 overflow-hidden">
                        <img
                          src={SINGLES_MENU[0].image}
                          alt="Singles"
                          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 bg-brand-terracotta/95 text-brand-cream text-[9px] font-black uppercase tracking-widest px-2.5 py-1 z-10 rounded">
                          Start Here
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-brand-terracotta" />
                            <div>
                              <h4 className="serif text-xl font-black text-brand-cream uppercase tracking-tight">Singles</h4>
                              <p className="mono text-[10px] text-brand-ochre mt-0.5">Starting at $5.00</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-brand-cream/60 leading-normal">
                            Give yourself a low-friction entry point, or grab a quick standalone signature roll.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* 4-PACK */}
                    <button
                      onClick={() => {
                        setSelectedSize('4pack');
                      }}
                      className={`group relative text-left border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden rounded-2xl ${
                        selectedSize === '4pack'
                          ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-lg'
                          : 'border-brand-ochre/20 hover:border-brand-ochre'
                      }`}
                    >
                      <div className="w-full aspect-[16/10] relative bg-brand-ink/40 overflow-hidden">
                        <img
                          src={BOXED_4_PACKS[1].image}
                          alt="4-Pack"
                          className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Layers className="w-5 h-5 text-brand-ochre" />
                            <div>
                              <h4 className="serif text-xl font-black text-brand-cream uppercase tracking-tight">4-Pack Box</h4>
                              <p className="mono text-[10px] text-brand-ochre mt-0.5">Starting at $18.00</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-brand-cream/60 leading-normal">
                            Indulgent selection for small families, roommates, or keeping operations elegant.
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* 6-PACK HERO (VISUALLY EMPHASIZED) */}
                    <button
                      onClick={() => {
                        setSelectedSize('6pack');
                      }}
                      className={`group relative text-left border-4 transition-all duration-500 flex flex-col justify-between overflow-hidden rounded-2xl ${
                        selectedSize === '6pack'
                          ? 'border-brand-terracotta bg-brand-ink shadow-[0_0_40px_rgba(185,76,47,0.15)] bg-gradient-to-br from-brand-ink to-brand-terracotta/10'
                          : 'border-brand-ochre/30 hover:border-brand-ochre hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="w-full aspect-[16/10] relative bg-brand-ink/40 overflow-hidden">
                        <img
                          src={BOXED_6_PACKS[2].image}
                          alt="6-Pack"
                          className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-brand-terracotta text-brand-cream font-mono text-[8px] font-black uppercase tracking-widest px-4 py-1.5 shadow-md flex items-center gap-1 z-10">
                          <Flame className="w-3 h-3 text-brand-ochre fill-brand-ochre" />
                          <span>Fan Favorite</span>
                        </div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-brand-ochre fill-brand-ochre animate-bounce" />
                            <div>
                              <h4 className="serif text-xl font-black text-brand-cream uppercase tracking-tight">6-Pack Box</h4>
                              <p className="mono text-xs text-brand-ochre font-extrabold mt-0.5">
                                Starting at $26.00 — BEST VALUE
                              </p>
                            </div>
                          </div>
                          <p className="text-[11px] text-brand-cream/80 font-medium leading-relaxed">
                            Positioned as our signature host gift or ultimate shareable statement. <span className="font-bold text-brand-terracotta underline">The box that gets talked about.</span>
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Style Configurations */}
                <div className="space-y-4 pt-6 border-t border-brand-ochre/10">
                  <label className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                    Choose Your Flavor Style Tier:
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CLASSIC STYLE */}
                    <button
                      onClick={() => {
                        setSelectedStyle('classic');
                      }}
                      className={`text-left p-6 border-2 transition-all duration-300 flex flex-col justify-between rounded-2xl ${
                        selectedStyle === 'classic'
                          ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-md'
                          : 'border-brand-ochre/20 hover:border-brand-ochre hover:bg-white/[0.01]'
                      }`}
                    >
                      <div>
                        <h4 className="serif text-xl font-black text-brand-cream">
                          {selectedSize === 'single' ? 'CLASSIC BUN' : 'CLASSIC 4/6-PACK'}
                        </h4>
                        <p className="mono text-[10px] text-brand-ochre mt-1">
                          {selectedSize === 'single' ? '$5.00' : selectedSize === '4pack' ? '$18.00' : '$26.00'}
                        </p>
                      </div>
                      <p className="text-[11px] text-brand-cream/60 leading-normal mt-4">
                        {selectedSize === 'single'
                          ? 'Secret Frost. Clean. Easy. Always right.'
                          : 'Four or six classic buns drenched in Bobby’s velvety vanilla Secret Frost cream whip.'}
                      </p>
                    </button>

                    {/* MIXED STYLE */}
                    <button
                      onClick={() => {
                        setSelectedStyle('mixed');
                      }}
                      className={`text-left p-6 border-2 transition-all duration-300 flex flex-col justify-between rounded-2xl ${
                        selectedStyle === 'mixed'
                          ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-md'
                          : 'border-brand-ochre/20 hover:border-brand-ochre hover:bg-white/[0.01]'
                      }`}
                    >
                      <div>
                        <h4 className="serif text-xl font-black text-brand-cream flex items-center gap-2">
                          <span>{selectedSize === 'single' ? 'CAVIAR BUN' : 'MIXED 4/6-PACK'}</span>
                          <span className="bg-brand-ochre text-brand-ink text-[8px] font-black px-1.5 py-0.5 rounded">Custom</span>
                        </h4>
                        <p className="mono text-[10px] text-brand-ochre mt-1">
                          {selectedSize === 'single' ? '$6.00' : selectedSize === '4pack' ? '$22.00' : '$32.00'}
                        </p>
                      </div>
                      <p className="text-[11px] text-brand-cream/60 leading-normal mt-4">
                        {selectedSize === 'single'
                          ? 'Your bun + one signature slow-simmered regional fruit caviar topping of your choice.'
                          : 'A mix of classic and custom caviar topped buns. Best value, shareable, and delicious.'}
                      </p>
                    </button>

                    {/* SIGNATURE STYLE */}
                    <button
                      onClick={() => {
                        setSelectedStyle('signature');
                      }}
                      className={`text-left p-6 border-2 transition-all duration-300 flex flex-col justify-between rounded-2xl ${
                        selectedStyle === 'signature'
                          ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-md'
                          : 'border-brand-ochre/20 hover:border-brand-ochre hover:bg-white/[0.01]'
                      }`}
                    >
                      <div>
                        <h4 className="serif text-xl font-black text-brand-cream">
                          {selectedSize === 'single' ? 'PREMIUM BUN' : 'PREMIUM 4/6-PACK'}
                        </h4>
                        <p className="mono text-[10px] text-brand-ochre mt-1">
                          {selectedSize === 'single' ? '$7.00' : selectedSize === '4pack' ? '$25.00' : '$36.00'}
                        </p>
                      </div>
                      <p className="text-[11px] text-brand-cream/60 leading-normal mt-4">
                        {selectedSize === 'single'
                          ? 'Our warm signature Velvet Apple Bun topped with slow-simmered regional spiced brown-sugar apples.'
                          : 'For the elevated box moment. Our ultimate dressed-up party box of highly curated best-selling premium toppings.'}
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 02: CUSTOM TOPIPING CAVIAR SELECTOR (IF MIXED OR SIGNATURE chosen) */}
            {phase === 'CAVIAR_SELECTION' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Visual slot selector track */}
                <div className="space-y-3">
                  <label className="mono text-[9px] text-brand-ochre uppercase font-black tracking-widest block">
                    Pick a Bun Slot to configure / assign Caviar:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    {caviarSlots.slice(0, maxCaviarSlots).map((slotId, index) => {
                      const active = index === activeSlotIdx;
                      const fl = CAVIAR_FLAVORS.find(f => f.id === slotId);
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveSlotIdx(index)}
                          className={`p-4 border transition-all text-center flex flex-col justify-between cursor-pointer ${
                            active
                              ? 'border-brand-terracotta bg-brand-terracotta/10 shadow-md'
                              : 'border-brand-ochre/15 hover:border-brand-ochre/40'
                          }`}
                        >
                          <span className="mono text-[8px] font-black text-brand-ochre block uppercase mb-1">Bun {index + 1}</span>
                          <span className="serif text-sm font-black truncate block text-brand-cream">
                            {fl?.name || 'Standard'}
                          </span>
                          <span className={`text-[8.5px] font-mono mt-2 block font-extrabold ${fl?.category === 'premium' ? 'text-brand-terracotta' : 'text-brand-cream/40'}`}>
                            {fl?.category === 'premium' ? 'PREMIUM' : 'STANDARD'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="text-center py-4 bg-brand-ochre/[0.03] border border-brand-sand/10 space-y-1">
                  <h4 className="serif text-2xl font-black text-brand-cream">
                    Configure Bun #{activeSlotIdx + 1} Topping
                  </h4>
                  <p className="mono text-[9px] text-brand-cream/50 uppercase tracking-widest">
                    No Caviar is free. Standard caviar is +$1.00. Premium or Seasonal flavors are +$2.00.
                  </p>
                </div>

                {/* Split flavor listings */}
                <div className={`grid grid-cols-1 ${selectedSize === 'single' && selectedStyle === 'signature' ? '' : 'lg:grid-cols-2'} gap-8`}>
                  {/* Standard Flavors */}
                  {!(selectedSize === 'single' && selectedStyle === 'signature') && (
                    <div className="space-y-4 bg-white/[0.02] p-6 border border-brand-ochre/5">
                      <h5 className="mono text-[10px] text-brand-ochre font-black uppercase tracking-widest border-b border-brand-ochre/10 pb-2">
                        Standard Caviar Flavors (+$1.00 or Free)
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CAVIAR_FLAVORS.filter(f => f.category === 'standard').map(fl => {
                          const isSelected = caviarSlots[activeSlotIdx] === fl.id;
                          const isNone = fl.id === 'none';
                          return (
                            <button
                              key={fl.id}
                              onClick={() => {
                                const newSlots = [...caviarSlots];
                                newSlots[activeSlotIdx] = fl.id;
                                setCaviarSlots(newSlots);
                                if (activeSlotIdx < maxCaviarSlots - 1) {
                                  setActiveSlotIdx(activeSlotIdx + 1);
                                }
                              }}
                              className={`group p-3 text-left border transition-all flex items-center space-x-3 cursor-pointer min-h-[96px] ${
                                isSelected
                                  ? 'border-brand-terracotta bg-brand-terracotta/5'
                                  : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                              }`}
                            >
                              <img
                                src={fl.image}
                                alt={fl.name}
                                className="w-14 h-14 rounded-lg object-cover shrink-0 bg-brand-ink/40 border border-brand-ochre/10 group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[60px]">
                                <div>
                                  <span className="font-serif font-black text-xs text-brand-cream block leading-tight truncate">{fl.name}</span>
                                  <span className="text-[9px] text-brand-cream/50 line-clamp-2 block leading-snug mt-0.5">{fl.description}</span>
                                </div>
                                <span className="mono text-[8px] uppercase tracking-widest text-brand-ochre/70 font-black mt-1 block">
                                  {isNone ? 'Free / Included' : '+$1.00 (Included in Tier)'}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Premium Seasonal Flavors */}
                  <div className={`space-y-4 bg-brand-terracotta/[0.02] p-6 border border-brand-terracotta/10 ${selectedSize === 'single' && selectedStyle === 'signature' ? 'col-span-full' : ''}`}>
                    <h5 className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-widest border-b border-brand-terracotta/10 pb-2 flex justify-between items-center">
                      <span>Premium / Seasonal Flavors</span>
                      <span className="bg-brand-terracotta text-brand-cream text-[8px] font-black px-1.5 py-0.5">Upgrades Applied</span>
                    </h5>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${selectedSize === 'single' && selectedStyle === 'signature' ? 'md:grid-cols-3' : ''} gap-3`}>
                      {CAVIAR_FLAVORS.filter(f => f.category === 'premium').map(fl => {
                        const isSelected = caviarSlots[activeSlotIdx] === fl.id;
                        return (
                          <button
                            key={fl.id}
                            onClick={() => {
                              const newSlots = [...caviarSlots];
                              newSlots[activeSlotIdx] = fl.id;
                              setCaviarSlots(newSlots);
                              if (activeSlotIdx < maxCaviarSlots - 1) {
                                setActiveSlotIdx(activeSlotIdx + 1);
                              }
                            }}
                            className={`group p-3 text-left border transition-all flex items-center space-x-3 cursor-pointer min-h-[96px] ${
                              isSelected
                                ? 'border-brand-terracotta bg-brand-terracotta/5'
                                : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                            }`}
                          >
                            <img
                              src={fl.image}
                              alt={fl.name}
                              className="w-14 h-14 rounded-lg object-cover shrink-0 bg-brand-ink/40 border border-brand-ochre/10 group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[60px]">
                              <div>
                                <span className="font-serif font-black text-xs text-brand-cream block leading-tight truncate">{fl.name}</span>
                                <span className="text-[9px] text-brand-cream/50 line-clamp-2 block leading-snug mt-0.5">{fl.description}</span>
                              </div>
                              {selectedSize !== 'single' ? (
                                <span className="mono text-[8px] uppercase tracking-widest text-brand-terracotta font-black mt-1 block">
                                  +$2.00 (+{selectedSize === '4pack' ? '$3.00' : '$4.00'} Box Upgrade)
                                </span>
                              ) : selectedStyle === 'signature' ? (
                                <span className="mono text-[8px] uppercase tracking-widest text-[#90E0EF] font-black mt-1 block">
                                  Included in Premium Flat Rate
                                </span>
                              ) : (
                                <span className="mono text-[8px] uppercase tracking-widest text-brand-terracotta font-black mt-1 block">
                                  +$1.00 (Upgrades to Premium Bun)
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Live Upgrade explanation message */}
                <div className="bg-white/5 border border-brand-sand/10 p-5 rounded-xl text-center space-y-1.5">
                  {selectedSize === 'single' ? (
                    selectedStyle === 'signature' ? (
                      <p className="text-xs font-serif font-black italic text-[#90E0EF] leading-relaxed animate-pulse">
                        ✨ PREMIUM SINGLE BUN: Premium and Standard caviar options are fully included in your flat $7.00 price!
                      </p>
                    ) : hasPremiumCaviar ? (
                      <p className="text-xs font-serif font-black italic text-brand-terracotta leading-relaxed animate-pulse">
                        ✨ PREMIUM CAVIAR UPGRADE DETECTED: Choosing a premium seasonal flavor upgrades your Caviar Bun ($6.00) to a Premium Bun ($7.00 flat).
                      </p>
                    ) : (
                      <p className="text-xs font-serif font-black italic text-brand-ochre leading-relaxed">
                        ✨ CAVIAR SINGLE BUN: Standard delicious mountain-grown caviar is fully included in your solid $6.00 price!
                      </p>
                    )
                  ) : hasPremiumCaviar ? (
                    <p className="text-xs font-serif font-black italic text-brand-ochre leading-relaxed animate-pulse">
                      ✨ PREMIUM FLAVOR UPGRADE DETECTED: A flat reward fee of <span className="text-brand-terracotta text-sm">${premiumUpgradePrice.toFixed(2)}</span> has been automatically added to this {selectedSize === '4pack' ? '4-Pack' : '6-Pack'} box total for your seasonal flavor picks. Enjoy high luxury!
                    </p>
                  ) : (
                    <p className="mono text-[9px] uppercase tracking-widest text-brand-cream/40 text-center leading-normal">
                      All currently selected caviar toppings correspond to standard items. Switch to a Premium flavor above to trigger dynamic box upgrades.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* PHASE 03: UPGRADE OPTIONS & BONUS JARS */}
            {phase === 'ADD_ONS' && (
              <div className="space-y-12 animate-in fade-in duration-300">
                {/* Topping modifications */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-brand-terracotta" />
                    <label className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                      Secure Custom Topping Drizzle Upgrades:
                    </label>
                  </div>

                  {selectedSize === 'single' ? (
                    // Single bun addons
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                      {/* Petit Frost Cup */}
                      <button
                        onClick={() => {
                          setExtraSecretFrost(!extraSecretFrost);
                          setAdd1CaviarTopping(false);
                          setExtraCaviarDrizzle(false);
                        }}
                        className={`group p-4 border text-left transition-all flex flex-col justify-between h-full rounded-xl ${
                          extraSecretFrost ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                        }`}
                      >
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-brand-ochre/10 mb-3 bg-brand-ink/40">
                          <img
                            src={petitFrostCup}
                            alt="Petit Frost Cup"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-in fade-in duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex justify-between items-start w-full gap-2">
                          <div>
                            <h4 className="font-serif font-black text-sm text-brand-cream uppercase tracking-wide">Petit Frost Cup (3.5 oz)</h4>
                            <p className="text-[10px] text-brand-cream/60 mt-0.5 leading-snug">Staggeringly thick side-cup of vanilla cream whip</p>
                          </div>
                          <div className="mono text-xs font-black text-brand-terracotta shrink-0">+$3.00</div>
                        </div>
                      </button>

                      {/* Petit Caviar Cup */}
                      <button
                        onClick={() => {
                          setAdd1CaviarTopping(!add1CaviarTopping);
                          setExtraSecretFrost(false);
                          setExtraCaviarDrizzle(false);
                        }}
                        className={`group p-4 border text-left transition-all flex flex-col justify-between h-full rounded-xl ${
                          add1CaviarTopping ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                        }`}
                      >
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-brand-ochre/10 mb-3 bg-brand-ink/40">
                          <img
                            src={petitCaviarCup}
                            alt="Petit Caviar Cup"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-in fade-in duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex justify-between items-start w-full gap-2">
                          <div>
                            <h4 className="font-serif font-black text-sm text-brand-cream uppercase tracking-wide">Petit Caviar Cup (3.5 oz)</h4>
                            <p className="text-[10px] text-brand-cream/60 mt-0.5 leading-snug">Premium handcrafted fruit reduction glaze side-cup</p>
                          </div>
                          <div className="mono text-xs font-black text-brand-terracotta shrink-0">+$3.00</div>
                        </div>
                      </button>

                      {/* Le Petit Duo */}
                      <button
                        onClick={() => {
                          setExtraCaviarDrizzle(!extraCaviarDrizzle);
                          setAdd1CaviarTopping(false);
                          setExtraSecretFrost(false);
                        }}
                        className={`group p-4 border text-left transition-all flex flex-col justify-between h-full rounded-xl ${
                          extraCaviarDrizzle ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                        }`}
                      >
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-brand-ochre/10 mb-3 bg-brand-ink/40">
                          <img
                            src={petitDuoCups}
                            alt="Le Petit Duo Cups"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-in fade-in duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex justify-between items-start w-full gap-2">
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-serif font-black text-sm text-brand-cream uppercase tracking-wide">Le Petit Duo</h4>
                              <span className="bg-brand-terracotta text-brand-cream text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full shrink-0">Best Value</span>
                            </div>
                            <p className="text-[10px] text-brand-cream/60 mt-0.5 leading-snug">Both pocket-sized cups of Frost & Caviar together</p>
                          </div>
                          <div className="mono text-xs font-black text-brand-terracotta shrink-0">+$5.00</div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    // Box addons (4pack or 6pack)
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setAddCaviarToBox(!addCaviarToBox)}
                        className={`group p-4 border text-left transition-all flex flex-col justify-between h-full rounded-xl ${
                          addCaviarToBox ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                        }`}
                      >
                        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-brand-ochre/10 mb-3.5 bg-brand-ink/40">
                          <img
                            src={fourPackCaviarUpgrade}
                            alt="Add Caviar to Box"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-in fade-in duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex justify-between items-start w-full gap-2">
                          <div>
                            <h4 className="font-serif font-black text-lg text-brand-cream">
                              {selectedSize === '4pack' ? 'Add Caviar to 4-Pack' : 'Add Caviar to 6-Pack'}
                            </h4>
                            <p className="text-xs text-brand-cream/60 mt-0.5 leading-snug">Adds rich customized caviar toppings to standard items</p>
                          </div>
                          <div className="mono text-base font-black text-brand-terracotta shrink-0">
                            {selectedSize === '4pack' ? '+$4.00' : '+$6.00'}
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => setExtraHeavyToppingBox(!extraHeavyToppingBox)}
                        className={`group p-4 border text-left transition-all flex flex-col justify-between h-full rounded-xl ${
                          extraHeavyToppingBox ? 'border-brand-terracotta bg-brand-terracotta/5' : 'border-brand-ochre/10 hover:border-brand-ochre/30'
                        }`}
                      >
                        <div className="w-full aspect-[16/9] rounded-lg overflow-hidden border border-brand-ochre/10 mb-3.5 bg-brand-ink/40">
                          <img
                            src={cookiesCreamTopping}
                            alt="Extra-Heavy Topping"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 animate-in fade-in duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex justify-between items-start w-full gap-2">
                          <div>
                            <h4 className="font-serif font-black text-lg text-brand-cream">
                              Extra-Heavy Grand Topping Upgrade
                            </h4>
                            <p className="text-xs text-brand-cream/60 mt-0.5 leading-snug">A massive final glaze reduction finish across all items</p>
                          </div>
                          <div className="mono text-base font-black text-brand-terracotta shrink-0">
                            {selectedSize === '4pack' ? '+$5.00' : '+$7.00'}
                          </div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* BONUS JARS ADD-ON LIST */}
                  <div className="space-y-8 pt-6 border-t border-brand-ochre/10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-brand-ochre" />
                        <label className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                          Presenting Jars as Bonus Add-Ons:
                        </label>
                      </div>
                      {jarsStats.discount > 0 && (
                        <span className="mono text-[9px] bg-emerald-600 text-brand-cream font-black uppercase px-2 py-0.5 tracking-wider rounded">
                          ✨ BUNDLE DISCOUNT APPLIED: -${jarsStats.discount.toFixed(2)} OFF
                        </span>
                      )}
                    </div>

                    {/* 1. FRUIT CAVIAR JARS SECTION */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className="serif text-lg font-black text-brand-cream shrink-0">
                          Fruit Caviar Jars & Cups
                        </span>
                        <div className="h-[1px] bg-brand-ochre/25 flex-grow" />
                        <span className="mono text-[8px] tracking-widest text-[#FFFBF5] uppercase bg-brand-cream/10 px-2 py-0.5 rounded font-bold">
                          Slow-Simmered Regional Recipes
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {JAR_PRODUCTS.filter(j => j.id.includes('caviar') && j.id !== 'petit-caviar-jar' && j.id !== 'petit-duo-caviar').map(jar => {
                          const qty = jarQuantities[jar.id] || 0;
                          const availableFlavors = CAVIAR_FLAVORS.filter(f => f.id !== 'none');
                          return (
                            <div 
                              key={jar.id}
                              className="group bg-zinc-900/40 p-4 border border-brand-ochre/15 rounded-xl flex flex-col justify-between hover:border-brand-ochre/30 transition-all duration-300"
                            >
                              <div>
                                <div className="w-full aspect-square rounded-lg overflow-hidden border border-brand-ochre/10 mb-3 bg-brand-ink/40">
                                  <img
                                    src={jar.image}
                                    alt={jar.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="space-y-1.5 font-sans">
                                  <div className="flex items-center justify-between">
                                    <span className="mono text-[8px] bg-brand-cream/10 text-brand-cream px-2 py-0.5 rounded font-black tracking-widest uppercase">
                                      Fruit Caviar
                                    </span>
                                    <span className="mono font-bold text-xs text-brand-ochre">${jar.price.toFixed(2)}</span>
                                  </div>
                                  <h5 className="font-serif font-black text-sm text-brand-cream leading-tight">{jar.name}</h5>
                                  <p className="text-[10px] text-brand-cream/50 line-clamp-3 leading-relaxed">{jar.description}</p>
                                </div>

                                {qty > 0 && (
                                  <div className="mt-4 pt-3 border-t border-brand-ochre/10 space-y-2.5">
                                    <label className="mono text-[9px] text-[#E27043] font-extrabold uppercase tracking-widest block">
                                      Choose Caviar Flavor{qty > 1 || jar.id === 'double-grande-caviar-jars' ? "s" : ""}:
                                    </label>
                                    <div className="space-y-2">
                                      {Array.from({ length: jar.id === 'double-grande-caviar-jars' ? qty * 2 : qty }).map((_, idx) => {
                                        const currentList = selectedJarFlavors[jar.id] || [];
                                        const currentVal = currentList[idx] || 'blueberry';
                                        return (
                                          <div key={idx} className="space-y-1">
                                            <span className="mono text-[7.5px] text-[#FFFBF5]/60 block">
                                              {jar.id === 'double-grande-caviar-jars' 
                                                ? `Jar #${idx + 1} of Bundle:` 
                                                : `Jar #${idx + 1}:`}
                                            </span>
                                            <select
                                              value={currentVal}
                                              onChange={(e) => {
                                                const updated = [...currentList];
                                                updated[idx] = e.target.value;
                                                setSelectedJarFlavors(prev => ({
                                                  ...prev,
                                                  [jar.id]: updated
                                                }));
                                              }}
                                              className="w-full bg-brand-ink/90 border border-brand-ochre/25 p-2 text-[#FFFBF5] focus:outline-none focus:border-[#E27043] mono text-[10px] uppercase cursor-pointer rounded-lg hover:border-brand-ochre/50 transition-colors"
                                            >
                                              {availableFlavors.map(f => (
                                                <option key={f.id} value={f.id} className="bg-brand-ink text-[#FFFBF5]">
                                                  {f.name.toUpperCase()} ({f.category.toUpperCase()})
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-ochre/10">
                                <button
                                  onClick={() => decrementJar(jar.id)}
                                  disabled={qty === 0}
                                  className="w-10 h-10 rounded-full border border-brand-ochre/25 flex items-center justify-center text-brand-ochre hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-colors active:scale-95 disabled:opacity-25"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="mono text-sm text-brand-cream font-black">{qty}</span>
                                <button
                                  onClick={() => incrementJar(jar.id)}
                                  className="w-10 h-10 rounded-full border border-brand-ochre/25 flex items-center justify-center text-brand-ochre hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-colors active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. SECRET FROST JARS SECTION */}
                    <div className="space-y-4 pt-6">
                      <div className="flex items-center gap-4">
                        <span className="serif text-lg font-black text-brand-cream shrink-0">
                          Bobby's Secret Frost Jars & Cups
                        </span>
                        <div className="h-[1px] bg-brand-ochre/25 flex-grow" />
                        <span className="mono text-[8px] tracking-widest text-[#FDF6F0] uppercase bg-brand-cream/10 px-2 py-0.5 rounded font-bold">
                          Temperature Calibrated
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {JAR_PRODUCTS.filter(j => !j.id.includes('caviar') && j.id !== 'petit-frost-jar' && j.id !== 'petit-duo-frost').map(jar => {
                          const qty = jarQuantities[jar.id] || 0;
                          return (
                            <div 
                              key={jar.id}
                              className="group bg-zinc-900/40 p-4 border border-brand-ochre/15 rounded-xl flex flex-col justify-between hover:border-brand-ochre/30 transition-all duration-300"
                            >
                              <div>
                                <div className="w-full aspect-square rounded-lg overflow-hidden border border-brand-ochre/10 mb-3 bg-brand-ink/40">
                                  <img
                                    src={jar.image}
                                    alt={jar.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="space-y-1.5">
                                  <div className="flex items-center justify-between">
                                    <span className="mono text-[8px] bg-brand-cream/10 text-brand-cream px-2 py-0.5 rounded font-black tracking-widest uppercase">
                                      Secret Frost
                                    </span>
                                    <span className="mono font-bold text-xs text-brand-ochre">${jar.price.toFixed(2)}</span>
                                  </div>
                                  <h5 className="font-serif font-black text-sm text-brand-cream leading-tight">{jar.name}</h5>
                                  <p className="text-[10px] text-brand-cream/50 line-clamp-2 leading-relaxed">{jar.description}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-ochre/10">
                                <button
                                  onClick={() => decrementJar(jar.id)}
                                  disabled={qty === 0}
                                  className="w-10 h-10 rounded-full border border-brand-ochre/25 flex items-center justify-center text-brand-ochre hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-colors active:scale-95 disabled:opacity-25"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="mono text-sm text-brand-cream font-black">{qty}</span>
                                <button
                                  onClick={() => incrementJar(jar.id)}
                                  className="w-10 h-10 rounded-full border border-brand-ochre/25 flex items-center justify-center text-brand-ochre hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-colors active:scale-95"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PHASE 04: LOGISTICS */}
            {phase === 'LOGISTICS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-in fade-in duration-300">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="mono text-brand-terracotta text-[10px] uppercase font-black tracking-widest">LOGISTICS PROTOCOL</span>
                    <h4 className="serif text-3xl font-black">Verify Pack Dispatch Date</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPickupOption('this-sat')}
                      className={`p-5 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        pickupOption === 'this-sat'
                          ? 'border-brand-terracotta bg-brand-terracotta/5'
                          : 'border-brand-ochre/15 hover:border-brand-ochre/40'
                      }`}
                    >
                      <span className="mono text-[7.5px] text-brand-terracotta uppercase font-black tracking-widest mb-1">IMMEDIATE RELEASE</span>
                      <span className="font-serif font-black text-lg text-brand-cream block leading-tight">This Saturday</span>
                    </button>

                    <button
                      onClick={() => setPickupOption('different-sat')}
                      className={`p-5 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        pickupOption === 'different-sat'
                          ? 'border-brand-terracotta bg-brand-terracotta/5'
                          : 'border-brand-ochre/15 hover:border-brand-ochre/40'
                      }`}
                    >
                      <span className="mono text-[7.5px] text-brand-ochre uppercase font-black tracking-widest mb-1">FUTURE DISPATCH</span>
                      <span className="font-serif font-black text-lg text-brand-cream block leading-tight">Other Saturday</span>
                    </button>
                  </div>

                  <div className="bg-brand-ochre/[0.03] border border-brand-ochre/15 p-6 rounded-2xl space-y-4">
                    {pickupOption === 'this-sat' ? (
                      <div className="space-y-2">
                        <span className="mono text-[8px] text-brand-ochre uppercase font-bold block">CONFIRMED DISPATCH DATE:</span>
                        <p className="serif text-2xl font-black text-brand-cream italic leading-none">{formatDateDisplayForUI(saturdays[0])}</p>
                        <p className="text-xs text-brand-cream/60 leading-normal pt-2 border-t border-brand-ochre/10">
                          Fresh hot rolls will be available for pickup this Saturday at our local baking cores from 10:00 AM – 2:00 PM.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="mono text-[8.5px] text-brand-ochre font-black uppercase tracking-wider block">
                            Pick Saturday Release Date:
                          </label>
                          <select
                            value={pickupDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full bg-brand-ink border border-brand-ochre/25 p-3 text-brand-cream focus:outline-none focus:border-brand-terracotta mono text-[11px] uppercase cursor-pointer"
                          >
                            {saturdays.slice(1).map((sat, idx) => (
                              <option key={idx} value={formatDateISO(sat)} className="bg-brand-ink text-brand-cream">
                                {formatDateDisplayForUI(sat).toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="mono text-[8.5px] text-brand-ochre font-black uppercase tracking-wider block">
                            Or custom calendars selector:
                          </label>
                          <input 
                            type="date" 
                            value={pickupDate}
                            min={thisSaturdayISO}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="w-full bg-brand-ink border border-brand-ochre/25 p-3 text-brand-cream focus:outline-none focus:border-brand-terracotta text-xs font-mono uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-brand-ochre/10 p-8 rounded-2xl space-y-6">
                  <h5 className="mono text-[9px] text-brand-ochre font-black uppercase tracking-widest border-b border-brand-ochre/10 pb-2">
                    Secure Package Summary
                  </h5>
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="serif font-black text-xl text-brand-cream">
                        {selectedSize === 'single'
                          ? selectedStyle === 'classic'
                            ? 'Classic Single Bun'
                            : selectedStyle === 'mixed'
                            ? 'Single Caviar Bun'
                            : 'Premium Single Bun'
                          : selectedSize === '4pack'
                          ? 'Bobby’s 4-Pack Collection'
                          : 'Bobby’s 6-Pack Collection'}
                      </span>
                      <span className="mono text-brand-ochre text-sm font-black">${basePackagePrice.toFixed(2)}</span>
                    </div>

                    {hasPremiumCaviar && selectedSize !== 'single' && (
                      <div className="flex justify-between items-baseline text-xs text-brand-terracotta font-heading">
                        <span>+ Seasonal Premium Upgrade Pack</span>
                        <span className="mono font-black">+${premiumUpgradePrice.toFixed(2)}</span>
                      </div>
                    )}

                    {selectedSize === 'single' ? (
                      <>
                        {add1CaviarTopping && (
                          <div className="flex justify-between items-baseline text-xs text-brand-ochre font-heading animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>+ Premium Upgrade: Petit Caviar Cup (3.5 oz)</span>
                            <span className="mono font-black">+$3.00</span>
                          </div>
                        )}
                        {extraCaviarDrizzle && (
                          <div className="flex justify-between items-baseline text-xs text-brand-ochre font-heading animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>+ Premium Upgrade: Le Petit Duo (Frost & Caviar)</span>
                            <span className="mono font-black">+$5.00</span>
                          </div>
                        )}
                        {extraSecretFrost && (
                          <div className="flex justify-between items-baseline text-xs text-brand-ochre font-heading animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>+ Premium Upgrade: Petit Frost Cup (3.5 oz)</span>
                            <span className="mono font-black">+$3.00</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {addCaviarToBox && (
                          <div className="flex justify-between items-baseline text-xs text-brand-ochre font-heading animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>+ Premium Upgrade: Add Caviar to Box</span>
                            <span className="mono font-black">
                              {selectedSize === '4pack' ? '+$4.00' : '+$6.00'}
                            </span>
                          </div>
                        )}
                        {extraHeavyToppingBox && (
                          <div className="flex justify-between items-baseline text-xs text-brand-ochre font-heading animate-in fade-in slide-in-from-left-2 duration-300">
                            <span>+ Premium Upgrade: Extra-Heavy Grand Topping Upgrade</span>
                            <span className="mono font-black">
                              {selectedSize === '4pack' ? '+$5.00' : '+$7.00'}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {jarsStats.totalPrice > 0 && (
                      <div className="flex justify-between items-baseline text-xs text-brand-cream/80 font-heading">
                        <span>+ Vault Jars Add-Ons (with discounts)</span>
                        <span className="mono font-black">+${jarsStats.totalPrice.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-brand-cream/60 leading-normal border-t border-brand-ochre/10 pt-4 font-serif">
                    <span className="bold block text-brand-cream">Full Configuration Spec:</span>
                    {summaryText}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="mt-12 flex flex-col sm:flex-row justify-between items-center border-t border-brand-ochre/10 pt-8 gap-4">
        {/* Phase progress total indicator */}
        <div className="text-center sm:text-left space-y-1">
          <span className="mono text-[9px] text-brand-cream/40 uppercase block font-black">Configured Total Summary</span>
          <p className="serif text-3xl md:text-5xl font-black text-brand-ochre leading-none">
            ${grandTotal.toFixed(2)}
          </p>
        </div>

        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          {phase !== 'PACKAGE_SELECTION' && (
            <button
              onClick={() => {
                if (phase === 'LOGISTICS') setPhase('ADD_ONS');
                else if (phase === 'ADD_ONS') {
                  if (selectedStyle === 'classic') setPhase('PACKAGE_SELECTION');
                  else setPhase('CAVIAR_SELECTION');
                }
                else if (phase === 'CAVIAR_SELECTION') setPhase('PACKAGE_SELECTION');
              }}
              className="flex items-center space-x-2 text-brand-cream/50 hover:text-brand-cream font-mono text-[10px] uppercase font-black uppercase tracking-widest px-4 py-4 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {phase !== 'LOGISTICS' ? (
            <button
              onClick={() => {
                if (phase === 'PACKAGE_SELECTION') {
                  if (selectedStyle === 'classic') {
                    setPhase('ADD_ONS'); // Classic style skips custom caviar logic completely!
                  } else {
                    setPhase('CAVIAR_SELECTION');
                  }
                } else if (phase === 'CAVIAR_SELECTION') {
                  setPhase('ADD_ONS');
                } else if (phase === 'ADD_ONS') {
                  setPhase('LOGISTICS');
                }
              }}
              className="w-full sm:w-auto bg-brand-cream text-brand-ink px-10 py-4 font-mono text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 hover:bg-brand-terracotta hover:text-brand-cream transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleCheckoutProtocol}
              className="w-full sm:w-auto bg-brand-terracotta text-brand-cream px-10 py-5 font-mono text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-brand-ochre hover:text-brand-ink transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Secure Allocation Order</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderingWizard;
