import React, { useEffect } from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
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
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="serif text-3xl font-black text-brand-ink">Privacy Protocol</h1>
              <p className="text-[10px] uppercase font-bold tracking-widest text-brand-ochre mt-0.5">Bobby's Security System</p>
            </div>
          </div>

          <div className="space-y-6 text-zinc-600 text-xs font-semibold leading-relaxed font-sans">
            <p>
              At Bobby's Bun Factory, we respect your privacy. All information collected from box order selections, customized toppings, and contact inquiries are safely secured under strict factory standards.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">1. Data Collected</h2>
            <p>
              We collect names, emails, and phone numbers exclusively to prepare freshly baked rolls, schedule pickups, send Swirl Points notifications, and evaluate franchise applications.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">2. Double-Protection Cache</h2>
            <p>
              Your customized order sequences are protected using standard authorization systems. When sending application and inquiry forms, your data maps directly into our Google Sheets integration while caching a secure backup copy inside our internal systems to ensure high transmission fidelity.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">3. Security Standards</h2>
            <p>
              We do not distribute or trade customer email directories with third-party networks. Only certified members of Bobby's high command have access to order files to prepare boxes.
            </p>

            <h2 className="serif text-lg font-bold text-brand-ink pt-4">4. Cookie Configuration</h2>
            <p>
              We use lightweight localized storage tags keying into your customized cart variables and profile loyalty markers so your points stay updated dynamically without unnecessary cookies tracker clutter.
            </p>

            <div className="pt-8 border-t border-brand-sand/30 text-center text-zinc-400 text-[10px] mono uppercase tracking-widest">
              Last Updated Protocol: June 2026 / Verified secure
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Privacy;
