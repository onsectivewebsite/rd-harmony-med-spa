import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { Smartphone, Clock, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [allServices, setAllServices] = useState(SERVICES);
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const custom = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    setAllServices([...SERVICES, ...custom]);
    
    const prices = JSON.parse(localStorage.getItem('rd_harmony_service_prices') || '{}');
    setCustomPrices(prices);
  }, []);

  const categories = ['All', ...new Set(allServices.map(s => s.category))];
  const filteredServices = activeCategory === 'All'
    ? allServices
    : allServices.filter(s => s.category === activeCategory);

  return (
    <div className="bg-spa-bg min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-20">
          <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block text-center">Treatment Menu</span>
          <h1 className="text-5xl md:text-7xl font-serif text-spa-ink text-center mb-12">Our Services</h1>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                  activeCategory === cat
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-spa-border text-spa-ink/50 hover:border-spa-ink/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-[#111111] border border-spa-border rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col shadow-sm"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-[#111111]/60 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-600/20">
                    {service.category}
                  </span>
                  {service.isMobileAvailable && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-[#111111]/60 backdrop-blur-md px-3 py-1 rounded-full border border-blue-600/20">
                      <Smartphone size={10} /> Mobile
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif text-spa-ink mb-2 group-hover:text-emerald-600 transition-colors">{service.name}</h3>
                <p className="text-spa-ink/40 text-sm font-light line-clamp-2 mb-4 flex-1">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between text-spa-ink/30 text-xs mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" /> {service.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-emerald-500" /> {customPrices[service.id] || service.price}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/services/${service.id}`}
                    className="flex-1 py-3 border border-spa-border hover:border-spa-border/60 text-spa-ink text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all text-center"
                  >
                    Details
                  </Link>
                  <Link
                    to="/booking"
                    state={{ serviceId: service.id }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all text-center"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
