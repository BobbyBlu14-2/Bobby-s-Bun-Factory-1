import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Sparkles, 
  Ban, 
  Heart, 
  DollarSign, 
  Award,
  ArrowRight,
  HelpCircle,
  Megaphone
} from 'lucide-react';

const Franchise: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [territory, setTerritory] = useState('');
  const [capital, setCapital] = useState('$500 – $5,000 (Stage 1)');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/submit-franchise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, territory, capital }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server. Please check your network and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roadmapStages = [
    {
      stage: "Stage 1",
      title: "Bun Hustle™",
      type: "Home Bakery",
      investment: "$500 – $5,000",
      revenue: "$500 – $2,500 Monthly",
      description: "Start where you are. Leverage cottage food laws to bake fresh rolls right from your home oven with minimal risk and immediate cash flow."
    },
    {
      stage: "Stage 2",
      title: "Bun On The Move™",
      type: "Pop-Ups & Events",
      investment: "$3,000 – $20,000",
      revenue: "$3,000 – $8,000 Monthly",
      description: "Take the show on the road. Perfect for local farmers markets, corporate parkings, town festivals, and exclusive weekend catering events."
    },
    {
      stage: "Stage 3",
      title: "Sweet Rolls™",
      type: "Micro Bakery",
      investment: "$40,000 – $150,000",
      revenue: "$8,000 – $25,000 Monthly",
      description: "Establish a dedicated highly-efficient small-footprint kitchen space. Perfect transition phase leading up to a storefront, featuring localized delivery."
    },
    {
      stage: "Stage 4",
      title: "Bun Factory™",
      type: "Full Storefront",
      investment: "$150,000 – $500,000+",
      revenue: "$25,000+ Monthly",
      description: "The crown jewel. A full-scale experiential flagship retail shop. Signature custom-engineered rolling lanes and queue lines wrapping the block."
    },
    {
      stage: "Stage 5",
      title: "Bun Factory Partners™",
      type: "Multi-Unit Expansion",
      investment: "Varies Based on Area",
      revenue: "Market Development Scale",
      description: "Secure entire exclusive regional territories. Deploy a network of storefronts, pop-ups, and hub-and-spoke delivery operations in your market."
    }
  ];

  const valuePillars = [
    { title: "Quality", desc: "Never compromise. The best local ingredients, regional slow-simmered fruit coulis toppings, and premium secret frost cream." },
    { title: "Hospitality", desc: "Warm, energetic, and unapologetic. Every customer is greeted like a returning family member, with a sample of warm bun." },
    { title: "Craftsmanship", desc: "We are artisans of yeast and temperature. Precision-engineered timing for every individual batch." },
    { title: "Community", desc: "We belong to the neighborhoods we bake in. We sponsor local initiatives and support local growers." },
    { title: "Experience", desc: "A sensory feast. The sweet aroma of brown sugar and yeast curling out of open doors and wrapping around the street." }
  ];

  return (
    <div className="min-h-screen bg-white text-brand-ink selection:bg-brand-terracotta selection:text-brand-cream">
      
      {/* Editorial Hero Layout — White Background */}
      <section className="relative overflow-hidden py-24 md:py-32 px-4 border-b border-brand-ochre/15 bg-white">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-brand-ochre/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-terracotta/5 border border-brand-terracotta/30 rounded-full animate-in fade-in duration-500">
            <Sparkles className="w-4 h-4 text-brand-terracotta animate-pulse" />
            <span className="mono text-[10px] tracking-widest font-black uppercase text-brand-terracotta">Official Opportunity Portfolio</span>
          </div>

          <h1 className="serif text-5xl md:text-8xl font-black tracking-tight leading-none text-brand-ink">
            Built to Scale. <br />
            <span className="text-brand-terracotta italic font-normal">Designed to Stay Human.™</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left max-w-4xl mx-auto border-t border-brand-ochre/25 col-span-3">
            <div className="space-y-2 p-1">
              <span className="serif text-lg font-black text-brand-terracotta block">Accessible Entrepreneurship</span>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                What if starting a business didn't require hundreds of thousands of dollars right out of the gate? We design pathways for everyone.
              </p>
            </div>
            <div className="space-y-2 p-1">
              <span className="serif text-lg font-black text-brand-terracotta block">Start Where You Are</span>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                Begin where you are today and systematically grow as your confidence, experience, and regional customer demand increase.
              </p>
            </div>
            <div className="space-y-2 p-1">
              <span className="serif text-lg font-black text-brand-terracotta block">Inclusive Ownership</span>
              <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                Business ownership shouldn't be reserved purely for people with perfect timing, perfect credit, or perfect circumstances.
              </p>
            </div>
          </div>

          {/* Trademark & Localized Naming Opportunity Callout */}
          <div className="pt-6">
            <div className="bg-amber-50/40 border-2 border-dashed border-brand-ochre/25 max-w-3xl mx-auto p-6 md:p-8 rounded-3xl text-left space-y-4 shadow-sm animate-in fade-in duration-700">
              <div className="flex items-center space-x-2">
                <span className="p-1 px-2.5 bg-brand-ink text-brand-cream mono text-[9px] font-black uppercase tracking-wider rounded">
                  Trademark & Naming Protocol
                </span>
                <span className="text-[10px] mono text-brand-terracotta font-bold">• Master Entity Framework</span>
              </div>
              <div className="space-y-2">
                <h3 className="serif text-xl font-bold text-brand-ink">
                  Bun Factory™: Local Roots, Global Brand
                </h3>
                <p className="text-xs text-zinc-750 leading-relaxed font-semibold">
                  While <strong className="text-brand-ink font-black">Bun Factory™</strong> operates as our main corporate business entity and core trademark framework, we believe genuine community connection starts with local character. 
                  As an officially licensed operator, you are afforded the flexibility to **fully customize the name of your local outlet** to honor your target zone, family history, or neighborhood identity—as long as the words <strong className="text-brand-terracotta font-black uppercase tracking-tight">"Bun Factory"</strong> remain a central, integrated part of your final public trading title (e.g., <em className="text-zinc-900 not-italic font-bold bg-brand-ochre/10 px-1 rounded">"Bobby's Bun Factory"</em>, <em className="text-zinc-900 not-italic font-bold bg-brand-ochre/10 px-1 rounded">"Austin Bun Factory"</em>, or <em className="text-zinc-900 not-italic font-bold bg-brand-ochre/10 px-1 rounded">"The Midtown Bun Factory"</em>).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <div className="bg-zinc-50 border border-brand-ochre/25 max-w-lg mx-auto p-5 rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-sm">
              <span className="mono text-[9px] font-black tracking-widest uppercase text-brand-terracotta">Bobby's Ultimate Manifesto</span>
              <span className="serif text-sm md:text-base font-extrabold italic text-center text-brand-ink">
                "Anybody With An Oven, Ambition, and Franchise Fees.™" 😉
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* The Roadmap Stages — Black/Dark Background Section */}
      <section className="py-24 px-4 bg-brand-ink text-brand-cream border-t border-b border-brand-ochre/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(214,142,57,0.04),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="space-y-4 mb-16 text-center md:text-left">
            <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest bg-brand-cream/10 px-3 py-1 rounded border border-brand-ochre/20">The Roadmap™</span>
            <h2 className="serif text-4xl md:text-6xl font-black text-brand-cream">5 Stages of Modular Growth</h2>
            <p className="text-sm md:text-base text-brand-cream/80 max-w-2xl leading-relaxed">
              Unlike traditional rigid franchises that force you to buy expensive retail real estate instantly, the Bun Factory ecosystem lets you choose your initial investment tier and expand at your command.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {roadmapStages.map((stage, idx) => (
              <div 
                key={idx} 
                className="bg-zinc-950/60 p-6 border border-brand-ochre/15 hover:border-brand-terracotta/40 transition-all duration-300 rounded-2xl flex flex-col justify-between relative group"
              >
                <div className="absolute top-4 right-4 text-xs font-black mono text-brand-ochre/30 group-hover:text-brand-terracotta/50 transition-colors">
                  {stage.stage}
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="mono text-[9px] uppercase tracking-wider text-brand-ochre/70 font-semibold">{stage.type}</span>
                    <h3 className="serif text-xl font-black text-brand-cream">{stage.title}</h3>
                  </div>

                  <p className="text-xs text-brand-cream/70 leading-relaxed min-h-[100px]">{stage.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-brand-ochre/10 space-y-2">
                  <div className="flex justify-between items-center text-[10px] mono">
                    <span className="text-brand-cream/50 font-medium">EST. INVESTMENT:</span>
                    <span className="text-brand-cream font-bold">{stage.investment}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] mono">
                    <span className="text-brand-cream/50 font-medium">REVENUE GOAL:</span>
                    <span className="text-brand-ochre font-extrabold">{stage.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operator Match System — White Background Section */}
      <section className="py-24 px-4 bg-zinc-50/50 border-b border-brand-ochre/15">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* WHO THRIVES — Now includes Systemized Creatives */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded">
                <Users className="w-4 h-4" />
                <span className="mono text-[10px] font-black tracking-widest uppercase">Operator Blueprint</span>
              </div>
              <h3 className="serif text-3xl md:text-4xl font-black text-brand-ink">Who Thrives in Bun Factory™?</h3>
              <p className="text-xs text-zinc-650 font-semibold">Our most thriving operators represent highly motivated, proactive profiles:</p>
            </div>

            <div className="space-y-4">
              {[
                { title: "Creative System-Followers", desc: "Creative people that can follow a system. They realize that perfect operations and consistency unlock incredible leverage without boring overhead or reinventing the wheel." },
                { title: "Young Entrepreneurs", desc: "Determined, ambitious individuals hungry to build their first high-cash-flow bakeshop business." },
                { title: "Burned-Out Corporate Employees", desc: "Corporate-ladder refugees seeking tangible brand purpose, flexibility, and absolute self-ownership." },
                { title: "Retired Professionals", desc: "Experienced executives craving a fun, structured community-oriented project that stays physically human and delicious." },
                { title: "Side Hustlers", desc: "Resourceful makers ready to systematically scale home-baked side income into massive regional roll empires." },
                { title: "Community Builders", desc: "People-centric connectors who genuinely enjoy serving, talking with, and feeding their neighbors." }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white border border-brand-ochre/15 rounded-2xl space-y-1.5 hover:border-emerald-600/35 transition-all shadow-sm">
                  <span className="serif text-base font-extrabold text-emerald-600 block">{item.title}</span>
                  <p className="text-xs text-zinc-600 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* WHO IS NOT A FIT */}
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-brand-terracotta bg-brand-terracotta/5 border border-brand-terracotta/20 px-3 py-1 rounded">
                <Ban className="w-4 h-4" />
                <span className="mono text-[10px] font-black tracking-widest uppercase">The Filter</span>
              </div>
              <h3 className="serif text-3xl md:text-4xl font-black text-brand-ink">Who is NOT a Good Fit?</h3>
              <p className="text-xs text-zinc-650 font-semibold">To maintain brand excellence, we actively screen out candidates who align with these qualities:</p>
            </div>

            <div className="space-y-4">
              {[
                { title: "Refuse Brand Standards", desc: "Our systems guarantee precision. If you skip protocols, ignore oven temperatures, or drift from recipes, this is not for you." },
                { title: "Want Zero-Effort Passive Income", desc: "This is a hands-on craft bakeshop model. It requires active presence, positive energy, hospitality, and consistent daily execution." },
                { title: "Constantly Ignore Systems", desc: "Our global playbook drives unit profitability. We search for coachable partners who respect operations and follow established routines." },
                { title: "Want to Reinvent Everything", desc: "The Bun Factory formula is proven. If your ultimate goal is to immediately redesign the core menu and concept, buy an independent oven." },
                { title: "Expect Immediate Overnight Success", desc: "A great regional bakery requires effort, consistency, local relationship building, and strict commitment. We are a business, not a lottery ticket." }
              ].map((item, i) => (
                <div key={i} className="p-5 bg-white border border-brand-terracotta/15 rounded-2xl space-y-1.5 hover:border-brand-terracotta/35 transition-all shadow-sm">
                  <span className="serif text-base font-extrabold text-brand-terracotta block">{item.title}</span>
                  <p className="text-xs text-zinc-600 leading-relaxed font-semibold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Support & Training Ecosystem — Black/Dark Background Section */}
      <section className="py-24 px-4 bg-brand-ink text-brand-cream border-t border-b border-brand-ochre/25 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,142,57,0.04),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="mono text-[10px] text-brand-ochre uppercase font-black tracking-widest bg-brand-cream/10 px-3 py-1 rounded border border-brand-ochre/20">Resources & Systems</span>
              <h3 className="serif text-3xl md:text-5xl font-black text-brand-cream leading-tight">
                What You Receive & Support Blueprint
              </h3>
              <p className="text-sm text-brand-cream/80 leading-relaxed">
                We never expect you to figure out this business alone. From recipes to layouts, we arm our team with cohesive infrastructure.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Bun Factory University™",
                  "The Bun Book™ Standards",
                  "Secret Frost™ Systems",
                  "Fru-Fru Culinary Coulis Systems",
                  "Territory Protection Map",
                  "Ongoing Mentorship Access"
                ].map((support, ind) => (
                  <div key={ind} className="flex items-center space-x-2 text-xs">
                    <span className="text-brand-terracotta font-black text-sm">✦</span>
                    <span className="font-semibold text-brand-cream/90">{support}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-950 p-8 border border-brand-ochre/25 rounded-[2.5rem] relative space-y-6">
              <div className="inline-flex items-center gap-2 text-brand-ochre bg-brand-cream/10 border border-brand-ochre/20 px-3 py-1 rounded">
                <Megaphone className="w-3.5 h-3.5" />
                <span className="mono text-[8px] font-black tracking-widest uppercase">The Caviar Collective™</span>
              </div>
              
              <h4 className="serif text-xl font-bold text-brand-cream">Operators Shape the Empire</h4>
              <p className="text-xs text-brand-cream/80 leading-relaxed">
                Most standard franchises tell operators exactly what to do and shut they doors to creativity. Bun Factory™ invites developers to actively make the system better. Through the **Caviar Collective™**, operators can:
              </p>

              <ul className="space-y-2 text-xs text-brand-cream/80">
                <li className="flex items-start gap-2">
                  <span className="text-brand-ochre mt-0.5">•</span>
                  <span><strong>Create New Products:</strong> Propose regional flavor profiles for monthly custom rolls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-ochre mt-0.5">•</span>
                  <span><strong>Co-development Workshops:</strong> Direct pipeline to our executive R&D kitchens.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-ochre mt-0.5">•</span>
                  <span><strong>Earn National Recognition:</strong> Win the prestigious <strong>Factory Select™</strong> award for top creative bakes.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Scale Philosophy — White Background Section */}
      <section className="py-24 px-4 bg-white border-t border-brand-ochre/15 text-center text-brand-ink">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
          <span className="mono text-[10px] text-brand-terracotta bg-brand-terracotta/5 border border-brand-terracotta/20 px-3 py-1 rounded font-black tracking-widest uppercase">Our Unforgiving Manifesto</span>
          <h3 className="serif text-3xl md:text-5xl font-black text-brand-ink">Built to Scale. Designed to Stay Human.</h3>
          
          <p className="text-sm text-zinc-650 font-medium leading-relaxed max-w-xl mx-auto">
            We believe corporate growth should never come at the expense of our five absolute non-negotiables:
          </p>

          <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
            {valuePillars.map((p, i) => (
              <span key={i} className="bg-brand-ink text-brand-cream border border-brand-ink px-4 py-1.5 rounded-full mono text-[9px] font-black uppercase tracking-wider">
                {p.title}
              </span>
            ))}
          </div>

          <blockquote className="serif text-lg md:text-xl font-black italic text-brand-terracotta max-w-lg mx-auto py-4 border-t border-b border-brand-ochre/15">
            "The goal is not to become the biggest bakery company. The goal is to become one of the most respected."
          </blockquote>
        </div>
      </section>

      {/* Interactive Waitlist Application Form — White Background Section */}
      <section className="py-24 px-4 bg-zinc-50/30 border-t border-brand-ochre/15">
        <div className="max-w-4xl mx-auto text-brand-ink">
          <div className="text-center space-y-4 mb-12">
            <span className="mono text-[10px] text-brand-terracotta uppercase font-black tracking-widest bg-brand-terracotta/5 border border-brand-terracotta/15 px-3 py-1 rounded">Enrollment Protocol</span>
            <h3 className="serif text-3xl md:text-5xl font-black text-brand-ink">Request Exclusive Territory Intel</h3>
            <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed font-semibold">
              Be the first to secure territory maps and receive invitations to Discovery Calls when applications unlock in your zone.
            </p>
          </div>

          {/* Form Card */}
          <div className="max-w-xl mx-auto bg-brand-ink text-brand-cream p-8 border border-brand-ochre/25 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-terracotta/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              {submitted ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <span className="inline-block p-4 bg-brand-terracotta/10 text-brand-terracotta rounded-full mb-3">
                    <Rocket className="w-8 h-8 animate-bounce" />
                  </span>
                  <h5 className="font-heading font-black text-lg text-brand-ochre uppercase tracking-widest mb-2">
                    Sweet Desires Registered
                  </h5>
                  <p className="text-xs text-brand-cream/70 leading-relaxed max-w-xs mx-auto">
                    Your franchise profile and desired territory details have been successfully mapped to Bobby’s high-command pipeline. We will whisper back soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {errorMsg && (
                    <div className="p-4 bg-rose-900/40 border border-rose-500/35 text-rose-200 text-xs rounded-xl font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-heading text-brand-ochre mb-1.5 font-bold">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900/60 border border-brand-ochre/20 focus:border-brand-terracotta rounded-xl px-4 py-3 text-xs text-brand-cream focus:outline-none font-sans disabled:opacity-50"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-heading text-brand-ochre mb-1.5 font-bold">
                        Email address
                      </label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900/60 border border-brand-ochre/20 focus:border-brand-terracotta rounded-xl px-4 py-3 text-xs text-brand-cream focus:outline-none font-sans disabled:opacity-50"
                        placeholder="e.g. jdoe@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-heading text-brand-ochre mb-1.5 font-bold">
                        Desired Territory / Region
                      </label>
                      <input 
                        type="text" 
                        required
                        value={territory}
                        onChange={(e) => setTerritory(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900/60 border border-brand-ochre/20 focus:border-brand-terracotta rounded-xl px-4 py-3 text-xs text-brand-cream focus:outline-none font-sans disabled:opacity-50"
                        placeholder="e.g. Austin, TX"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest font-heading text-brand-ochre mb-1.5 font-bold">
                        Available Investment Capital
                      </label>
                      <select 
                        value={capital}
                        onChange={(e) => setCapital(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full bg-zinc-900 border border-brand-ochre/20 focus:border-brand-terracotta rounded-xl px-4 py-3 text-xs text-brand-cream focus:outline-none font-sans"
                      >
                        <option value="$500 – $5,000 (Stage 1)">$500 – $5,000 (Stage 1)</option>
                        <option value="$3,000 – $20,000 (Stage 2)">$3,000 – $20,000 (Stage 2)</option>
                        <option value="$40,000 – $150,000 (Stage 3)">$40,000 – $150,000 (Stage 3)</option>
                        <option value="$150,000 – $500,000+ (Stage 4 & 5)">$150,000 – $500,000+ (Stage 4 & 5)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-terracotta hover:bg-brand-terracotta/90 text-brand-cream py-4 rounded-xl font-heading font-black uppercase text-xs tracking-widest transition-all active:scale-[0.98] mt-2 shadow-lg shadow-brand-terracotta/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Interest Application"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-center pt-8">
            <button 
              disabled 
              className="bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-none block mx-auto transition-all"
            >
              Download Official Franchise kit (Coming Soon)
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Franchise;
