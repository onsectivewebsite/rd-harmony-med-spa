import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const Offers = () => {
  const { offers } = useContent();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 bg-spa-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-emerald-600 text-xs uppercase tracking-[0.4em] font-bold mb-6"
          >
            <Sparkles size={16} /> Special Offers
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Exclusive <span className="font-serif italic text-emerald-600">Offers</span> & Promotions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-spa-ink/60 max-w-2xl mx-auto text-lg"
          >
            Enjoy our latest promotional pricing on premium treatments. Limited-time offers
            designed to help you glow for less.
          </motion.p>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col h-full relative"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                {offer.badge && (
                  <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-emerald-500 text-black text-[0.65rem] uppercase tracking-widest font-bold px-4 py-2 rounded-full shadow-lg">
                    <Tag size={12} /> {offer.badge}
                  </span>
                )}
                <div className="absolute bottom-5 left-6 right-6">
                  <h3 className="text-3xl font-serif text-white leading-tight">{offer.title}</h3>
                  {offer.subtitle && (
                    <p className="text-white/70 text-sm uppercase tracking-widest font-medium mt-1">
                      {offer.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 md:p-10 flex flex-col flex-grow">
                {/* Price */}
                <div className="mb-8 pb-8 border-b border-spa-border flex items-end gap-4">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-light tracking-tight text-emerald-600">{offer.offerPrice}</span>
                  </div>
                  {offer.originalPrice && (
                    <div className="mb-2">
                      <span className="text-spa-ink/40 text-xl line-through">{offer.originalPrice}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-spa-ink/70 text-sm leading-relaxed mb-8">{offer.description}</p>

                {/* Highlights */}
                {offer.highlights && offer.highlights.length > 0 && (
                  <div className="space-y-4 mb-8 flex-grow">
                    <p className="text-xs font-bold uppercase tracking-widest text-spa-ink/40">What's Included</p>
                    {offer.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-spa-ink/80 text-sm leading-relaxed">{h}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className="mt-auto pt-8 border-t border-spa-border flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/booking"
                    className="group flex items-center justify-center gap-2 flex-1 bg-emerald-600 text-white py-4 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Book This Offer
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  {offer.serviceId && (
                    <Link
                      to={`/services/${offer.serviceId}`}
                      className="flex items-center justify-center gap-2 flex-1 border border-spa-border text-spa-ink/80 py-4 rounded-xl font-medium uppercase tracking-widest text-xs hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                    >
                      View Treatment
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Offers;
