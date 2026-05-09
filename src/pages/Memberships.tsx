import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, Star, Crown, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Memberships = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const packages = [
    {
      title: "VIP Membership",
      price: "$2,400",
      period: "12 months",
      icon: <Star className="w-8 h-8 text-emerald-500" />,
      features: [
        "Free Skincare product: 1 set",
        "15% OFF retail skincare for 12 months"
      ],
      treatmentsDesc: "Enjoy flexible access to advanced skin treatments using your membership credits, including:",
      treatments: [
        { name: "Brightening Facial including Ultrasound + LED Light Therapy ($199)", desc: "Targets dullness and uneven skin tone, helping to enhance glow, reduce pigmentation, and support overall skin clarity." },
        { name: "HydraFacial including Ultrasound + LED Light Therapy ($249)", desc: "Deeply cleanses, exfoliates, and hydrates the skin while reducing congestion and leaving a smoother, plumper, more refreshed complexion." },
        { name: "Anti-Aging Facial including ultrasound+ LED Light Therapy ($199)", desc: "Helps soften fine lines and wrinkles by stimulating collagen, improving elasticity, and restoring a more youthful appearance." },
        { name: "Tripollar Radiofrequency (RF) Skin Tightening ($299)", desc: "Non-invasive treatment that stimulates collagen and elastin production to improve skin firmness, contour, and reduce the appearance of fine lines." },
        { name: "Lifting Stone Facial ($249)", desc: "Enhances circulation and lymphatic drainage to reduce puffiness, sculpt facial contours, and promote a naturally lifted, toned look." },
        { name: "Microdermabrasion ($199)", desc: "(6 treatments per 12 months). Gently exfoliates dead skin cells to smooth texture, brighten dull skin, and improve absorption of skincare products." },
        { name: "Microneedling ($299)", desc: "(4 treatments per year). Boosts collagen production to improve acne scars, fine lines, and skin texture for a smoother, more even complexion." },
        { name: "Chemical Peels ($249)", desc: "Resurfaces the skin by removing damaged outer layers, reduce pigmentation, unclog pores, and reveal a brighter, more even complexion." }
      ]
    },
    {
      title: "Prestige Membership",
      price: "$3,200",
      period: "12 months",
      icon: <Crown className="w-8 h-8 text-emerald-500" />,
      features: [
        "Free Skin care product: 1 set",
        "15% OFF retail skincare for 12 months"
      ],
      treatmentsDesc: "Enjoy flexible access to advanced skin treatments using your membership credits, including:",
      treatments: [
        { name: "Microneedling with Exosomes / Salmon DNA / NAD Serum ($599)", desc: "(1 treatment per 12 months). Helps stimulate collagen production, improve skin texture, reduce fine lines, and enhance overall skin regeneration for a smoother, more youthful complexion." },
        { name: "Platelet-Rich Plasma (PRP) Therapy ($499 + $45 doctor fees)", desc: "(3 treatments per 12 months). Uses your body’s natural growth factors to boost collagen, improve skin firmness, and support long-term skin rejuvenation and healing." },
        { name: "Chemical Peels ($249)", desc: "Resurfaces the skin by removing damaged outer layers, reduce pigmentation, unclog pores, and reveal a brighter, more even complexion." },
        { name: "OxyGeneo Facial + LED Light Therapy ($299)", desc: "(2 treatments per 12 months). Deeply exfoliates, oxygenates, and nourishes the skin while LED therapy helps calm inflammation and promote skin repair and radiance." },
        { name: "Tripollar Radiofrequency (RF) Skin Tightening ($299)", desc: "Non-invasive treatment that stimulates collagen and elastin production to improve skin firmness, contour, and reduce the appearance of fine lines." },
        { name: "Brightening Facials + LED Light Therapy ($199)", desc: "Targets dullness and uneven skin tone, helping to enhance glow, reduce pigmentation, and support overall skin clarity." },
        { name: "HydraFacial + LED Light Therapy ($249)", desc: "Deeply cleanses, exfoliates, and hydrates the skin while reducing congestion and leaving a smoother, plumper, more refreshed complexion." }
      ]
    },
    {
      title: "Inside-Out Glow Package",
      price: "$2,300",
      period: "6 months",
      icon: <Sparkles className="w-8 h-8 text-emerald-500" />,
      features: [
        "Free Skincare product: cleanser and serum according to skin type",
        "15% OFF retail skincare for 6 months"
      ],
      treatmentsDesc: "Enjoy flexible access to advanced skin treatments using your membership credits, including:",
      treatments: [
        { name: "Platelet-Rich Plasma (PRP) Therapy ($499 + $45 doctor fees)", desc: "(3 treatments per 6 months). Uses your body’s natural growth factors to boost collagen, improve skin firmness, and support long-term skin rejuvenation and healing." },
        { name: "Brightening Facial including ultrasound + LED Light Therapy ($199)", desc: "(2 treatments per 6 months). Targets dullness and uneven skin tone, helping to enhance glow, reduce pigmentation, and support overall skin clarity." },
        { name: "Microdermabrasion ($199)", desc: "(1 treatment per 6 months). Gently exfoliates dead skin cells to smooth texture, brighten dull skin, and improve absorption of skincare products." },
        { name: "Intravenous (IV) Glutathione + Vitamin C ($289 + $45 doctor fees valid for one year)", desc: "(3 treatments per 6 months). A powerful antioxidant blend that helps protect cells from oxidative stress, supports liver detoxification, strengthens immune function, boosts collagen production, and promotes skin brightening, resulting in a more even tone, healthier skin, and a naturally radiant, refreshed, and youthful appearance from within." }
      ]
    },
    {
      title: "Glow Beyond Package",
      price: "$4,500",
      period: "12 months",
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      features: [
        "Free Skincare product-1 set: cleanser and serum according to skin type",
        "20% OFF retail skincare for 12 months"
      ],
      treatmentsDesc: "Enjoy flexible access to advanced skin treatments using your membership credits, including:",
      treatments: [
        { name: "Platelet-Rich Plasma (PRP) Therapy ($499 + $45 doctor fees)", desc: "(4 treatments per 12 months). Uses your body’s natural growth factors to boost collagen, improve skin firmness, and support long-term skin rejuvenation and healing." },
        { name: "Glutathione + Vitamin C ($289 + $45 doctor fees valid for one year)", desc: "(3 treatments per 6 months). A powerful antioxidant blend that helps protect cells from oxidative stress, supports liver detoxification, strengthens immune function, boosts collagen production, and promotes skin brightening, resulting in a more even tone, healthier skin, and a naturally radiant, refreshed, and youthful appearance from within." },
        { name: "Microneedling with Exosomes / Salmon DNA / NAD Serum ($599)", desc: "(2 treatments per 12 months). Helps stimulate collagen production, improve skin texture, reduce fine lines, and enhance overall skin regeneration for a smoother, more youthful complexion." },
        { name: "HydraFacial including ultrasound + LED Light Therapy ($249)", desc: "(2 treatments per 12 months). Deeply cleanses, exfoliates, and hydrates the skin while reducing congestion and leaving a smoother, plumper, more refreshed complexion." },
        { name: "OxyGeneo Facial + LED Light Therapy ($299)", desc: "(2 treatments per 12 months). Deeply exfoliates, oxygenates, and nourishes the skin while LED therapy helps calm inflammation and promote skin repair and radiance." }
      ]
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-spa-bg min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Exclusive <span className="font-serif italic text-emerald-600">Memberships</span> & Packages
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-spa-ink/60 max-w-2xl mx-auto text-lg"
          >
            Invest in your skin’s health and beauty with our flexible, premium membership plans. 
            Unlock a year of advanced skin treatments and medical-grade skincare.
          </motion.p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {packages.map((pkg, idx) => (
            <motion.div
              key={pkg.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col h-full relative"
            >
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  {pkg.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-spa-ink">{pkg.title}</h3>
                  <div className="text-emerald-600 font-medium text-sm mt-1">{pkg.period} Membership</div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-spa-border">
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-light tracking-tight">{pkg.price}</span>
                  <span className="text-spa-ink/60 text-xs sm:text-sm mb-2 uppercase tracking-widest font-medium">upfront</span>
                </div>
              </div>

              {/* Core Features */}
              <div className="space-y-4 mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-spa-ink/40">Exclusive Perks</p>
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-spa-ink/80 text-sm leading-relaxed">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Treatments */}
              <div className="space-y-4 flex-grow">
                <p className="text-xs font-bold uppercase tracking-widest text-spa-ink/40">Included Treatments</p>
                <p className="text-sm text-spa-ink/60 mb-4">{pkg.treatmentsDesc}</p>
                
                <div className="space-y-6">
                  {pkg.treatments.map((t, i) => (
                    <div key={i} className="bg-black/40 rounded-xl p-4 border border-spa-border/30">
                      <h4 className="font-semibold text-spa-ink text-sm mb-2 leading-tight">{t.name}</h4>
                      <p className="text-xs text-spa-ink/60 leading-relaxed">{t.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 pt-8 border-t border-spa-border">
                <Link
                  to="/booking"
                  className="group flex items-center justify-center gap-2 w-full bg-emerald-600 text-white py-4 rounded-xl font-medium uppercase tracking-widest text-xs hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  Join Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Memberships;
