
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram } from 'lucide-react';
import GearLogo from './GearLogo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-ink text-brand-cream py-24 px-6 border-t border-brand-ochre/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center space-x-4">
              <GearLogo className="w-10 h-10 opacity-50" />
              <h2 className="serif text-3xl font-black">Bobby's <span className="text-brand-terracotta italic">Bun</span></h2>
            </div>
            <p className="text-brand-cream/40 text-sm leading-relaxed max-w-xs">
              Born into luxury, engineered for industrial throughput. The only roll that matters.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://www.facebook.com/BobbysBunFactory/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream/40 hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/bobbysbunfactory/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream/40 hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://www.tiktok.com/@bobbysbunfactory" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream/40 hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-all duration-300"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.01 1.62 4.15 1.12 1.25 2.72 1.93 4.38 2.1-.01 1.41-.01 2.82-.01 4.22-.9-.06-1.8-.35-2.61-.78-.89-.48-1.63-1.18-2.18-2.02v6.86c-.05 1.25-.42 2.5-1.14 3.52-.94 1.34-2.42 2.29-4.04 2.61-1.39.27-2.86.13-4.18-.39-1.57-.61-2.91-1.87-3.64-3.41C3.81 18.3 3.39 16.51 3.5 14.7c.07-1.74.83-3.43 2.1-4.6 1.35-1.25 3.19-1.92 5.03-1.84V12.5c-.9-.12-1.83.17-2.54.76-.79.67-1.21 1.7-1.15 2.73.04 1.05.59 2.05 1.48 2.62.91.56 2.06.63 3.03.18.91-.41 1.53-1.32 1.61-2.31.06-1.72.02-3.44.03-5.16.01-3.8-.02-7.61.01-11.41.02-.04.04-.08.06-.11z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <span className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-[0.2em] mb-2">The Boudoir</span>
              <Link to="/shop" className="text-sm font-bold text-brand-ochre hover:text-brand-cream transition-colors flex items-center gap-1.5">Shop Jars <span className="bg-brand-terracotta text-white text-[8px] font-mono px-1 py-0.2 rounded font-black uppercase scale-90">NEW</span></Link>
              <Link to="/about" className="text-sm font-bold hover:text-brand-ochre transition-colors">Our Lineage</Link>
              <Link to="/locations" className="text-sm font-bold hover:text-brand-ochre transition-colors">Sweet Spots</Link>
              <Link to="/franchise" className="text-sm font-bold hover:text-brand-ochre transition-colors">Sweet Ventures</Link>
            </div>
            <div className="flex flex-col space-y-4">
              <span className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-[0.2em] mb-2">Boundaries</span>
              <Link to="/privacy" className="text-sm font-bold hover:text-brand-ochre transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm font-bold hover:text-brand-ochre transition-colors">The Rules of Play</Link>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <span className="mono text-[10px] text-brand-ochre font-black uppercase tracking-[0.2em]">Sweet Talk</span>
            <div className="flex items-center bg-brand-ochre/5 border border-brand-ochre/20 p-1 rounded-none">
              <input 
                type="email" 
                placeholder="Your email for whispers..." 
                className="bg-transparent border-none text-sm px-4 py-2 w-full focus:outline-none placeholder:text-brand-cream/20"
              />
              <button className="bg-brand-ochre text-brand-ink px-6 py-2 text-[10px] font-black uppercase">Join Us</button>
            </div>
          </div>
        </div>
        
        <div className="pt-12 border-t border-brand-ochre/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-brand-cream/20 text-[10px] mono uppercase tracking-widest">© 2024 Bobby's Bun Factory / Established by Bloodline</p>
          <div className="flex space-x-6">
             <div className="w-2 h-2 rounded-full bg-brand-terracotta animate-pulse" />
             <div className="w-2 h-2 rounded-full bg-brand-ochre animate-pulse" style={{ animationDelay: '0.2s' }} />
             <div className="w-2 h-2 rounded-full bg-brand-brass animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
