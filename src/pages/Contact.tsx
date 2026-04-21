import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, CheckCircle2, User, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const position = { lat: 43.4418, lng: -79.6644 };
  const [enquiry, setEnquiry] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setStatus('sending');
    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setStatus('error');
        setErrorMsg(result.message || 'Failed to send. Please try again.');
        return;
      }
      setStatus('sent');
      setEnquiry({ name: '', email: '', phone: '', message: '' });
    } catch {
      setStatus('error');
      setErrorMsg('Unable to connect. Please try again later.');
    }
  };

  return (
    <div className="bg-spa-bg min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Get in Touch</span>
            <h1 className="text-5xl md:text-7xl font-serif text-spa-ink mb-8">Contact <br /><span className="italic text-emerald-600">RD Harmony</span></h1>
            <p className="text-spa-ink/50 text-lg font-light leading-relaxed mb-12">
              Have questions about our treatments or mobile services? Our team is here to assist you. Visit us in Oakville or reach out via phone or email.
            </p>

            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#111111]/5 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Our Location</h4>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=78+Jones+St+Oakville+ON+L6L+6C5" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-spa-ink/40 text-sm hover:text-emerald-600 transition-colors"
                  >
                    78 Jones St, Oakville, ON L6L 6C5
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#111111] rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Call Us</h4>
                  <a href="tel:+16478191892" className="text-spa-ink/40 text-sm hover:text-emerald-600 transition-colors">
                    (647) 819-1892
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#111111]/5 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Email Us</h4>
                  <a href="mailto:rajudhanju1974@gmail.com" className="text-spa-ink/40 text-sm hover:text-emerald-600 transition-colors">
                    rajudhanju1974@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-[#111111] rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="text-spa-ink font-medium mb-1">Hours</h4>
                  <p className="text-spa-ink/40 text-sm">Mon - Sat: 9:00 AM - 7:00 PM<br />Sun: Closed</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#111111] flex items-center justify-center text-spa-ink/70 hover:text-emerald-600 hover:bg-emerald-600/10 transition-all shadow-sm">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[#111111] flex items-center justify-center text-spa-ink/70 hover:text-emerald-600 hover:bg-emerald-600/10 transition-all shadow-sm">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-8">
            {/* Map Section */}
            <div className="w-full aspect-square bg-[#111111] rounded-[2.5rem] overflow-hidden border border-spa-border relative shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.434440366144!2d-79.6644!3d43.4418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b5cf696fe931b%3A0xc3f58a36d7a467f3!2s78%20Jones%20St%2C%20Oakville%2C%20ON%20L6L%206C5%2C%20Canada!5e0!3m2!1sen!2sus!4v1710892000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 contrast-125"
                title="Google Maps Location"
              ></iframe>
            </div>

            <div className="bg-emerald-500 p-10 rounded-[2.5rem] text-black">
              <h3 className="text-2xl font-serif mb-4">Mobile Service Area</h3>
              <p className="text-black/70 text-sm leading-relaxed mb-6">
                We provide mobile medical aesthetic services across Oakville, Burlington, and Mississauga. Contact us to check availability for your specific location.
              </p>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
                Now Accepting Mobile Bookings
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="mt-24 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Send a Message</span>
            <h2 className="text-4xl md:text-5xl font-serif text-spa-ink">Have a <span className="italic text-emerald-600">Question?</span></h2>
            <p className="text-spa-ink/50 mt-4">Fill out the form and we will get back to you within one business day.</p>
          </div>

          <div className="bg-[#111111] border border-spa-border p-8 md:p-12 rounded-[2rem] shadow-sm">
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-serif text-spa-ink mb-3">Message Sent!</h3>
                <p className="text-spa-ink/50 mb-6">Thank you for reaching out. A confirmation has been emailed to you and our team will follow up shortly.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-emerald-600 text-xs uppercase tracking-widest font-bold hover:text-spa-ink transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-6">
                {status === 'error' && errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs uppercase tracking-widest font-bold text-center">
                    {errorMsg}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                      <input
                        required
                        type="text"
                        className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Jane Doe"
                        value={enquiry.name}
                        onChange={e => setEnquiry({ ...enquiry, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Phone (optional)</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                      <input
                        type="tel"
                        className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="(905) 000-0000"
                        value={enquiry.phone}
                        onChange={e => setEnquiry({ ...enquiry, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-spa-ink/20" size={16} />
                    <input
                      required
                      type="email"
                      className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="jane@example.com"
                      value={enquiry.email}
                      onChange={e => setEnquiry({ ...enquiry, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-spa-ink/50 font-bold ml-4">Message</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-6 text-spa-ink/20" size={16} />
                    <textarea
                      required
                      rows={5}
                      className="w-full bg-[#1A1A1A] border border-spa-border rounded-2xl py-4 pl-12 pr-4 text-spa-ink focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      placeholder="Tell us how we can help..."
                      value={enquiry.message}
                      onChange={e => setEnquiry({ ...enquiry, message: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-white py-5 rounded-2xl text-sm uppercase tracking-widest font-bold transition-all transform hover:scale-[1.02] disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {status === 'sending' ? 'Sending...' : (<>Send Message <Send size={16} /></>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
