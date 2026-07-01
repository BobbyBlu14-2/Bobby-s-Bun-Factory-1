import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Zap, Sparkles } from 'lucide-react';
import { FLAVORS_OF_THE_MONTH } from '../constants';
import { Product } from '../types';

interface FlavorsCarouselProps {
  onAddFlavor?: (product: Product) => void;
}

export const FlavorsCarousel: React.FC<FlavorsCarouselProps> = ({ onAddFlavor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  // Update visible count based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (!window) return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalItems = FLAVORS_OF_THE_MONTH.length;
  const maxIndex = Math.max(0, totalItems - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleAddToOrder = (flavor: Product) => {
    if (onAddFlavor) {
      onAddFlavor(flavor);
      setAddedItem(flavor.id);
      setTimeout(() => setAddedItem(null), 2000);
    }
  };

  return (
    <section id="flavors-of-the-month" className="w-full bg-brand-cream py-16 border-b border-brand-sand/40 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header content */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-brand-terracotta" />
              <span className="mono text-brand-ochre text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] font-mono">
                Limited Drops & Exclusive Batches
              </span>
            </div>
            <h2 className="serif text-4xl md:text-5xl font-black text-brand-ink leading-tight">
              Flavors <span className="text-brand-terracotta italic font-normal">of the Month</span>
            </h2>
            <p className="text-brand-ink/60 text-sm max-w-xl">
              Fresh limited-edition masterpieces built on our legendary fluffy dough base. Available for checkout only this month.
            </p>
          </div>

          {/* Slider controls */}
          <div className="flex items-center space-x-3 self-end md:self-auto">
            <button
              onClick={handlePrev}
              aria-label="Previous Flavor"
              className="p-3 border-2 border-brand-terracotta text-brand-terracotta bg-white/80 rounded-full hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-all active:scale-95 cursor-pointer shadow-md shadow-brand-terracotta/5 hover:shadow-brand-terracotta/20"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Flavor"
              className="p-3 border-2 border-brand-terracotta text-brand-terracotta bg-white/80 rounded-full hover:bg-brand-terracotta hover:text-brand-cream hover:border-brand-terracotta transition-all active:scale-95 cursor-pointer shadow-md shadow-brand-terracotta/5 hover:shadow-brand-terracotta/20"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Carousel viewport */}
        <div className="overflow-hidden relative -mx-2 px-2" ref={containerRef}>
          <div 
            className="flex flex-row transition-transform duration-500 ease-out gap-6"
            style={{ 
              transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              width: `${(totalItems / visibleCount) * 100}%` 
            }}
          >
            {FLAVORS_OF_THE_MONTH.map((flavor) => {
              const badge = flavor.tags?.[0] || 'Limited';
              const tagline = flavor.tags?.[1] || 'Featured Flavor';
              return (
                <div 
                  key={flavor.id} 
                  style={{ width: `${100 / totalItems}%` }}
                  className="px-1 py-3"
                >
                  <div className={`h-full border border-brand-sand/40 bg-white hover:shadow-2xl hover:border-brand-terracotta/40 transition-all duration-500 flex flex-col group overflow-hidden relative rounded-xl`}>
                    
                    {/* Badge & Price tag */}
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                      <span className="bg-brand-ink text-brand-ochre text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none shadow-md flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5 shrink-0" />
                        <span>{badge}</span>
                      </span>
                      {flavor.id === 'peach-outlaw' && (
                        <span className="bg-brand-terracotta text-brand-cream text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-none shadow-md flex items-center space-x-1 border border-brand-cream/10 animate-pulse">
                          <span>🔥 Most Ordered</span>
                        </span>
                      )}
                      {flavor.id === 'loaded-bun' && (
                        <span className="bg-brand-ochre text-brand-ink text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-none shadow-md flex items-center space-x-1 border border-brand-ink/10">
                          <span>🏆 Customer Favorite</span>
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-brand-terracotta text-brand-cream text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-none shadow-md">
                        ${flavor.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Image container */}
                    <div className="aspect-[4/3] w-full overflow-hidden relative">
                      <img
                        src={flavor.image}
                        alt={flavor.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-brand-ink/10 group-hover:bg-brand-ink/0 transition-all duration-500" />
                    </div>

                    {/* Info block */}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="mono text-[9px] text-brand-ochre font-bold uppercase tracking-widest">
                          {tagline}
                        </span>
                        <h4 className="serif text-xl sm:text-2xl font-black text-brand-ink mt-1.5 transition-colors group-hover:text-brand-terracotta">
                          {flavor.name}
                        </h4>
                        <p className="text-brand-ink/65 text-xs sm:text-sm mt-3 leading-relaxed">
                          {flavor.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-brand-sand/20">
                        <button
                          onClick={() => handleAddToOrder(flavor)}
                          className={`w-full text-center py-3 font-mono font-black text-[10px] uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                            addedItem === flavor.id 
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-brand-cream hover:bg-brand-terracotta hover:text-brand-cream border border-brand-ink/15 hover:border-brand-terracotta text-brand-ink'
                          }`}
                        >
                          {addedItem === flavor.id ? '✓ Added To Box!' : 'Add To Box Customizer'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicator dots for mobile */}
        <div className="flex justify-center space-x-1.5 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                currentIndex === idx ? 'w-8 bg-brand-terracotta' : 'w-2 bg-brand-sand/40 hover:bg-brand-sand'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FlavorsCarousel;
