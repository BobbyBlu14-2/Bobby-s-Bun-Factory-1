
import React, { useState, useEffect } from 'react';
import { Loader2, Zap, Sparkles, Check } from 'lucide-react';
import GearLogo from './GearLogo';
import { FLAVORS_OF_THE_MONTH } from '../constants';
import { Product } from '../types';

interface FlavorAssistantProps {
  onAddBun?: (product: Product) => void;
}

const FlavorAssistant: React.FC<FlavorAssistantProps> = ({ onAddBun }) => {
  const [mood, setMood] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [suggestedBun, setSuggestedBun] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [addedToOrder, setAddedToOrder] = useState(false);

  const placeholders = ["“sticky, warm, and messy”", "“craving sweet sin”", "“needs sweet, sweet comfort”"];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood.trim()) return;
    setLoading(true);
    setAddedToOrder(false);
    
    try {
      const response = await fetch('/api/recommend-bun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood })
      });
      const data = await response.json();
      
      if (data && data.recommendation) {
        setRecommendation(data.recommendation);
        const match = FLAVORS_OF_THE_MONTH.find(item => item.id === data.suggestedBunId);
        setSuggestedBun(match || null);
      } else {
        setRecommendation("You can't go wrong with our OG Classic!");
        setSuggestedBun(null);
      }
    } catch (error) {
      console.error("Error calling recommendations API:", error);
      setRecommendation("Treat yourself to a warm, fluffy bun today!");
      setSuggestedBun(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToOrder = () => {
    if (suggestedBun && onAddBun) {
      onAddBun(suggestedBun);
      setAddedToOrder(true);
      setTimeout(() => setAddedToOrder(false), 2500);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-24 p-12 bg-brand-ink text-brand-cream rounded-none border-t-4 border-brand-terracotta shadow-2xl relative overflow-hidden group">
      {/* Decorative Gear Background */}
      <div className="absolute -bottom-24 -right-24 opacity-5 group-hover:rotate-45 transition-transform duration-1000">
        <GearLogo className="w-96 h-96" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-brand-terracotta" />
          <h3 className="mono text-[10px] font-black uppercase tracking-[0.4em] text-brand-ochre">The Bun Oracle</h3>
        </div>
        
        <h2 className="serif text-5xl font-black mb-10 leading-tight">Tell Us <br /><span className="italic text-brand-terracotta">What You’re Feeling.</span></h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder={`${placeholders[placeholderIndex]}...`}
            className="flex-1 px-8 py-5 rounded-none bg-brand-ochre/5 border border-brand-ochre/20 text-brand-cream placeholder:text-brand-cream/40 focus:outline-none focus:border-brand-terracotta mono text-xs uppercase tracking-widest transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-5 rounded-none bg-brand-terracotta text-brand-ink font-black uppercase tracking-widest text-[10px] hover:bg-brand-ochre transition-all flex items-center justify-center space-x-3 shadow-lg disabled:opacity-30 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-brand-ink" /> : (
              <>
                <Zap className="w-4 h-4" />
                <span>Seduce My Senses</span>
              </>
            )}
          </button>
        </form>

        {recommendation && !loading && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-6 duration-1000">
            {/* Whimsical Text */}
            <div className="p-10 bg-brand-ochre/5 border border-brand-ochre/10 rounded-none">
              <div className="flex items-start space-x-6">
                 <div className="w-1 h-12 bg-brand-terracotta shrink-0" />
                 <p className="serif text-2xl md:text-3xl italic font-medium leading-relaxed">"{recommendation}"</p>
              </div>
            </div>

            {/* Match Bun Preview Card with Easy ordering */}
            {suggestedBun && (
              <div className="mt-6 flex flex-col md:flex-row bg-white/5 border border-white/10 overflow-hidden items-stretch rounded-xl">
                <div className="md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                  <img 
                    src={suggestedBun.image} 
                    alt={suggestedBun.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-brand-ink to-transparent" />
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="mono text-[8px] bg-brand-terracotta text-brand-cream font-black uppercase tracking-widest px-2 py-0.5">
                        {suggestedBun.tags?.[0] || "Featured Drop"}
                      </span>
                      <span className="mono text-[8px] text-brand-ochre font-bold uppercase tracking-widest">
                        {suggestedBun.tags?.[1] || "Monthly Special"}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <h4 className="serif text-2xl font-black text-brand-cream mb-2">{suggestedBun.name}</h4>
                      <span className="mono text-brand-ochre text-sm font-bold">${suggestedBun.price.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-brand-cream/70 leading-relaxed font-sans mt-1">{suggestedBun.description}</p>
                  </div>
                  
                  <button
                    onClick={handleAddToOrder}
                    className={`w-full py-4 font-mono font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer ${
                      addedToOrder 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-brand-ochre text-brand-ink hover:bg-brand-cream hover:text-brand-ink'
                    }`}
                  >
                    {addedToOrder ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Your Order Box!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-brand-terracotta animate-pulse" />
                        <span>Add `{suggestedBun.name}` to Box</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlavorAssistant;
