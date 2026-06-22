import React, { useEffect } from 'react';
import { Scroll, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="flex-grow bg-brand-cream py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-brand-ink/60 hover:text-brand-terracotta mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Factory</span>
        </Link>

        <div className="bg-white border border-brand-sand/40 p-8 md:p-12 rounded-[3rem] shadow-xl">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-brand-terracotta/10 text-brand-terracotta flex items-center justify-center">
              <Scroll className="w-5 h-5" />
            </div>
            <div>
              <h1 className="serif text-3xl font-black text-brand-ink">Terms of Protocol</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-ochre mt-0.5">Bobby's Quality Standards</p>
            </div>
          </div>

          <div className="space-y-6 text-zinc-600 text-xs font-semibold leading-relaxed font-sans">
            <p>
              By accessing Bobby's Bun Factory and using our custom ordering systems, you agree to obey the culinary standards of the High Command.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">1. Custom Ordering Standards</h2>
            <p>
              All buns and boxes configured on our order dashboard are prepared fresh at selected outpost locations. Users select either pickup dates or local delivery options.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">2. Swirl Points & Loyalty</h2>
            <p>
              Swirl Points are accumulated through authentic purchases. Tier rankings and associated rewards (Free Petit Frost, 50% Off 6-Pack, or Free Vrai Grande Frost) are strictly bound to individual user profiles and are non-transferable.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">3. Premium Ingredients Upcharges</h2>
            <p>
              Standard toppings are included within custom package pricing structures. Premium ingredients (such as Chocolate Cherry Bomb and Georgia caramelized Peach Outlaw) carry specialized value upcharges clearly detailed in the customization steps.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">4. Local Pickup Protocol</h2>
            <p>
              Orders not retrieved from selected outposts within 2 hours of scheduled pickup windows may be recycled or reassigned to walk-in customers to guarantee strict, oven-fresh standard quality control.
            </p>

            <div className="pt-8 border-t border-brand-sand/30 text-center text-zinc-400 text-[10px] mono uppercase tracking-widest">
              Standard Baked Agreement v4.2 / Oven Authorized
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Terms;
