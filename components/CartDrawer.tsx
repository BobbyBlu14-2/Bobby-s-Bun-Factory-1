
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total?: number;
  onRemove: (productId: string, modifierId?: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, total, onRemove }) => {
  const navigate = useNavigate();
  const subtotal = total !== undefined ? total : items.reduce((acc, item) => acc + (item.product.price + (item.modifier?.price || 0)) * item.quantity, 0);

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div 
        className="absolute inset-0 bg-brand-ink/80 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-brand-ink shadow-2xl flex flex-col border-l border-brand-ochre/10">
        <div className="p-8 flex items-center justify-between border-b border-brand-ochre/10">
          <div className="flex items-center space-x-3">
             <div className="w-2 h-2 rounded-full bg-brand-terracotta" />
             <h2 className="serif text-3xl font-black text-brand-cream uppercase tracking-tight">The Box</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-cream/10 rounded-full text-brand-cream transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 border border-brand-ochre/20 rounded-full flex items-center justify-center text-brand-ochre animate-pulse">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <p className="text-brand-cream/30 font-medium mono text-xs uppercase tracking-widest">Storage Status: Empty</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.product.id}-${item.modifier?.id || 'none'}-${idx}`} className="flex space-x-6 group animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="w-24 h-24 bg-brand-cream/5 rounded-none border border-brand-ochre/10 overflow-hidden shrink-0 group-hover:border-brand-terracotta transition-colors">
                  <img src={item.product.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 flex flex-col justify-center space-y-1">
                  <h4 className="serif text-xl font-bold text-brand-cream group-hover:text-brand-terracotta transition-colors">{item.product.name}</h4>
                  {item.modifier && (
                     <p className="mono text-[8px] text-brand-terracotta uppercase tracking-[0.2em] font-black italic">+ {item.modifier.name}</p>
                  )}
                  <p className="mono text-[10px] text-brand-cream/40 uppercase tracking-widest font-black">Allocation: {item.quantity} Units</p>
                  <p className="mono text-[14px] font-black text-brand-ochre mt-2">${((item.product.price + (item.modifier?.price || 0)) * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => onRemove(item.product.id, item.modifier?.id)}
                  className="p-2 h-fit text-brand-cream/20 hover:text-brand-terracotta transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-8 bg-brand-ochre/5 border-t border-brand-ochre/10 space-y-6">
          <div className="flex justify-between items-center">
            <span className="mono text-[10px] font-black text-brand-terracotta uppercase tracking-[0.3em]">Aggregate Total</span>
            <span className="serif text-4xl font-black text-brand-cream">${subtotal.toFixed(2)}</span>
          </div>
          <button 
            disabled={items.length === 0}
            onClick={handleCheckout}
            className="w-full bg-brand-terracotta text-brand-ink py-5 rounded-none font-black uppercase tracking-[0.3em] text-xs shadow-[0_0_30px_rgba(185,76,47,0.3)] hover:bg-brand-ochre transition-all disabled:opacity-20 disabled:shadow-none flex items-center justify-center space-x-3"
          >
            <span>Submit to Your Cravings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
