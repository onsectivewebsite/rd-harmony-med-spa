import React from 'react';
import { FAQ as FAQType } from '../../types';
import { HelpCircle, ChevronRight } from 'lucide-react';

interface ServiceFAQProps {
  faqs?: FAQType[];
  name: string;
}

const ServiceFAQ = ({ faqs, name }: ServiceFAQProps) => {
  const defaultFaqs = [
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

  const items = faqs || defaultFaqs;

  return (
    <section className="section-padding bg-[#111111] relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-20">
          <HelpCircle className="text-emerald-600 mx-auto mb-6" size={40} />
          <span className="text-emerald-600 text-[10px] uppercase tracking-[0.5em] font-bold block mb-4">Deep Insights</span>
          <h2 className="text-3xl md:text-5xl font-serif text-spa-ink leading-tight">Frequently Asked Questions <br /> about {name}</h2>
        </div>

        <div className="space-y-8">
          {items.map((faq, i) => (
            <div key={i} className="group p-10 bg-[#1A1A1A] border border-spa-border rounded-[2.5rem] hover:bg-[#111111] hover:border-emerald-600/20 hover:shadow-2xl transition-all duration-500">
              <div className="flex gap-6">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                  <ChevronRight size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                </div>
                <div>
                  <h3 className="text-xl font-serif text-spa-ink mb-4">{faq.q}</h3>
                  <p className="text-spa-ink/60 font-light leading-relaxed text-lg">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;
