import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronDown, Sparkles, ShieldCheck, Clock, MapPin } from 'lucide-react';

const Faq = () => {
  const faqCategories = [
    {
      title: "General Questions",
      questions: [
        {
          q: "Where is RD Harmony located?",
          a: "We are located at 78 Jones St, Oakville, ON L6L 6C5. We also offer mobile services for specific treatments like Botox and IV Therapy."
        },
        {
          q: "What are your opening hours?",
          a: "We are open Monday to Saturday from 10:00 AM to 7:00 PM. Sunday is available by appointment only."
        },
        {
          q: "How do I book an appointment?",
          a: "You can book directly through our website's 'Book Now' button, or call us at (647) 819-1892."
        }
      ]
    },
    {
      title: "Treatments & Safety",
      questions: [
        {
          q: "Is there any downtime for Microneedling?",
          a: "You may experience mild redness for 24-48 hours, similar to a light sunburn. We recommend avoiding heavy exercise and makeup for the first 24 hours."
        },
        {
          q: "How long do Botox results last?",
          a: "Botox results typically last between 3 to 4 months. Factors like metabolism and activity level can influence longevity."
        },
        {
          q: "Are the IV therapies safe?",
          a: "Yes, all our IV treatments are administered by certified medical professionals using medical-grade supplies. A doctor's fee ($45) covers your medical clearance for one full year."
        }
      ]
    },
    {
      title: "Pricing & Packages",
      questions: [
        {
          q: "Do you offer package discounts?",
          a: "Yes! Most of our clinical treatments like Microneedling, PRP, and IV Therapy have significantly discounted 'Package of 3' options."
        },
        {
          q: "What is the 'Doctor's Fee'?",
          a: "For medical-grade injections and IVs, a small administrative fee ($20-$45) is required for medical oversight. This fee is valid for one entire year at our clinic."
        }
      ]
    }
  ];

  return (
    <div className="bg-spa-bg min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold mb-4 block">Information Center</span>
          <h1 className="text-4xl md:text-6xl font-serif text-spa-ink">Frequently Asked <br /><span className="italic text-emerald-600">Questions</span></h1>
          <p className="text-spa-ink/50 mt-6 max-w-xl mx-auto leading-relaxed">Everything you need to know about our premium med-spa services, safety protocols, and booking policies.</p>
        </motion.div>

        <div className="space-y-16">
          {faqCategories.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <h2 className="text-emerald-600 text-xs uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-4">
                {cat.title}
                <div className="h-px bg-emerald-600/10 flex-1" />
              </h2>
              <div className="space-y-4">
                {cat.questions.map((faq, i) => (
                  <details key={i} className="group bg-white border border-spa-border rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all shadow-sm">
                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                      <h3 className="text-spa-ink font-medium text-lg pr-8">{faq.q}</h3>
                      <div className="w-8 h-8 rounded-full border border-spa-border flex items-center justify-center text-spa-ink/40 group-open:rotate-180 transition-transform bg-spa-bg/50">
                        <ChevronDown size={14} />
                      </div>
                    </summary>
                    <div className="px-6 pb-6 text-spa-ink/60 leading-relaxed text-sm">
                      <div className="h-px bg-spa-border mb-6" />
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-12 bg-emerald-500 rounded-[2.5rem] text-black text-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
            <HelpCircle size={120} />
          </div>
          <h2 className="text-3xl font-serif mb-4">Still have questions?</h2>
          <p className="text-black/70 mb-8 max-w-md mx-auto">Our team is happy to assist you with any specific medical or beauty enquiries you may have.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+16478191892" className="px-8 py-4 bg-spa-ink text-white rounded-xl text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:scale-105 transition-all">
               Call Us Directly
            </a>
            <button className="px-8 py-4 border border-black/20 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-black/5 transition-all">
               Book Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Faq;
