
import React, { useEffect } from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

const LOCATIONS = [
  {
    id: 1,
    name: "Rabbit Hill Park (Baking Drop Outpost)",
    address: "400 Rabbit Hill Rd, Dacula, GA 30019",
    hours: "Saturdays: 10:00 AM – 2:00 PM (Or until sold out)",
    phone: "Transmission Secured On-Site",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1000&auto=format&fit=crop"
  }
];

const Locations: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[70vh] py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="serif text-5xl md:text-7xl font-black text-brand-ink mb-6">Pull Up Before <br /><span className="text-brand-terracotta italic font-normal">We Sell Out.</span></h2>
          <p className="text-brand-ochre font-bold uppercase tracking-[0.3em] font-mono mt-4">Fresh buns. Limited drops. Zero patience.</p>
        </div>

        <div className="flex flex-col items-center justify-center max-w-xl mx-auto">
          {LOCATIONS.map(loc => (
            <div key={loc.id} className="bg-brand-cream/10 rounded-[2.5rem] overflow-hidden border border-brand-cream/30 hover:shadow-xl transition-all group w-full">
              <div className="h-64 overflow-hidden">
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8">
                <h3 className="serif text-2xl font-bold text-brand-ink mb-4">{loc.name}</h3>
                <div className="space-y-4 text-gray-600">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-brand-terracotta shrink-0" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-brand-terracotta shrink-0" />
                    <span>{loc.hours}</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-brand-terracotta shrink-0" />
                    <span>{loc.phone}</span>
                  </div>
                </div>
                <button className="w-full mt-8 bg-brand-ink text-brand-ochre py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-brand-terracotta hover:text-brand-cream transition-all">
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Locations;
