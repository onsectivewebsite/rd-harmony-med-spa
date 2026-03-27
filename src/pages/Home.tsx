import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, MapPin, Smartphone, CreditCard, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const position = { lat: 43.4418, lng: -79.6644 };
  return (
    <div className="bg-spa-bg text-spa-ink">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 flex items-center overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 w-full h-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8 lg:mt-0"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full text-emerald-700 text-[10px] uppercase tracking-[0.2em] font-bold mb-6 border border-emerald-100 shadow-sm">
                <Sparkles size={12} /> Premium Care
              </div>
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-serif text-spa-ink mb-6 leading-[1.1]">
                Advanced Medical Aesthetics That Deliver <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#119C47] to-[#1FA455]">Real Results</span>
              </h1>
              <p className="text-spa-ink/60 text-lg lg:text-xl font-light leading-relaxed mb-10 max-w-xl">
                Experience clinically proven skincare, injectables, and wellness therapies tailored to your unique beauty goals.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  to="/booking"
                  className="bg-[#119C47] hover:bg-[#2E5B3E] text-white px-8 py-5 rounded-full text-xs uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(17,156,71,0.2)] hover:shadow-[0_0_30px_rgba(17,156,71,0.4)] transition-all transform hover:scale-105 text-center flex items-center justify-center gap-2"
                >
                  Book Appointment <ArrowRight size={16} />
                </Link>
                <Link
                  to="/free-consultation"
                  className="bg-white border text-spa-ink border-spa-border hover:border-[#119C47] px-8 py-5 rounded-full text-xs uppercase tracking-widest font-bold transition-all text-center hover:bg-emerald-50/50"
                >
                  Free Consultation
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-spa-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#119C47] shrink-0">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-bold text-spa-ink/70">FDA Approved<br/>Devices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#119C47] shrink-0">
                    <Star size={18} />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-bold text-spa-ink/70">Health Canada<br/>Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#119C47] shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <span className="text-xs uppercase tracking-wider font-bold text-spa-ink/70">Medical Grade<br/>Products</span>
                </div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-t-[10rem] rounded-b-[2rem] overflow-hidden aspect-[4/5] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[8px] border-white z-10">
                <img 
                  src="/images/image_11.jpg" 
                  alt="Medical Aesthetic Treatment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-64 h-64 bg-[#119C47]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#1FA455]/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-6">
              <div className="w-12 h-12 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-600">
                <Star size={24} />
              </div>
              <h3 className="text-xl font-serif">Expert Care</h3>
              <p className="text-spa-ink/50 text-sm leading-relaxed">
                Our team of certified professionals brings years of experience in medical aesthetics and wellness.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-600">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-serif">Advanced Tech</h3>
              <p className="text-spa-ink/50 text-sm leading-relaxed">
                We use the latest FDA-approved technologies like HydraFacial and Oxygeneo for superior results.
              </p>
            </div>
            <div className="space-y-6">
              <div className="w-12 h-12 bg-emerald-500/5 rounded-2xl flex items-center justify-center text-emerald-600">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-serif">Mobile Concierge</h3>
              <p className="text-spa-ink/50 text-sm leading-relaxed">
                Can't make it to the clinic? We bring our premium injectable and IV treatments directly to your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Our Signature</span>
              <h2 className="text-4xl md:text-6xl font-serif">Curated Treatments</h2>
            </div>
            <Link to="/services" className="text-emerald-600 text-xs uppercase tracking-widest font-bold flex items-center gap-2 group">
              View All Services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Hydrafacial',
                desc: 'The ultimate skin rejuvenation treatment for instant radiance and deep hydration.',
                img: '/images/image_5.jpg'
              },
              {
                title: 'NANO & OMBRE Brows',
                desc: 'Achieve perfectly shaped and defined eyebrows with advanced semi-permanent techniques.',
                img: '/images/image_7.jpg'
              },
              {
                title: 'Botox & Injectables',
                desc: 'Precision treatments including Botox, Xeomin, and Dysport to smooth and rejuvenate.',
                img: '/images/image_2.jpg'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="group relative h-[500px] overflow-hidden rounded-3xl"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <h3 className="text-2xl font-serif mb-3">{item.title}</h3>
                  <p className="text-white/80 text-sm mb-6 font-light">{item.desc}</p>
                  <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-400">
                    Learn More <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Consultation CTA */}
      <section className="py-24 bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 -z-1" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="/images/image_0.jpg" 
                  alt="Clinical Consultation" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-spa-border hidden md:block">
                 <Sparkles className="text-emerald-600 mb-4" size={32} />
                 <div className="text-xs uppercase tracking-[0.2em] font-bold text-spa-ink/40 mb-2">Limited Slots</div>
                 <div className="text-2xl font-serif text-spa-ink text-gradient-gold">Reserve Yours Today</div>
              </div>
            </div>
            
            <div className="space-y-8">
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold block">Exclusive Invitation</span>
              <h2 className="text-4xl md:text-6xl font-serif text-spa-ink leading-tight">
                Begin Your Journey <br /> with <span className="italic text-emerald-600/70">Expert Insight</span>
              </h2>
              <p className="text-spa-ink/60 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                Experience a 15-minute precision-driven consultation. No cost, no obligation — just pure clinical discovery.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/free-consultation"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold shadow-xl shadow-emerald-500/20 transition-all text-center"
                >
                  Learn About Consultation
                </Link>
                <Link 
                  to="/booking"
                  className="border border-spa-border hover:border-emerald-600 px-10 py-5 rounded-full text-xs uppercase tracking-widest font-bold transition-all hover:text-emerald-600 text-center"
                >
                  Book Securely Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-spa-bg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-spa-ink/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">The RD Harmony Difference</span>
            <h2 className="text-4xl md:text-6xl font-serif text-spa-ink">Why Choose Our <br /><span className="italic text-emerald-600">Expert Care</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: <Star className="text-emerald-600" size={24} />, 
                title: 'Certified Expertise', 
                desc: 'Our staff are highly trained and certified medical professionals.' 
              },
              { 
                icon: <ShieldCheck className="text-emerald-600" size={24} />, 
                title: 'FDA Approved', 
                desc: 'We use the latest, safest medical-grade technologies only.' 
              },
              { 
                icon: <CreditCard className="text-emerald-600" size={24} />, 
                title: 'Mobile Concierge', 
                desc: 'Luxury med spa treatments in the comfort of your Oakville home.' 
              },
              { 
                icon: <Sparkles className="text-emerald-600" size={24} />, 
                title: 'Natural Results', 
                desc: 'We prioritize subtle enhancements that look and feel like you.' 
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white border border-spa-border p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all group shadow-sm">
                <div className="mb-6 w-12 h-12 bg-spa-bg rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-spa-ink font-serif text-xl mb-4">{feature.title}</h4>
                <p className="text-spa-ink/40 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Service CTA */}
      <section className="py-32 bg-emerald-500 text-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-serif mb-8">Spa Quality at Your Doorstep</h2>
          <p className="text-black/70 text-lg max-w-2xl mx-auto mb-12">
            We offer mobile services for our premium injectable treatments including Botox, Xeomin, and Dysport. Experience luxury in the comfort of your home.
          </p>
          <Link
            to="/booking"
            className="bg-spa-ink text-white px-12 py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-spa-ink/90 transition-all inline-block"
          >
            Request Mobile Service
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-32 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Our Location</span>
              <h2 className="text-4xl md:text-6xl font-serif mb-8">Visit Us in <br /><span className="italic text-emerald-600">Oakville</span></h2>
              <p className="text-spa-ink/50 text-lg font-light leading-relaxed mb-8">
                Located in the heart of Oakville, our clinic offers a serene environment for your aesthetic journey. 
              </p>
              <div className="space-y-4 mb-12">
                <div className="flex items-center gap-4 text-spa-ink/70">
                  <MapPin size={18} className="text-emerald-600" />
                  <span>78 Jones St, Oakville, ON L6L 6C5</span>
                </div>
                <div className="flex items-center gap-4 text-spa-ink/70">
                  <Smartphone size={18} className="text-emerald-600" />
                  <span>(647) 819-1892</span>
                </div>
              </div>
                <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-emerald-600 hover:gap-4 transition-all"
              >
                Get Directions <ArrowRight size={14} />
              </Link>
            </div>
            <div className="h-[500px] bg-white rounded-[2.5rem] overflow-hidden border border-spa-border relative shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.434440366144!2d-79.6644!3d43.4418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b5cf696fe931b%3A0xc3f58a36d7a467f3!2s78%20Jones%20St%2C%20Oakville%2C%20ON%20L6L%206C5%2C%20Canada!5e0!3m2!1sen!2sus!4v1710892000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80 contrast-125"
                title="Google Maps Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
