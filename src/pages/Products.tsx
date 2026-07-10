import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';

const Products = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 bg-spa-bg min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-emerald-600 text-xs uppercase tracking-[0.4em] font-bold mb-6"
          >
            <Sparkles size={16} /> Shop
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Medical-Grade <span className="font-serif italic text-emerald-600">Skincare</span> Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-spa-ink/60 max-w-2xl mx-auto text-lg"
          >
            Continue your results at home with our curated selection of professional skincare.
            Contact us to purchase or ask which products are right for your skin.
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 3) * 0.1 }}
              className="glass-card rounded-3xl overflow-hidden flex flex-col group"
            >
              {/* Image / placeholder */}
              <div className="relative h-56 overflow-hidden bg-gradient-to-br from-emerald-900/30 to-[#111111] flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-6xl font-serif text-emerald-500/40 select-none">
                    {product.name.charAt(0)}
                  </span>
                )}
                {product.category && (
                  <span className="absolute top-4 left-4 text-[0.6rem] uppercase tracking-widest font-bold text-emerald-300 bg-black/40 px-3 py-1.5 rounded-full">
                    {product.category}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-serif text-spa-ink mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-spa-ink/60 text-sm leading-relaxed mb-4 flex-grow">{product.description}</p>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-spa-border">
                  {product.price && (
                    <span className="flex items-center gap-1.5 text-spa-ink font-medium">
                      <Tag size={14} className="text-emerald-500" /> {product.price}
                    </span>
                  )}
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1.5 text-emerald-600 text-[10px] uppercase tracking-widest font-bold hover:text-emerald-500 transition-colors"
                  >
                    Enquire <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;
