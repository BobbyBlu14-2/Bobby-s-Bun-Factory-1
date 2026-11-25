
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, X, Check, Plus, Sparkles, ArrowRight, Filter, Droplet, Star, ChevronLeft, ChevronRight, Gift, Snowflake } from 'lucide-react';
import OrderTypeSelector from '../components/OrderTypeSelector';
import FlavorAssistant from '../components/FlavorAssistant';
import GearLogo from '../components/GearLogo';
import OrderingWizard from '../components/OrderingWizard';
import FlavorsCarousel from '../components/FlavorsCarousel';
import { Product, OrderType, CartItem } from '../types';
import {
  JAR_PRODUCTS,
  duoFeaturedDuoSet,
  miniBunTraySide,
  cinnabitesChopped,
  happierHolidaysFlyer,
  MINI_PACKS,
  MiniPack,
  HOLIDAY_CATERING_PACKAGES,
  THANKSGIVING_CAVIAR_FLAVORS
} from '../constants';

const MINI_DIPPER_OPTIONS = [
  'Classic Secret Frost Cup (3.5 oz)',
  'Blueberry Caviar Cup (3.5 oz)',
  'Strawberry Caviar Cup (3.5 oz)',
  'Salted Caramel Drizzle Cup (3.5 oz)',
  'Georgia Peach Caviar Cup (3.5 oz)',
  'Velvet Apple Caviar Cup (3.5 oz)',
  'Wildberry Caviar Cup (3.5 oz)'
];

const RENDEZVOUS_VARIANTS = [
  {
    id: 'little',
    name: 'Little Rendezvous',
    description: 'Two oversized Classic Rolls finished with Secret Frost, plus your choice of two Petit de Frost or Petit de Caviar cups (3.5 oz plastic cups).',
    price: 18.00,
    rollsCountNum: 2,
    jarsCountNum: 2,
    rollsCount: '2 Classic Rolls + 2 Petit Cups (3.5 oz)',
    badge: 'Classic Duo'
  },
  {
    id: 'rendezvous',
    name: 'The Rendezvous',
    description: 'Two oversized Premium Rolls with your choice of signature toppings, plus two Petit de Frost or Petit de Caviar cups (3.5 oz plastic cups).',
    price: 22.00,
    rollsCountNum: 2,
    jarsCountNum: 2,
    rollsCount: '2 Premium Rolls + 2 Petit Cups (3.5 oz)',
    badge: 'Signature Duo'
  },
  {
    id: 'datenight',
    name: 'Date Night Rendezvous',
    description: 'Two oversized Premium Rolls, plus your choice of two Coupe de Frost or Coupe de Caviar jars (8 oz glass mason jars).',
    price: 32.00,
    rollsCountNum: 2,
    jarsCountNum: 2,
    rollsCount: '2 Premium Rolls + 2 Coupe Jars (8 oz)',
    badge: 'Luxury Gift Set'
  }
];

const BUN_FLAVOR_OPTIONS = [
  'Blueberry Caviar',
  'Strawberry Caviar',
  'Salted Caramel Drizzle',
  'Signature Classic Roll (Secret Frost)',
  'Georgia Peach Cobbler (Premium)',
  'Velvet Apple (Premium)',
  'Wildberry (Premium)'
];

const COMPANION_OPTIONS_CUPS = [
  'Petit de Frost™ (3.5 oz Plastic Cup)',
  'Petit de Caviar — Blueberry (3.5 oz Cup)',
  'Petit de Caviar — Strawberry (3.5 oz Cup)',
  'Petit de Caviar — Wildberry (3.5 oz Cup)',
  'Petit de Caviar — Georgia Peach (3.5 oz Cup)',
  'Petit de Caviar — Salted Caramel (3.5 oz Cup)',
  'Petit de Caviar — Velvet Apple (3.5 oz Cup)'
];

