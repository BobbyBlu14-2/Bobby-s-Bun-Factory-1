import React, { useEffect, useState } from 'react';
import { 
  User, 
  Package, 
  Dribbble, 
  Award, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Receipt, 
  HelpCircle, 
  Heart, 
  ChevronDown, 
  RotateCcw, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { 
  fourPackBuns, 
  sixPackHorizontal, 
  velvetAppleBun, 
  classicSingleBun, 
  peachSingleBun,
  singleFruitCaviarBun,
  petitFrostCup,
  coupeFrostJar,
  doubleGrandeCaviarJars
} from '../constants';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  modifier?: string;
  image?: string;
}

interface OrderHistory {
  id: string;
  date: string;
  type: 'pickup' | 'delivery' | 'shipping';
  status: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  address?: string;
  pickupTime?: string;
}

interface FavoriteBox {
  id: string;
  name: string;
  size: number;
  toppings: string[];
  frosting: string;
}

const Profile: React.FC<{ currentUser: string | null; onOpenAuth: () => void }> = ({ currentUser, onOpenAuth }) => {
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [favorites, setFavorites] = useState<FavoriteBox[]>([
    {
      id: 'fav-1',
      name: 'Autumn Crunch Special',
      size: 4,
      toppings: ['Velvet Apple', 'Salted Caramel', 'Chocolate Cherry Bomb'],
      frosting: 'Secret Frost'
    },
    {
      id: 'fav-2',
      name: 'Berry Bomb Box',
      size: 6,
      toppings: ['Wildberry', 'Blueberry', 'Strawberry', 'Lemon'],
      frosting: 'Meyer Lemon Whip'
    }
  ]);
  const [activeTab, setActiveTab] = useState<'history' | 'loyalty' | 'favorites'>('history');

  // Simulated Orders to fall back on or enrich the experience
  const simulatedOrders: OrderHistory[] = [
    {
      id: 'BBF-98842-GA',
      date: '2026-06-12',
      type: 'pickup',
      status: 'Ready & Collected • Clean Cook',
      subtotal: 39.50,
      discount: 4.50,
      tax: 2.80,
      total: 37.80,
      pickupTime: 'June 12, 2026 at 11:30 AM',
      address: 'Atlanta Factory #04 (Dacula)',
      items: [
        {
          name: 'The Custom Bun Box (6-Pack)',
          quantity: 1,
          price: 24.50,
          modifier: 'Premium: 2x Velvet Apple, 2x Peach Outlaw, 2x Cookies & Cream',
          image: sixPackHorizontal
        },
        {
          name: 'Coupe de Frost (8 oz)',
          quantity: 2,
          price: 7.50,
          modifier: 'Custom Glass Mason Jar',
          image: coupeFrostJar
        }
      ]
    },
    {
      id: 'BBF-87114-X',
      date: '2026-05-28',
      type: 'delivery',
      status: 'Dispatched & Enjoyed',
      subtotal: 18.00,
      discount: 0.00,
      tax: 1.44,
      total: 19.44,
      address: '742 Yeast Boulevard, Atlanta GA',
      items: [
        {
          name: 'The Custom Bun Box (4-Pack)',
          quantity: 1,
          price: 18.00,
          modifier: 'Classic Glaze + Blueberry Caviar',
          image: fourPackBuns
        }
      ]
    },
    {
      id: 'BBF-70139-SV',
      date: '2026-05-14',
      type: 'shipping',
      status: 'Sealed Cold & Delivered',
      subtotal: 58.00,
      discount: 5.00,
      tax: 4.24,
      total: 57.24,
      address: '112 Baker Lane, East Point GA',
      items: [
        {
          name: 'Fru-Fru Culinary Coulis Double-Pack',
          quantity: 1,
          price: 28.00,
          modifier: 'Double 32 oz Grand Jars',
          image: doubleGrandeCaviarJars
        },
        {
          name: 'Classic Single Yeast Roll',
          quantity: 3,
          price: 5.00,
          modifier: 'Raw Brown sugar glaze',
          image: classicSingleBun
        },
        {
          name: 'Petit Frost (3.5 oz Cup)',
          quantity: 3,
          price: 5.00,
          modifier: 'In black plastic storage cups',
          image: petitFrostCup
        }
      ]
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);

    // Load actual user purchases from localStorage if they exist, merged with simulation
    try {
      const stored = localStorage.getItem('bobbys_orders');
      if (stored) {
        const parsed = JSON.parse(stored) as OrderHistory[];
        // Merge real purchases on top of simulated ones
        setOrders([...parsed, ...simulatedOrders]);
      } else {
        setOrders(simulatedOrders);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable', e);
      setOrders(simulatedOrders);
    }
  }, [currentUser]);

  // Handle re-ordering
  const handleReorder = (order: OrderHistory) => {
    alert(`Recipe for ${order.id} transferred directly to your oven session basket! Check checkout space to proceed.`);
  };

  // Convert points
  const pointsEarned = orders.reduce((acc, curr) => acc + Math.floor(curr.total * 10), 0);
  const nextTierPoints = 2000;
  const currentRatio = Math.min((pointsEarned / nextTierPoints) * 100, 100);

  // Determine Tier Title
  const getTierName = (pts: number) => {
    if (pts >= 2000) return 'Grand High Master Bun';
    if (pts >= 1200) return 'Glaze Outlaw';
    if (pts >= 500) return 'Proofing Advocate';
    return 'Yeast Apprentice';
  };

  const currentTier = getTierName(pointsEarned);

  return (
    <div className="min-h-screen bg-brand-cream/5 text-brand-ink selection:bg-brand-orange selection:text-white pb-16">
      
      {/* HEADER HERO AREA */}
      <section className="bg-white border-b border-brand-ochre/15 pt-12 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-8">
            
            {/* User Profile Summary */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-tr from-brand-orange to-brand-terracotta flex items-center justify-center text-white border-4 border-white shadow-xl overflow-hidden p-1">
                  <div className="w-full h-full rounded-full bg-brand-ink flex items-center justify-center">
                    <User className="w-10 h-10 md:w-12 md:h-12 text-brand-cream" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-brand-terracotta text-white rounded-full p-1.5 border-2 border-white flex items-center justify-center shadow-lg">
                  <Award className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="mono text-[9px] uppercase font-black tracking-widest text-brand-terracotta px-2.5 py-0.5 bg-brand-terracotta/5 border border-brand-terracotta/20 rounded-full">
                    Average Patron Account
                  </span>
                  <span className="mono text-[9px] uppercase font-bold text-zinc-400">
                    ID: BBF-{(currentUser ? currentUser.length * 97 : 504)}
                  </span>
                </div>
                <h1 className="serif text-3xl md:text-5xl font-black text-brand-ink leading-none">
                  {currentUser ? `Hello, ${currentUser}!` : 'Loyalty Portal'}
                </h1>
                <p className="text-xs text-zinc-500 font-semibold max-w-sm">
                  {currentUser 
                    ? 'Welcome back to the High Command. See your Swirl Points, previous box drops, and recipes below.'
                    : 'Log in to track your real purchase history and earn free custom boxes.'
                  }
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center space-x-4">
              <div className="bg-brand-cream/10 border border-brand-ochre/15 rounded-[1.5rem] p-5 flex items-center space-x-4 shadow-sm bg-white min-w-[200px]">
                <div className="w-12 h-12 rounded-xl bg-brand-terracotta/5 border border-brand-terracotta/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-brand-terracotta" />
                </div>
                <div>
                  <div className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">Swirl Points</div>
                  <div className="text-2xl font-black text-brand-ink">{pointsEarned} <span className="text-[10px] text-zinc-400">Pts</span></div>
                  <div className="text-[9px] font-semibold text-brand-terracotta uppercase">{currentTier}</div>
                </div>
              </div>

              {!currentUser && (
                <button 
                  onClick={onOpenAuth}
                  className="bg-brand-ink text-brand-cream hover:bg-brand-terracotta hover:text-brand-cream text-xs font-black uppercase tracking-widest py-5 px-6 rounded-2xl transition-all shadow-xl"
                >
                  Connect Account
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED TABS NAVIGATION */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex space-x-2 border-b border-brand-ochre/15 pb-4">
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'history' 
                ? 'bg-brand-ink text-brand-cream shadow-md' 
                : 'hover:bg-zinc-100 text-brand-ink/65 hover:text-brand-ink'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('loyalty')}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'loyalty' 
                ? 'bg-brand-ink text-brand-cream shadow-md' 
                : 'hover:bg-zinc-100 text-brand-ink/65 hover:text-brand-ink'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Loyalty & Tiers</span>
          </button>

          <button 
            onClick={() => setActiveTab('favorites')}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all flex items-center space-x-2 ${
              activeTab === 'favorites' 
                ? 'bg-brand-ink text-brand-cream shadow-md' 
                : 'hover:bg-zinc-100 text-brand-ink/65 hover:text-brand-ink'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favorite Boxes ({favorites.length})</span>
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="serif text-2xl font-black text-brand-ink mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-terracotta" />
                <span>Past Batch Requests</span>
              </h3>

              {orders.length === 0 ? (
                <div className="bg-white border border-brand-ochre/15 rounded-[2rem] p-12 text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="serif text-xl font-bold">Ovens Quiet...</h4>
                    <p className="text-zinc-500 text-xs mt-1">No recorded purchases located on this terminal.</p>
                  </div>
                  <button className="bg-brand-terracotta text-brand-cream px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Place First Order
                  </button>
                </div>
              ) : (
                orders.map((order) => (
                  <div 
                    key={order.id}
                    className={`bg-white border transition-all rounded-[2rem] p-6 hover:shadow-md cursor-pointer ${
                      selectedOrder?.id === order.id ? 'border-brand-terracotta ring-1 ring-brand-terracotta/25' : 'border-brand-ochre/15'
                    }`}
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-3.5 flex-wrap">
                          <span className="mono text-[10px] font-black text-brand-ink">
                            {order.id}
                          </span>
                          <span className="text-zinc-300">|</span>
                          <span className="text-xs font-semibold text-zinc-500 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {order.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-zinc-100 text-zinc-800 text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full">
                            {order.type}
                          </span>
                          <span className="bg-emerald-50 text-emerald-800 text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 fill-emerald-800 text-white" />
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                        <div className="text-left md:text-right">
                          <div className="text-[9px] font-black uppercase text-zinc-450 tracking-wider">Total Charge</div>
                          <div className="text-lg font-black text-brand-ink">${order.total.toFixed(2)}</div>
                          <div className="text-[10px] text-zinc-400 font-bold">{order.items.reduce((acc, curr) => acc + curr.quantity, 0)} items</div>
                        </div>
                        <div className="text-brand-ink/40 group-hover:text-brand-terracotta transition-colors">
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${selectedOrder?.id === order.id ? 'rotate-180 text-brand-terracotta' : ''}`} />
                        </div>
                      </div>

                    </div>

                    {/* Expansive Detail View */}
                    {selectedOrder?.id === order.id && (
                      <div className="mt-6 pt-6 border-t border-zinc-100 space-y-4 animate-in slide-in-from-top-4 duration-300">
                        <h4 className="mono text-[10px] uppercase font-black tracking-widest text-brand-terracotta">
                          Items Breakdown
                        </h4>

                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100">
                              <div className="flex items-center space-x-3">
                                {item.image ? (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-10 object-cover rounded-xl border border-zinc-200" 
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-brand-cream/10 rounded-xl flex items-center justify-center">
                                    <Package className="w-5 h-5 text-brand-terracotta" />
                                  </div>
                                )}
                                <div>
                                  <div className="text-xs font-bold text-brand-ink">{item.name}</div>
                                  <div className="text-[10px] text-zinc-400 font-semibold">{item.modifier}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-bold text-brand-ink">${(item.price * item.quantity).toFixed(2)}</div>
                                <div className="text-[10px] font-semibold text-zinc-400">Qty {item.quantity} • ${item.price.toFixed(2)} ea</div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Address or Pickup info */}
                        <div className="bg-brand-cream/10 border border-brand-ochre/15 rounded-2xl p-4 flex flex-col md:flex-row justify-between text-xs font-semibold text-zinc-600 gap-4">
                          <div>
                            <span className="block text-[8px] uppercase tracking-wider font-extrabold text-zinc-400">Fulfillment Target</span>
                            <span className="text-brand-ink font-bold mt-0.5 block">{order.type === 'pickup' ? order.address : 'Ship Address'}</span>
                          </div>
                          {order.pickupTime && (
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-zinc-400">Scheduled Handover</span>
                              <span className="text-brand-ink font-bold mt-0.5 block">{order.pickupTime}</span>
                            </div>
                          )}
                          {!order.pickupTime && order.address && (
                            <div>
                              <span className="block text-[8px] uppercase tracking-wider font-extrabold text-zinc-400">Dispatch Location</span>
                              <span className="text-brand-ink font-bold mt-0.5 block">{order.address}</span>
                            </div>
                          )}
                        </div>

                        {/* Totals Frame and Action row */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between border-t border-dashed border-zinc-200 pt-5 gap-4">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorder(order);
                            }}
                            className="bg-zinc-900 text-brand-ochre hover:bg-brand-terracotta hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center space-x-2"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Quick Reorder Batch</span>
                          </button>

                          <div className="space-y-1 text-right text-xs">
                            <div className="flex justify-between md:justify-end gap-6 text-zinc-500 font-semibold">
                              <span>Subtotal:</span>
                              <span className="font-bold text-brand-ink">${order.subtotal.toFixed(2)}</span>
                            </div>
                            {order.discount > 0 && (
                              <div className="flex justify-between md:justify-end gap-6 text-emerald-600 font-semibold">
                                <span>Discounts/Voucher:</span>
                                <span>-${order.discount.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between md:justify-end gap-6 text-zinc-500 font-semibold">
                              <span>Taxes:</span>
                              <span className="font-bold text-brand-ink">${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between md:justify-end gap-6 text-sm font-black text-brand-ink pt-1 border-t border-zinc-100">
                              <span>Paid Amount:</span>
                              <span className="text-brand-terracotta">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                ))
              )}
            </div>

            {/* Sidebar receipts helper */}
            <div className="space-y-6">
              
              <div className="bg-brand-ink text-brand-cream rounded-[2.5rem] p-6 border border-brand-terracotta/20 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-terracotta/10 rounded-full blur-2xl pointer-events-none" />
                
                <h3 className="serif text-xl font-black mb-1 text-brand-cream">
                  Oven Security Pass
                </h3>
                <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed mb-6">
                  Verify purchase history records or quickly duplicate previous customized batch recipes into the oven pipeline instantly.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                    <ShieldCheck className="w-5 h-5 text-brand-ochre flex-shrink-0" />
                    <div>
                      <div className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Status</div>
                      <div className="text-xs font-bold text-white">Cryptographically Verified</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3.5 bg-white/5 border border-white/10 rounded-2xl">
                    <Receipt className="w-5 h-5 text-brand-ochre flex-shrink-0" />
                    <div>
                      <div className="text-[9px] uppercase tracking-wider font-extrabold text-zinc-400">Total Bakes</div>
                      <div className="text-xs font-bold text-white">{orders.length} Handcrafted Transactions</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 text-[10px] text-zinc-500 font-semibold">
                  * Average customer calculations update dynamically across web caches. For any queries, write info@bobbysbunfactory.com.
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: LOYALTY & TIERS */}
        {activeTab === 'loyalty' && (
          <div className="bg-white border border-brand-ochre/15 rounded-[2.5rem] p-8 md:p-12 mt-8 space-y-12">
            
            {/* Progress Meter bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-brand-ochre/10 pb-8">
              
              <div className="space-y-2">
                <span className="mono text-[10px] font-black uppercase tracking-wider text-brand-terracotta">
                  Next Free Custom Box Progress
                </span>
                <h3 className="serif text-3xl font-black text-brand-ink">
                  Glaze Status Meter
                </h3>
                <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                  Earn 10 Swirl Points for every dollar spent at Bobby's Bun Factory. Buy customizable boxes or premium Secret Frost containers to unlock specialized brand tiers and discount coupon rewards.
                </p>
              </div>

              {/* Progress gauge visualizer */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-end text-xs font-black">
                  <span className="text-brand-ink">{pointsEarned} Pts Accumulated</span>
                  <span className="text-zinc-400">{nextTierPoints} Pts Target</span>
                </div>
                
                <div className="w-full bg-zinc-100 rounded-full h-4 overflow-hidden border border-zinc-200 p-0.5">
                  <div 
                    className="bg-brand-terracotta h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${currentRatio}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                  <span>Current: <strong className="text-brand-ink">{currentTier}</strong></span>
                  <span>{nextTierPoints - pointsEarned > 0 ? `${nextTierPoints - pointsEarned} more Swirl Points to Grand High Master Bun!` : 'Target achieved!'}</span>
                </div>
              </div>

            </div>

            {/* Loyalty levels breakdown */}
            <div className="space-y-6">
              <h4 className="serif text-xl font-bold text-brand-ink">
                Bobby's Official Tier Progression
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Tier 1 */}
                <div className={`p-6 rounded-3xl border transition-all ${
                  pointsEarned < 500 ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-sm' : 'border-zinc-200'
                }`}>
                  <Award className={`w-8 h-8 mb-4 ${pointsEarned < 500 ? 'text-brand-terracotta' : 'text-zinc-400'}`} />
                  <h5 className="font-bold text-sm text-brand-ink">Yeast Apprentice</h5>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">0 - 499 Pts</p>
                  <p className="text-xs text-zinc-500 mt-2 font-semibold">Standard access to localized packaging drops and general recipe releases.</p>
                </div>

                {/* Tier 2 */}
                <div className={`p-6 rounded-3xl border transition-all ${
                  pointsEarned >= 500 && pointsEarned < 1200 ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-sm' : 'border-zinc-200'
                }`}>
                  <Award className={`w-8 h-8 mb-4 ${pointsEarned >= 500 ? 'text-brand-terracotta' : 'text-zinc-400'}`} />
                  <h5 className="font-bold text-sm text-brand-ink">Proofing Advocate</h5>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">500 - 1199 Pts</p>
                  <p className="text-xs text-zinc-500 mt-2 font-semibold">Unlocks customized coupon discounts on our medium glass mason jar coulis drops.</p>
                </div>

                {/* Tier 3 */}
                <div className={`p-6 rounded-3xl border transition-all ${
                  pointsEarned >= 1200 && pointsEarned < 2000 ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-sm' : 'border-zinc-200'
                }`}>
                  <Award className={`w-8 h-8 mb-4 ${pointsEarned >= 1200 ? 'text-brand-terracotta' : 'text-zinc-400'}`} />
                  <h5 className="font-bold text-sm text-brand-ink">Glaze Outlaw</h5>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">1200 - 1999 Pts</p>
                  <p className="text-xs text-zinc-500 mt-2 font-semibold">Priority oven routing queue & custom monthly drop bundles delivered free.</p>
                </div>

                {/* Tier 4 */}
                <div className={`p-6 rounded-3xl border transition-all ${
                  pointsEarned >= 2000 ? 'border-brand-terracotta bg-brand-terracotta/5 shadow-sm' : 'border-zinc-200'
                }`}>
                  <Award className={`w-8 h-8 mb-4 ${pointsEarned >= 2000 ? 'text-brand-terracotta' : 'text-zinc-400'}`} />
                  <h5 className="font-bold text-sm text-brand-ink">Grand High Master Bun</h5>
                  <p className="text-[10px] uppercase font-bold text-zinc-400">2000+ Pts</p>
                  <p className="text-xs text-zinc-500 mt-2 font-semibold">VIP Chef communications. Unlocks restricted 32 oz Double-pack rewards & bespoke toppings.</p>
                </div>

              </div>
            </div>

            {/* Swirl Points Rewards */}
            <div className="space-y-6">
              <h4 className="serif text-xl font-bold text-brand-ink">
                Swirl Points Rewards
              </h4>

              <div className="space-y-3">
                {/* Reward 1 */}
                <div className={`flex items-center justify-between p-4 rounded-2xl text-xs font-semibold border ${
                  pointsEarned >= 350 
                    ? 'bg-emerald-50/50 border-emerald-150 text-brand-ink' 
                    : 'bg-zinc-50 border-zinc-150 opacity-60'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      pointsEarned >= 350 ? 'bg-emerald-100 text-emerald-850' : 'bg-zinc-250 text-zinc-600'
                    }`}>
                      {pointsEarned >= 350 ? '✓' : '🔒'}
                    </div>
                    <div>
                      <div className="text-brand-ink font-bold flex items-center gap-1.5">
                        <span>Free Petit Frost (3.5 oz)</span>
                        <span className="text-[9px] font-semibold text-brand-terracotta px-1.5 py-0.2 bg-brand-terracotta/5 rounded-full border border-brand-terracotta/10">350 Pts</span>
                      </div>
                      <p className="text-zinc-500 text-[10px]">A free cup of Bobby's Secret Frost whip served in our airtight black plastic cup.</p>
                    </div>
                  </div>
                  <span className={`mono text-[9px] uppercase tracking-wider font-extrabold ${
                    pointsEarned >= 350 ? 'text-emerald-700' : 'text-zinc-500'
                  }`}>
                    {pointsEarned >= 350 ? 'Unlocked & Active' : 'Locked'}
                  </span>
                </div>

                {/* Reward 2 */}
                <div className={`flex items-center justify-between p-4 rounded-2xl text-xs font-semibold border ${
                  pointsEarned >= 1200 
                    ? 'bg-emerald-50/50 border-emerald-150 text-brand-ink' 
                    : 'bg-zinc-50 border-zinc-150 opacity-60'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      pointsEarned >= 1200 ? 'bg-emerald-100 text-emerald-850' : 'bg-zinc-250 text-zinc-600'
                    }`}>
                      {pointsEarned >= 1200 ? '✓' : '🔒'}
                    </div>
                    <div>
                      <div className="text-brand-ink font-bold flex items-center gap-1.5">
                        <span>50% Off Custom 6-Pack Box</span>
                        <span className="text-[9px] font-semibold text-brand-terracotta px-1.5 py-0.2 bg-brand-terracotta/5 rounded-full border border-brand-terracotta/10">1200 Pts</span>
                      </div>
                      <p className="text-zinc-500 text-[10px]">Half-price on a custom six-pack bun box layered with standard or premium toppings.</p>
                    </div>
                  </div>
                  <span className={`mono text-[9px] uppercase tracking-wider font-extrabold ${
                    pointsEarned >= 1200 ? 'text-emerald-700' : 'text-zinc-500'
                  }`}>
                    {pointsEarned >= 1200 ? 'Unlocked & Active' : `${1200 - pointsEarned} Pts Away`}
                  </span>
                </div>

                {/* Reward 3 */}
                <div className={`flex items-center justify-between p-4 rounded-2xl text-xs font-semibold border ${
                  pointsEarned >= 2000 
                    ? 'bg-emerald-50/50 border-emerald-150 text-brand-ink' 
                    : 'bg-zinc-50 border-zinc-150 opacity-60'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      pointsEarned >= 2000 ? 'bg-emerald-100 text-emerald-850' : 'bg-zinc-250 text-zinc-600'
                    }`}>
                      {pointsEarned >= 2000 ? '✓' : '🔒'}
                    </div>
                    <div>
                      <div className="text-brand-ink font-bold flex items-center gap-1.5">
                        <span>Free Vrai Grande Frost (32 oz)</span>
                        <span className="text-[9px] font-semibold text-brand-terracotta px-1.5 py-0.2 bg-brand-terracotta/5 rounded-full border border-brand-terracotta/10">2000 Pts</span>
                      </div>
                      <p className="text-zinc-500 text-[10px]">A giant, heavy-duty wide-mouth glass mason jar filled to the brim with our signature whip.</p>
                    </div>
                  </div>
                  <span className={`mono text-[9px] uppercase tracking-wider font-extrabold ${
                    pointsEarned >= 2000 ? 'text-emerald-700' : 'text-zinc-500'
                  }`}>
                    {pointsEarned >= 2000 ? 'Unlocked & Active' : `${2000 - pointsEarned} Pts Away`}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="mt-8 space-y-6">
            <h3 className="serif text-2xl font-black text-brand-ink flex items-center gap-2">
              <Heart className="w-5 h-5 text-brand-terracotta" />
              <span>Saved Custom Box Presets</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((fav) => (
                <div key={fav.id} className="bg-white border border-brand-ochre/15 rounded-[2.5rem] p-6 space-y-4 hover:shadow-md transition-shadow">
                  
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                    <div>
                      <h4 className="serif text-lg font-black text-brand-ink">{fav.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{fav.size}-Pack Configuration</p>
                    </div>
                    <button 
                      onClick={() => setFavorites(prev => prev.filter(f => f.id !== fav.id))}
                      className="text-zinc-355 hover:text-red-500 text-xs font-bold transition-all"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="block text-[8px] font-black uppercase text-zinc-400">Frost Base</span>
                      <span className="font-bold text-brand-ink">{fav.frosting}</span>
                    </div>

                    <div>
                      <span className="block text-[8px] font-black uppercase text-zinc-450">Layered Toppings ("Caviars")</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {fav.toppings.map((top, idx) => (
                          <span key={idx} className="bg-zinc-100 text-brand-ink font-bold text-[9px] px-2 py-0.5 rounded-full border border-zinc-150">
                            {top}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-brand-terracotta">
                      ${fav.size === 4 ? '18.00' : '24.50'}
                    </span>
                    <button 
                      onClick={() => alert('Recipe successfully loaded directly into box builder. Begin custom baking!')}
                      className="bg-brand-ink text-brand-cream hover:bg-brand-terracotta hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex items-center space-x-1.5"
                    >
                      <span>Bake Box</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}

              {/* Add Mock custom preset card */}
              <button 
                onClick={() => {
                  const presetName = prompt('Enter a name for your custom Box:');
                  if (presetName) {
                    setFavorites(prev => [
                      ...prev,
                      {
                        id: `fav-${Date.now()}`,
                        name: presetName,
                        size: 4,
                        toppings: ['Velvet Apple', 'Blueberry'],
                        frosting: 'Secret Frost'
                      }
                    ]);
                  }
                }}
                className="bg-zinc-50 border border-dashed border-zinc-300 hover:border-brand-terracotta rounded-[2.5rem] p-12 text-center flex flex-col justify-center items-center space-y-3 cursor-pointer group transition-colors"
              >
                <div className="w-12 h-12 bg-zinc-100 group-hover:bg-brand-terracotta/10 rounded-full flex items-center justify-center border border-zinc-200 transition-colors">
                  <span className="text-xl font-bold group-hover:text-brand-terracotta">+</span>
                </div>
                <div>
                  <h4 className="serif text-sm font-bold text-brand-ink">Save New Box Recipe</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 max-w-[200px]">Pin your customized recipe layouts straight into your saved drawer.</p>
                </div>
              </button>

            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default Profile;
