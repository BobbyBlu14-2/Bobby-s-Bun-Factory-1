
import React, { useState } from 'react';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import GearLogo from './GearLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  currentUser: string | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, 
  onOpenCart, 
  currentUser, 
  onOpenAuth, 
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-xl border-b border-brand-sand/30">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 md:hidden group focus:outline-none"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-brand-ink group-hover:text-brand-terracotta transition-colors" />
            ) : (
              <Menu className="w-6 h-6 text-brand-ink group-hover:text-brand-terracotta transition-colors" />
            )}
          </button>
          
          <Link 
            to="/" 
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-4 group"
          >
            <GearLogo className="w-12 h-12" />
            <div className="flex flex-col">
              <h1 className="serif text-2xl md:text-3xl font-black tracking-tighter text-brand-ink leading-none">
                Bobby's <span className="text-brand-terracotta italic text-xl md:text-2xl font-serif">Bun</span> Factory
              </h1>
              <span className="mono text-[8px] uppercase tracking-[0.3em] font-bold text-brand-ochre mt-1">
                Big buns. Bad intentions.
              </span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-[11px] font-black uppercase tracking-[0.2em] text-brand-ink/70">
          <Link to="/" onClick={() => {
            if (window.location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }} className="hover:text-brand-terracotta transition-all hover:tracking-[0.3em]">The Goods</Link>
          <Link to="/#menu-section" onClick={() => {
            if (window.location.pathname === '/') {
              document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
            }
          }} className="hover:text-brand-terracotta transition-all hover:tracking-[0.3em]">The Box</Link>
          <Link to="/shop" className="text-brand-terracotta hover:text-brand-terracotta flex items-center gap-1 font-bold hover:tracking-[0.3em] transition-all">
            The Jars <span className="bg-brand-terracotta text-white text-[8px] font-mono px-1 py-0.2 rounded font-black uppercase scale-90">NEW</span>
          </Link>
          <Link to="/franchise" className="hover:text-brand-terracotta transition-all hover:tracking-[0.3em]">Meet Bobby</Link>
          <Link to="/locations" className="hover:text-brand-terracotta transition-all hover:tracking-[0.3em]">The Pull Up</Link>
          <Link to="/contact" className="hover:text-brand-terracotta transition-all hover:tracking-[0.3em]">Talk Sweet to Us</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {/* User Sign In / Profile action */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-white/70 border border-brand-sand/40 py-2 px-4 rounded-full shadow-sm">
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 hover:opacity-80 transition-all"
                title="View Profile & Loyalty points"
              >
                <div className="w-6 h-6 rounded-full bg-brand-terracotta text-white font-black flex items-center justify-center text-[10px] italic animate-pulse">
                  {currentUser.charAt(0)}
                </div>
                <span className="text-[10px] font-bold mono uppercase tracking-wider text-brand-ink hidden lg:inline border-b border-dashed border-brand-ink/20">
                  {currentUser}
                </span>
                <User className="w-3.5 h-3.5 text-brand-ink/60 lg:hidden" />
              </Link>
              <span className="text-zinc-300">|</span>
              <button 
                onClick={onLogout}
                title="Sign Out"
                className="p-1 text-zinc-400 hover:text-brand-terracotta transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuth}
              className="bg-brand-cream border border-brand-sand/60 text-brand-ink text-[10px] font-black uppercase tracking-widest px-4.5 py-3.5 rounded-full hover:bg-brand-ink hover:text-brand-cream hover:border-brand-ink transition-all duration-300 shadow-sm flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button 
            onClick={onOpenCart}
            className="relative p-4 bg-brand-ink text-brand-cream rounded-full hover:bg-brand-terracotta transition-all duration-500 group shadow-lg shadow-brand-ink/10"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-ochre text-brand-ink text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-brand-cream">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 w-full bg-brand-cream border-b border-brand-sand/50 shadow-2xl z-40 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col p-6 space-y-4 text-xs font-black uppercase tracking-[0.2em] text-brand-ink/80">
            <Link 
              to="/" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="hover:text-brand-terracotta border-b border-brand-sand/20 pb-3 transition-colors"
            >
              The Goods
            </Link>
            <Link 
              to="/" 
              onClick={() => {
                setIsMobileMenuOpen(false);
                setTimeout(() => {
                  document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              className="hover:text-brand-terracotta border-b border-brand-sand/20 pb-3 transition-colors"
            >
              The Box
            </Link>
            <Link 
              to="/shop" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="hover:text-brand-terracotta border-b border-brand-sand/20 pb-3 flex items-center justify-between transition-colors text-brand-terracotta font-black"
            >
              <span>The Jars</span>
              <span className="bg-brand-terracotta text-white text-[8px] font-mono px-2 py-0.5 rounded font-black uppercase">NEW</span>
            </Link>
            <Link 
              to="/franchise" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="hover:text-brand-terracotta border-b border-brand-sand/20 pb-3 transition-colors"
            >
              Meet Bobby
            </Link>
            <Link 
              to="/locations" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="hover:text-brand-terracotta border-b border-brand-sand/20 pb-3 transition-colors"
            >
              The Pull Up
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="hover:text-brand-terracotta pb-1 transition-colors"
            >
              Talk Sweet to Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

