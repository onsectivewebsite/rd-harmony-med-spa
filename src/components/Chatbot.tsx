import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Loader2, Sparkles, Ticket, CheckCircle2, ChevronRight, Phone } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string, showTicketButton?: boolean, suggestions?: string[] }[]>([
    { 
      role: 'bot', 
      text: 'Welcome to RD Harmony Med Spa. I am your concierge. How can I assist you with your beauty journey today?',
      suggestions: ['View Services', 'Booking Info', 'Mobile Services']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [ticketData, setTicketData] = useState({ name: '', email: '', message: '' });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showTicketForm]);

  const knowledgeBase: { [key: string]: { text: string, suggestions?: string[] } } = {
    'facials': {
      text: "We offer several advanced facials: Regular ($90), Hydrafacial ($150), Oxygeneo ($225), Microdermabrasion ($120), Dermaplanning ($100), and Chemical Peels ($130). Which one would you like to know more about?",
      suggestions: ['Hydrafacial', 'Oxygeneo', 'Chemical Peel']
    },
    'botox': {
      text: "Botox is $11 per unit. Mobile service is available! Would you like to book an injection?",
      suggestions: ['Book Botox', 'Mobile Service']
    },
    'xeomin': {
      text: "Xeomin costs $8 per unit. It is a highly pure neurotoxin perfect for smoothing moderate to severe frown lines. We can even come to you!",
      suggestions: ['Book Xeomin', 'Compare Brands']
    },
    'dysport': {
      text: "Dysport goes for $7 per unit. It spreads a bit more quickly and provides an excellent alternative option. Ask our experts about it during a consultation!",
      suggestions: ['Book Dysport', 'Differences']
    },
    'microneedling': {
      text: "Microneedling is $225 per session, or a Package of 3 for $550. We also offer it with premium boosters (Salmon DNA/NAD+/Exosomes) for $425.",
      suggestions: ['Pkg of 3 Deals', 'Boosters Info']
    },
    'prp': {
      text: "PRP Face is $400, PRP Hair is $375, and PRP Under Eye is $220. Packages of 3 are available for all. Note: A $45 annual doctor's fee applies.",
      suggestions: ['PRP Hair', 'PRP Face', 'Under Eye']
    },
    'under eye': {
      text: "PRP for Dark Under-Eye Circles uses your own plasma to revitalize the delicate skin. It's $220/session, or a package of 3 for $600.",
      suggestions: ['Book Under-Eye PRP', 'PRP Face']
    },
    'electrolysis': {
      text: "Electrolysis is an FDA-approved method for permanent hair removal, suitable for all hair and skin types. Prices start at $30 for 15 minutes.",
      suggestions: ['Book Electrolysis', 'Waxing Options']
    },
    'iv therapy': {
      text: "Our IV drips include Wellness ($220), Glutathione ($190), Calories Burn ($250), and Iron Infusion ($275). Most have 'Package of 3' discounts!",
      suggestions: ['IV Wellness', 'Iron Infusion', 'Glutathione']
    },
    'iron': {
      text: "Iron Infusions (Venofer) are $275. A package of 3 is $700. Recent blood work showing Ferritin levels is required for this treatment.",
      suggestions: ['Book Iron IV', 'Requirements']
    },
    'threading': {
      text: "Threading prices: Brows ($10), Upper Lips ($5), Forehead ($5), Chin ($3), Cheeks ($7), or Full Face ($25). Quick and precise!",
      suggestions: ['Book Brows', 'Full Face']
    },
    'waxing': {
      text: "Waxing options: Brazilian ($30), Full Leg ($38), Full Arm ($28), Underarms ($12). Brazilian with Numbing is $45.",
      suggestions: ['Brazilian', 'Full Leg', 'Arm Waxing']
    },
    'location': {
      text: "We are located at 78 Jones St, Oakville, ON L6L 6C5. We also provide mobile services across the region for select treatments.",
      suggestions: ['Get Directions', 'Mobile Cities']
    },
    'doctor': {
      text: "A doctor's fee ($20 for injections, $45 for IVs) is required for medical clearance. This fee is valid for one full year of treatments!",
      suggestions: ['Pricing Info', 'Booking']
    },
    'mobile': {
      text: "Yes! Mobile service is available for Botox, Xeomin, Dysport, and all IV & Injection therapies. Experience the spa at home.",
      suggestions: ['Book Mobile', 'IV Selection']
    },
    'price': {
      text: "Our services range from $3 threading to premium $900 clinical packages. You can see the full list on our Services page.",
      suggestions: ['View Services', 'Package Deals']
    },
    'booking': {
      text: "Booking is easy! Use the 'Book Now' button on our site or call/text us at (647) 819-1892 to secure your spot.",
      suggestions: ['Online Booking', 'Call Now']
    }
  };

  const processMessage = async (text: string) => {
    const lowText = text.toLowerCase().trim();
    
    // Exact or partial keyword matching
    const keys = Object.keys(knowledgeBase);
    const matchedKey = keys.find(key => lowText.includes(key));

    if (matchedKey) {
      return knowledgeBase[matchedKey];
    }

    // Contextual handling for "hello", "hi", etc.
    if (lowText.match(/^(hi|hello|hey|greetings)/)) {
      return {
        text: "Hello! I'm the RD Harmony assistant. Are you interested in skincare, injectables, or perhaps our IV wellness drips today?",
        suggestions: ['Skincare', 'Injectables', 'IV Therapy']
      };
    }

    // Default fallback
    return {
      text: "I want to make sure you get the exact medical information you need. Would you like me to open a direct enquiry ticket for our specialist crew?",
      showTicketButton: true,
      suggestions: ['Main Services', 'Pricing', 'Contact']
    };
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(async () => {
      const response = await processMessage(textToSend);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: response.text, 
        suggestions: response.suggestions,
        showTicketButton: (response as any).showTicketButton 
      }]);
      setIsLoading(false);
    }, 800);
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketStatus('submitting');
    // Simulated ticket submission
    setTimeout(() => {
      setTicketStatus('success');
      setTimeout(() => {
        setShowTicketForm(false);
        setTicketStatus('idle');
        setMessages(prev => [...prev, { role: 'bot', text: "Thank you! Our clinical team has received your ticket and will contact you within 24 hours." }]);
      }, 1500);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-600/20 flex items-center justify-center hover:scale-110 transition-all active:scale-95 group"
      >
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#111111] rounded-full flex items-center justify-center animate-bounce shadow-md">
           <span className="w-2 h-2 bg-emerald-600 rounded-full" />
        </div>
        <MessageCircle size={30} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="fixed bottom-28 right-8 z-[100] w-[380px] h-[600px] bg-[#111111] backdrop-blur-2xl border border-spa-border rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden shadow-emerald-600/10"
          >
            {/* Elegant Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#111111]/20 rounded-2xl backdrop-blur-md flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">RD Harmony Concierge</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#111111] rounded-full animate-pulse shadow-sm" />
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">Online & Ready</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 flex items-center justify-center hover:bg-[#111111]/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Conversation Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-gradient-to-b from-spa-bg/50 to-white">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none shadow-lg shadow-emerald-600/10'
                      : 'bg-[#111111] border border-spa-border text-spa-ink rounded-tl-none font-light'
                  }`}>
                    {msg.text}
                  </div>
                  
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                       {msg.suggestions.map((s, idx) => (
                         <button 
                           key={idx}
                           onClick={() => handleSend(s)}
                           className="px-4 py-2 rounded-full border border-emerald-600/20 text-emerald-600 text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all bg-[#111111] shadow-sm"
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                  )}

                  {msg.showTicketButton && !showTicketForm && (
                    <button
                      onClick={() => setShowTicketForm(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/10"
                    >
                      <Ticket size={14} /> Open Support Ticket
                    </button>
                  )}
                </div>
              ))}
              
              {showTicketForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#1A1A1A] p-6 rounded-[2rem] border border-spa-border space-y-4 shadow-inner"
                >
                  <div className="flex items-center gap-2 text-emerald-600">
                    <Ticket size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Enquiry Desk</span>
                  </div>
                  <input
                    required
                    placeholder="Full Name"
                    className="w-full bg-[#111111] border border-spa-border rounded-xl px-4 py-3 text-xs text-spa-ink focus:border-emerald-500 outline-none transition-all shadow-sm"
                    value={ticketData.name}
                    onChange={e => setTicketData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-[#111111] border border-spa-border rounded-xl px-4 py-3 text-xs text-spa-ink focus:border-emerald-500 outline-none transition-all shadow-sm"
                    value={ticketData.email}
                    onChange={e => setTicketData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  <textarea
                    required
                    placeholder="Your message..."
                    rows={3}
                    className="w-full bg-[#111111] border border-spa-border rounded-xl px-4 py-3 text-xs text-spa-ink focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                    value={ticketData.message}
                    onChange={e => setTicketData(prev => ({ ...prev, message: e.target.value }))}
                  />
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={() => setShowTicketForm(false)}
                      className="flex-1 py-3 text-spa-ink/40 text-[10px] font-bold uppercase tracking-widest hover:text-spa-ink transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleTicketSubmit}
                      className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/10"
                    >
                      {ticketStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </motion.div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#111111] border border-spa-border p-4 rounded-3xl rounded-tl-none shadow-sm">
                     <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
                     </div>
                  </div>
                </div>
              )}
            </div>

            {/* Premium Input Bar */}
            <div className="p-6 bg-[#111111] border-t border-spa-border px-8">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tell me about a service..."
                  disabled={showTicketForm}
                  className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-6 pr-14 text-sm text-spa-ink focus:outline-none focus:border-emerald-500/50 transition-all placeholder:text-spa-ink/30 shadow-inner"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading || showTicketForm}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-20 shadow-lg shadow-emerald-600/10"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-spa-ink/30 text-center mt-4 uppercase tracking-[0.2em] font-medium">Powered by RD Harmony Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
