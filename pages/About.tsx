
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-brand-cream/10 py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="serif text-5xl md:text-7xl font-black text-brand-ink mb-6">It Started With <br /><span className="text-brand-terracotta italic font-normal">One Perfect Roll.</span></h2>
          <div className="w-24 h-1 bg-brand-terracotta mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop" 
              alt="Bakery" 
              className="rounded-[3rem] shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-6">
            <h3 className="serif text-3xl font-bold text-brand-ink italic">No Respect For Restraint.</h3>
            <p className="text-gray-600 leading-relaxed">
              Bobby didn’t want average cinnamon rolls. He wanted the kind that make people stop talking mid-sentence.
            </p>
            <p className="text-gray-600 leading-relaxed">
              After hundreds of batches, late nights, and entirely too much butter, Bobby’s Bun Factory was born — soft-centered, frosting-heavy, and built with absolutely no respect for restraint.
            </p>
          </div>
        </div>

        <div className="bg-brand-ink text-brand-cream p-12 rounded-[3.5rem] border border-brand-ochre/20 shadow-2xl text-center">
          <p className="serif text-3xl md:text-4xl italic font-normal max-w-2xl mx-auto leading-relaxed text-brand-cream">
            “If the frosting doesn’t make you emotional, we’re not done yet.”
          </p>
          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-brand-terracotta font-black">— Bobby</p>
        </div>
      </div>
    </div>
  );
};

export default About;
