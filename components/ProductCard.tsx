
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdate: (qty: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onUpdate }) => {
  return (
    <div className="group relative bg-brand-ink text-brand-cream rounded-none overflow-hidden transition-all duration-700 hover:shadow-[0_0_50px_rgba(185,76,47,0.2)] border border-brand-ochre/10">
      {/* Decorative Corner Bracket */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-terracotta/40 z-20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-terracotta/40 z-20" />

      <div className="aspect-[4/5] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-ink/40 mix-blend-multiply transition-opacity group-hover:opacity-0" />
        
        {/* Price Tag Overlay */}
        <div className="absolute top-6 right-6">
           <div className="bg-brand-ochre text-brand-ink font-black px-3 py-1 rounded-sm text-sm mono">
             ${product.price.toFixed(2)}
           </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        <div className="space-y-2">
          <span className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-[0.4em]">Unit Type: {product.type}</span>
          <h3 className="serif text-3xl font-black text-brand-cream group-hover:text-brand-terracotta transition-colors leading-[0.9]">
            {product.name}
          </h3>
        </div>
        
        <p className="text-brand-cream/40 text-sm leading-relaxed line-clamp-3 font-medium">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-brand-ochre/10">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onUpdate(Math.max(0, quantity - 1))}
              className="w-10 h-10 rounded-full border border-brand-ochre/20 flex items-center justify-center hover:bg-brand-terracotta hover:border-brand-terracotta transition-all disabled:opacity-20"
              disabled={quantity === 0}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="mono w-8 text-center font-black text-brand-ochre">{quantity}</span>
            <button 
              onClick={() => onUpdate(quantity + 1)}
              className="w-10 h-10 rounded-full border border-brand-ochre/20 flex items-center justify-center hover:bg-brand-terracotta hover:border-brand-terracotta transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => onUpdate(quantity + 1)}
            className={`px-8 py-3 rounded-none font-black uppercase tracking-widest text-[10px] transition-all duration-700 ${
              quantity > 0 
                ? 'bg-brand-terracotta text-brand-ink shadow-[0_0_20px_rgba(185,76,47,0.4)]' 
                : 'bg-brand-ochre/5 text-brand-ochre border border-brand-ochre/40 hover:bg-brand-ochre hover:text-brand-ink'
            }`}
          >
            {quantity > 0 ? 'Allocated' : 'Initialize'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
