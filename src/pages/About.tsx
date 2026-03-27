import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-spa-bg text-spa-ink">
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-8xl font-serif text-spa-ink mb-12 leading-tight">
              Dedicated to Your <br />
              <span className="italic text-emerald-600">Natural Radiance</span>
            </h1>
            <p className="text-spa-ink/60 text-xl font-light leading-relaxed">
              RD Harmony Med Spa was founded on the principle that medical aesthetics should be a harmonious blend of clinical precision and holistic wellness. Located in the heart of Oakville, we provide a sanctuary for those seeking transformative results in a serene, luxury environment.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <Sparkles className="w-full h-full text-emerald-500/20" />
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-32 bg-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden">
                <img
                  src="/images/image_13.jpg"
                  alt="Professional Med Spa Treatment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500 rounded-[2rem] p-8 flex flex-col justify-end">
                <h4 className="text-white text-4xl font-serif mb-2">10+</h4>
                <p className="text-white/70 text-xs uppercase tracking-widest font-bold">Years of Excellence</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif text-spa-ink">The RD Harmony Philosophy</h2>
                <p className="text-spa-ink/50 leading-relaxed">
                  We believe that beauty is not just skin deep. It's a reflection of your overall health and confidence. Our treatments are designed to not only improve your appearance but to rejuvenate your spirit.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <Heart size={20} />
                  </div>
                  <h4 className="font-serif text-lg text-spa-ink">Holistic Approach</h4>
                  <p className="text-spa-ink/40 text-sm">Treating the whole person, not just the symptoms.</p>
                </div>
                <div className="space-y-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <Award size={20} />
                  </div>
                  <h4 className="font-serif text-lg text-spa-ink">Certified Experts</h4>
                  <p className="text-spa-ink/40 text-sm">Our practitioners are highly trained and certified.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Values */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Our Values</span>
          <h2 className="text-4xl md:text-6xl font-serif text-spa-ink mb-20">What Defines Us</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-12 bg-zinc-950 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all">
              <Users className="w-12 h-12 text-emerald-600 mx-auto mb-8" />
              <h3 className="text-xl font-serif text-white mb-4">Client Centric</h3>
              <p className="text-white/70 text-sm leading-relaxed">Every treatment plan is customized to your unique needs and goals.</p>
            </div>
            <div className="p-12 bg-zinc-950 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all">
              <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-8" />
              <h3 className="text-xl font-serif text-white mb-4">Innovation</h3>
              <p className="text-white/70 text-sm leading-relaxed">We stay at the forefront of aesthetic medicine with continuous training.</p>
            </div>
            <div className="p-12 bg-zinc-950 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all">
              <ShieldCheck size={48} className="text-emerald-600 mx-auto mb-8" />
              <h3 className="text-xl font-serif text-white mb-4">Safety First</h3>
              <p className="text-white/70 text-sm leading-relaxed">Your health and safety are our absolute top priorities in every procedure.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default About;
