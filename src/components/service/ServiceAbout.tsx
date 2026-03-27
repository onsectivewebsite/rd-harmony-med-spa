import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ServiceAboutProps {
  description?: string;
  name: string;
  category: string;
  technology?: string;
}

const ServiceAbout = ({ description, name, category, technology }: ServiceAboutProps) => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div>
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">The Treatment</span>
              <h2 className="text-4xl md:text-6xl font-serif text-spa-ink leading-tight mb-8 text-gradient-gold">
                About the <span className="italic">{name}</span>
              </h2>
              <div className="text-spa-ink/70 text-lg md:text-xl font-light leading-relaxed space-y-6">
                <p>{description}</p>
              </div>
            </div>

            {technology && (
              <div className="bg-stone-50 border border-spa-border p-12 rounded-[3.5rem] group hover:shadow-2xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-700" />
                <div className="flex items-center gap-6 mb-8 group/icon">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover/icon:rotate-[15deg] duration-500">
                    <Sparkles size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-spa-ink italic">Advanced Technology</h3>
                    <div className="text-xs uppercase tracking-widest font-bold text-emerald-600/60 mt-2">Clinical Precision</div>
                  </div>
                </div>
                <p className="text-spa-ink/60 text-lg font-light leading-relaxed mb-6">{technology}</p>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-spa-ink/40">
                  <ShieldCheck size={16} className="text-emerald-600" /> Authorized provider for {technology}
                </div>
              </div>
            )}
          </div>

          <div className="relative group lg:pl-12">
             <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative shadow-emerald-500/5 z-10 transition-transform duration-700 group-hover:scale-[0.98]">
               <img 
                 src="/images/image_10.jpg" 
                 alt="Aesthetic Precision" 
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
             </div>
             {/* Decorative frames */}
             <div className="absolute top-10 -right-10 w-full h-full border border-spa-border rounded-[4.5rem] -z-1 group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform duration-1000" />
             <div className="absolute -bottom-10 -left-10 w-full h-full bg-stone-50 rounded-[4.5rem] -z-1 group-hover:-translate-x-4 group-hover:translate-y-4 transition-transform duration-1000 opacity-50" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceAbout;
