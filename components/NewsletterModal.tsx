import React, { useState, useEffect } from 'react';
import { Mail, Sparkles, X, Gift, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { velvetAppleBun } from '../constants';

const NewsletterModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Show popup after 3 seconds on first load of session
    const hasSeen = sessionStorage.getItem('hasSeenNewsletterPopup');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('hasSeenNewsletterPopup', 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/submit-newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSuccess(true);
        setEmail('');
        setName('');
        // Close after 4 seconds automatically on success
        setTimeout(() => {
          setIsOpen(false);
          setIsSuccess(false);
        }, 4000);
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to join our reserve. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Tiny Persistent Floating Invitation Hub */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-brand-ink text-brand-ochre hover:bg-brand-terracotta hover:text-brand-cream px-4 py-3 rounded-full border border-brand-ochre/25 shadow-2xl font-sans text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 select-none active:scale-95"
          id="newsletter-floating-trigger"
        >
          <Gift className="w-3.5 h-3.5 animate-bounce" />
          <span>Get Free Drops & Prizes</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-brand-ink/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-brand-cream border border-brand-sand/40 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-none"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 z-10 w-9 h-9 bg-brand-ink text-brand-ochre hover:text-brand-cream rounded-full flex items-center justify-center transition-colors shadow-lg border border-brand-ochre/20"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Seductive Velvet Apple Bun Hero Column */}
              <div className="relative md:col-span-5 h-48 md:h-auto min-h-[160px] overflow-hidden bg-brand-ink">
                <img
                  src={velvetAppleBun}
                  alt="Seductive Velvet Apple Bun"
                  className="w-full h-full object-cover object-center scale-105 filter brightness-95 contrast-105"
                  referrerPolicy="no-referrer"
                />
                {/* Visual Accent Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-brand-ink/10 to-brand-ink/30" />
                <div className="absolute bottom-4 left-4 right-4 bg-brand-ink/80 backdrop-blur-md border border-brand-ochre/15 p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-ochre block">Today's Star Drop</span>
                    <span className="serif text-xs font-black text-brand-cream">Velvet Apple Bun</span>
                  </div>
                  <span className="text-[10px] font-mono text-brand-terracotta font-black uppercase">Signature</span>
                </div>
              </div>

              {/* Invitation Copy & Sign-Up Column */}
              <div className="p-8 md:p-12 md:col-span-7 flex flex-col justify-center overflow-y-auto">
                {isSuccess ? (
                  <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                      <CheckCircle2 className="w-8 h-8 font-black" />
                    </div>
                    <h3 className="serif text-2xl font-black text-brand-ink uppercase tracking-wider mb-2">
                      Welcome to the Vault!
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed max-w-sm mx-auto font-semibold">
                      Your invite has been locked in! We've registered your profile and dispatched the secret drop discounts directly to your inbox.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-brand-terracotta/10 text-brand-terracotta border border-brand-terracotta/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                      <Sparkles className="w-3 h-3" />
                      <span>Bobby's Inner Secret Reserve</span>
                    </div>

                    <h2 className="serif text-2.5xl md:text-3xl font-black text-brand-ink leading-tight mb-3">
                      The Seduction of <span className="text-brand-terracotta italic font-medium">Velvet Apple</span>
                    </h2>
                    <p className="text-xs text-zinc-500 font-semibold mb-6 leading-relaxed">
                      Indulge in Bobby's elite inner circle. Join our exclusive mailing list today for early menu feature drops, limited bun batches, special 20% discounts, and custom prizes.
                    </p>

                    <form onSubmit={handleSubscribe} className="space-y-4">
                      {errorMsg && (
                        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                          {errorMsg}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">Your First Name</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="e.g. Bobby"
                            className="w-full bg-white border border-brand-sand/30 focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/20 rounded-xl px-4 py-3 text-xs outline-none transition-all font-sans text-brand-ink font-semibold disabled:opacity-50"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1.5">Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="name@example.com"
                            className="w-full bg-white border border-brand-sand/30 focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/20 rounded-xl px-4 py-3 text-xs outline-none transition-all font-sans text-brand-ink font-semibold disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-4 bg-brand-ink text-brand-ochre hover:bg-brand-terracotta hover:text-brand-cream py-4 rounded-xl font-heading font-black uppercase text-xs tracking-widest transition-all shadow-xl hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <Mail className="w-4 h-4" />
                        <span>{isSubmitting ? 'Joining Reserve...' : 'Indulge Me & Send Discounts'}</span>
                      </button>
                    </form>

                    <p className="border-t border-brand-sand/20 mt-6 pt-4 text-[9px] text-zinc-400 font-semibold leading-normal">
                      * Fresh drops dispatched weekly. We do not sell or trade your data. Opt-out at any time. Unlocks immediately.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NewsletterModal;
