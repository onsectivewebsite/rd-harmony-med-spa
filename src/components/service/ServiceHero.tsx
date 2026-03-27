import React from 'react';
import { motion } from 'motion/react';
import { Clock, CreditCard, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceHeroProps {
  title: string;
  subtitle?: string;
  duration: string;
  price: string;
  image: string;
}

const ServiceHero = ({ title, subtitle, duration, price, image }: ServiceHeroProps) => {
  return (
    <div className="relative h-[60vh] md:h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-spa-bg via-transparent to-transparent" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="text-emerald-600 text-xs uppercase tracking-[0.5em] font-bold block bg-[#111111]/30 backdrop-blur-sm w-fit px-4 py-1.5 rounded-full border border-white/20">
              Premium Treatment
            </span>
            <h1 className="text-5xl md:text-8xl font-serif text-spa-ink leading-[1.1]">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-spa-ink/60 font-light max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
            
            <div className="flex flex-wrap gap-8 items-center pt-4">
              <div className="flex items-center gap-3 text-spa-ink/70">
                <Clock size={20} className="text-emerald-600" />
                <span className="text-sm uppercase tracking-widest font-bold">{duration}</span>
              </div>
              <div className="flex items-center gap-3 text-spa-ink/70 text-gradient-gold">
                <Sparkles size={20} />
                <span className="text-sm uppercase tracking-widest font-bold">{price}</span>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to="/booking"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold shadow-2xl shadow-emerald-500/20 transition-all flex items-center w-fit gap-3 group"
              >
                Book Your Experience <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHero;
