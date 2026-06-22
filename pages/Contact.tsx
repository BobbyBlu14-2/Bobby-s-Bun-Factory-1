import React, { useEffect, useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Heart, 
  MessageCircle, 
  Instagram, 
  X, 
  ExternalLink, 
  Bookmark, 
  Share2, 
  CheckCircle2,
  Camera
} from 'lucide-react';
import { 
  singleFruitCaviarBun, 
  flavorPeach, 
  cookiesCreamTopping, 
  chocolateCherryCaviar, 
  velvetAppleBun, 
  sixPackHorizontal, 
  doubleGrandeCaviarJars, 
  flavorCaramel, 
  fourPackBuns 
} from '../constants';

interface InstagramPost {
  id: number;
  image: string;
  likes: number;
  commentsCount: number;
  caption: string;
  tags: string[];
  date: string;
  comments: { user: string; text: string }[];
}

const Contact: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
        // Hide success message after 5 seconds
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const instagramPosts: InstagramPost[] = [
    {
      id: 1,
      image: singleFruitCaviarBun,
      likes: 1424,
      commentsCount: 94,
      caption: "Our signature single fruit caviar bun dripping beautifully. Pure, unadulterated slow-simmered berry bliss on warm yeast layers. 🍒✨",
      tags: ["#bobbysbunfactory", "#fruitcaviar", "#bakeshopartisan"],
      date: "2 HOURS AGO",
      comments: [
        { user: "bun_lover_99", text: "this is literally absolute perfection. on my way down now!" },
        { user: "atl_foodie_drip", text: "The fruit-to-bun ratio here is elite." },
        { user: "cinnamon_queen", text: "Bobby's never misses with the coulis." }
      ]
    },
    {
      id: 2,
      image: flavorPeach,
      likes: 982,
      commentsCount: 47,
      caption: "Dacula peach chunks caramelized to gooey brown-sugar perfection, layered under Bobby's Secret Frost. Pure cobbler energy. 🍑🔥",
      tags: ["#thepeachoutlaw", "#seasonalflavor", "#georgiapeaches"],
      date: "1 DAY AGO",
      comments: [
        { user: "peach_hunter_7", text: "Tried this yesterday and my life is changed." },
        { user: "baking_with_joy", text: "Are these local Georgia peaches? 🍑" },
        { user: "bobbysbunfactory", text: "@baking_with_joy Yes! hand-picked from regional orchards." }
      ]
    },
    {
      id: 3,
      image: cookiesCreamTopping,
      likes: 2109,
      commentsCount: 153,
      caption: "Cookies & Cream overload! Velvet vanilla cream check, topped with crushed Oreo cookie sand. 🍪🖤",
      tags: ["#cookiesandcream", "#cookiesnscreambun", "#sweettooth"],
      date: "3 DAYS AGO",
      comments: [
        { user: "oreo_fanatic", text: "OMGGGGG COOP ME UP" },
        { user: "diet_starts_tomorrow", text: "I need a 6-pack of of these immediately." }
      ]
    },
    {
      id: 4,
      image: chocolateCherryCaviar,
      likes: 1774,
      commentsCount: 88,
      caption: "Chocolate Cherry Bomb! Reductions that explode with premium tart dark cherry fruit and swirled dark chocolate glaze. 🍒🍫",
      tags: ["#chocolatecherry", "#cherrybomb", "#luxurybuns"],
      date: "4 DAYS AGO",
      comments: [
        { user: "savory_sweets", text: "The tart cherry cuts through the rich chocolate so well." },
        { user: "travel_cook", text: "Is this dynamic drop staying for the whole month??" }
      ]
    },
    {
      id: 5,
      image: velvetAppleBun,
      likes: 1556,
      commentsCount: 62,
      caption: "Signature Velvet Apple slices in spiced cinnamon glaze spread warm over a fresh roll. Peak cozy vibes. 🍎🍂",
      tags: ["#velvetapple", "#applecinnamon", "#warmbakes"],
      date: "1 WEEK AGO",
      comments: [
        { user: "cozy_fall_vibes", text: "It smells like autumn heaven in the factory!" },
        { user: "dough_boy", text: "the Apple outlaw is my favorite period." }
      ]
    },
    {
      id: 6,
      image: sixPackHorizontal,
      likes: 3205,
      commentsCount: 204,
      caption: "Ready for transport! 📦 Buns built to share with your friends, although we won't judge if you eat the whole box yourself. 😉",
      tags: ["#bunpack", "#sharingoptional", "#weekendvibes"],
      date: "1 WEEK AGO",
      comments: [
        { user: "office_hero", text: "Brought these into the morning huddle and won worker of the year." },
        { user: "mikey_g", text: "What's the best reheating protocol for the next morning?" }
      ]
    },
    {
      id: 7,
      image: doubleGrandeCaviarJars,
      likes: 1882,
      commentsCount: 79,
      caption: "Fru-Fru Culinary Coulis Double-Pack packs massive flavor. Keep your glass jars cold & ready for custom midnight drizzling. 🍓🍯",
      tags: ["#fruitcaviarjars", "#drizzletemp", "#craftkitchen"],
      date: "2 WEEKS AGO",
      comments: [
        { user: "jar_collector", text: "the mason jars look beautiful on my counter." },
        { user: "midnight_snacker", text: "I literally spoon this onto ice cream, waffles, everything." }
      ]
    },
    {
      id: 8,
      image: flavorCaramel,
      likes: 2631,
      commentsCount: 112,
      caption: "Hand-caramelized drizzle dripping slow. Stabilized at exactly 104°F so it curls around yeast layers like silk. 🍮💦",
      tags: ["#saltedcaramel", "#drizzleart", "#mesmerizing"],
      date: "2 WEEKS AGO",
      comments: [
        { user: "satisfying_videos", text: "I watched this loop for 10 minutes straight." },
        { user: "caramel_queen", text: "sweet, salty, absolute luxury." }
      ]
    },
    {
      id: 9,
      image: fourPackBuns,
      likes: 2984,
      commentsCount: 186,
      caption: "The Mixed 4-Pack: Choose two classic glazes & two fruit caviars. No compromises. Packed and ready for pick-up. 📦✨",
      tags: ["#boxedbuns", "#mixedfourpack", "#custombox"],
      date: "3 WEEKS AGO",
      comments: [
        { user: "baking_bro", text: "Our favorite Saturday tradition." },
        { user: "mama_bear", text: "My kids go crazy for the wildberry ones!" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-cream/5 text-brand-ink transition-all">
      
      {/* INSTAGRAM INTRO SECTION — Beautiful Curated Header & Info */}
      <section className="py-12 md:py-16 bg-white border-b border-brand-ochre/15">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="flex flex-col items-center space-y-6 text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-pink-500/20 px-3.5 py-1.5 rounded-full">
              <Instagram className="w-4 h-4 text-pink-600" />
              <span className="mono text-[10px] uppercase font-black tracking-widest text-pink-700">Follow @bobbysbunfactory</span>
            </div>
            
            <h1 className="serif text-4xl md:text-6xl font-black text-brand-ink leading-none">
              The Sweet <span className="text-brand-terracotta italic font-normal">Social Feed</span>
            </h1>
            <p className="text-xs md:text-sm text-zinc-500 leading-relaxed font-semibold">
              Get raw, real-time updates of our latest oven drops, limited premium toppings, and localized packaging releases straight from our community feed.
            </p>
          </div>

          {/* Instagram Profile Simulator Banner */}
          <div className="bg-zinc-50 border border-zinc-100 rounded-[2rem] p-6 md:p-8 max-w-3xl mx-auto space-y-6 md:space-y-0 md:flex md:items-center md:space-x-10 mb-12 shadow-sm">
            {/* Avatar */}
            <div className="flex justify-center flex-shrink-0">
              <div className="relative p-1 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 rounded-full">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-brand-ink flex items-center justify-center overflow-hidden">
                  <span className="serif text-white text-2xl font-black italic">B</span>
                </div>
                <span className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-1 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 fill-current" />
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-3 md:space-y-0">
                <h2 className="text-xl font-bold font-sans flex items-center gap-1.5">
                  bobbysbunfactory
                </h2>
                <div className="flex space-x-2">
                  <a 
                    href="https://www.instagram.com/bobbysbunfactory/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-brand-ink text-brand-cream hover:bg-brand-terracotta text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full transition-colors inline-flex items-center space-x-1.5"
                  >
                    <span>Follow</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900 border border-zinc-300 rounded-full px-4 py-2 text-xs font-bold transition-all">
                    Message
                  </button>
                </div>
              </div>

              {/* Counts */}
              <div className="flex justify-center md:justify-start space-x-6 text-sm">
                <div>
                  <span className="font-extrabold text-brand-ink">9</span> <span className="text-zinc-500">posts</span>
                </div>
                <div>
                  <span className="font-extrabold text-brand-ink">25.4k</span> <span className="text-zinc-500">followers</span>
                </div>
                <div>
                  <span className="font-extrabold text-brand-ink">148</span> <span className="text-zinc-500">following</span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1 text-xs text-zinc-650 leading-relaxed font-semibold">
                <p className="font-bold text-zinc-900">Bobby's Bun Factory™</p>
                <p>🏠 Anyone with an oven, ambition, and franchise fees. 😉</p>
                <p>🍒 Fresh, artisan fruit caviars & Secret Frost slow-churned at exactly 104°F.</p>
                <a 
                  href="https://www.instagram.com/bobbysbunfactory/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-brand-terracotta hover:underline font-bold"
                >
                  linktr.ee/bobbysbunfactory
                </a>
              </div>
            </div>
          </div>

          {/* 3x3 INSTAGRAM PHOTO GRID */}
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {instagramPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square relative group overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 cursor-pointer shadow-sm transition-transform duration-300 active:scale-95"
                >
                  <img 
                    src={post.image} 
                    alt={post.caption} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white space-y-2 p-2">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-1.5 font-bold text-xs md:text-sm">
                        <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current text-brand-terracotta" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 font-bold text-xs md:text-sm">
                        <MessageCircle className="w-4 h-4 md:w-5 md:h-5 fill-current text-white" />
                        <span>{post.commentsCount}</span>
                      </div>
                    </div>
                    
                    <p className="hidden md:block text-[10px] text-zinc-200 text-center font-medium line-clamp-2 max-w-[90%] pt-2 border-t border-white/20">
                      {post.caption}
                    </p>
                    <span className="text-[8px] mono uppercase tracking-wider text-brand-ochre px-2 py-0.5 bg-brand-cream/10 rounded">
                      View Details
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* FULL INSTAGRAM LIGHTBOX MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white text-zinc-900 rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl border border-zinc-200 md:flex h-[90vh] md:h-auto max-h-[750px]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/80 text-white rounded-full p-2.5 transition-colors shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Huge Post Photo */}
            <div className="w-full md:w-3/5 bg-zinc-950 flex items-center justify-center relative aspect-square md:aspect-auto md:h-full">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.caption} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover max-h-[350px] md:max-h-none md:absolute md:inset-0"
              />
            </div>

            {/* Right Column: Profile, Info, Comments Form */}
            <div className="w-full md:w-2/5 flex flex-col h-[calc(100%-350px)] md:h-full justify-between bg-white border-l border-zinc-100">
              
              {/* Header Profile Info inside Modal */}
              <div className="p-4 border-b border-zinc-150 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-brand-ink text-white flex items-center justify-center font-bold text-sm italic">
                    B
                  </div>
                  <div>
                    <div className="text-xs font-black flex items-center gap-1">
                      bobbysbunfactory
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-current" />
                    </div>
                    <div className="text-[10px] text-zinc-400 font-bold">Atlanta, GA</div>
                  </div>
                </div>
                <a 
                  href="https://www.instagram.com/bobbysbunfactory/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase text-brand-terracotta hover:underline inline-flex items-center space-x-0.5"
                >
                  <span>Link Out</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              {/* Scrollable Comments / Captions Area */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
                
                {/* Author Original Caption */}
                <div className="flex items-start space-x-3 border-b border-zinc-100 pb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-ink text-white flex flex-shrink-0 items-center justify-center font-bold italic text-xs">
                    B
                  </div>
                  <div className="space-y-1 font-medium">
                    <p className="leading-relaxed">
                      <strong className="font-extrabold mr-1.5">bobbysbunfactory</strong>
                      {selectedPost.caption}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {selectedPost.tags.map((tag, idx) => (
                        <span key={idx} className="text-blue-600 font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Simulated Commments List */}
                <div className="space-y-3 pt-1">
                  {selectedPost.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <div className="w-7 h-7 rounded-full bg-zinc-100 text-zinc-500 flex flex-shrink-0 items-center justify-center font-black uppercase text-[10px] border border-zinc-200">
                        {comment.user.slice(0, 2)}
                      </div>
                      <p className="leading-relaxed font-semibold text-zinc-700">
                        <strong className="text-brand-ink font-bold mr-1.5">{comment.user}</strong>
                        {comment.text}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Action Tray */}
              <div className="p-4 border-t border-zinc-100 bg-zinc-55/40 space-y-3">
                <div className="flex justify-between items-center text-zinc-800">
                  <div className="flex space-x-4">
                    <button className="hover:text-red-600 transition-colors">
                      <Heart className="w-5 h-5 text-brand-terracotta fill-current" />
                    </button>
                    <button className="hover:text-zinc-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button className="hover:text-zinc-600 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="hover:text-brand-ochre transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-0.5">
                  <div className="text-xs font-black text-brand-ink">
                    {selectedPost.likes.toLocaleString()} likes
                  </div>
                  <div className="text-[9px] font-black tracking-widest text-zinc-400">
                    {selectedPost.date}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CORE CONTACT LAYOUT — Beautiful form and address details */}
      <section className="py-20 bg-brand-cream/10 border-t border-brand-ochre/15">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            
            {/* Info Column */}
            <div className="space-y-6">
              <h2 className="serif text-5xl md:text-7xl font-black text-brand-ink leading-tight">
                Talk Sweet <br />
                <span className="text-brand-terracotta italic font-normal">To Us.</span>
              </h2>
              <p className="text-zinc-600 text-lg leading-relaxed font-semibold">
                Got a question, general feedback, or a regional business proposal? Drop us a line below. Welcome to Bobby’s high command.
              </p>

              <div className="space-y-6 pt-6">
                
                <div className="flex items-center space-x-4 p-4 bg-white border border-brand-ochre/15 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-100">
                    <Mail className="w-6 h-6 text-brand-terracotta" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email Us</div>
                    <div className="text-brand-ink font-bold text-sm">info@bobbysbunfactory.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white border border-brand-ochre/15 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-100">
                    <MessageSquare className="w-6 h-6 text-brand-terracotta" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Support</div>
                    <div className="text-brand-ink font-bold text-sm">info@bobbysbunfactory.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-white border border-brand-ochre/15 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-zinc-100">
                    <Camera className="w-6 h-6 text-brand-terracotta" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Social Handles</div>
                    <div className="flex items-center space-x-3 mt-1 flex-wrap text-brand-ink font-bold text-xs">
                      <a 
                        href="https://www.facebook.com/BobbysBunFactory/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-brand-terracotta transition-colors border-b border-dashed border-brand-ink/20 mr-2"
                      >
                        Facebook
                      </a>
                      <a 
                        href="https://www.instagram.com/bobbysbunfactory/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-brand-terracotta transition-colors border-b border-dashed border-brand-ink/20 mr-2"
                      >
                        Instagram
                      </a>
                      <a 
                        href="https://www.tiktok.com/@bobbysbunfactory" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-brand-terracotta transition-colors border-b border-dashed border-brand-ink/20"
                      >
                        TikTok
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Form Column */}
            <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl border border-brand-ochre/15">
              {isSuccess ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8 font-black" />
                  </div>
                  <h5 className="font-heading font-black text-lg text-brand-ink uppercase tracking-widest mb-2">
                    Message Received!
                  </h5>
                  <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                    Thanks for reaching out! Your message was submitted successfully and mapped directly to Bobby's priority response queue.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brand-terracotta outline-none transition-all font-sans text-xs disabled:opacity-50"
                      placeholder="Bobby Jr."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brand-terracotta outline-none transition-all font-sans text-xs disabled:opacity-50"
                      placeholder="bobby@factory.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Message</label>
                    <textarea 
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl px-5 py-4 focus:ring-2 focus:ring-brand-terracotta outline-none transition-all resize-none font-sans text-xs disabled:opacity-50"
                      placeholder="Tell us everything..."
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-ink text-brand-ochre py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-brand-terracotta hover:text-brand-cream transition-all flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
