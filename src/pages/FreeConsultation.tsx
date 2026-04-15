import React from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Stethoscope, 
  ClipboardList, 
  CheckCircle2, 
  ArrowRight,
  Search,
  Zap,
  Leaf,
  Users,
  Car,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FreeConsultation = () => {
  const highlights = [
    { icon: <Search size={20} />, text: '15-Minute Expert Consultation' },
    { icon: <ClipboardList size={20} />, text: 'Tailored Aesthetic Roadmap' },
    { icon: <Zap size={20} />, text: 'No Cost – No Obligation' },
  ];

  const exceptionalFeatures = [
    {
      icon: <Sparkles className="text-emerald-600" />,
      title: "Personalized Skin Intelligence",
      description: "We assess hydration, elasticity, pigmentation, and texture to create a complete skin profile."
    },
    {
      icon: <Stethoscope className="text-emerald-600" />,
      title: "Medical Expertise",
      description: "All consultations are conducted by trained professionals with deep clinical knowledge in aesthetic medicine."
    },
    {
      icon: <Target className="text-emerald-600" />,
      title: "Tailored Treatment Strategy",
      description: "Receive a step-by-step roadmap designed specifically for your skin goals."
    }
  ];

  const safetyStandards = [
    "Medical-grade sterilization protocols",
    "Single-use or fully sanitized instruments",
    "FDA-approved technologies only",
    "Continuous practitioner training & certification"
  ];

  const journeySteps = [
    {
      step: "01",
      title: "Discovery",
      description: "We evaluate your skin condition, concerns, and expectations."
    },
    {
      step: "02",
      title: "Analysis",
      description: "Detailed assessment of tone, texture, hydration, and underlying issues."
    },
    {
      step: "03",
      title: "Custom Plan",
      description: "A personalized treatment roadmap is created for optimal, natural results."
    }
  ];

  const reasonsToChoose = [
    {
      icon: <Leaf className="text-emerald-600" />,
      title: "Holistic + Medical Approach",
      description: "We combine science with artistry to deliver balanced, natural beauty."
    },
    {
      icon: <Car className="text-emerald-600" />,
      title: "Mobile Luxury Services",
      description: "Enjoy select treatments in the comfort of your home."
    },
    {
      icon: <Users className="text-emerald-600" />,
      title: "Results That Look Natural",
      description: "We enhance — never overdo. Your beauty, refined."
    }
  ];

  const faqs = [
    {
      q: "How long do results last?",
      a: "Results vary depending on the treatment, but most clients enjoy visible improvements for weeks to months. Maintenance plans are recommended for long-term results."
    },
    {
      q: "Is there any downtime?",
      a: "Many treatments involve no downtime. Some advanced procedures may cause mild redness for 24–48 hours."
    },
    {
      q: "How many sessions are required?",
      a: "Typically, a series of 3–6 sessions is recommended for optimal outcomes, depending on your goals."
    }
  ];

  return (
    <div className="bg-spa-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-200 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block"
          >
            Clinical Excellence
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-serif text-spa-ink mb-8 leading-tight"
          >
            Elevate Your Natural Beauty <br className="hidden md:block" />
            with <span className="italic">Expert Precision</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-spa-ink/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Begin your transformation with a personalized, medical-grade consultation designed to understand your skin at a deeper level.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
          >
            {highlights.map((h, i) => (
              <div key={i} className="flex items-center justify-center gap-3 bg-[#111111]/50 backdrop-blur-sm border border-spa-border p-4 rounded-2xl">
                <div className="text-emerald-600">{h.icon}</div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-spa-ink/80">{h.text}</span>
              </div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row gap-6 justify-center"
          >
            <Link 
              to="/booking"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 group"
            >
              Book Your Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/services"
              className="bg-[#111111] border border-spa-border hover:bg-[#1A1A1A] text-spa-ink px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center"
            >
              Explore All Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                <img 
                  src="/images/doctor_patient.jpg"
                  alt="Aesthetic Consultation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-spa-bg p-8 rounded-[2rem] shadow-xl border border-spa-border hidden md:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-spa-ink/40">Success Rate</div>
                    <div className="text-2xl font-serif text-spa-ink">100% Personalization</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold">Premium Experience</span>
              <h2 className="text-3xl md:text-5xl font-serif text-spa-ink leading-tight">
                Your journey at RD Harmony begins with more than just a consultation — <span className="italic text-emerald-600/70">it is a clinical discovery session.</span>
              </h2>
              <div className="space-y-6 text-spa-ink/70 leading-relaxed text-lg font-light">
                <p>
                  We take the time to understand your skin’s unique biology, your aesthetic goals, and your lifestyle. Using advanced assessment techniques, our experts craft a bespoke treatment plan that enhances your natural features while aligning with your comfort and budget.
                </p>
                <p>
                  This is not a generic consultation — it is a precision-driven approach to beauty and wellness.
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-6 pt-6">
                {exceptionalFeatures.map((f, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-[#1A1A1A] rounded-2xl border border-spa-border hover:shadow-lg transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-[#111111] flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-serif text-spa-ink mb-1">{f.title}</h3>
                      <p className="text-sm text-spa-ink/60">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="section-padding bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <ShieldCheck size={400} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-emerald-400 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Our Foundation</span>
          <h2 className="text-3xl md:text-5xl font-serif mb-12">Clinical Safety & Standards</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-16 text-lg font-light">
            At RD Harmony, safety is not a feature — it is our foundation. Your trust is built on our commitment to clinical excellence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {safetyStandards.map((s, i) => (
              <div key={i} className="bg-[#111111]/5 border border-white/10 p-8 rounded-3xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all flex flex-col items-center gap-4">
                <ShieldCheck className="text-emerald-400" size={32} />
                <p className="text-xs uppercase tracking-[0.2em] font-bold leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section className="section-padding bg-spa-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">The Process</span>
            <h2 className="text-3xl md:text-5xl font-serif text-spa-ink">Your Experience Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[60px] left-0 w-full h-[2px] bg-emerald-600/10 -z-1" />
            {journeySteps.map((s, i) => (
              <div key={i} className="relative bg-[#111111] p-10 rounded-[2.5rem] border border-spa-border shadow-sm hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-8 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <h3 className="text-2xl font-serif text-spa-ink mb-4">{s.title}</h3>
                <p className="text-spa-ink/60 font-light leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="section-padding bg-[#111111] relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="w-full lg:w-1/2 space-y-8">
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold">The Difference</span>
              <h2 className="text-3xl md:text-5xl font-serif text-spa-ink">Why Clients Choose <br /> RD Harmony</h2>
              <div className="grid grid-cols-1 gap-8 pt-8">
                {reasonsToChoose.map((r, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="shrink-0 w-14 h-14 bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                      {r.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-serif text-spa-ink mb-2">{r.title}</h4>
                      <p className="text-spa-ink/60 font-light leading-relaxed">{r.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="bg-[#1A1A1A] p-12 rounded-[3rem] border border-spa-border shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <Sparkles className="text-emerald-600 mb-8" size={48} />
                  <h3 className="text-[10px] uppercase tracking-[0.5em] font-bold text-spa-ink/40 mb-4 block">Service Details</h3>
                  <div className="text-4xl font-serif text-spa-ink mb-2">Free Consultation</div>
                  <div className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-8">Duration: 15 Minutes • Price: Complimentary</div>
                  <ul className="space-y-4 mb-10">
                    {["Skin Analysis", "Expert Recommendations", "Customized Treatment Plan"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-spa-ink/70">
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span className="text-sm uppercase tracking-widest font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-spa-ink/30 text-[10px] uppercase tracking-widest font-bold italic">
                    📌 Final pricing for treatments will be discussed during consultation.
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto bg-stone-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">Start Your Personalized Skin Journey Today</h2>
            <p className="text-white/60 text-lg md:text-xl font-light mb-12 max-w-2xl mx-auto leading-relaxed">
              Limited consultation slots available. Secure your appointment and take the first step toward refined, confident beauty.
            </p>
            <Link 
              to="/booking"
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black px-12 py-6 rounded-full text-sm uppercase tracking-[0.2em] font-bold shadow-xl shadow-emerald-500/20 transition-all transform hover:scale-105"
            >
              👉 Book Appointment Now
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-[#111111]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Common Inquiries</span>
            <h2 className="text-3xl md:text-5xl font-serif text-spa-ink">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-spa-bg border border-spa-border p-8 rounded-3xl hover:border-emerald-600/20 transition-all">
                <h3 className="text-xl font-serif text-spa-ink mb-4">{faq.q}</h3>
                <p className="text-spa-ink/60 font-light leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className="py-24 bg-[#1A1A1A] border-y border-spa-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Sparkles className="text-emerald-600 mx-auto mb-8" size={40} />
          <h2 className="text-xs uppercase tracking-[0.5em] font-bold text-spa-ink/40 mb-6">Our Commitment to You</h2>
          <p className="text-2xl md:text-3xl font-serif text-spa-ink leading-relaxed italic">
            "At RD Harmony Med Spa, we believe beauty should feel effortless, safe, and authentically yours. Every service we offer is guided by precision, care, and integrity — ensuring results that enhance, not alter."
          </p>
        </div>
      </section>
    </div>
  );
};

export default FreeConsultation;
