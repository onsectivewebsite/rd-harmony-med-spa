import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Clock, Tag, Stethoscope, Droplets, CheckCircle2, ChevronDown, Check, Beaker, Zap, Moon } from 'lucide-react';

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  const { service, displayPrice } = React.useMemo(() => {
    const customAdded = JSON.parse(localStorage.getItem('rd_harmony_custom_added_services') || '[]');
    const combined = [...SERVICES, ...customAdded];
    const foundService = combined.find((s: any) => s.id === id);
    if (!foundService) return { service: null, displayPrice: '' };
    
    const prices = JSON.parse(localStorage.getItem('rd_harmony_service_prices') || '{}');
    return { service: foundService, displayPrice: prices[foundService.id] || foundService.price };
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyCTA(true);
      } else {
        setShowStickyCTA(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle || `${service.name} | RD Harmony Med Spa`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', service.metaDescription || service.description || '');
      }
    }
  }, [service]);

  if (id === 'free-consult') {
    return <Navigate to="/free-consultation" replace />;
  }

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="min-h-screen bg-spa-bg overflow-x-hidden pt-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={service.image || '/images/image_12.jpg'} 
            alt={service.name}
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-spa-ink/60" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 mt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111111]/10 backdrop-blur-md rounded-full text-white/90 text-xs uppercase tracking-widest font-bold mb-6 border border-white/20">
            <Tag size={12} /> {service.category}
          </div>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
            {service.heroTitle || service.name}
          </h1>
          <p className="text-xl text-white/80 font-light mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {service.heroSubtitle || service.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-white/90 bg-[#111111]/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <Clock size={16} className="text-spa-accent" />
              <span className="font-medium tracking-wide">{service.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 bg-[#111111]/5 px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <Tag size={16} className="text-spa-accent" />
              <span className="font-medium tracking-wide text-lg">{displayPrice}</span>
            </div>
          </div>
          
          <Link to="/booking" className="inline-flex items-center gap-2 bg-spa-primary text-white px-10 py-5 rounded-full text-sm uppercase tracking-widest font-bold hover:bg-spa-dark hover:scale-105 transition-all shadow-[0_0_30px_rgba(17,156,71,0.3)]">
            Book Appointment
          </Link>
        </div>
      </section>

      {/* STICKY CTA ON SCROLL */}
      <div className={`fixed top-20 left-0 right-0 z-40 bg-[#111111]/90 backdrop-blur-md border-b border-spa-border shadow-sm transition-transform duration-300 ${showStickyCTA ? 'translate-y-0' : '-translate-y-[200%]'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="hidden md:block">
            <h3 className="font-serif text-lg text-spa-ink font-medium">{service.name}</h3>
            <p className="text-xs text-spa-ink/60 uppercase tracking-widest">{displayPrice} • {service.duration}</p>
          </div>
          <Link to="/booking" className="w-full md:w-auto text-center px-8 py-3 bg-spa-ink text-white rounded-full text-xs uppercase tracking-widest font-bold hover:bg-spa-dark transition-colors">
            Book Now
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* MAIN CONTENT COLUMN */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* 2. OVERVIEW  */}
            <section>
              <h2 className="text-3xl font-serif text-spa-ink mb-6">Treatment Overview</h2>
              <div className="prose prose-lg text-spa-ink/70 leading-relaxed font-light space-y-4">
                <p>{service.longDescription || service.description}</p>
                {service.experience && (
                  <p className="italic border-l-2 border-spa-primary pl-6 py-2 bg-spa-primary/5 rounded-r-xl mt-6">
                    "{service.experience}"
                  </p>
                )}
              </div>
            </section>

            {/* 3. BENEFITS */}
            {service.benefits && service.benefits.length > 0 && (
              <section>
                <div className="bg-[#111111] p-10 rounded-[2rem] border border-spa-border shadow-spa">
                  <h2 className="text-2xl font-serif text-spa-ink mb-8 flex items-center gap-3">
                    <CheckCircle2 className="text-spa-primary" /> Core Benefits
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {service.benefits.map((benefit, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-xl bg-spa-bg/50">
                        <div className="w-6 h-6 rounded-full bg-spa-primary/10 text-spa-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-spa-ink/80 font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 4. HOW IT WORKS (STEP FLOW) */}
            {service.stepFlow && service.stepFlow.length > 0 && (
              <section>
                <h2 className="text-3xl font-serif text-spa-ink mb-10">How It Works</h2>
                <div className="relative">
                  <div className="absolute top-0 bottom-0 left-[23px] w-px bg-spa-primary/20" />
                  <div className="space-y-12">
                    {service.stepFlow.map((step, i) => (
                      <div key={i} className="relative pl-16">
                        <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-[#111111] border-2 border-spa-primary flex items-center justify-center text-spa-primary font-bold font-serif shadow-sm z-10">
                          {i + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-medium text-spa-ink mb-2 pt-2">{step.title}</h4>
                          {step.desc && <p className="text-spa-ink/60 leading-relaxed">{step.desc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* 5. TECHNOLOGY / PRODUCTS */}
            {(service.technology || service.productsUsed) && (
              <div className="bg-spa-ink text-white p-8 rounded-[2rem]">
                <h3 className="text-xl font-serif mb-6 flex items-center gap-3 text-spa-accent">
                  <Beaker size={20} /> Technology & Products
                </h3>
                <div className="space-y-6">
                  {service.technology && (
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">Advanced Tech</span>
                      <p className="font-medium text-lg">{service.technology}</p>
                    </div>
                  )}
                  {service.productsUsed && (
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest text-white/50 mb-1">Premium Products</span>
                      <p className="font-medium text-lg">{service.productsUsed}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. WHO IS IT FOR */}
            {(service.idealFor || service.skinConcern || service.precautions) && (
              <div className="bg-[#111111] p-8 rounded-[2rem] border border-spa-border shadow-spa">
                <h3 className="text-xl font-serif mb-6 flex items-center gap-3 text-spa-ink">
                  <Droplets className="text-spa-primary" size={20} /> Who It's For
                </h3>
                <div className="space-y-6">
                  {(service.skinConcern || service.idealFor) && (
                    <div className="flex flex-wrap gap-2">
                      {[...(service.skinConcern || []), ...(service.idealFor || [])].map((item, i) => (
                        <span key={i} className="px-4 py-2 bg-spa-bg rounded-lg text-sm text-spa-ink/70 border border-spa-border font-medium">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                  {service.precautions && service.precautions.length > 0 && (
                    <div className="pt-4 border-t border-spa-border">
                      <span className="block text-[10px] uppercase tracking-widest text-red-500 mb-3 font-bold">Clinical Precautions</span>
                      <ul className="space-y-2">
                        {service.precautions.map((item, i) => (
                          <li key={i} className="text-xs text-spa-ink/60 flex gap-2">
                            <span className="text-red-400">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. RESULTS & RECOVERY */}
            {(service.results || service.recovery || service.downtime || service.frequency) && (
                <div className="bg-spa-bg p-8 rounded-[2rem] border border-spa-primary/20">
                  <h3 className="text-xl font-serif mb-6 flex items-center gap-3 text-spa-ink">
                    <Zap className="text-spa-primary" size={20} /> Results & Recovery
                  </h3>
                  <ul className="space-y-4">
                    {service.results && (
                      <li className="flex gap-4">
                        <CheckCircle2 size={16} className="text-spa-primary mt-1 shrink-0" />
                        <div>
                          <strong className="block text-sm text-spa-ink">Expected Results</strong>
                          <span className="text-spa-ink/60 text-sm leading-relaxed">{service.results}</span>
                        </div>
                      </li>
                    )}
                    {service.frequency && (
                      <li className="flex gap-4">
                        <Moon size={16} className="text-spa-primary mt-1 shrink-0" />
                        <div>
                          <strong className="block text-sm text-spa-ink">Recommended Frequency</strong>
                          <span className="text-spa-ink/60 text-sm leading-relaxed">{service.frequency}</span>
                        </div>
                      </li>
                    )}
                    {service.recovery && (
                      <li className="flex gap-4">
                        <Clock size={16} className="text-spa-primary mt-1 shrink-0" />
                        <div>
                          <strong className="block text-sm text-spa-ink">Recovery Timeline</strong>
                          <span className="text-spa-ink/60 text-sm leading-relaxed">{service.recovery}</span>
                        </div>
                      </li>
                    )}
                    {service.downtime && (
                      <li className="flex gap-4">
                        <Moon size={16} className="text-spa-primary mt-1 shrink-0" />
                        <div>
                          <strong className="block text-sm text-spa-ink">Downtime</strong>
                          <span className="text-spa-ink/60 text-sm leading-relaxed">{service.downtime}</span>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              )}

          </div>
        </div>
      </div>

      {/* NEW: TESTIMONIALS SECTION */}
      {service.testimonials && service.testimonials.length > 0 && (
        <section className="bg-spa-ink text-white py-24 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-10 w-64 h-64 border border-white rounded-full translate-x-[-50%] translate-y-[-50%]" />
            <div className="absolute bottom-0 right-10 w-96 h-96 border border-white rounded-full translate-x-[50%] translate-y-[50%]" />
          </div>
          <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <span className="text-spa-accent text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">Patient Experience</span>
            <h2 className="text-3xl md:text-5xl font-serif mb-16 italic">What Our Clients Say</h2>
            <div className="space-y-12">
              {service.testimonials.map((t, i) => (
                <div key={i} className="max-w-2xl mx-auto">
                  <p className="text-2xl md:text-3xl font-light leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-spa-accent/30" />
                    <span className="text-spa-accent uppercase tracking-widest text-sm font-bold">{t.author}</span>
                    <div className="h-px w-8 bg-spa-accent/30" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. AFTERCARE */}
      {service.postCare && service.postCare.length > 0 && (
        <section className="bg-[#111111] py-24 border-t border-spa-border">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-spa-primary text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">Post-Treatment</span>
            <h2 className="text-3xl md:text-5xl font-serif text-spa-ink mb-16">Aftercare Instructions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {service.postCare.map((step, i) => (
                <div key={i} className="flex gap-6 p-8 bg-spa-bg rounded-3xl hover:border-spa-primary/20 border border-transparent transition-all group shadow-sm">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-spa-primary/10 text-spa-primary flex items-center justify-center font-bold font-serif group-hover:scale-110 group-hover:bg-spa-primary group-hover:text-white transition-all">
                    {i + 1}
                  </div>
                  <p className="text-spa-ink/70 font-medium leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. FAQ SECTION */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="bg-spa-bg py-24">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-serif text-spa-ink mb-16 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <div key={i} className="bg-[#111111] p-8 rounded-[1.5rem] border border-spa-border shadow-sm">
                  <h4 className="text-xl font-medium text-spa-ink mb-4">{faq.q}</h4>
                  <p className="text-spa-ink/70 leading-relaxed italic">"{faq.a}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. FINAL CTA SECTION */}
      <section className="bg-spa-ink py-32 text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-8">
            {service.id === 'regular-facial' ? 'Reveal Healthier, Glowing Skin Today' : 
             service.id === 'hydrafacial' ? 'Achieve Instant Radiance in Just One Session' :
             service.id === 'oxygeneo-facial' ? 'Experience Deep Skin Rejuvenation Like Never Before' :
             service.id === 'microdermabrasion' ? 'Reveal Smoother, Brighter Skin Today' :
             service.id === 'dermaplanning' ? 'Reveal Silky Smooth, Radiant Skin' :
             service.id === 'chemical-peel' ? 'Reveal Clearer, Brighter Skin Today' :
             service.id === 'threading-eyebrow' ? 'Shape Your Perfect Brows Today' :
             service.id === 'threading-upper-lips' ? 'Smooth Skin in Minutes' :
             service.id === 'threading-forehead' ? 'Achieve a Clean, Refined Look' :
             service.id === 'threading-chin' ? 'Smooth Chin. Clean Finish. Confident You.' :
             service.id === 'threading-cheeks' ? 'Smooth Cheeks. Flawless Skin. Confident Glow.' :
             service.id === 'threading-full-face' ? 'Complete Facial Transformation' :
             service.id === 'waxing-full-arm' ? 'Silky Smooth Arms. Long-Lasting Confidence.' :
             service.id === 'waxing-half-arm' ? 'Targeted Smoothness. Quick & Refined.' :
             service.id === 'waxing-full-leg' ? 'Smooth Legs, Long-Lasting Confidence' :
             service.id === 'waxing-half-leg' ? 'Targeted Smoothness in Half the Time' :
             service.id === 'waxing-underarms' ? 'Smooth, Hair-Free Underarms for Weeks' :
             service.id.startsWith('waxing-brazilian') ? 'Smooth and Confident Brazilian Area' :
             service.id.startsWith('microneedling') ? 'Stimulate Collagen, Renew Your Skin' :
             service.id.startsWith('prp-') ? 'Natural Regeneration Starts Here' :
             'Your Skin Transformation Starts Here'}
          </h2>
          <p className="text-white/60 text-lg mb-12 max-w-xl mx-auto font-light leading-relaxed">
            {service.id === 'regular-facial' ? 'Book your Regular Facial and experience the difference of professional skincare.' : 
             service.id === 'hydrafacial' ? 'Experience the power of Hydrafacial and reveal healthier, glowing skin today.' :
             service.id === 'oxygeneo-facial' ? 'Book your OxyGeneo Facial today and reveal brighter, healthier, and youthful skin.' :
             service.id === 'microdermabrasion' ? 'Book your Microdermabrasion session and experience refined, glowing skin instantly.' :
             service.id === 'dermaplanning' ? 'Book your Dermaplaning session today and experience flawless skin like never before.' :
             service.id === 'chemical-peel' ? 'Transform your skin with a professional Chemical Peel using PCA medical-grade formulations.' :
             service.id === 'threading-eyebrow' ? 'Book your eyebrow threading or waxing appointment now for perfectly shaped brows.' :
             service.id === 'threading-upper-lips' ? 'Book your upper lip appointment today for smooth, hair-free skin.' :
             service.id === 'threading-forehead' ? 'Book your forehead hair removal session now for a refined, polished look.' :
             service.id === 'threading-chin' ? 'Book your chin grooming session today and experience a smooth, clean finish.' :
             service.id === 'threading-cheeks' ? 'Book your cheek hair removal session today for smooth, glowing skin.' :
             service.id === 'threading-full-face' ? 'Book your full face grooming session today for complete facial transformation.' :
             service.id === 'waxing-full-arm' ? 'Book your full arm waxing today for silky smooth skin that lasts for weeks.' :
             service.id === 'waxing-half-arm' ? 'Book your targeted arm waxing session today for quick and refined results.' :
             service.id === 'waxing-full-leg' ? 'Book your professional full leg waxing today for smooth, hair-free legs.' :
             service.id === 'waxing-half-leg' ? 'Book your half leg waxing today for quick and targeted results.' :
             service.id === 'waxing-underarms' ? 'Book your underarm waxing today for smooth, hair-free skin.' :
             service.id.startsWith('waxing-brazilian') ? 'Book your professional Brazilian waxing today for a smooth and confident Brazilian area.' :
             service.id === 'microneedling' ? 'Book your FDA-approved SkinPen microneedling session today.' :
             service.id === 'microneedling-boosters' ? 'Enhance your results with microneedling and specialized bio-boosters.' :
             service.id === 'prp-face' ? 'Rejuvenate your skin naturally with Platelet Rich Plasma therapy.' :
             service.id === 'prp-hair' ? 'Restore your natural hair growth with PRP therapy today.' :
             'Our medical experts are ready to personalize a treatment plan specifically for your unique goals.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="px-12 py-5 bg-spa-primary text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-spa-accent hover:scale-105 transition-all shadow-[0_0_20px_rgba(17,156,71,0.2)]">
              {service.id === 'regular-facial' ? 'Refresh Your Skin' : 
               service.id === 'hydrafacial' ? 'Glow Instantly' :
               service.id === 'oxygeneo-facial' ? 'Glow Beyond the Surface' :
               service.id === 'microdermabrasion' ? 'Polish Your Skin' :
               service.id === 'dermaplanning' ? 'Smooth Your Glow' :
               service.id === 'chemical-peel' ? 'Renew Your Skin' :
               service.id.startsWith('threading-') ? 'Book Grooming' :
               service.id.startsWith('waxing-') ? 'Book Waxing' :
               service.id.startsWith('microneedling') ? 'Begin Rejuvenation' :
               service.id.startsWith('prp-') ? 'Start Regeneration' :
               'Book Now'}
            </Link>
            <Link to="/contact" className="px-12 py-5 border border-white/20 text-white rounded-full text-sm uppercase tracking-widest font-bold hover:bg-[#111111]/10 transition-all text-center">
              Free Consultation
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ServiceDetail;

