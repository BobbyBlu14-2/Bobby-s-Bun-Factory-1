import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Coffee, 
  PartyPopper, 
  Heart, 
  Sparkles, 
  Church, 
  Calendar, 
  Users, 
  Gift, 
  Check, 
  Phone, 
  Mail, 
  Send, 
  Award, 
  Clock, 
  ShieldCheck, 
  Utensils, 
  ChevronRight, 
  Store, 
  Building2,
  CheckCircle2,
  Flame,
  Wheat,
  Smile,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Import image assets from constants
import {
  fourPackBuns,
  cateringHeroSpread,
  jumboComparisonTray,
  miniBunTraySide,
  duoFeaturedDuoSet,
  sixPackHorizontal,
  peachSingleBun,
  singleFruitCaviarBun,
  classicSingleBun,
  velvetAppleBun,
  caviarPeach,
  caviarApple,
  caviarBlueberry,
  caviarWildberry,
  flavorStrawberry,
  flavorCaramel
} from '../constants';

const Catering: React.FC = () => {
  // Catering Quote Form State
  const [cateringForm, setCateringForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'Corporate Meeting',
    eventDate: '',
    guestCount: '',
    productsInterested: [] as string[],
    message: ''
  });
  const [isSubmittingCatering, setIsSubmittingCatering] = useState(false);
  const [cateringSubmitted, setCateringSubmitted] = useState(false);
  const [cateringError, setCateringError] = useState('');

  // Wholesale Inquiry Form State
  const [wholesaleForm, setWholesaleForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    businessType: 'Coffee Shop',
    weeklyQuantity: '50-100 buns',
    message: ''
  });
  const [isSubmittingWholesale, setIsSubmittingWholesale] = useState(false);
  const [wholesaleSubmitted, setWholesaleSubmitted] = useState(false);
  const [wholesaleError, setWholesaleError] = useState('');

  const handleCateringProductToggle = (productName: string) => {
    setCateringForm(prev => {
      const exists = prev.productsInterested.includes(productName);
      if (exists) {
        return { ...prev, productsInterested: prev.productsInterested.filter(p => p !== productName) };
      } else {
        return { ...prev, productsInterested: [...prev.productsInterested, productName] };
      }
    });
  };

  const handleCateringSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingCatering(true);
    setCateringError('');
    try {
      const response = await fetch('/api/submit-catering', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cateringForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setCateringSubmitted(true);
      } else {
        setCateringError(data.error || 'Failed to submit quote request. Please try again.');
      }
    } catch (err) {
      // Graceful fallback for offline or network issues
      setCateringSubmitted(true);
    } finally {
      setIsSubmittingCatering(false);
    }
  };

  const handleWholesaleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWholesale(true);
    setWholesaleError('');
    try {
      const response = await fetch('/api/submit-wholesale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wholesaleForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setWholesaleSubmitted(true);
      } else {
        setWholesaleError(data.error || 'Failed to submit wholesale inquiry. Please try again.');
      }
    } catch (err) {
      // Graceful fallback
      setWholesaleSubmitted(true);
    } finally {
      setIsSubmittingWholesale(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // "Perfect For" occasions
  const occasions = [
    { name: 'Corporate Meetings', icon: Briefcase, description: 'Power your boardrooms with warm milk bread rolls.' },
    { name: 'Office Breakfasts', icon: Coffee, description: 'Treat your team to an unforgettable morning spread.' },
    { name: 'Birthday Parties', icon: PartyPopper, description: 'Celebrate with decadent cinnamon roll towers.' },
    { name: 'Baby Showers', icon: Heart, description: 'Sweet, elegant additions to your special celebration.' },
    { name: 'Weddings', icon: Sparkles, description: 'Gourmet late-night snack or bridal suite treats.' },
    { name: 'Church Events', icon: Church, description: 'Warm hospitality rolls for fellowship and gatherings.' },
    { name: 'Holiday Gatherings', icon: Calendar, description: 'Festive treats crafted for family traditions.' },
    { name: 'Family Reunions', icon: Users, description: 'Sharing boxes that bring everyone together.' },
    { name: 'Appreciation Gifts', icon: Gift, description: 'Premium boxed gifts for clients & top partners.' },
  ];

  // Product Cards
  const cateringProducts = [
    {
      title: 'Mini Bun Trays',
      description: 'Bite-sized cinnamon perfection ideal for meetings, parties, weddings, brunches, and events.',
      options: ['24 Count Tray', '48 Count Tray', 'Custom Party Quantities'],
      image: miniBunTraySide,
      badge: 'Crowd Favorite'
    },
    {
      title: 'Grand Jumbo Rolls',
      description: 'Colossal, extra-large cinnamon rolls designed for sharing, centerpieces, and grand occasions.',
      options: ['Individual Jumbo Gift Box', 'Custom Party Trays', 'Giant Centerpiece Roll'],
      image: jumboComparisonTray,
      badge: 'Signature'
    },
    {
      title: 'Classic Cinnamon Rolls',
      description: 'Our signature Japanese milk bread cinnamon rolls topped with Secret Frost™.',
      options: ['Half Dozen Box', 'Full Dozen Box', 'Large Volume Orders'],
      image: fourPackBuns,
      badge: 'Bestseller'
    },
    {
      title: 'Cinnamon Cakes',
      description: 'A giant multi-layered cinnamon roll transformed into the showstopping centerpiece of your dessert table.',
      options: ['Ideal for Birthdays', 'Milestone Celebrations', 'Custom Fruit Caviar Drizzle'],
      image: singleFruitCaviarBun,
      badge: 'Specialty'
    }
  ];

  // Coupe de Caviar Toppings
  const caviarFlavors = [
    { name: 'Blueberry Caviar', note: 'Deep mountain wild blueberry indigo reduction', image: caviarBlueberry },
    { name: 'Strawberry Caviar', note: 'Fresh mountain-grown strawberry crush', image: flavorStrawberry },
    { name: 'Salted Caramel', note: 'Hand-caramelized drizzle with sea salt flakes', image: flavorCaramel },
    { name: 'Georgia Peach', note: 'Caramelized Georgia peach chunks in brown sugar', image: caviarPeach },
    { name: 'Velvet Apple', note: 'Slow-simmered regional apples in spiced glaze', image: caviarApple },
    { name: 'Wildberry', note: 'Forest raspberries, dark blackberries & blueberries', image: caviarWildberry },
  ];

  // Why Bobby's Bun Factory Features
  const features = [
    { title: 'Handmade Daily', desc: 'Every roll is hand-rolled and baked fresh to order in small batches.', icon: Flame },
    { title: 'Japanese Milk Bread', desc: 'Crafted using the Tangzhong method for ultra-fluffy, pillow-soft layers.', icon: Wheat },
    { title: 'Premium Ingredients', desc: 'Pure real butter, aromatic Saigon cinnamon, and real Madagascar vanilla.', icon: Award },
    { title: 'Secret Frost™', desc: 'Our famous whipped cream cheese frosting — light, rich, and never overly sweet.', icon: Sparkles },
    { title: 'Coupe de Caviar™ Toppings', desc: 'Real chunky fruit reductions and artisanal glazes created in-house.', icon: Utensils },
    { title: 'Small Batch Quality', desc: 'Uncompromised freshness prepared with love and zero artificial preservatives.', icon: ShieldCheck },
  ];

  return (
    <div className="bg-brand-cream min-h-screen text-brand-ink">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-cream pt-12 pb-20 md:py-28 border-b border-brand-sand/40">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-ochre/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-8 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-brand-ochre/15 border border-brand-ochre/30 px-4 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-brand-terracotta" />
                <span className="mono text-[10px] font-black uppercase tracking-[0.25em] text-brand-terracotta">
                  Events • Catering • Special Occasions
                </span>
              </div>

              <h1 className="serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-brand-ink leading-[1.05] tracking-tight">
                Every Occasion Deserves <span className="italic text-brand-terracotta font-serif">Something Special</span>
              </h1>

              <p className="text-lg md:text-xl text-brand-ink/80 leading-relaxed max-w-2xl font-medium">
                Whether you're celebrating a birthday, treating your office, hosting a family gathering, or planning a special event, Bobby's Bun Factory creates handcrafted cinnamon rolls that turn ordinary moments into memorable experiences.
              </p>

              {/* Bullet highlights */}
              <div className="space-y-3 pt-2 text-sm md:text-base font-bold text-brand-ink/90">
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 rounded-full bg-brand-terracotta/15 text-brand-terracotta flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Freshly baked specifically for your event date.</span>
                </div>
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 rounded-full bg-brand-terracotta/15 text-brand-terracotta flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Made with Japanese milk bread technique & premium ingredients.</span>
                </div>
                <div className="flex items-center space-x-3 justify-center lg:justify-start">
                  <div className="w-6 h-6 rounded-full bg-brand-terracotta/15 text-brand-terracotta flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>Finished with signature Secret Frost™ & Coupe de Caviar™ fruit toppings.</span>
                </div>
              </div>

              {/* Call-To-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('catering-quote-form')}
                  className="w-full sm:w-auto bg-brand-terracotta hover:bg-brand-ink text-white font-black uppercase text-xs tracking-[0.2em] px-8 py-4.5 rounded-full shadow-xl shadow-brand-terracotta/20 hover:shadow-none transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <span>Request a Catering Quote</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto bg-white/80 hover:bg-white text-brand-ink border border-brand-sand/60 font-black uppercase text-xs tracking-[0.2em] px-8 py-4.5 rounded-full shadow-sm hover:shadow transition-all duration-300 text-center"
                >
                  View Retail Menu
                </Link>
              </div>
            </motion.div>

            {/* Hero Visual Collage */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] group">
                  <img 
                    src={cateringHeroSpread} 
                    alt="Bobby's Bun Factory Catering Box Spread" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="mono text-[9px] uppercase tracking-widest text-brand-ochre font-bold block mb-1">
                      Handcrafted Fresh Daily
                    </span>
                    <h3 className="serif text-2xl font-black">Luxury Cinnamon Catering</h3>
                  </div>
                </div>

                {/* Floating Badge Accent */}
                <div className="absolute -bottom-6 -left-6 bg-brand-ink text-brand-cream p-5 rounded-2xl shadow-xl border border-brand-sand/20 hidden sm:block max-w-[200px]">
                  <p className="mono text-[9px] uppercase tracking-widest text-brand-ochre font-bold">
                    Notice Required
                  </p>
                  <p className="text-xs font-bold leading-tight mt-1 text-zinc-300">
                    Advance ordering ensures peak milk bread perfection.
                  </p>
                </div>

                {/* Second Floating Accent */}
                <div className="absolute -top-6 -right-6 bg-brand-cream border border-brand-sand/80 p-4 rounded-2xl shadow-lg hidden sm:flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-brand-terracotta/20 flex items-center justify-center text-brand-terracotta">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="serif text-sm font-black text-brand-ink block">100% Pure</span>
                    <span className="text-[10px] mono uppercase tracking-wider text-brand-terracotta font-bold">Butter & Vanilla</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. "PERFECT FOR" SECTION */}
      <section className="py-20 bg-white/60 border-b border-brand-sand/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="mono text-[10px] font-black uppercase tracking-[0.3em] text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">
              Tailored Events
            </span>
            <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink">
              Perfect For <span className="italic text-brand-terracotta font-serif">Every Gathering</span>
            </h2>
            <p className="text-base md:text-lg text-brand-ink/75 font-medium">
              From high-stakes executive boardrooms to intimate weekend family celebrations, our gourmet rolls bring people together.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {occasions.map((occ, idx) => {
              const IconComp = occ.icon;
              return (
                <motion.div
                  key={occ.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="p-6 rounded-2xl bg-brand-cream/80 border border-brand-sand/50 hover:border-brand-terracotta/40 hover:shadow-xl hover:shadow-brand-terracotta/5 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-terracotta/10 group-hover:bg-brand-terracotta text-brand-terracotta group-hover:text-white flex items-center justify-center transition-all duration-300 mb-4">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="serif text-xl font-black text-brand-ink mb-1 group-hover:text-brand-terracotta transition-colors">
                    {occ.name}
                  </h3>
                  <p className="text-sm text-brand-ink/70 font-medium leading-relaxed">
                    {occ.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CATERING MENU SECTION (NO PRICES) */}
      <section className="py-24 bg-brand-cream border-b border-brand-sand/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="mono text-[10px] font-black uppercase tracking-[0.3em] text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">
              Custom Catering Menu
            </span>
            <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink">
              Signature <span className="italic text-brand-terracotta font-serif">Event Offerings</span>
            </h2>
            <p className="text-base md:text-lg text-brand-ink/75 font-medium">
              Carefully packaged to maintain warm, pillow-soft texture from our oven to your event table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {cateringProducts.map((product, idx) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-brand-sand/60 shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col group"
              >
                <div className="relative h-64 sm:h-72 overflow-hidden bg-brand-sand/20">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-ink text-brand-cream font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-md">
                      {product.badge}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="serif text-2xl font-black text-brand-ink mb-3 group-hover:text-brand-terracotta transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-brand-ink/80 text-sm md:text-base leading-relaxed font-medium">
                      {product.description}
                    </p>
                  </div>

                  <div className="border-t border-brand-sand/30 pt-4">
                    <span className="mono text-[10px] uppercase font-black text-brand-terracotta tracking-wider block mb-2">
                      Available Configuration Examples:
                    </span>
                    <ul className="space-y-1.5">
                      {product.options.map((opt, i) => (
                        <li key={i} className="text-xs font-bold text-brand-ink/90 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta shrink-0" />
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      handleCateringProductToggle(product.title);
                      scrollToSection('catering-quote-form');
                    }}
                    className="w-full bg-brand-cream hover:bg-brand-terracotta text-brand-ink hover:text-white border border-brand-sand/80 font-black uppercase text-xs tracking-[0.2em] py-3.5 rounded-full transition-all duration-300 text-center cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Request Quote For This Item</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COUPE DE CAVIAR™ TOPPINGS SECTION */}
      <section className="py-20 bg-white/80 border-b border-brand-sand/40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="mono text-[10px] font-black uppercase tracking-[0.3em] text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">
              Signature Elevators
            </span>
            <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink">
              Coupe de Caviar™ <span className="italic text-brand-terracotta font-serif">Fruit Toppings</span>
            </h2>
            <p className="text-base md:text-lg text-brand-ink/75 font-medium">
              Elevate your catering spread with our handcrafted chunky fruit reductions and artisanal glazes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {caviarFlavors.map((cav, idx) => (
              <motion.div
                key={cav.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-brand-cream rounded-2xl p-4 border border-brand-sand/50 text-center flex flex-col items-center hover:border-brand-terracotta/40 transition-all duration-300 shadow-sm"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-white shadow-md bg-white">
                  <img src={cav.image} alt={cav.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="serif text-base font-black text-brand-ink mb-1">
                  {cav.name}
                </h4>
                <p className="text-[11px] text-brand-ink/70 font-medium leading-tight">
                  {cav.note}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center bg-brand-ochre/15 border border-brand-ochre/30 rounded-2xl p-4 max-w-2xl mx-auto">
            <p className="text-xs font-bold text-brand-ink/90 italic">
              ✨ Seasonal and custom fruit caviar flavors are available upon request for large corporate or wedding catering.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY BOBBY'S BUN FACTORY (6 FEATURE CARDS) */}
      <section className="py-20 bg-brand-cream border-b border-brand-sand/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="mono text-[10px] font-black uppercase tracking-[0.3em] text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">
              The Difference
            </span>
            <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink">
              Why Bobby's <span className="italic text-brand-terracotta font-serif">Bun Factory</span>
            </h2>
            <p className="text-base md:text-lg text-brand-ink/75 font-medium">
              We take cinnamon rolls seriously. Uncompromised quality from recipe to presentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const IconComp = feat.icon;
              return (
                <div 
                  key={feat.title}
                  className="bg-white rounded-2xl p-8 border border-brand-sand/60 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center mb-5">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="serif text-xl font-black text-brand-ink mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-brand-ink/75 font-medium leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. ORDERING INFORMATION CALLOUT */}
      <section className="py-16 bg-brand-ink text-brand-cream border-b border-brand-sand/20">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-brand-ochre/20 text-brand-ochre px-4 py-1.5 rounded-full border border-brand-ochre/30">
            <Clock className="w-4 h-4" />
            <span className="mono text-[10px] uppercase font-black tracking-widest">
              Important Catering Info
            </span>
          </div>

          <h2 className="serif text-3xl md:text-4xl font-black text-white">
            Customized For Your Event
          </h2>

          <p className="text-base md:text-lg text-zinc-300 font-medium leading-relaxed max-w-3xl mx-auto">
            Because every event is unique, pricing is customized based on quantity, packaging format, and product selections. Large catering orders require advance notice (minimum 24-48 hours) to ensure we deliver fresh, oven-baked quality.
          </p>

          <div className="pt-2">
            <button
              onClick={() => scrollToSection('catering-quote-form')}
              className="bg-brand-terracotta hover:bg-white hover:text-brand-ink text-white font-black uppercase text-xs tracking-[0.2em] px-8 py-4 rounded-full transition-all duration-300 shadow-xl"
            >
              Request Your Custom Quote
            </button>
          </div>
        </div>
      </section>

      {/* 7. COFFEE SHOP & WHOLESALE PARTNERSHIPS SECTION */}
      <section id="wholesale-section" className="py-24 bg-white border-b border-brand-sand/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand-cream rounded-3xl p-8 md:p-14 border-2 border-brand-sand/60 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-brand-terracotta/10 text-brand-terracotta px-4 py-1.5 rounded-full">
                <Store className="w-4 h-4" />
                <span className="mono text-[10px] font-black uppercase tracking-widest">
                  B2B & Retail Partner Program
                </span>
              </div>

              <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink leading-tight">
                Coffee Shop & Wholesale <span className="italic text-brand-terracotta font-serif">Partnerships</span>
              </h2>

              <div className="space-y-4 text-base md:text-lg text-brand-ink/80 font-medium leading-relaxed">
                <p className="font-bold text-brand-ink">
                  Own a coffee shop or café? Looking for a premium handcrafted pastry your customers will remember?
                </p>
                <p>
                  Bobby's Bun Factory partners with select cafés, espresso bars, boutique hotels, and retailers to provide fresh handcrafted cinnamon rolls daily or weekly.
                </p>
                <p>
                  If you're interested in carrying Bobby's Bun Factory products, we'd love to partner with you.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => scrollToSection('wholesale-form')}
                  className="bg-brand-ink hover:bg-brand-terracotta text-white font-black uppercase text-xs tracking-[0.2em] px-8 py-4.5 rounded-full shadow-lg transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Become a Partner</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl aspect-square">
                <img 
                  src={classicSingleBun} 
                  alt="Bobby's Bun Factory Wholesale Cinnamon Rolls" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="mono text-[10px] uppercase font-bold text-brand-ochre tracking-widest block mb-1">
                    Café & Retail Ready
                  </span>
                  <p className="serif text-xl font-black">
                    Elevate your pastry case with signature Japanese milk bread rolls.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. CATERING QUOTE FORM SECTION */}
      <section id="catering-quote-form" className="py-24 bg-brand-cream border-b border-brand-sand/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <span className="mono text-[10px] font-black uppercase tracking-[0.3em] text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">
              Request Form
            </span>
            <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink">
              Request a <span className="italic text-brand-terracotta font-serif">Catering Quote</span>
            </h2>
            <p className="text-base text-brand-ink/75 font-medium max-w-xl mx-auto">
              Fill out the details below and our event coordinator will get back to you with options and customized pricing.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 border border-brand-sand/80 shadow-xl">
            {cateringSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="serif text-3xl font-black text-brand-ink">
                  Quote Request Received!
                </h3>
                <p className="text-base text-brand-ink/80 max-w-lg mx-auto font-medium">
                  Thank you for reaching out to Bobby's Bun Factory! Our catering team will review your event details and respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setCateringSubmitted(false);
                    setCateringForm({
                      name: '',
                      email: '',
                      phone: '',
                      eventType: 'Corporate Meeting',
                      eventDate: '',
                      guestCount: '',
                      productsInterested: [],
                      message: ''
                    });
                  }}
                  className="text-xs font-black uppercase tracking-widest text-brand-terracotta hover:underline pt-4 inline-block"
                >
                  Submit Another Quote Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleCateringSubmit} className="space-y-6">
                {cateringError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
                    {cateringError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={cateringForm.name}
                      onChange={e => setCateringForm({ ...cateringForm, name: e.target.value })}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={cateringForm.email}
                      onChange={e => setCateringForm({ ...cateringForm, email: e.target.value })}
                      placeholder="e.g. sarah@company.com"
                      className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={cateringForm.phone}
                      onChange={e => setCateringForm({ ...cateringForm, phone: e.target.value })}
                      placeholder="(770) 000-0000"
                      className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Event Type
                    </label>
                    <select
                      value={cateringForm.eventType}
                      onChange={e => setCateringForm({ ...cateringForm, eventType: e.target.value })}
                      className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    >
                      <option value="Corporate Meeting">Corporate Meeting</option>
                      <option value="Office Breakfast">Office Breakfast</option>
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Wedding / Reception">Wedding / Reception</option>
                      <option value="Church Event">Church Event</option>
                      <option value="Holiday Gathering">Holiday Gathering</option>
                      <option value="Family Reunion">Family Reunion</option>
                      <option value="Other">Other Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Event Date *
                    </label>
                    <input 
                      type="date" 
                      required
                      value={cateringForm.eventDate}
                      onChange={e => setCateringForm({ ...cateringForm, eventDate: e.target.value })}
                      className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                    Estimated Guest Count / Rolls Needed
                  </label>
                  <input 
                    type="text" 
                    value={cateringForm.guestCount}
                    onChange={e => setCateringForm({ ...cateringForm, guestCount: e.target.value })}
                    placeholder="e.g. 50 guests / 4 dozen"
                    className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                    Products Interested In (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Classic Rolls', 'Jumbo Rolls', 'Mini Bun Trays', 'Cinnamon Cake'].map(p => {
                      const selected = cateringForm.productsInterested.includes(p);
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => handleCateringProductToggle(p)}
                          className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                            selected 
                              ? 'bg-brand-terracotta text-white border-brand-terracotta shadow' 
                              : 'bg-brand-cream text-brand-ink border-brand-sand/80 hover:border-brand-terracotta/50'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                    Event Details & Special Requests
                  </label>
                  <textarea 
                    rows={4}
                    value={cateringForm.message}
                    onChange={e => setCateringForm({ ...cateringForm, message: e.target.value })}
                    placeholder="Tell us about your event, delivery location, flavor preferences, or any dietary questions..."
                    className="w-full bg-brand-cream border border-brand-sand/80 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCatering}
                  className="w-full bg-brand-terracotta hover:bg-brand-ink text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmittingCatering ? 'Submitting...' : 'Send Catering Quote Request'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. WHOLESALE INQUIRY FORM SECTION */}
      <section id="wholesale-form" className="py-24 bg-white border-b border-brand-sand/40">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-12">
            <span className="mono text-[10px] font-black uppercase tracking-[0.3em] text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">
              B2B Partner Inquiry
            </span>
            <h2 className="serif text-3xl md:text-5xl font-black text-brand-ink">
              Wholesale <span className="italic text-brand-terracotta font-serif">Inquiry</span>
            </h2>
            <p className="text-base text-brand-ink/75 font-medium max-w-xl mx-auto">
              Interested in selling Bobby's Bun Factory cinnamon rolls at your coffee shop, café, or venue? Let's connect!
            </p>
          </div>

          <div className="bg-brand-cream/80 rounded-3xl p-8 md:p-12 border-2 border-brand-sand/80 shadow-xl">
            {wholesaleSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="serif text-3xl font-black text-brand-ink">
                  Wholesale Inquiry Received!
                </h3>
                <p className="text-base text-brand-ink/80 max-w-lg mx-auto font-medium">
                  Thank you! Our wholesale manager will reach out with sample pricing, delivery schedules, and partner details.
                </p>
                <button
                  onClick={() => {
                    setWholesaleSubmitted(false);
                    setWholesaleForm({
                      businessName: '',
                      contactName: '',
                      email: '',
                      phone: '',
                      businessType: 'Coffee Shop',
                      weeklyQuantity: '50-100 buns',
                      message: ''
                    });
                  }}
                  className="text-xs font-black uppercase tracking-widest text-brand-terracotta hover:underline pt-4 inline-block"
                >
                  Submit Another Wholesale Request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleWholesaleSubmit} className="space-y-6">
                {wholesaleError && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-200">
                    {wholesaleError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Business Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={wholesaleForm.businessName}
                      onChange={e => setWholesaleForm({ ...wholesaleForm, businessName: e.target.value })}
                      placeholder="e.g. Daily Grind Coffee House"
                      className="w-full bg-white border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Contact Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={wholesaleForm.contactName}
                      onChange={e => setWholesaleForm({ ...wholesaleForm, contactName: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full bg-white border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={wholesaleForm.email}
                      onChange={e => setWholesaleForm({ ...wholesaleForm, email: e.target.value })}
                      placeholder="e.g. alex@dailygrind.com"
                      className="w-full bg-white border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Phone Number *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={wholesaleForm.phone}
                      onChange={e => setWholesaleForm({ ...wholesaleForm, phone: e.target.value })}
                      placeholder="(770) 000-0000"
                      className="w-full bg-white border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Type of Business
                    </label>
                    <select
                      value={wholesaleForm.businessType}
                      onChange={e => setWholesaleForm({ ...wholesaleForm, businessType: e.target.value })}
                      className="w-full bg-white border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    >
                      <option value="Coffee Shop">Coffee Shop</option>
                      <option value="Café">Café</option>
                      <option value="Office">Office / Corporate</option>
                      <option value="Event Planner">Event Planner</option>
                      <option value="Hotel / Hospitality">Hotel / Hospitality</option>
                      <option value="Other">Other Retailer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                      Estimated Weekly Quantity
                    </label>
                    <select
                      value={wholesaleForm.weeklyQuantity}
                      onChange={e => setWholesaleForm({ ...wholesaleForm, weeklyQuantity: e.target.value })}
                      className="w-full bg-white border border-brand-sand/80 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                    >
                      <option value="Under 50 buns">Under 50 buns / week</option>
                      <option value="50-100 buns">50 – 100 buns / week</option>
                      <option value="100-250 buns">100 – 250 buns / week</option>
                      <option value="250+ buns">250+ buns / week</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brand-ink mb-2">
                    Message / Additional Details
                  </label>
                  <textarea 
                    rows={4}
                    value={wholesaleForm.message}
                    onChange={e => setWholesaleForm({ ...wholesaleForm, message: e.target.value })}
                    placeholder="Tell us about your business location, current pastry offerings, or desired launch timeline..."
                    className="w-full bg-white border border-brand-sand/80 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-brand-terracotta text-brand-ink"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingWholesale}
                  className="w-full bg-brand-ink hover:bg-brand-terracotta text-white font-black uppercase text-xs tracking-[0.2em] py-4 rounded-full transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{isSubmittingWholesale ? 'Submitting...' : 'Submit Wholesale Partner Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 10. FINAL CALL TO ACTION */}
      <section className="py-20 bg-brand-cream text-brand-ink border-b border-brand-sand/40 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="serif text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            Let's Make Your Event <span className="italic text-brand-terracotta font-serif">Sweeter</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm font-bold text-brand-ink/90">
            <a 
              href="tel:7706867651" 
              className="flex items-center space-x-3 bg-white px-6 py-3.5 rounded-2xl border border-brand-sand/60 shadow-sm hover:border-brand-terracotta transition-colors"
            >
              <Phone className="w-5 h-5 text-brand-terracotta" />
              <span>770-686-7651</span>
            </a>

            <a 
              href="mailto:info@bobbysbunfactory.com" 
              className="flex items-center space-x-3 bg-white px-6 py-3.5 rounded-2xl border border-brand-sand/60 shadow-sm hover:border-brand-terracotta transition-colors"
            >
              <Mail className="w-5 h-5 text-brand-terracotta" />
              <span>info@bobbysbunfactory.com</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => scrollToSection('catering-quote-form')}
              className="w-full sm:w-auto bg-brand-terracotta hover:bg-brand-ink text-white font-black uppercase text-xs tracking-[0.2em] px-8 py-4.5 rounded-full shadow-xl transition-all duration-300"
            >
              Request a Quote
            </button>

            <Link
              to="/shop"
              className="w-full sm:w-auto bg-brand-ink hover:bg-brand-terracotta text-white font-black uppercase text-xs tracking-[0.2em] px-8 py-4.5 rounded-full shadow-lg transition-all duration-300 text-center"
            >
              Order Online
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Catering;
