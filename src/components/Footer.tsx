import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-spa-bg border-t border-spa-border pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-flex items-center mb-8 group">
              <img 
                src="/logo.png" 
                alt="RD Harmony Logo" 
                className="h-[8rem] md:h-[10rem] w-auto object-contain" 
              />
            </Link>
            <p className="text-spa-ink/50 text-sm max-w-sm leading-relaxed mb-8">
              Experience the Future of Aesthetic Care. We blend advanced medical technology with a refined, client-first approach to deliver exceptional results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-spa-ink/40 hover:text-emerald-600 hover:border-emerald-600 transition-all bg-[#111111] shadow-sm">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-spa-ink/40 hover:text-emerald-600 hover:border-emerald-600 transition-all bg-[#111111] shadow-sm">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-spa-ink text-xs uppercase tracking-[0.2em] font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">Our Services</Link></li>
              <li><Link to="/about" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">About Us</Link></li>
              <li><Link to="/booking" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">Book Appointment</Link></li>
              <li><Link to="/contact" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">Contact</Link></li>
              <li><Link to="/free-consultation" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">Free Consultation</Link></li>
              <li><Link to="/admin" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors italic">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-spa-ink text-xs uppercase tracking-[0.2em] font-bold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=78+Jones+St+Oakville+ON+L6L+6C5" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors"
                >
                  78 Jones St, Oakville, ON L6L 6C5
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-emerald-600 shrink-0" />
                <a href="tel:+16478191892" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">
                  (647) 819-1892
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-emerald-600 shrink-0" />
                <a href="mailto:rajudhanju1974@gmail.com" className="text-spa-ink/50 text-sm hover:text-emerald-600 transition-colors">
                  rajudhanju1974@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-spa-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-spa-ink/30 text-[10px] uppercase tracking-widest">
            © 2026 RD Harmony Med Spa. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-spa-ink/30 text-[10px] uppercase tracking-widest hover:text-spa-ink transition-colors">Privacy Policy</a>
            <a href="#" className="text-spa-ink/30 text-[10px] uppercase tracking-widest hover:text-spa-ink transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
