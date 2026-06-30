import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [receiveOffers, setReceiveOffers] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Clear states when toggled or closed
  useEffect(() => {
    setEmail('');
    setPassword('');
    setUsername('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(false);
  }, [isOpen, isSignUp]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (isSignUp && !username.trim()) {
      setErrorMsg('Please enter a username');
      return;
    }
    if (!email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const targetName = isSignUp ? username : email.split('@')[0];
      const finalizedName = targetName.charAt(0).toUpperCase() + targetName.slice(1);
      
      setSuccessMsg(isSignUp ? 'Yeast culture successfully generated! Welcome aboard.' : `Signed in as ${finalizedName}!`);
      
      // Pass the username back on successful login after 1.2s delay
      setTimeout(() => {
        onLoginSuccess(finalizedName);
        onClose();
      }, 1200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-ink/75 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Modal Card wrapper */}
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden border border-brand-ochre/15 shadow-2xl transition-all p-8 md:p-10 animate-in zoom-in-95 duration-200 text-brand-ink">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 bg-zinc-50 hover:bg-zinc-100 text-brand-ink/60 hover:text-brand-ink rounded-full p-2.5 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-terracotta/5 border border-brand-terracotta/20 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-brand-terracotta animate-pulse" />
            <span className="mono text-[8.5px] tracking-widest font-black uppercase text-brand-terracotta">
              {isSignUp ? 'The Sweet Temptation' : 'The Key to Seduction'}
            </span>
          </div>

          <h2 className="serif text-3xl md:text-4xl font-black text-brand-ink leading-tight">
            {isSignUp ? 'Become a Patron' : 'Welcome Back'}
          </h2>
          <p className="text-[11px] md:text-xs text-zinc-500 font-semibold leading-relaxed max-w-[260px] mx-auto">
            {isSignUp 
              ? 'Unlock restricted oven updates, limited custom glaze droplets, and VIP box drops.' 
              : 'Sign in to access your saved box recipes and order history details.'
            }
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-2.5 text-rose-800 text-xs animate-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 mb-2">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            </div>
            <h4 className="serif text-xl font-black text-brand-ink">
              Authentication Approved
            </h4>
            <p className="text-zinc-550 text-xs leading-relaxed max-w-xs mx-auto font-medium">
              {successMsg}
            </p>
            <div className="flex justify-center items-center space-x-2 text-[10px] mono text-brand-terracotta font-black uppercase tracking-widest pt-2">
              <span className="w-1.5 h-1.5 bg-brand-terracotta rounded-full animate-ping" />
              <span>Initializing Gearbox...</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Input - SignUp only */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-widest font-black text-brand-ink/60">
                  Custom Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-zinc-50 border border-zinc-150 rounded-xl pl-11 pr-4 py-3.5 text-xs text-brand-ink focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/10 outline-none transition-all font-sans"
                    placeholder="e.g. BunRider99"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-widest font-black text-brand-ink/60">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-150 rounded-xl pl-11 pr-4 py-3.5 text-xs text-brand-ink focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/10 outline-none transition-all font-sans"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[9px] uppercase tracking-widest font-black text-brand-ink/60">
                  Password
                </label>
                {!isSignUp && (
                  <button 
                    type="button"
                    onClick={() => setErrorMsg('Reset token dispatched. Check your cosmic mailbox!')}
                    className="text-[9px] uppercase tracking-wider font-extrabold text-brand-terracotta hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-zinc-50 border border-zinc-150 rounded-xl pl-11 pr-12 py-3.5 text-xs text-brand-ink focus:border-brand-terracotta focus:ring-2 focus:ring-brand-terracotta/10 outline-none transition-all font-sans"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Newsletter toggle for Sign Up */}
            {isSignUp && (
              <label className="flex items-start gap-2.5 pt-1.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={receiveOffers}
                  onChange={(e) => setReceiveOffers(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-300 text-brand-terracotta focus:ring-brand-terracotta transition-colors h-4 w-4"
                />
                <span className="text-[10px] text-zinc-500 font-semibold leading-relaxed">
                  I wish to receive elite oven drop notifications and customized VIP recipe secrets.
                </span>
              </label>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-ink text-brand-cream hover:bg-brand-terracotta hover:text-brand-cream font-black uppercase text-xs tracking-widest py-4.5 rounded-xl transition-all shadow-xl hover:shadow-brand-terracotta/10 flex items-center justify-center space-x-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <span>{isLoading ? 'Processing Yeast...' : isSignUp ? 'Generate Account' : 'Authenticate'}</span>
              {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>

            {/* Switch Mode link */}
            <div className="pt-6 border-t border-zinc-100 text-center text-xs text-zinc-500 font-semibold font-sans">
              {isSignUp ? (
                <p>
                  Already registered?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsSignUp(false)} 
                    className="text-brand-terracotta hover:underline font-black"
                  >
                    Authenticate here
                  </button>
                </p>
              ) : (
                <p>
                  New to the Factory?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsSignUp(true)} 
                    className="text-brand-terracotta hover:underline font-black"
                  >
                    Apply for an Account
                  </button>
                </p>
              )}
            </div>

          </form>
        )}

      </div>

    </div>
  );
};

export default AuthModal;
