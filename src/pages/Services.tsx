import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SERVICES } from '../constants';
import { Service } from '../types';
import { Smartphone, Clock, Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const THREADING_UMBRELLA_ID = 'threading-waxing';
const THREADING_UMBRELLA: Service = {
  id: THREADING_UMBRELLA_ID,
  name: 'Threading & Waxing',
  duration: '10–45 Minutes',
  // Marketing headline price. To make this dynamic, swap to the min of all
  // T&W prices via constants + customPrices on render.
  price: 'Starting from $10',
  category: 'Threading & Waxing',
  isMobileAvailable: false,
  description:
    'Brow shaping, upper lip, full face, arms, legs, Brazilian and more — precision threading and gentle medical-grade waxing for every need.',
  image: '/images/svc_eyebrow_threading.jpg',
};

type DisplayItem = {
  key: string;
  serviceId: string;
  optionId?: string;
  name: string;
  description?: string;
  duration: string;
  price: string;
  category: string;
  image?: string;
  isMobileAvailable?: boolean;
  isThreadingUmbrella?: boolean;
};

const Services = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [allServices, setAllServices] = useState<Service[]>(SERVICES);
  const [customPrices, setCustomPrices] = useState<Record<string, string>>({});

  React.useEffect(() => {
    const custom = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    setAllServices([...SERVICES, ...custom]);

    fetch('/api/service-prices')
      .then(r => r.json())
      .then(d => { if (d?.success && d.prices) setCustomPrices(d.prices); })
      .catch(() => {});
  }, []);

  // Build the cards shown in the grid. Two special cases:
  //  - Threading & Waxing collapses into one umbrella card (options live on the
  //    detail page).
  //  - A service with price tiers (`options`, e.g. Hydrafacial) expands into one
  //    card per tier so each package is bookable directly from the menu.
  const displayItems = React.useMemo<DisplayItem[]>(() => {
    const out: DisplayItem[] = [];
    let umbrellaInserted = false;
    for (const s of allServices) {
      if (s.category === 'Threading & Waxing') {
        if (!umbrellaInserted) {
          out.push({
            key: THREADING_UMBRELLA_ID,
            serviceId: THREADING_UMBRELLA_ID,
            name: THREADING_UMBRELLA.name,
            description: THREADING_UMBRELLA.description,
            duration: THREADING_UMBRELLA.duration,
            price: THREADING_UMBRELLA.price,
            category: THREADING_UMBRELLA.category,
            image: THREADING_UMBRELLA.image,
            isThreadingUmbrella: true,
          });
          umbrellaInserted = true;
        }
        continue;
      }
      if (s.options && s.options.length > 0) {
        for (const opt of s.options) {
          out.push({
            key: `${s.id}-${opt.id}`,
            serviceId: s.id,
            optionId: opt.id,
            name: opt.name,
            description: opt.description || s.description,
            duration: opt.duration || s.duration,
            price: opt.price,
            category: s.category,
            image: s.image,
            isMobileAvailable: s.isMobileAvailable,
          });
        }
        continue;
      }
      out.push({
        key: s.id,
        serviceId: s.id,
        name: s.name,
        description: s.description,
        duration: s.duration,
        price: customPrices[s.id] || s.price,
        category: s.category,
        image: s.image,
        isMobileAvailable: s.isMobileAvailable,
      });
    }
    return out;
  }, [allServices, customPrices]);

  const categories = ['All', ...new Set(displayItems.map(i => i.category))];
  const filteredServices = activeCategory === 'All'
    ? displayItems
    : displayItems.filter(i => i.category === activeCategory);

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
          {filteredServices.map((item, idx) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-[#111111] border border-spa-border rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all flex flex-col shadow-sm"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-60" />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 bg-[#111111]/60 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-600/20">
                    {item.category}
                  </span>
                  {item.isMobileAvailable && (
                    <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-blue-600 bg-[#111111]/60 backdrop-blur-md px-3 py-1 rounded-full border border-blue-600/20">
                      <Smartphone size={10} /> Mobile
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-serif text-spa-ink mb-2 group-hover:text-emerald-600 transition-colors">{item.name}</h3>
                <p className="text-spa-ink/40 text-sm font-light line-clamp-2 mb-4 flex-1">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-spa-ink/30 text-xs mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-emerald-500" /> {item.duration}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-emerald-500" /> {item.price}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to={`/services/${item.serviceId}`}
                    className="flex-1 py-3 border border-spa-border hover:border-spa-border/60 text-spa-ink text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all text-center"
                  >
                    {item.isThreadingUmbrella ? 'View Options' : 'Details'}
                  </Link>
                  {item.isThreadingUmbrella ? (
                    <Link
                      to={`/services/${item.serviceId}`}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all text-center"
                    >
                      Book
                    </Link>
                  ) : (
                    <Link
                      to="/booking"
                      state={{ serviceId: item.serviceId, optionId: item.optionId }}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase tracking-widest font-bold rounded-xl transition-all text-center"
                    >
                      Book
                    </Link>
                  )}
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
