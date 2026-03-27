import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, UserCheck, ShieldCheck, Heart, MapPin, Search, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceExperienceProps {
  experience?: string;
  idealFor?: string[];
  name: string;
}

export const ServiceExperience = ({ experience, idealFor, name }: ServiceExperienceProps) => {
  return (
    <section className="section-padding bg-[#1A1A1A] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-600/10 to-transparent" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative shadow-emerald-500/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
              <img 
                src="/images/image_12.jpg" 
                alt="Clinic Experience" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-[#111111] p-8 rounded-[2.5rem] shadow-2xl border border-spa-border hidden md:block group-hover:translate-x-4 transition-transform">
               <Sparkles className="text-emerald-600 mb-4" size={32} />
               <div className="text-xs uppercase tracking-[0.2em] font-bold text-spa-ink/40 mb-2">Sensory Feel</div>
               <div className="text-2xl font-serif text-spa-ink text-gradient-gold italic">Pure Excellence</div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">The Sensation</span>
              <h2 className="text-3xl md:text-5xl font-serif text-spa-ink leading-tight mb-8">What to Expect During <br /> Your Journey</h2>
              <p className="text-spa-ink/60 text-lg md:text-xl font-light leading-relaxed italic">
                "{experience || `RD Harmony ${name} is designed to provide exceptional results using the latest technology and premium products. Whether you're looking for rejuvenation, relaxation, or specific skin improvements, our expert team is here to guide you.`}"
              </p>
            </div>

            {idealFor && (
              <div className="pt-8 border-t border-spa-border">
                <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-spa-ink/40 mb-8 flex items-center gap-3">
                   <Target className="text-emerald-600" size={16} /> Targeted For
                </h3>
                <div className="flex flex-wrap gap-4">
                  {idealFor.map((item, i) => (
                    <span key={i} className="bg-[#111111] px-6 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold text-spa-ink/70 border border-spa-border hover:border-emerald-500/30 transition-all hover:bg-[#1A1A1A] shadow-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ServiceSafety = () => {
  const standards = [
    { icon: <ShieldCheck size={28} />, title: "FDA-Approved Tech", desc: "We use the latest, safest medical-grade technologies only." },
    { icon: <Heart size={28} />, title: "Medical-Grade Products", desc: "Only the highest quality clinical formulations for your skin." },
    { icon: <Sparkles size={28} />, title: "Sterile Environment", desc: "Medical-grade sterilization protocols in every session." },
    { icon: <UserCheck size={28} />, title: "Expert Practitioners", desc: "Highly trained and certified medical professionals." }
  ];

  return (
    <section className="section-padding bg-stone-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none -mr-32">
        <ShieldCheck size={400} />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-emerald-400 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Foundation & Trust</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-8">Clinical Safety & Standards</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {standards.map((s, i) => (
            <div key={i} className="group p-10 bg-[#111111]/5 border border-white/10 rounded-[2.5rem] hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all text-center">
              <div className="mx-auto w-16 h-16 bg-[#111111]/5 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all shadow-xl mb-8">
                {s.icon}
              </div>
              <h3 className="text-xl font-serif mb-4">{s.title}</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ServiceCTA = ({ name }: { name: string }) => {
  return (
    <section className="py-32 bg-[#111111]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-[#1A1A1A] border border-spa-border p-12 md:p-24 rounded-[4rem] text-center relative overflow-hidden shadow-2xl group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity duration-1000" />
          <div className="relative z-10 scale-100 group-hover:scale-[1.02] transition-transform duration-700">
            <span className="text-emerald-600 text-xs uppercase tracking-[0.5em] font-bold block mb-8">Transform Your Look</span>
            <h2 className="text-4xl md:text-6xl font-serif text-spa-ink mb-10 leading-tight">Limited Slots Available — <br className="hidden md:block" /> <span className="italic text-emerald-600/70">Secure Yours Today.</span></h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link 
                to="/booking"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold shadow-2xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 group/btn scale-100 hover:scale-105"
              >
                Book Securely Now <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/free-consultation"
                className="bg-[#111111] border border-spa-border hover:border-emerald-600 text-spa-ink px-12 py-5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center hover:text-emerald-600 scale-100 hover:scale-105 shadow-sm"
              >
                Not Sure? Get Consulted
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