const COMPANION_OPTIONS_JARS = [
  'Coupe de Frost™ (8 oz Glass Mason Jar)',
  'Coupe de Caviar — Blueberry (8 oz Glass Mason Jar)',
  'Coupe de Caviar — Strawberry (8 oz Glass Mason Jar)',
  'Coupe de Caviar — Georgia Peach (8 oz Glass Mason Jar)',
  'Coupe de Caviar — Wildberry (8 oz Glass Mason Jar)',
  'Coupe de Caviar — Velvet Apple (8 oz Glass Mason Jar)',
  'Coupe de Caviar — Salted Caramel (8 oz Glass Mason Jar)'
];

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
  const [spotlightSlide, setSpotlightSlide] = useState(0); // 0 = Holiday Special, 1 = Minis, 2 = Rendezvous
  const [rendezvousVariant, setRendezvousVariant] = useState<'little' | 'rendezvous' | 'datenight'>('rendezvous');
  const [rendezvousAdded, setRendezvousAdded] = useState(false);

  const SPOTLIGHT_SLIDES = [
    { id: 0, title: 'Holiday Orders', subtitle: 'The Factory Is Taking Holiday Orders', badge: '01 / Holiday Catering' },
    { id: 1, title: 'The Minis', subtitle: '48-Pan & Drop Trays', badge: '02 / Bite-Sized' },
    { id: 2, title: 'The Rendezvous', subtitle: 'Tasting Flight Drop', badge: '03 / Signature Flight' },
  ];

  const nextSpotlightSlide = () => {
    setSpotlightSlide((prev) => (prev + 1) % SPOTLIGHT_SLIDES.length);
  };

  const prevSpotlightSlide = () => {
    setSpotlightSlide((prev) => (prev - 1 + SPOTLIGHT_SLIDES.length) % SPOTLIGHT_SLIDES.length);
  };
  const [selectedBuns, setSelectedBuns] = useState<string[]>([
    'Blueberry Caviar',
    'Georgia Peach Cobbler (Premium)',
    'Velvet Apple (Premium)',
    'Wildberry (Premium)'
  ]);
  const [selectedJars, setSelectedJars] = useState<string[]>([
    'Secret Frost — 3.5 oz Cup',
    'Petit de Caviar — Strawberry (3.5 oz Cup)',
    'Petit de Caviar — Wildberry (3.5 oz Cup)',
    'Petit de Caviar — Georgia Peach (3.5 oz Cup)'
  ]);

  const selectedRendezvousVariant = RENDEZVOUS_VARIANTS.find(v => v.id === rendezvousVariant) || RENDEZVOUS_VARIANTS[1];
  const rollCount = selectedRendezvousVariant.rollsCountNum;
  const jarCount = selectedRendezvousVariant.jarsCountNum;
  const isJarType = selectedRendezvousVariant.id === 'datenight';
  const currentCompanionOptions = isJarType ? COMPANION_OPTIONS_JARS : COMPANION_OPTIONS_CUPS;
  const companionLabel = isJarType ? 'Coupe Jar (8 oz Mason Jar)' : 'Petit Cup (3.5 oz Plastic Cup)';

  const handleBunChange = (index: number, value: string) => {
    setSelectedBuns(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleJarChange = (index: number, value: string) => {
    setSelectedJars(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddRendezvous = () => {
    const activeBuns = selectedBuns.slice(0, rollCount);
    const activeJars = selectedJars.slice(0, jarCount);

    const product: Product = {
      id: `rendezvous-${selectedRendezvousVariant.id}-${Date.now()}`,
      name: `${selectedRendezvousVariant.name}`,
      description: `${selectedRendezvousVariant.description} — Rolls: ${activeBuns.join(', ')} | Jars: ${activeJars.join(', ')}`,
      price: selectedRendezvousVariant.price,
      image: duoFeaturedDuoSet,
      type: 'bun',
      tags: ['Featured Special', 'The Rendezvous', selectedRendezvousVariant.rollsCount],
      color: 'border-brand-ochre/25 text-brand-terracotta bg-orange-50/50'
    };

    handleAddToCart(product, 1);
    setRendezvousAdded(true);
    setTimeout(() => setRendezvousAdded(false), 2000);
  };

  // Minis State & Handlers
  const [selectedMiniPackId, setSelectedMiniPackId] = useState<string>('minis-12pack');
  const [selectedMiniDipper, setSelectedMiniDipper] = useState<string>('Classic Secret Frost');
  const [miniAdded, setMiniAdded] = useState(false);
  const [miniView, setMiniView] = useState<'tray' | 'bites'>('tray');
  const [addedMiniPacks, setAddedMiniPacks] = useState<Record<string, boolean>>({});

  const selectedMiniPack = MINI_PACKS.find(p => p.id === selectedMiniPackId) || MINI_PACKS[3];

  const handleAddMini = (pack?: MiniPack, dipperOverride?: string) => {
    const packToUse = pack || selectedMiniPack;
    const dipperToUse = dipperOverride || selectedMiniDipper;

    const product: Product = {
      id: `${packToUse.id}-${Date.now()}`,
      name: packToUse.name,
      description: `"${packToUse.quip}" — Includes ${packToUse.dippersIncluded} (${dipperToUse})`,
      price: packToUse.price,
      image: miniBunTraySide,
      type: 'bun',
      tags: ['The Minis', 'Square Menu', `${packToUse.count}-Pack`],
      color: 'border-brand-ochre/25 text-brand-terracotta bg-orange-50/50'
    };

    handleAddToCart(product, 1);

    if (pack) {
      setAddedMiniPacks(prev => ({ ...prev, [pack.id]: true }));
      setTimeout(() => {
        setAddedMiniPacks(prev => ({ ...prev, [pack.id]: false }));
      }, 2000);
    } else {
      setMiniAdded(true);
      setTimeout(() => setMiniAdded(false), 2000);
    }
  };

  // Holiday Catering Spotlight State & Preorder Handler
  const SPOTLIGHT_HOLIDAY_PACKAGES = HOLIDAY_CATERING_PACKAGES.filter((p) =>
    ['factory-48', 'petite-holiday-feast', 'factory-96', 'holiday-cinnacake-caviar'].includes(p.id)
  );
  const [selectedHolidayPkgId, setSelectedHolidayPkgId] = useState<string>('petite-holiday-feast');
  const [holidayCaviar1, setHolidayCaviar1] = useState<string>(THANKSGIVING_CAVIAR_FLAVORS[0]);
  const [holidayCaviar2, setHolidayCaviar2] = useState<string>(THANKSGIVING_CAVIAR_FLAVORS[1]);
  const [holidayDropDate, setHolidayDropDate] = useState<string>('Thanksgiving Pre-Order Pickup (Wed, Nov 25)');
  const [holidayBundleAdded, setHolidayBundleAdded] = useState(false);
  const [isHolidayFlyerModalOpen, setIsHolidayFlyerModalOpen] = useState(false);

  const selectedHolidayPkg =
    SPOTLIGHT_HOLIDAY_PACKAGES.find((p) => p.id === selectedHolidayPkgId) || SPOTLIGHT_HOLIDAY_PACKAGES[0];

  const HOLIDAY_DROP_DATES = [
    'Thanksgiving Pre-Order Pickup (Wed, Nov 25)',
    'Saturday Bun Drop — Rabbit Hill Park (Sat, Nov 21)',
    'Christmas Eve Morning Drop (Dec 24)',
    'Christmas Day Celebration Drop (Dec 25)',
    'New Year\'s Eve Midnight Sweet Drop (Dec 31)'
  ];

  const handlePreorderHolidayBundle = () => {
    const caviarSpec =
      selectedHolidayPkg.caviarChoiceCount === 2
        ? ` | Fru-Fru Caviars (Pick 2): ${holidayCaviar1} & ${holidayCaviar2}`
        : selectedHolidayPkg.caviarChoiceCount === 1
        ? ` | Fru-Fru Caviar: ${holidayCaviar1}`
        : '';

    const holidayProduct: Product = {
      id: `${selectedHolidayPkg.id}-${Date.now()}`,
      name: `${selectedHolidayPkg.name} (Holiday Catering)`,
      description: `${selectedHolidayPkg.subtitle} • Frost: ${selectedHolidayPkg.frostIncluded}${caviarSpec} • Pickup: ${holidayDropDate}`,
      price: selectedHolidayPkg.price,
      image: selectedHolidayPkg.image,
      type: 'bun',
      tags: ['Holiday Catering', 'Prepaid Order', selectedHolidayPkg.badge || 'Holiday'],
      color: 'border-brand-ochre/25 text-brand-terracotta bg-orange-50/50'
    };

    setPickupDate(holidayDropDate);
    handleAddToCart(holidayProduct, 1);
    setHolidayBundleAdded(true);
    setTimeout(() => setHolidayBundleAdded(false), 2000);
  };

  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
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
          <div className="mb-10 flex flex-col items-center gap-4">
             <div className="bg-brand-ochre/10 backdrop-blur-xl px-8 py-2 border border-brand-ochre/20 rounded-lg">
                <span className="mono text-brand-ochre text-[10px] font-black uppercase tracking-[0.2em]">
                  Warning: These buns ruin relationships with grocery store cinnamon rolls.
                </span>
             </div>
             
             {/* Saturday Drop Scarcity Badge */}
             <div className="inline-flex items-center space-x-2 bg-brand-terracotta/15 border border-brand-terracotta/25 px-5 py-2 text-brand-terracotta text-[9px] sm:text-[10px] uppercase font-black tracking-[0.25em] rounded-full">
                <span className="inline-block w-2 h-2 rounded-full bg-brand-terracotta animate-ping mr-1" />
                <span>Welcome to the Bun Club • Fresh Every Saturday • Small Batches Only</span>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <button 
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-brand-cream text-brand-ink px-12 py-6 rounded-none font-black uppercase tracking-widest text-xs shadow-2xl transition-all overflow-hidden"
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
            <Link 
              to="/catering"
              className="mono text-brand-cream text-xs font-black uppercase tracking-widest hover:text-brand-ochre transition-colors border-b-2 border-brand-cream/30 pb-2 cursor-pointer"
            >
              Catering
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FEATURED DROP SPOTLIGHT: CAROUSEL (RENDEZVOUS > MINIS > HAPPIER HOLIDAYS) */}
      <div className="max-w-7xl mx-auto w-full px-6 my-12">
        <section className="bg-brand-ink text-brand-cream rounded-3xl overflow-hidden border border-brand-ochre/15 shadow-2xl p-6 md:p-12 relative">
          {/* Dynamic progression accent track matching wizard */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-ochre/10">
            <motion.div 
              className="h-full bg-brand-terracotta" 
              initial={false}
              animate={{ 
                width: spotlightSlide === 0 ? '33.33%' : spotlightSlide === 1 ? '66.66%' : '100%' 
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            />
          </div>

          {/* Carousel Header & Controls Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-8 border-b border-brand-ochre/10">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-[0.3em] block">
                  Featured Spotlight Drop • 0{spotlightSlide + 1} / 03
                </span>
                <span className="mono text-[9px] bg-brand-ochre/15 text-brand-ochre border border-brand-ochre/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                  {SPOTLIGHT_SLIDES[spotlightSlide].badge}
                </span>
              </div>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {SPOTLIGHT_SLIDES.map((slide, index) => {
                  const isActive = spotlightSlide === index;
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setSpotlightSlide(index)}
                      className={`px-3.5 py-1.5 rounded-full mono text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center space-x-2 ${
                        isActive
                          ? 'bg-brand-terracotta text-brand-cream border border-brand-terracotta shadow-md'
                          : 'bg-brand-ink/80 text-brand-cream/60 border border-brand-ochre/20 hover:text-brand-cream hover:border-brand-ochre/50'
                      }`}
                    >
                      <span className="opacity-70">0{index + 1}.</span>
                      <span>{slide.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Carousel Arrow Controls & Indicators */}
            <div className="flex items-center space-x-4 self-start lg:self-center">
              <span className="mono text-[11px] text-brand-cream/50 tracking-widest font-black hidden sm:inline-block">
                SLIDE 0{spotlightSlide + 1} OF 03
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={prevSpotlightSlide}
                  aria-label="Previous Slide"
                  className="w-10 h-10 rounded-full border border-brand-ochre/25 bg-brand-ink/90 text-brand-cream hover:border-brand-ochre hover:text-brand-ochre flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSpotlightSlide}
                  aria-label="Next Slide"
                  className="w-10 h-10 rounded-full border border-brand-ochre/25 bg-brand-ink/90 text-brand-cream hover:border-brand-ochre hover:text-brand-ochre flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-md"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slide Content */}
          <AnimatePresence mode="wait">
            {/* SLIDE 0: HOLIDAY CATERING & HAPPIER HOLIDAYS FLYER */}
            {spotlightSlide === 0 && (
              <motion.div
                key="slide-holidays"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Flyer Artwork Frame with Zoom & Holiday Tagline */}
                  <div className="lg:col-span-6 space-y-4">
                    <div 
                      onClick={() => setIsHolidayFlyerModalOpen(true)}
                      className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-ochre/30 group bg-brand-ink/40 cursor-zoom-in"
                    >
                      <img 
                        src={happierHolidaysFlyer} 
                        alt="Holiday Catering Display: 48-Pan Minis, Secret Frost, & Fru-Fru Caviar Jars" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/90 via-brand-ink/20 to-transparent pointer-events-none" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        <div className="bg-brand-ink/90 backdrop-blur-md text-brand-ochre border border-brand-ochre/30 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest flex items-center space-x-1.5 shadow-lg">
                          <Snowflake className="w-3.5 h-3.5 text-brand-ochre animate-spin-slow" />
                          <span>The Factory Is Taking Holiday Orders</span>
                        </div>
                        <div className="bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/30 px-3 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest shadow-lg">
                          Cutoff: Mon Nov 23 • 8 PM
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsHolidayFlyerModalOpen(true);
                        }}
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-brand-ink/80 text-brand-cream/80 hover:text-brand-ochre hover:bg-brand-ink border border-brand-ochre/30 transition-all cursor-pointer shadow-lg"
                        title="Enlarge Flyer Artwork"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-5 left-5 right-5 z-10 space-y-1.5">
                        <span className="mono text-[9px] text-brand-ochre uppercase font-black tracking-[0.25em] block">
                          Wed Nov 25 Thanksgiving Pickups • Limited Trays
                        </span>
                        <h5 className="serif text-2xl sm:text-3xl font-black text-brand-cream leading-tight">
                          Order Now For <span className="italic text-brand-ochre font-serif">Happier Holidays</span>
                        </h5>
                        <p className="mono text-xs text-brand-cream/90 font-bold tracking-wide">
                          Big celebrations. Bigger buns. Questionable restraint.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-ochre/[0.06] border border-brand-ochre/20 flex items-start gap-3">
                      <span className="serif text-3xl text-brand-ochre font-serif leading-none shrink-0 select-none">“</span>
                      <div>
                        <p className="serif text-base sm:text-lg font-black text-brand-cream italic leading-snug">
                          Baked in full 48-mini baking pans with shared glass jars of Secret Frost &amp; Fru-Fru Caviar.
                        </p>
                        <span className="mono text-[9px] uppercase font-bold text-brand-ochre/80 tracking-wider mt-1 block">
                          Full Menu on Catering Page: Factory 24/48/96/144 • Holiday Feasts • 12/24 Dozens • CinnaCakes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details Card & Holiday Package Picker */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline border-b border-brand-ochre/10 pb-4">
                        <div>
                          <span className="mono text-[10px] text-brand-terracotta uppercase font-black tracking-widest block mb-1">
                            Holiday Catering Drop • Spot 01 / 03
                          </span>
                          <h4 className="serif text-3xl md:text-4xl font-black text-brand-cream uppercase tracking-tight">
                            {selectedHolidayPkg.name}
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="mono text-2xl md:text-3xl font-black text-brand-ochre">
                            ${selectedHolidayPkg.price.toFixed(2)}
                          </span>
                          <span className="mono text-[10px] text-brand-cream/60 block tracking-wider uppercase font-bold">
                            {selectedHolidayPkg.badge}
                          </span>
                        </div>
                      </div>

                      <p className="text-brand-cream/80 text-xs md:text-sm leading-relaxed">
                        {selectedHolidayPkg.description}
                      </p>

                      {/* Anchor Packages Selector */}
                      <div className="space-y-2">
                        <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                          Select Featured Holiday Package:
                        </span>
                        <div className="grid grid-cols-2 gap-2.5">
                          {SPOTLIGHT_HOLIDAY_PACKAGES.map((pkg) => {
                            const isSelected = selectedHolidayPkgId === pkg.id;
                            return (
                              <button
                                key={pkg.id}
                                onClick={() => setSelectedHolidayPkgId(pkg.id)}
                                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'border-brand-terracotta bg-brand-terracotta/15 text-brand-cream shadow-lg ring-1 ring-brand-terracotta/40'
                                    : 'border-brand-ochre/20 bg-brand-ink/60 hover:border-brand-ochre/50 text-brand-cream/75'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="mono text-[8px] font-black uppercase tracking-wider text-brand-ochre">
                                    {pkg.badge}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-terracotta" />}
                                </div>
                                <span className="serif text-sm font-black text-brand-cream leading-tight">
                                  {pkg.name}
                                </span>
                                <span className="mono text-[10px] text-brand-cream/55 mt-0.5 line-clamp-1">
                                  {pkg.subtitle}
                                </span>
                                <span className="mono text-xs font-black text-brand-ochre mt-1.5">
                                  ${pkg.price.toFixed(2)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Caviar Picker if Feast or CinnaCake+Caviar */}
                      {selectedHolidayPkg.caviarChoiceCount > 0 && (
                        <div className="p-4 rounded-2xl border border-brand-ochre/20 bg-brand-ochre/[0.04] space-y-3">
                          <span className="mono text-[10px] font-black uppercase tracking-widest text-brand-ochre flex items-center gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-brand-ochre" />
                            <span>
                              Choose Your {selectedHolidayPkg.caviarChoiceCount === 2 ? 'Two' : ''} Thanksgiving Fru-Fru Caviar
                              {selectedHolidayPkg.caviarChoiceCount === 2 ? 's' : ''}:
                            </span>
                          </span>
                          <div className={`grid grid-cols-1 ${selectedHolidayPkg.caviarChoiceCount === 2 ? 'sm:grid-cols-2' : ''} gap-2.5`}>
                            <select
                              value={holidayCaviar1}
                              onChange={(e) => setHolidayCaviar1(e.target.value)}
                              className="w-full bg-brand-ink/90 border border-brand-ochre/20 text-brand-cream rounded-xl px-3 py-2 text-xs font-semibold focus:border-brand-ochre focus:outline-none cursor-pointer"
                            >
                              {THANKSGIVING_CAVIAR_FLAVORS.map((fl) => (
                                <option key={fl} value={fl} className="bg-brand-ink text-brand-cream">
                                  Caviar #1: {fl}
                                </option>
                              ))}
                            </select>

                            {selectedHolidayPkg.caviarChoiceCount === 2 && (
                              <select
                                value={holidayCaviar2}
                                onChange={(e) => setHolidayCaviar2(e.target.value)}
                                className="w-full bg-brand-ink/90 border border-brand-ochre/20 text-brand-cream rounded-xl px-3 py-2 text-xs font-semibold focus:border-brand-ochre focus:outline-none cursor-pointer"
                              >
                                {THANKSGIVING_CAVIAR_FLAVORS.map((fl) => (
                                  <option key={fl} value={fl} className="bg-brand-ink text-brand-cream">
                                    Caviar #2: {fl}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Drop Reservation Date Selector */}
                      <div className="space-y-2 pt-1 border-t border-brand-ochre/10">
                        <label className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest flex items-center justify-between">
                          <span>Choose Holiday Pickup Date:</span>
                          <span className="text-brand-cream/60 mono text-[9px] font-normal">Prepaid Reservation</span>
                        </label>
                        <select
                          value={holidayDropDate}
                          onChange={(e) => setHolidayDropDate(e.target.value)}
                          className="w-full bg-brand-ink/90 border border-brand-ochre/20 text-brand-cream rounded-xl px-3.5 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-ochre focus:border-brand-ochre focus:outline-none cursor-pointer hover:border-brand-ochre/40 transition-colors shadow-inner"
                        >
                          {HOLIDAY_DROP_DATES.map((date) => (
                            <option key={date} value={date} className="bg-brand-ink text-brand-cream">
                              {date}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Pre-Order Action Buttons */}
                    <div className="space-y-3 pt-1">
                      <button
                        onClick={handlePreorderHolidayBundle}
                        className={`w-full py-5 rounded-2xl font-mono font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-xl ${
                          holidayBundleAdded
                            ? 'bg-emerald-600 text-brand-cream'
                            : 'bg-brand-terracotta hover:bg-brand-ochre text-brand-cream hover:text-brand-ink'
                        }`}
                      >
                        {holidayBundleAdded ? (
                          <>
                            <Check className="w-4 h-4 text-brand-cream" />
                            <span>✓ Added {selectedHolidayPkg.name} to Order!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Pre-Order {selectedHolidayPkg.name} — ${selectedHolidayPkg.price.toFixed(2)}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-[10px] mono text-brand-cream/70 px-1">
                        <Link
                          to="/catering"
                          className="text-brand-ochre hover:text-brand-cream transition-colors uppercase font-bold flex items-center gap-1"
                        >
                          <span>See All Holiday Trays &amp; Feasts →</span>
                        </Link>
                        <button
                          onClick={() => setSpotlightSlide(1)}
                          className="text-brand-cream/70 hover:text-brand-ochre transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Next: The Minis →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 1: THE MINIS (48-PAN & SQUARE MENU EDITIONS) */}
            {spotlightSlide === 1 && (
              <motion.div
                key="slide-minis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Photo Container with View Toggle & Selected Quip Callout */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-ochre/20 group bg-brand-ink/40">
                      <img 
                        src={miniView === 'tray' ? miniBunTraySide : cinnabitesChopped} 
                        alt="The Minis - Golden Bite-Sized Cinnamon Roll Trays" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        <div className="bg-brand-ink/90 backdrop-blur-md text-brand-ochre border border-brand-ochre/30 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest flex items-center space-x-1.5 shadow-lg">
                          <Star className="w-3 h-3 fill-brand-ochre" />
                          <span>48-Pan Factory Standard</span>
                        </div>
                        <div className="bg-brand-terracotta/90 backdrop-blur-md text-brand-cream border border-brand-terracotta/40 px-3 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest shadow-lg">
                          {selectedMiniPack.count}-Pack Selected
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-brand-ink/90 backdrop-blur-md p-1 rounded-full border border-brand-ochre/20">
                        <button
                          onClick={() => setMiniView('tray')}
                          className={`px-3 py-1 rounded-full text-[9px] mono uppercase font-black transition-all cursor-pointer ${
                            miniView === 'tray'
                              ? 'bg-brand-terracotta text-brand-cream shadow'
                              : 'text-brand-cream/70 hover:text-brand-cream'
                          }`}
                        >
                          Tray View
                        </button>
                        <button
                          onClick={() => setMiniView('bites')}
                          className={`px-3 py-1 rounded-full text-[9px] mono uppercase font-black transition-all cursor-pointer ${
                            miniView === 'bites'
                              ? 'bg-brand-terracotta text-brand-cream shadow'
                              : 'text-brand-cream/70 hover:text-brand-cream'
                          }`}
                        >
                          Bite View
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-brand-ochre/[0.06] border border-brand-ochre/20 flex items-start gap-3">
                      <span className="serif text-3xl text-brand-ochre font-serif leading-none shrink-0 select-none">“</span>
                      <div>
                        <p className="serif text-base sm:text-lg font-black text-brand-cream italic leading-snug">
                          {selectedMiniPack.quip}
                        </p>
                        <span className="mono text-[9px] uppercase font-bold text-brand-ochre/80 tracking-wider mt-1 block">
                          Official {selectedMiniPack.name} Quip • {selectedMiniPack.dippersIncluded}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details & Interactive Pack Selection */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-5">
                      <div className="flex justify-between items-baseline border-b border-brand-ochre/10 pb-4">
                        <div>
                          <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block mb-1">
                            Bite-Sized Collection • Spot 02 / 03
                          </span>
                          <h4 className="serif text-3xl md:text-4xl font-black text-brand-cream uppercase tracking-tight">
                            The <span className="italic text-brand-ochre font-serif">Minis</span>
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="mono text-2xl md:text-3xl font-black text-brand-ochre">
                            ${selectedMiniPack.price.toFixed(2)}
                          </span>
                          <span className="mono text-[10px] text-brand-cream/50 block tracking-wider uppercase font-bold">
                            {selectedMiniPack.count} Fresh Minis
                          </span>
                        </div>
                      </div>

                      <p className="text-brand-cream/80 text-xs md:text-sm leading-relaxed">
                        {selectedMiniPack.description} Baked golden-brown from our signature Tangzhong Japanese milk dough and glazed with velvety Secret Frost.
                      </p>

                      {/* 6 Pack Sizes Grid */}
                      <div className="space-y-2.5 pt-1">
                        <div className="flex justify-between items-center">
                          <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                            Choose Pack Size (Drop &amp; Pan Sizes):
                          </span>
                          <span className="mono text-[9px] text-brand-cream/50 uppercase">
                            {selectedMiniPack.badge}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {MINI_PACKS.map((pack) => {
                            const isSelected = selectedMiniPackId === pack.id;
                            return (
                              <button
                                key={pack.id}
                                onClick={() => setSelectedMiniPackId(pack.id)}
                                className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer relative ${
                                  isSelected
                                    ? 'border-brand-terracotta bg-brand-terracotta/15 text-brand-cream shadow-lg ring-1 ring-brand-terracotta/40'
                                    : 'border-brand-ochre/20 bg-brand-ink/60 hover:border-brand-ochre/50 hover:bg-white/[0.02] text-brand-cream/70'
                                }`}
                              >
                                {pack.popular && (
                                  <span className="absolute -top-2 right-2 bg-brand-terracotta text-brand-cream font-mono text-[7px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full shadow">
                                    Pop
                                  </span>
                                )}
                                <div className="flex justify-between items-center mb-1">
                                  <span className="mono text-[8px] font-black uppercase tracking-wider text-brand-ochre">
                                    {pack.badge}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-terracotta" />}
                                </div>
                                <span className="serif text-sm font-black block text-brand-cream leading-tight">
                                  {pack.name}
                                </span>
                                <span className="mono text-[10px] text-brand-cream/50 mt-0.5">
                                  {pack.count} buns
                                </span>
                                <span className="mono text-xs font-black text-brand-ochre mt-1.5">
                                  ${pack.price.toFixed(2)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dipper Accompaniment Selection */}
                      <div className="space-y-2 pt-2 border-t border-brand-ochre/10">
                        <div className="flex items-center justify-between">
                          <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                            Select Frost / Dipper ({selectedMiniPack.dippersIncluded}):
                          </span>
                          <span className="mono text-[9px] text-emerald-400 font-bold">Included</span>
                        </div>
                        <select
                          value={selectedMiniDipper}
                          onChange={(e) => setSelectedMiniDipper(e.target.value)}
                          className="w-full bg-brand-ink/90 border border-brand-ochre/20 text-brand-cream rounded-xl px-3 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-brand-ochre focus:border-brand-ochre focus:outline-none cursor-pointer hover:border-brand-ochre/40 transition-colors shadow-inner"
                        >
                          {MINI_DIPPER_OPTIONS.map((opt) => (
                            <option key={opt} value={opt} className="bg-brand-ink text-brand-cream">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="p-3 rounded-xl bg-brand-ochre/[0.04] border border-brand-ochre/15 text-xs flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-brand-terracotta shrink-0" />
                          <span className="text-brand-cream/90 font-medium">
                            {selectedMiniPack.name} + {selectedMiniPack.dippersIncluded}
                          </span>
                        </div>
                        <span className="mono text-xs font-black text-brand-ochre">
                          ${selectedMiniPack.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        onClick={() => handleAddMini()}
                        className={`w-full py-5 rounded-2xl font-mono font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-xl ${
                          miniAdded
                            ? 'bg-emerald-600 text-brand-cream'
                            : 'bg-brand-terracotta hover:bg-brand-ochre text-brand-cream hover:text-brand-ink'
                        }`}
                      >
                        {miniAdded ? (
                          <>
                            <Check className="w-4 h-4 text-brand-cream" />
                            <span>✓ Added {selectedMiniPack.name} to Box!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add {selectedMiniPack.name} to Box — ${selectedMiniPack.price.toFixed(2)}</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-[10px] mono text-brand-cream/60 px-1">
                        <button
                          onClick={() => {
                            document.getElementById('minis-menu-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="text-brand-ochre hover:text-brand-cream transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Explore All 6 Sizes On Menu ↓</span>
                        </button>
                        <button
                          onClick={() => setSpotlightSlide(2)}
                          className="text-brand-cream/70 hover:text-brand-ochre transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>Next: The Rendezvous →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 2: THE RENDEZVOUS */}
            {spotlightSlide === 2 && (
              <motion.div
                key="slide-rendezvous"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Square Photo Container */}
                  <div className="lg:col-span-6">
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-2 border-brand-ochre/20 group bg-brand-ink/40">
                      <img 
                        src={duoFeaturedDuoSet} 
                        alt="The Rendezvous - Opened Luxury Gift Box with Frosted Rolls & Glass Companion Jars" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      />
                      <div className="absolute top-4 left-4 bg-brand-ink/90 backdrop-blur-md text-brand-ochre border border-brand-ochre/30 px-3.5 py-1.5 rounded-full text-[9px] font-mono font-black uppercase tracking-widest flex items-center space-x-1.5 shadow-lg">
                        <Star className="w-3 h-3 fill-brand-ochre" />
                        <span>Square Edition Flight • Spot 03 / 03</span>
                      </div>
                    </div>
                  </div>

                  {/* Details & Variant Selection */}
                  <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline border-b border-brand-ochre/10 pb-4">
                        <div>
                          <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block mb-1">
                            Selected Flight Variant • Spot 03 / 03
                          </span>
                          <h4 className="serif text-2xl font-black text-brand-cream uppercase tracking-tight">{selectedRendezvousVariant.name}</h4>
                        </div>
                        <span className="mono text-2xl md:text-3xl font-black text-brand-ochre">
                          ${selectedRendezvousVariant.price.toFixed(2)}
                        </span>
                      </div>

                      <p className="text-brand-cream/70 text-xs md:text-sm leading-relaxed">
                        {selectedRendezvousVariant.description}
                      </p>

                      {/* Custom Bun & Companion Dropdown Selection Lists */}
                      <div className="space-y-4 pt-2 border-t border-brand-ochre/10">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-3.5 h-3.5 text-brand-ochre" />
                          <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest block">
                            Customize Your Selection ({rollCount} Rolls & {jarCount} {isJarType ? 'Coupe Jars (8 oz)' : 'Petit Cups (3.5 oz)'}):
                          </span>
                        </div>

                        <div className="space-y-2">
                          <span className="mono text-[9px] uppercase font-black text-brand-cream/50 tracking-wider block">
                            Select {rollCount} Bun Flavors:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {Array.from({ length: rollCount }).map((_, i) => (
                              <div key={`bun-select-${i}`} className="space-y-1">
                                <label className="mono text-[9px] uppercase font-black text-brand-cream/80 flex items-center justify-between">
                                  <span>Bun #{i + 1}</span>
                                  <span className="text-brand-ochre">★ Roll</span>
                                </label>
                                <select
                                  value={selectedBuns[i] || BUN_FLAVOR_OPTIONS[0]}
                                  onChange={(e) => handleBunChange(i, e.target.value)}
                                  className="w-full bg-brand-ink/90 border border-brand-ochre/20 text-brand-cream rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-ochre focus:border-brand-ochre focus:outline-none cursor-pointer hover:border-brand-ochre/40 transition-colors shadow-inner"
                                >
                                  {BUN_FLAVOR_OPTIONS.map((flavor) => (
                                    <option key={flavor} value={flavor} className="bg-brand-ink text-brand-cream">
                                      {flavor}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 pt-1">
                          <span className="mono text-[9px] uppercase font-black text-brand-cream/50 tracking-wider block">
                            Select {jarCount} {isJarType ? 'Coupe de Frost / Caviar Jars (8 oz)' : 'Petit de Frost / Caviar Cups (3.5 oz)'}:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {Array.from({ length: jarCount }).map((_, i) => (
                              <div key={`jar-select-${i}`} className="space-y-1">
                                <label className="mono text-[9px] uppercase font-black text-brand-cream/80 flex items-center justify-between">
                                  <span>Companion #{i + 1}</span>
                                  <span className="text-brand-terracotta">{companionLabel}</span>
                                </label>
                                <select
                                  value={selectedJars[i] || currentCompanionOptions[0]}
                                  onChange={(e) => handleJarChange(i, e.target.value)}
                                  className="w-full bg-brand-ink/90 border border-brand-ochre/20 text-brand-cream rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-brand-ochre focus:border-brand-ochre focus:outline-none cursor-pointer hover:border-brand-ochre/40 transition-colors shadow-inner"
                                >
                                  {currentCompanionOptions.map((opt) => (
                                    <option key={opt} value={opt} className="bg-brand-ink text-brand-cream">
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-brand-ochre/10">
                        <span className="mono text-[9px] text-brand-cream/50 uppercase font-black tracking-widest block">
                          Your Selection Summary ({rollCount} Rolls + {jarCount} {isJarType ? 'Coupe Jars (8 oz)' : 'Petit Cups (3.5 oz)'}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-brand-cream">
                          {selectedBuns.slice(0, rollCount).map((bun, idx) => (
                            <div key={`summary-bun-${idx}`} className="flex items-center space-x-2 bg-brand-ochre/[0.04] p-2.5 rounded-xl border border-brand-ochre/15">
                              <Check className="w-4 h-4 text-brand-ochre shrink-0" />
                              <span className="truncate">Roll {idx + 1}: {bun}</span>
                            </div>
                          ))}
                          {selectedJars.slice(0, jarCount).map((jar, idx) => (
                            <div key={`summary-jar-${idx}`} className="flex items-center space-x-2 bg-brand-ochre/[0.04] p-2.5 rounded-xl border border-brand-ochre/15">
                              <Check className="w-4 h-4 text-brand-terracotta shrink-0" />
                              <span className="truncate">{isJarType ? 'Coupe' : 'Petit'} {idx + 1}: {jar}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <span className="mono text-[9px] text-brand-cream/50 uppercase font-black tracking-widest block">
                          Choose Size & Pricing Variant:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {RENDEZVOUS_VARIANTS.map((variant) => {
                            const isSelected = rendezvousVariant === variant.id;
                            return (
                              <button
                                key={variant.id}
                                onClick={() => setRendezvousVariant(variant.id as any)}
                                className={`p-3.5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                                  isSelected
                                    ? 'border-brand-terracotta bg-brand-terracotta/10 text-brand-cream shadow-lg ring-1 ring-brand-terracotta/40'
                                    : 'border-brand-ochre/20 bg-brand-ink/60 hover:border-brand-ochre/50 hover:bg-white/[0.02] text-brand-cream/70'
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="mono text-[8px] font-black uppercase tracking-wider text-brand-ochre">
                                    {variant.badge}
                                  </span>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-terracotta" />}
                                </div>
                                <span className="serif text-xs font-black block text-brand-cream leading-tight uppercase">{variant.name}</span>
                                <span className="mono text-[10px] text-brand-cream/50 mt-1">{variant.rollsCount}</span>
                                <span className="mono text-xs font-black text-brand-ochre mt-2">${variant.price.toFixed(2)}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={handleAddRendezvous}
                        className={`w-full py-5 rounded-2xl font-mono font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 cursor-pointer shadow-xl ${
                          rendezvousAdded
                            ? 'bg-emerald-600 text-brand-cream'
                            : 'bg-brand-terracotta hover:bg-brand-ochre text-brand-cream hover:text-brand-ink'
                        }`}
                      >
                        {rendezvousAdded ? (
                          <>
                            <Check className="w-4 h-4 text-brand-cream" />
                            <span>✓ Added The Rendezvous to Box!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add The Rendezvous to Box — ${selectedRendezvousVariant.price.toFixed(2)}</span>
                          </>
                        )}
                      </button>
                      <div className="flex justify-end px-1">
                        <button
                          onClick={() => setSpotlightSlide(0)}
                          className="mono text-[10px] text-brand-cream/70 hover:text-brand-ochre transition-colors uppercase font-bold cursor-pointer"
                        >
                          ← Back to Holiday Orders (Spot 01)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Dot Indicators */}
          <div className="flex items-center justify-center space-x-2.5 mt-10 pt-6 border-t border-brand-ochre/10">
            {SPOTLIGHT_SLIDES.map((slide, index) => {
              const isActive = spotlightSlide === index;
              return (
                <button
                  key={`dot-${slide.id}`}
                  onClick={() => setSpotlightSlide(index)}
                  aria-label={`Jump to ${slide.title}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    isActive
                      ? 'w-8 h-2 bg-brand-terracotta'
                      : 'w-2 h-2 bg-brand-ochre/30 hover:bg-brand-ochre/60'
                  }`}
                />
              );
            })}
          </div>
        </section>
      </div>

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

          {/* Holiday Flyer Fullscreen Lightbox Modal */}
          {isHolidayFlyerModalOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHolidayFlyerModalOpen(false)}
              className="fixed inset-0 z-50 bg-brand-ink/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out"
            >
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHolidayFlyerModalOpen(false);
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
                className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-brand-ink border-2 border-brand-ochre/30 select-none shadow-2xl flex flex-col items-center"
              >
                <img 
                  src={happierHolidaysFlyer} 
                  alt="Happier Holidays Festive Spread Full Screen" 
                  className="max-h-[72vh] w-auto h-auto object-contain"
                />
                <div className="w-full bg-brand-ink p-6 border-t border-brand-ochre/20 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                  <div>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <span className="mono text-[9px] uppercase font-black text-brand-ochre tracking-widest bg-brand-ochre/15 px-2 py-0.5 rounded-full border border-brand-ochre/20">
                        Winter Holiday Special
                      </span>
                    </div>
                    <h4 className="serif text-xl font-black text-brand-cream uppercase">Order Now for Happier Holidays</h4>
                    <p className="text-xs text-brand-cream/80 font-mono mt-0.5 italic">"Don't forget to order some for the family! 🤣"</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        handlePreorderHolidayBundle();
                        setIsHolidayFlyerModalOpen(false);
                      }}
                      className="bg-brand-terracotta text-brand-cream px-6 py-3 font-mono font-black text-[10px] uppercase tracking-widest hover:bg-brand-ochre hover:text-brand-ink transition-all duration-300 shadow-md cursor-pointer rounded-xl flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Pre-Order {selectedHolidayPkg.name} (${selectedHolidayPkg.price.toFixed(2)})</span>
                    </button>
                  </div>
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

        {/* The Minis Collection (Square Menu Favorites) */}
        <section id="minis-menu-section" className="mb-36 border-t border-brand-sand/20 pt-28">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-brand-ochre/15 border border-brand-ochre/30 px-4 py-1.5 rounded-full">
              <Star className="w-3.5 h-3.5 text-brand-terracotta fill-brand-terracotta" />
              <span className="mono text-brand-terracotta text-[10px] font-black uppercase tracking-[0.3em]">
                Square Menu Favorites • Bite-Sized Trays
              </span>
            </div>
            <h3 className="serif text-5xl md:text-7xl font-black text-brand-ink uppercase tracking-tighter">
              The <span className="text-brand-terracotta italic font-normal">Minis</span> Collection
            </h3>
            <div className="w-24 h-[2px] bg-brand-terracotta" />
            <p className="text-brand-ink/75 font-medium text-xs sm:text-sm max-w-xl leading-relaxed">
              Bite-sized cinnamon perfection baked golden brown, glazed with warm Secret Frost cream whip, and packaged in convenient sharing trays with generous dipping cups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
            {MINI_PACKS.map((pack) => {
              const isAdded = !!addedMiniPacks[pack.id];
              return (
                <div
                  key={pack.id}
                  className="bg-white border border-brand-sand/30 overflow-hidden flex flex-col justify-between group hover:shadow-2xl hover:border-brand-terracotta/30 transition-all duration-500 rounded-3xl relative shadow-sm"
                >
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
                    <span className="bg-brand-ink text-brand-ochre text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                      {pack.badge || `${pack.count}-Pack`}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-brand-terracotta text-brand-cream text-[9px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {pack.count} Minis
                    </span>
                  </div>

                  {/* Photo Container */}
                  <div className="aspect-[16/10] overflow-hidden relative bg-brand-cream/20">
                    <img
                      src={miniBunTraySide}
                      alt={pack.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-brand-ink/5 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  {/* Content & Quip */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-3.5">
                      <div className="flex justify-between items-baseline gap-2">
                        <h4 className="serif text-xl font-black text-brand-ink group-hover:text-brand-terracotta transition-colors">
                          {pack.name}
                        </h4>
                        <span className="mono text-base font-black text-brand-ochre shrink-0">
                          ${pack.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Quip Callout */}
                      <div className="p-3.5 rounded-2xl bg-brand-cream/60 border border-brand-sand/30 relative">
                        <span className="serif text-2xl text-brand-terracotta font-serif leading-none block mb-0.5 select-none">“</span>
                        <p className="serif text-sm font-black italic text-brand-ink leading-snug">
                          {pack.quip}
                        </p>
                      </div>

                      <p className="text-brand-ink/70 text-xs leading-relaxed">
                        {pack.description}
                      </p>

                      <div className="flex items-center space-x-2 text-[10px] mono text-brand-terracotta font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-brand-terracotta shrink-0" />
                        <span>{pack.dippersIncluded}</span>
                      </div>
                    </div>

                    {/* Add to Box Button */}
                    <button
                      onClick={() => handleAddMini(pack)}
                      className={`w-full py-3.5 font-mono font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer rounded-xl ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-brand-ink text-brand-cream hover:bg-brand-terracotta hover:text-brand-cream'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 animate-bounce" />
                          <span>Added {pack.name} to Box!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-brand-ochre" />
                          <span>Add to Order — ${pack.price.toFixed(2)}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vault Jars & Secret Frost Series Showcase Section */}
        <section className="mb-48 border-t border-brand-sand/20 pt-32">
          <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
            <span className="mono text-brand-terracotta text-sm font-black uppercase tracking-[0.4em]">Liquid Luxury Toppings</span>
            <h3 className="serif text-4xl md:text-6xl font-black text-brand-ink uppercase tracking-tighter">The Topping Vault Jars</h3>
            <div className="w-16 h-[2px] bg-brand-terracotta" />
            <p className="text-brand-ink/70 text-sm max-w-xl leading-relaxed animate-pulse">
              Our signature slow-simmered Fru-Fru Caviars and Velvety Secret Frost whips are available in curated 8 oz, 16 oz, and 32 oz glass jars for home &amp; holiday tables.
              <br/>
              <span className="font-extrabold text-brand-terracotta">Le Petit Duo — $5 (Any 2 Petit 3.5 oz Cups)</span> Added automatically on Saturday drop cups.
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

        {/* The Bobby's Promise Section */}
        <section className="mt-32 bg-brand-ink text-brand-cream py-16 px-8 md:px-16 border border-brand-ochre/15 rounded-[3.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12 pointer-events-none">
            <GearLogo className="w-64 h-64" />
          </div>
          
          <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-brand-ochre/10 border border-brand-ochre/20 px-4 py-1.5 rounded-full">
              <span className="text-brand-ochre text-sm">🤝</span>
              <span className="mono text-brand-ochre text-[9px] uppercase font-black tracking-widest">Trust & Family Heritage</span>
            </div>
            
            <h3 className="serif text-4xl md:text-5xl font-black tracking-tight text-brand-cream">The Bobby’s Promise</h3>
            
            <p className="text-lg md:text-xl text-brand-cream/80 max-w-2xl mx-auto font-medium leading-relaxed">
              Every Bun is baked fresh. Every topping is made in-house. No frozen shortcuts. <br className="hidden md:inline" />
              <span className="text-brand-ochre italic font-semibold">"If it isn't good enough for our family, it doesn't leave the kitchen."</span>
            </p>
            
            <div className="flex items-center justify-center space-x-4 pt-4">
              <div className="w-16 h-[1px] bg-brand-ochre/35" />
              <span className="mono text-[8px] text-[#FFFBF5]/60 uppercase tracking-[0.3em] font-bold">Baked Fresh & Simmered Lovingly</span>
              <div className="w-16 h-[1px] bg-brand-ochre/35" />
            </div>
          </div>
        </section>

        {/* High-Impact Social Proof / Testimonials Row (Moved to Bottom) */}
        <section className="mt-20 bg-white border border-brand-sand/30 py-12 px-6 rounded-[2.5rem] shadow-xl overflow-hidden select-none">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center text-center mb-8">
              <div className="flex items-center space-x-1 text-brand-terracotta mb-2">
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
                <span className="text-xl">★</span>
              </div>
              <p className="mono text-brand-ochre text-[10px] font-extrabold uppercase tracking-widest">Trusted By Thousands of Bun Lovers • 4.9/5 stars</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-brand-cream/35 p-6 border border-brand-sand/20 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all">
                <p className="text-brand-ink/80 text-sm font-semibold italic leading-relaxed">
                  "The fluffiest cinnamon roll I've ever had in my entire life. Literally worth every single calorie."
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-brand-sand/10 pt-3">
                  <span className="text-brand-ink text-xs font-black uppercase tracking-wider">— Marcus D.</span>
                  <span className="text-[8px] uppercase font-bold text-brand-terracotta bg-brand-terracotta/10 px-2 py-0.5 rounded">Verified Fan</span>
                </div>
              </div>
              
              <div className="bg-brand-cream/35 p-6 border border-brand-sand/20 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all relative">
                <div className="absolute -top-3 right-4 bg-brand-ochre text-brand-ink text-[7px] font-black uppercase tracking-widest px-2.5 py-1 shadow-md">
                  🏆 Top Rated
                </div>
                <p className="text-brand-ink/80 text-sm font-semibold italic leading-relaxed">
                  "The Peach Outlaw is Georgia gold. You can taste that everything is slow-simmered in-house with absolutely no shortcuts!"
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-brand-sand/10 pt-3">
                  <span className="text-brand-ink text-xs font-black uppercase tracking-wider">— Sarah L.</span>
                  <span className="text-[8px] uppercase font-bold text-brand-terracotta bg-brand-terracotta/10 px-2 py-0.5 rounded">Peach Addict</span>
                </div>
              </div>
              
              <div className="bg-brand-cream/35 p-6 border border-brand-sand/20 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all">
                <p className="text-brand-ink/80 text-sm font-semibold italic leading-relaxed">
                  "Once they are sold out, they're sold out until next Saturday. I have to set an alarm because they go in minutes!"
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-brand-sand/10 pt-3">
                  <span className="text-brand-ink text-xs font-black uppercase tracking-wider">— Jason K.</span>
                  <span className="text-[8px] uppercase font-bold text-brand-terracotta bg-brand-terracotta/10 px-2 py-0.5 rounded">Sat Club</span>
                </div>
              </div>
            </div>
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
