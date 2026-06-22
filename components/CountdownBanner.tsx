
import React, { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';

const CountdownBanner: React.FC = () => {
  // Set the next drop date to next Saturday at 10:00 AM
  const getNextDropDate = () => {
    const now = new Date();
    const target = new Date(now);
    let daysUntilSaturday = (6 - now.getDay() + 7) % 7;
    
    // If it's Saturday and past 10 AM, move to next Saturday
    if (daysUntilSaturday === 0 && now.getHours() >= 10) {
      daysUntilSaturday = 7;
    }
    
    target.setDate(now.getDate() + daysUntilSaturday);
    target.setHours(10, 0, 0, 0);
    return target;
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const dropLocation = "Rabbit Hill Park: 400 Rabbit Hill Rd, Dacula, GA 30019";

  useEffect(() => {
    const target = getNextDropDate();
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-ink text-brand-ochre py-3 px-6 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left text-[10px] font-black uppercase tracking-[0.2em] border-b border-brand-cream/10 gap-3">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-2 sm:space-y-0">
        <span className="text-white font-serif italic text-sm tracking-normal normal-case">Fresh Buns Loading…</span>
        <div className="flex items-center space-x-2 bg-brand-ochre/10 px-3 py-1 border border-brand-ochre/20">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Next Drop In:</span>
          <div className="flex space-x-1.5 text-white font-mono font-bold">
            <span>{timeLeft.days}D</span>
            <span>{timeLeft.hours}H</span>
            <span>{timeLeft.minutes}M</span>
            <span>{timeLeft.seconds}S</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-1 sm:space-y-0">
        <div className="flex items-center space-x-1.5 text-white">
          <MapPin className="w-3.5 h-3.5 text-brand-terracotta shrink-0" />
          <span className="font-bold">Rabbit Hill Park — Dacula, GA</span>
        </div>
        <span className="text-brand-cream/60 text-[9px] normal-case tracking-normal font-medium">
          Catch us before somebody buys your favorite flavor first.
        </span>
      </div>
    </div>
  );
};

export default CountdownBanner;
