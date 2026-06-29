/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, ArrowLeft, CheckCircle2, AlertCircle, CreditCard as CardIcon, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import GearLogo from '../components/GearLogo';
import { CartItem } from '../types';

interface CheckoutProps {
  items: CartItem[];
  total: number;
  pickupDate?: string;
  onSuccess: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, total, pickupDate, onSuccess }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [config, setConfig] = useState<{ applicationId: string; locationId: string } | null>(null);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const paymentsRef = useRef<any>(null);
  const cardRef = useRef<any>(null);

  useEffect(() => {
    // Fetch real-time config from backend to ensure we see secret updates
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.applicationId && data.locationId) {
          setConfig(data);
        }
      })
      .catch(err => console.error('Config fetch failed:', err));
  }, []);

  // Use config from API first, then fall back to Vite env vars
  const appId = (config?.applicationId || import.meta.env.VITE_SQUARE_APPLICATION_ID || import.meta.env.VITE_SQUARE_APPLIC || '').trim();
  const locationId = (config?.locationId || import.meta.env.VITE_SQUARE_LOCATION_ID || import.meta.env.VITE_SQUARE_LOCAT || '').trim();

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const loadSquareSdk = async () => {
      if (!appId || !locationId) return;

      if (window.Square) {
        initializePaymentForm();
        return;
      }

      script = document.createElement('script');
      const isProd = appId.startsWith('sq0idp');
      script.src = isProd 
        ? 'https://web.squarecdn.com/v1/square.js' 
        : 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.async = true;
      script.onload = () => initializePaymentForm();
      script.onerror = () => {
        setError('Security Protocol Failure: SDK Load Blocked.');
      };
      document.body.appendChild(script);
    };

    const initializePaymentForm = async () => {
      if (!window.Square) return;

      try {
        paymentsRef.current = window.Square.payments(appId, locationId);
        cardRef.current = await paymentsRef.current.card();
        
        if (cardContainerRef.current) {
          await cardRef.current.attach('#card-container');
          setIsSdkLoaded(true);
        }
      } catch (e: any) {
        console.error('Square Init Error:', e);
        if (!e.message?.includes('fetch')) {
          setError('Credential Verification Failed. Secure the link.');
        }
      }
    };

    loadSquareSdk();

    return () => {
      if (cardRef.current) cardRef.current.destroy();
    };
  }, [appId, locationId]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardRef.current) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await cardRef.current.tokenize();
      if (result.status === 'OK') {
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: total,
            locationId: locationId,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Identity Verification Failed');

        // Record purchase to local order history
        try {
          const orderId = `BBF-${Math.floor(10000 + Math.random() * 90000)}-GA`;
          const orderDate = new Date().toISOString().split('T')[0];
          
          const orderItemsFormatted = items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            modifier: item.modifier ? item.modifier.name : (item.product.description || ''),
            image: item.product.image
          }));

          const newOrder = {
            id: orderId,
            date: orderDate,
            type: 'pickup' as const,
            status: 'Ready & Collected • Clean Cook',
            items: orderItemsFormatted,
            subtotal: total * 0.9,
            discount: 0,
            tax: total * 0.1,
            total: total,
            pickupTime: pickupDate || 'Within 45 Minutes',
            address: 'Atlanta Factory #04'
          };

          const storedOrdersRaw = localStorage.getItem('bobbys_orders');
          const storedOrders = storedOrdersRaw ? JSON.parse(storedOrdersRaw) : [];
          localStorage.setItem('bobbys_orders', JSON.stringify([newOrder, ...storedOrders]));
        } catch (e) {
          console.warn('Error saving to order history:', e);
        }

        setSuccess(true);
        onSuccess();
        setTimeout(() => navigate('/'), 5000);
      } else {
        throw new Error(result.errors[0].message);
      }
    } catch (err: any) {
      setError(err.message || 'Transmission Interrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8 bg-brand-cream">
        <div className="w-24 h-24 border border-brand-ochre/20 rounded-full flex items-center justify-center text-brand-terracotta">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h2 className="serif text-5xl font-black text-brand-ink uppercase tracking-tight">Vessel Empty</h2>
          <p className="mono text-xs text-brand-terracotta font-black uppercase tracking-widest">Inventory depletion detected</p>
        </div>
        <Link to="/" className="bg-brand-ink text-brand-cream px-12 py-4 rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-brand-terracotta transition-colors">Return to Factory</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-12 bg-brand-ink min-h-[80vh]">
        <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} className="w-32 h-32 border-4 border-brand-terracotta rounded-none flex items-center justify-center shadow-[0_0_50px_rgba(185,76,47,0.5)]">
          <CheckCircle2 className="w-16 h-16 text-brand-terracotta" />
        </motion.div>
        <div className="space-y-4">
          <h2 className="serif text-6xl md:text-8xl font-black text-brand-cream uppercase tracking-tight">Transmission <br /> <span className="italic text-brand-terracotta">Received.</span></h2>
          <p className="mono text-brand-ochre text-[10px] uppercase tracking-[0.4em] font-black">Redirecting to Base Command in 5 Units...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto w-full px-6 py-12 md:py-24">
        <div className="flex items-center justify-between mb-16 border-b border-brand-sand/30 pb-12">
          <div className="flex items-center space-x-6">
            <Link to="/" className="w-12 h-12 border border-brand-ochre/20 flex items-center justify-center rounded-none hover:bg-brand-ink hover:text-brand-cream transition-all group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </Link>
            <h1 className="serif text-4xl md:text-7xl font-black text-brand-ink uppercase tracking-tight">The Protocol</h1>
          </div>
          <div className="hidden md:flex flex-col items-end">
             <span className="mono text-brand-terracotta text-[10px] font-black uppercase tracking-widest">Transaction Level</span>
             <span className="serif text-2xl font-black text-brand-ink italic">Restricted</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-12">
            <div className="bg-brand-ink text-brand-cream p-12 rounded-none border border-brand-ochre/10 shadow-2xl relative overflow-hidden">
               {/* Decorative Gear in Background */}
               <div className="absolute -bottom-24 -right-24 opacity-5 rotate-45 pointer-events-none">
                 <GearLogo className="w-96 h-96" />
               </div>

               <div className="relative z-10 space-y-12">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-brand-terracotta" />
                      <h2 className="mono text-xs font-black uppercase tracking-[0.3em] text-brand-ochre">Hardware Summary</h2>
                    </div>
                    {pickupDate && (
                      <div className="flex items-center space-x-4 bg-brand-terracotta/10 px-4 py-2 border border-brand-terracotta/20">
                         <span className="mono text-[8px] text-brand-terracotta font-black uppercase tracking-widest">LOGISTICS:</span>
                         <span className="serif text-sm font-black italic">{pickupDate}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-8 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                    {items.map((item, idx) => (
                      <div key={`${item.product.id}-${item.modifier?.id || 'none'}-${idx}`} className="flex items-center space-x-8 group">
                        <div className="w-24 h-24 rounded-none overflow-hidden bg-brand-cream/5 border border-brand-ochre/10 flex-shrink-0 group-hover:border-brand-terracotta transition-colors">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex-1 min-w-0 py-2">
                          <h3 className="serif text-2xl font-black text-brand-cream truncate group-hover:text-brand-terracotta transition-colors">{item.product.name}</h3>
                          {item.modifier && (
                             <p className="mono text-[8px] text-brand-terracotta uppercase tracking-[0.2em] font-black italic">+ {item.modifier.name}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                             <p className="mono text-[10px] text-brand-cream/30 uppercase tracking-widest">Allocation: {item.quantity}</p>
                             <div className="w-1 h-1 rounded-full bg-brand-ochre/20" />
                             <p className="mono text-[10px] text-brand-ochre font-black uppercase underline decoration-brand-terracotta/40">${(item.product.price + (item.modifier?.price || 0)).toFixed(2)} / Unit</p>
                          </div>
                        </div>
                        <p className="serif text-2xl font-black text-brand-cream">${((item.product.price + (item.modifier?.price || 0)) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-12 border-t border-brand-ochre/10 flex justify-between items-end">
                    <div>
                      <span className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-[0.4em]">Net Value sum</span>
                      <p className="serif text-6xl font-black text-brand-cream mt-2">${total.toFixed(2)}</p>
                    </div>
                    <div className="h-12 w-1 bg-brand-terracotta" />
                  </div>
               </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-brand-cream p-1 md:p-12 rounded-none border-2 border-brand-ink/5 sticky top-32">
              <div className="space-y-10">
                <div className="flex flex-col space-y-2">
                  <h2 className="serif text-4xl font-black text-brand-ink uppercase">Secure <br /> Transmission</h2>
                  <p className="mono text-[10px] text-brand-terracotta font-black uppercase tracking-widest">Encrypted Payment Gateway</p>
                </div>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-brand-terracotta/10 border-l-4 border-brand-terracotta p-6 flex items-start space-x-4">
                      <AlertCircle className="w-5 h-5 text-brand-terracotta flex-shrink-0 mt-1" />
                      <p className="text-xs font-black mono text-brand-ink uppercase tracking-tight leading-relaxed">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {(!appId || !locationId) ? (
                  <div className="bg-brand-ink p-12 text-center space-y-6">
                    <div className="w-12 h-12 border-2 border-brand-ochre/20 rounded-full border-t-brand-ochre animate-spin mx-auto" />
                    <p className="mono text-[10px] text-brand-cream uppercase tracking-[0.2em] font-black">Syncing Credentials...</p>
                  </div>
                ) : (
                  <form onSubmit={handlePayment} className="space-y-8">
                    <div className="space-y-4">
                       <span className="mono text-[9px] text-brand-ink/40 font-black uppercase tracking-widest block ml-1">Card Authentication Module</span>
                       <div 
                        id="card-container" 
                        ref={cardContainerRef}
                        className="bg-brand-ink p-6 min-h-[120px] flex items-center justify-center transition-all border border-brand-ochre/10"
                      >
                        {!isSdkLoaded && (
                          <div className="flex flex-col items-center space-y-4">
                            <div className="w-10 h-10 border-2 border-brand-terracotta border-t-transparent animate-spin" />
                            <p className="mono text-[9px] text-brand-cream font-black uppercase tracking-[0.3em] opacity-40">Initializing Gearbox...</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || !isSdkLoaded}
                      className="group relative w-full bg-brand-ink text-brand-cream py-6 rounded-none font-black uppercase tracking-[0.4em] text-xs shadow-2xl transition-all overflow-hidden disabled:opacity-30"
                    >
                      <div className="absolute inset-0 steam-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="relative z-10 flex items-center justify-center space-x-4 group-hover:text-brand-ink transition-colors">
                        {isProcessing ? (
                          <div className="w-5 h-5 border-2 border-brand-ochre border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="w-5 h-5" />
                            <span>Forge Transaction</span>
                          </>
                        )}
                      </div>
                    </button>

                    <div className="flex flex-col space-y-8 pt-8">
                       <div className="flex items-center justify-center space-x-8 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-3" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-5" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-3" />
                       </div>
                       
                       <div className="flex flex-col items-center space-y-2 py-4 border-y border-brand-sand/30">
                          <p className="mono text-[10px] text-brand-ink/40 font-black uppercase tracking-widest text-center">
                            Powered by Square <br /> 
                            <span className="text-[8px] opacity-50 underline decoration-brand-terracotta/40">Secure Identity Layer 02</span>
                          </p>
                       </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    Square: any;
  }
}

export default Checkout;
