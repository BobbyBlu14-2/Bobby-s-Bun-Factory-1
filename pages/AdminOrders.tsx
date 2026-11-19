import React, { useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  CheckCircle2,
  ChefHat,
  Clock,
  LogIn,
  LogOut,
  Mail,
  Package,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  ADMIN_EMAIL,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../src/firebase';

interface OrderItemRecord {
  name: string;
  quantity: number;
  price: number;
  modifier?: string;
  description?: string;
}

interface OrderRecord {
  docId?: string;
  source: 'firestore' | 'server';
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderType: string;
  status: string;
  pickupTime: string;
  address?: string;
  items: OrderItemRecord[];
  itemsSummary: string;
  subtotal: number;
  discount: number;
  discountCode?: string;
  tax?: number;
  total: number;
  transactionId: string;
  squareOrderId?: string;
  date?: string;
  formattedDate?: string;
  timestamp?: string;
}

interface SubmissionsData {
  newsletter: Array<{ name?: string; email: string; timestamp: string }>;
  contact: Array<{ name: string; email: string; message: string; timestamp: string }>;
  catering: Array<{
    name: string;
    email: string;
    phone?: string;
    eventType?: string;
    eventDate?: string;
    guestCount?: string;
    productsInterested?: string;
    message?: string;
    timestamp: string;
  }>;
  franchise: Array<{
    name: string;
    email: string;
    territory?: string;
    capital?: string;
    timestamp: string;
  }>;
  wholesale: Array<{
    businessName?: string;
    contactName?: string;
    email: string;
    phone?: string;
    businessType?: string;
    weeklyQuantity?: string;
    message?: string;
    timestamp: string;
  }>;
}

type StatusFilter = 'All' | 'Confirmed & In Oven' | 'Ready for Pickup' | 'Picked Up';

const AdminOrders: React.FC = () => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const [activeTab, setActiveTab] = useState<'orders' | 'club'>('orders');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [firestoreOrders, setFirestoreOrders] = useState<OrderRecord[]>([]);
  const [serverOrders, setServerOrders] = useState<OrderRecord[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionsData>({
    newsletter: [],
    contact: [],
    catering: [],
    franchise: [],
    wholesale: [],
  });
  const [isLoadingServer, setIsLoadingServer] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const isAuthorizedAdmin =
    Boolean(user) &&
    user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  const fetchServerData = async (currentUser: User) => {
    setIsLoadingServer(true);
    setActionError(null);
    try {
      const idToken = await currentUser.getIdToken();
      const headers = { Authorization: `Bearer ${idToken}` };

      const [ordersRes, subsRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/submissions', { headers }),
      ]);

      if (ordersRes.ok) {
        const ordersJson = await ordersRes.json();
        const rawList = Array.isArray(ordersJson.orders) ? ordersJson.orders : [];
        setServerOrders(
          rawList.map((o: any) => ({
            source: 'server' as const,
            orderNumber: o.orderNumber || o.id || 'UNKNOWN',
            customerName: o.customerName || 'Guest',
            customerEmail: o.customerEmail || '',
            orderType: o.orderType || 'pickup',
            status: o.status || 'Confirmed & In Oven',
            pickupTime: o.pickupTime || 'Saturday Pickup',
            items: Array.isArray(o.items) ? o.items : [],
            itemsSummary: o.itemsSummary || '',
            subtotal: Number(o.subtotal || o.total || 0),
            discount: Number(o.discount || 0),
            discountCode: o.discountCode || '',
            tax: Number(o.tax || 0),
            total: Number(o.total || 0),
            transactionId: o.transactionId || '',
            squareOrderId: o.squareOrderId || '',
            date: o.date || '',
            formattedDate: o.timestamp
              ? new Date(o.timestamp).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : o.date || '',
            timestamp: o.timestamp,
          }))
        );
      }

      if (subsRes.ok) {
        const subsJson = await subsRes.json();
        setSubmissions({
          newsletter: Array.isArray(subsJson.newsletter) ? subsJson.newsletter : [],
          contact: Array.isArray(subsJson.contact) ? subsJson.contact : [],
          catering: Array.isArray(subsJson.catering) ? subsJson.catering : [],
          franchise: Array.isArray(subsJson.franchise) ? subsJson.franchise : [],
          wholesale: Array.isArray(subsJson.wholesale) ? subsJson.wholesale : [],
        });
      }
    } catch (err: any) {
      setActionError(err?.message || 'Could not load server backup data.');
    } finally {
      setIsLoadingServer(false);
    }
  };

  useEffect(() => {
    if (!isAuthorizedAdmin || !user) {
      setFirestoreOrders([]);
      return;
    }

    fetchServerData(user);

    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: OrderRecord[] = snapshot.docs.map((d) => {
          const data = d.data() as any;
          return {
            docId: d.id,
            source: 'firestore',
            orderNumber: data.orderNumber || d.id,
            customerName: data.customerName || 'Guest',
            customerEmail: data.customerEmail || '',
            orderType: data.orderType || 'pickup',
            status: data.status || 'Confirmed & In Oven',
            pickupTime: data.pickupTime || 'Saturday Pickup',
            address: data.address || '',
            items: Array.isArray(data.items) ? data.items : [],
            itemsSummary: data.itemsSummary || '',
            subtotal: Number(data.subtotal || 0),
            discount: Number(data.discount || 0),
            discountCode: data.discountCode || '',
            tax: Number(data.tax || 0),
            total: Number(data.total || 0),
            transactionId: data.transactionId || '',
            squareOrderId: data.squareOrderId || '',
            date: data.date || '',
            formattedDate: data.formattedDate || data.date || '',
          };
        });
        setFirestoreOrders(loaded);
      },
      (err) => {
        try {
          handleFirestoreError(err, OperationType.LIST, 'orders');
        } catch (wrapped: any) {
          setActionError(wrapped?.message || 'Unable to listen to live orders.');
        }
      }
    );

    return () => unsubscribe();
  }, [isAuthorizedAdmin, user]);

  const mergedOrders = useMemo(() => {
    const byNumber = new Map<string, OrderRecord>();
    firestoreOrders.forEach((order) => {
      byNumber.set(order.orderNumber, order);
    });
    serverOrders.forEach((order) => {
      if (!byNumber.has(order.orderNumber)) {
        byNumber.set(order.orderNumber, order);
      }
    });
    return Array.from(byNumber.values());
  }, [firestoreOrders, serverOrders]);

  const filteredOrders = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return mergedOrders.filter((order) => {
      if (statusFilter !== 'All' && order.status !== statusFilter) return false;
      if (!q) return true;
      return (
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.itemsSummary.toLowerCase().includes(q) ||
        order.transactionId.toLowerCase().includes(q)
      );
    });
  }, [mergedOrders, statusFilter, searchTerm]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setIsSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in failed.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleUpdateStatus = async (
    order: OrderRecord,
    nextStatus: 'Confirmed & In Oven' | 'Ready for Pickup' | 'Picked Up'
  ) => {
    if (!order.docId) return;
    setUpdatingOrderId(order.orderNumber);
    setActionError(null);
    try {
      await updateDoc(doc(db, 'orders', order.docId), {
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${order.docId}`);
      } catch (wrapped: any) {
        setActionError(wrapped?.message || 'Failed to update order status.');
      }
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusCounts = useMemo(() => {
    return {
      all: mergedOrders.length,
      inOven: mergedOrders.filter((o) => o.status === 'Confirmed & In Oven').length,
      ready: mergedOrders.filter((o) => o.status === 'Ready for Pickup').length,
      pickedUp: mergedOrders.filter((o) => o.status === 'Picked Up').length,
    };
  }, [mergedOrders]);

  if (!authReady) {
    return (
      <div className="flex-1 bg-brand-cream min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-brand-terracotta border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || !isAuthorizedAdmin) {
    return (
      <div className="flex-1 bg-brand-cream min-h-[80vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full bg-brand-ink text-brand-cream border border-brand-ochre/20 p-10 md:p-12 shadow-2xl space-y-8">
          <div className="flex items-center space-x-3">
            <ChefHat className="w-7 h-7 text-brand-terracotta" />
            <span className="mono text-[10px] uppercase tracking-[0.3em] text-brand-ochre font-black">
              Kitchen & Order Hub
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="serif text-3xl md:text-4xl font-black uppercase tracking-tight">
              Factory <span className="italic text-brand-terracotta">Dispatch</span>
            </h1>
            <p className="text-sm text-brand-cream/70 leading-relaxed">
              Sign in with the bakery owner Google account ({ADMIN_EMAIL}) to inspect every online order’s bun-by-bun toppings, pickup schedule, Square references, and Bun Club signups.
            </p>
          </div>

          {user && !isAuthorizedAdmin && (
            <div className="bg-brand-terracotta/15 border border-brand-terracotta p-4 space-y-2">
              <div className="flex items-center gap-2 text-brand-terracotta">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="mono text-[10px] font-black uppercase tracking-wider">
                  Unauthorized Account
                </span>
              </div>
              <p className="text-xs text-brand-cream/80">
                Signed in as <span className="font-bold">{user.email}</span>. Please switch to{' '}
                <span className="font-bold">{ADMIN_EMAIL}</span>.
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                className="mono text-[10px] uppercase tracking-widest font-black text-brand-ochre hover:underline cursor-pointer"
              >
                Sign out and switch account
              </button>
            </div>
          )}

          {authError && (
            <div className="bg-brand-terracotta/20 border-l-4 border-brand-terracotta p-4 text-xs mono text-brand-cream">
              {authError}
            </div>
          )}

          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="w-full bg-brand-terracotta hover:bg-brand-ochre hover:text-brand-ink text-brand-cream py-4 px-6 font-black uppercase tracking-[0.25em] text-xs flex items-center justify-center gap-3 transition-colors cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{isSigningIn ? 'Authenticating...' : 'Sign In With Google'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-brand-cream min-h-screen py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="bg-brand-ink text-brand-cream border border-brand-ochre/20 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <ChefHat className="w-5 h-5 text-brand-terracotta" />
              <span className="mono text-[10px] uppercase tracking-[0.3em] text-brand-ochre font-black">
                Bobby&apos;s Bun Factory • Admin Kitchen Dispatch
              </span>
            </div>
            <h1 className="serif text-3xl md:text-5xl font-black uppercase tracking-tight">
              Orders &amp; <span className="italic text-brand-terracotta">Bun Specs</span>
            </h1>
            <p className="mono text-[11px] text-brand-cream/60">
              Authenticated as {user.email}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fetchServerData(user)}
              disabled={isLoadingServer}
              className="inline-flex items-center gap-2 border border-brand-ochre/30 px-4 py-2.5 mono text-[10px] uppercase tracking-widest font-black text-brand-ochre hover:bg-brand-ochre hover:text-brand-ink transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingServer ? 'animate-spin' : ''}`} />
              <span>Sync Server Backup</span>
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-2 bg-brand-cream/10 hover:bg-brand-terracotta text-brand-cream px-4 py-2.5 mono text-[10px] uppercase tracking-widest font-black transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-brand-ink/10 p-5 shadow-sm">
            <span className="mono text-[9px] uppercase tracking-widest text-brand-ink/50 font-black">
              Total Logged Orders
            </span>
            <p className="serif text-3xl font-black text-brand-ink mt-1">{statusCounts.all}</p>
          </div>
          <div className="bg-white border border-brand-terracotta/30 p-5 shadow-sm">
            <span className="mono text-[9px] uppercase tracking-widest text-brand-terracotta font-black">
              In Oven / To Bake
            </span>
            <p className="serif text-3xl font-black text-brand-terracotta mt-1">
              {statusCounts.inOven}
            </p>
          </div>
          <div className="bg-white border border-brand-ochre/40 p-5 shadow-sm">
            <span className="mono text-[9px] uppercase tracking-widest text-brand-ink/70 font-black">
              Ready For Pickup
            </span>
            <p className="serif text-3xl font-black text-brand-ink mt-1">{statusCounts.ready}</p>
          </div>
          <div className="bg-white border border-brand-ink/10 p-5 shadow-sm">
            <span className="mono text-[9px] uppercase tracking-widest text-brand-ink/50 font-black">
              Bun Club Signups
            </span>
            <p className="serif text-3xl font-black text-brand-ink mt-1">
              {submissions.newsletter.length}
            </p>
          </div>
        </div>

        {actionError && (
          <div className="bg-brand-terracotta/10 border-l-4 border-brand-terracotta p-4 text-xs mono text-brand-ink">
            {actionError}
          </div>
        )}

        {/* Primary View Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-brand-ink/15 pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 mono text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-brand-ink text-brand-cream'
                  : 'bg-white text-brand-ink/70 hover:text-brand-ink border border-brand-ink/10'
              }`}
            >
              <Package className="w-4 h-4 text-brand-terracotta" />
              <span>Online Orders ({mergedOrders.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('club')}
              className={`px-5 py-2.5 mono text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer ${
                activeTab === 'club'
                  ? 'bg-brand-ink text-brand-cream'
                  : 'bg-white text-brand-ink/70 hover:text-brand-ink border border-brand-ink/10'
              }`}
            >
              <Users className="w-4 h-4 text-brand-ochre" />
              <span>
                Bun Club &amp; Leads (
                {submissions.newsletter.length +
                  submissions.contact.length +
                  submissions.catering.length +
                  submissions.franchise.length +
                  submissions.wholesale.length}
                )
              </span>
            </button>
          </div>

          {activeTab === 'orders' && (
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-brand-ink/40 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search order #, name, flavor..."
                className="w-full bg-white border border-brand-ink/15 pl-9 pr-3 py-2 text-xs mono text-brand-ink focus:outline-none focus:border-brand-terracotta"
              />
            </div>
          )}
        </div>

        {activeTab === 'orders' ? (
          <div className="space-y-6">
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['All', 'Confirmed & In Oven', 'Ready for Pickup', 'Picked Up'] as StatusFilter[]).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`px-3.5 py-1.5 mono text-[10px] uppercase tracking-wider font-black border transition-colors cursor-pointer ${
                      statusFilter === status
                        ? 'bg-brand-terracotta text-white border-brand-terracotta'
                        : 'bg-white text-brand-ink/70 border-brand-ink/15 hover:border-brand-ink'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-brand-ink/10 p-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-brand-terracotta mx-auto" />
                <h2 className="serif text-2xl font-black text-brand-ink">
                  No Itemized Online Orders Logged Yet
                </h2>
                <p className="text-sm text-brand-ink/65 max-w-xl mx-auto">
                  Every new order placed through checkout from now on is automatically recorded here with the full box breakdown, individual bun flavors, caviars/drizzles, pickup date, and Square Transaction ID.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="bg-white border border-brand-ink/15 shadow-sm overflow-hidden"
                  >
                    {/* Order Top Bar */}
                    <div className="bg-brand-ink text-brand-cream px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <div>
                          <span className="mono text-[9px] uppercase tracking-widest text-brand-ochre block">
                            Order Number
                          </span>
                          <span className="mono text-base font-black">{order.orderNumber}</span>
                        </div>
                        <div className="h-8 w-px bg-brand-ochre/20 hidden sm:block" />
                        <div>
                          <span className="mono text-[9px] uppercase tracking-widest text-brand-cream/50 block">
                            Customer
                          </span>
                          <span className="serif text-lg font-bold">{order.customerName}</span>
                          {order.customerEmail && (
                            <span className="mono text-[10px] text-brand-cream/60 ml-2">
                              ({order.customerEmail})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-3 py-1 mono text-[10px] font-black uppercase tracking-wider border ${
                            order.status === 'Picked Up'
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                              : order.status === 'Ready for Pickup'
                              ? 'bg-brand-ochre text-brand-ink border-brand-ochre'
                              : 'bg-brand-terracotta text-white border-brand-terracotta'
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="serif text-2xl font-black text-brand-ochre">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-6 space-y-5">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs mono text-brand-ink/70 border-b border-brand-ink/10 pb-4">
                        <span className="inline-flex items-center gap-1.5 font-bold text-brand-ink">
                          <Clock className="w-3.5 h-3.5 text-brand-terracotta" />
                          Pickup: {order.pickupTime}
                        </span>
                        {order.formattedDate && <span>Placed: {order.formattedDate}</span>}
                        {order.transactionId && <span>Square Payment: {order.transactionId}</span>}
                        {order.squareOrderId && <span>Square Order: {order.squareOrderId}</span>}
                        {order.discountCode && (
                          <span className="text-brand-terracotta font-bold">
                            Promo: {order.discountCode} (-${order.discount.toFixed(2)})
                          </span>
                        )}
                      </div>

                      {/* Kitchen Prep Specs */}
                      <div className="space-y-3">
                        <h3 className="mono text-[10px] uppercase tracking-[0.25em] font-black text-brand-terracotta">
                          Kitchen Bake &amp; Topping Ticket
                        </h3>

                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-3">
                            {order.items.map((item, idx) => {
                              const specText = (item.modifier || item.description || '').trim();
                              return (
                                <div
                                  key={idx}
                                  className="bg-brand-cream/60 border border-brand-ink/10 p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                                >
                                  <div className="space-y-1.5">
                                    <div className="flex items-center gap-2">
                                      <span className="bg-brand-ink text-brand-ochre mono text-xs font-black px-2 py-0.5">
                                        {item.quantity}x
                                      </span>
                                      <span className="serif text-xl font-black text-brand-ink">
                                        {item.name}
                                      </span>
                                    </div>
                                    {specText ? (
                                      <p className="mono text-xs text-brand-terracotta font-bold leading-relaxed whitespace-pre-wrap">
                                        {specText}
                                      </p>
                                    ) : (
                                      <p className="mono text-[11px] text-brand-ink/50 italic">
                                        Standard preparation (no extra modifier notes)
                                      </p>
                                    )}
                                  </div>
                                  <span className="mono text-sm font-black text-brand-ink shrink-0">
                                    ${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="bg-brand-cream/60 border border-brand-ink/10 p-4 mono text-xs text-brand-ink">
                            {order.itemsSummary || 'No line items recorded'}
                          </div>
                        )}
                      </div>

                      {/* Fulfillment Action Controls (for Firestore-tracked orders) */}
                      {order.docId && (
                        <div className="pt-3 border-t border-brand-ink/10 flex flex-wrap items-center justify-between gap-3">
                          <span className="mono text-[10px] uppercase tracking-wider text-brand-ink/50">
                            Update Kitchen Status
                          </span>
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={
                                updatingOrderId === order.orderNumber ||
                                order.status === 'Confirmed & In Oven'
                              }
                              onClick={() => handleUpdateStatus(order, 'Confirmed & In Oven')}
                              className="px-3 py-1.5 mono text-[10px] font-black uppercase tracking-wider border border-brand-ink/20 hover:bg-brand-ink hover:text-white disabled:opacity-40 cursor-pointer transition-colors"
                            >
                              In Oven
                            </button>
                            <button
                              type="button"
                              disabled={
                                updatingOrderId === order.orderNumber ||
                                order.status === 'Ready for Pickup'
                              }
                              onClick={() => handleUpdateStatus(order, 'Ready for Pickup')}
                              className="px-3 py-1.5 mono text-[10px] font-black uppercase tracking-wider bg-brand-ochre text-brand-ink hover:opacity-90 disabled:opacity-40 cursor-pointer transition-opacity"
                            >
                              Mark Ready for Pickup
                            </button>
                            <button
                              type="button"
                              disabled={
                                updatingOrderId === order.orderNumber ||
                                order.status === 'Picked Up'
                              }
                              onClick={() => handleUpdateStatus(order, 'Picked Up')}
                              className="px-3 py-1.5 mono text-[10px] font-black uppercase tracking-wider bg-brand-ink text-brand-cream hover:bg-brand-terracotta disabled:opacity-40 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Picked Up</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Bun Club & Inquiries Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-brand-ink/15 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-ink/10 pb-3">
                <h2 className="serif text-2xl font-black text-brand-ink">
                  Bun Club Subscribers
                </h2>
                <span className="mono text-xs font-black text-brand-terracotta">
                  {submissions.newsletter.length} Total
                </span>
              </div>
              {submissions.newsletter.length === 0 ? (
                <p className="text-sm text-brand-ink/60">No Bun Club signups recorded on this server yet.</p>
              ) : (
                <div className="divide-y divide-brand-ink/10 max-h-96 overflow-y-auto">
                  {submissions.newsletter.map((sub, i) => (
                    <div key={i} className="py-3 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-sm text-brand-ink">{sub.name || 'Swirl Lover'}</p>
                        <p className="mono text-xs text-brand-terracotta flex items-center gap-1.5">
                          <Mail className="w-3 h-3" /> {sub.email}
                        </p>
                      </div>
                      <span className="mono text-[10px] text-brand-ink/50">
                        {new Date(sub.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white border border-brand-ink/15 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-brand-ink/10 pb-3">
                <h2 className="serif text-2xl font-black text-brand-ink">
                  Catering, Contact &amp; Partner Inquiries
                </h2>
                <span className="mono text-xs font-black text-brand-terracotta">
                  {submissions.catering.length +
                    submissions.contact.length +
                    submissions.franchise.length +
                    submissions.wholesale.length}{' '}
                  Total
                </span>
              </div>
              {submissions.catering.length +
                submissions.contact.length +
                submissions.franchise.length +
                submissions.wholesale.length ===
              0 ? (
                <p className="text-sm text-brand-ink/60">No form inquiries recorded on this server yet.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {submissions.catering.map((c, i) => (
                    <div key={`cat-${i}`} className="p-3 bg-brand-cream/50 border border-brand-ink/10 space-y-1">
                      <span className="mono text-[9px] uppercase font-black text-brand-terracotta">
                        Catering • {c.eventDate || 'TBD'} • {c.guestCount || '?'} guests
                      </span>
                      <p className="font-bold text-sm text-brand-ink">
                        {c.name} ({c.email})
                      </p>
                      {c.message && <p className="text-xs text-brand-ink/75">{c.message}</p>}
                    </div>
                  ))}
                  {submissions.contact.map((c, i) => (
                    <div key={`con-${i}`} className="p-3 bg-brand-cream/50 border border-brand-ink/10 space-y-1">
                      <span className="mono text-[9px] uppercase font-black text-brand-ochre">
                        Contact Message
                      </span>
                      <p className="font-bold text-sm text-brand-ink">
                        {c.name} ({c.email})
                      </p>
                      <p className="text-xs text-brand-ink/75">{c.message}</p>
                    </div>
                  ))}
                  {submissions.franchise.map((f, i) => (
                    <div key={`fran-${i}`} className="p-3 bg-brand-cream/50 border border-brand-ink/10 space-y-1">
                      <span className="mono text-[9px] uppercase font-black text-brand-terracotta">
                        Franchise • {f.territory} • {f.capital}
                      </span>
                      <p className="font-bold text-sm text-brand-ink">
                        {f.name} ({f.email})
                      </p>
                    </div>
                  ))}
                  {submissions.wholesale.map((w, i) => (
                    <div key={`wh-${i}`} className="p-3 bg-brand-cream/50 border border-brand-ink/10 space-y-1">
                      <span className="mono text-[9px] uppercase font-black text-brand-terracotta">
                        Wholesale • {w.businessName} ({w.weeklyQuantity})
                      </span>
                      <p className="font-bold text-sm text-brand-ink">
                        {w.contactName} ({w.email})
                      </p>
                      {w.message && <p className="text-xs text-brand-ink/75">{w.message}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
