import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Target } from 'lucide-react';

interface ServiceBenefitsProps {
  benefits?: string[];
}

const ServiceBenefits = ({ benefits }: ServiceBenefitsProps) => {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-24 bg-spa-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">The Outcomes</span>
          <h2 className="text-3xl md:text-5xl font-serif text-spa-ink leading-tight mb-8">Clinical Benefits</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-[2.5rem] border border-spa-border hover:border-emerald-500/30 transition-all hover:shadow-xl group text-center"
            >
              <div className="mx-auto w-14 h-14 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                <CheckCircle2 size={24} />
              </div>
              <p className="text-spa-ink/80 font-light leading-relaxed">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
