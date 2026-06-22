
import React from 'react';
import { Truck, Store, Package } from 'lucide-react';
import { OrderType } from '../types';

interface OrderTypeSelectorProps {
  currentType: OrderType;
  onChange: (type: OrderType) => void;
}

const OrderTypeSelector: React.FC<OrderTypeSelectorProps> = ({ currentType, onChange }) => {
  const options = [
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'pickup', label: 'Pickup', icon: Store },
    { id: 'shipping', label: 'Shipping', icon: Package },
  ];

  return (
    <div className="flex justify-center my-8 px-4">
      <div className="bg-brand-ink p-2 rounded-none border border-brand-ochre/20 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 shadow-2xl overflow-hidden">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentType === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id as OrderType)}
              className={`flex items-center justify-center space-x-4 px-10 py-5 rounded-none transition-all duration-700 relative group ${
                isActive 
                  ? 'bg-brand-terracotta text-brand-ink' 
                  : 'text-brand-cream/40 hover:text-brand-ochre hover:bg-brand-ochre/5'
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 border-2 border-brand-ink/20 opacity-50" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`} />
              <span className="mono text-[10px] font-black uppercase tracking-[0.3em]">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTypeSelector;
