import { Service } from './types';

export const SERVICES: Service[] = [
  {
    id: 'free-consult',
    name: 'Free Consultation',
    duration: '15 mins',
    price: 'Free',
    category: 'Consultation',
    isMobileAvailable: false,
    description: 'Start your journey with a personalized consultation. We will discuss your skin goals and create a custom treatment plan.',
    image: '/images/spa_interior.jpg',
    benefits: [
      'Personalized skin analysis',
      'Expert recommendations',
      'Custom treatment roadmap'
    ],
    experience: 'Your journey starts with a deep dive into your skin concerns. We analyze texture, tone, and moisture levels to build a perfect treatment roadmap.',
    postCare: ['Review your recommended plan', 'Prepare for your first session', 'Ask any follow-up questions'],
    longDescription: 'Our Free Consultation is the clinical bedrock of your journey. We listen to your goals and use expert analysis to design a bespoke aesthetic program that respects your natural features and budget.'
  },
  {
    id: 'regular-facial',
    name: 'Regular Facial',
    heroTitle: 'Deep Cleansing. Nourishment. Radiance — Tailored to Your Skin.',
    heroSubtitle: 'Deep Cleansing. Nourishment. Radiance — Tailored to Your Skin.',
    duration: '60 Minutes',
    price: '$90',
    category: 'Skincare',
    isMobileAvailable: false,
    description: 'Our Regular Facial is a foundational skincare treatment designed to deeply cleanse, exfoliate, and restore balance to your skin.',
    longDescription: 'Our Regular Facial is a foundational skincare treatment designed to deeply cleanse, exfoliate, and restore balance to your skin. Unlike basic facials, this treatment is fully customized based on your skin type and concerns, ensuring optimal results for every individual.\n\nUsing Bioline professional facial products, a premium Italian skincare line known for its botanical formulations and advanced dermatological research, this treatment works at both the surface and deeper levels of the skin.\n\nThe facial incorporates medical-grade steam, gentle exfoliation, targeted extraction (if required), and intensive hydration to leave your skin feeling refreshed, purified, and visibly glowing.\n\nWhether you are maintaining healthy skin or beginning your skincare journey, this facial serves as the perfect starting point for long-term skin health.',
    image: '/images/facial_regular.jpg',
    benefits: [
      'Deeply cleanses pores and removes impurities',
      'Eliminates dead skin cells for smoother texture',
      'Restores hydration and natural skin balance',
      'Improves blood circulation and oxygenation',
      'Helps reduce breakouts and congestion',
      'Enhances skin radiance and glow',
      'Prepares skin for advanced treatments'
    ],
    stepFlow: [
      { title: 'Step 1: Skin Analysis', desc: 'A detailed consultation is performed to assess your skin type, sensitivity level, and specific concerns such as acne, dryness, or pigmentation.' },
      { title: 'Step 2: Deep Cleansing', desc: 'A gentle cleanser is used to remove dirt, oil, and makeup buildup from the skin surface.' },
      { title: 'Step 3: Exfoliation', desc: 'Dead skin cells are removed using enzyme-based exfoliants from Bioline, revealing fresher and brighter skin underneath.' },
      { title: 'Step 4: Steam Therapy', desc: 'Medical-grade steam is applied to open up pores, soften debris, and prepare the skin for extraction.' },
      { title: 'Step 5: Extraction (If Required)', desc: 'Blackheads and whiteheads are carefully removed to unclog pores and prevent acne formation.' },
      { title: 'Step 6: Mask Application', desc: 'A customized mask is applied based on your skin condition: Hydrating mask for dry skin, Purifying mask for acne-prone skin, or Brightening mask for dull skin.' },
      { title: 'Step 7: Hydration & Protection', desc: 'Serums, moisturizers, and SPF are applied to lock in hydration and protect the skin barrier.' }
    ],
    technology: 'Bioline Professional Skincare Products, Medical-grade facial steam equipment, Professional extraction tools (sterilized and hygienic)',
    idealFor: [
      'All skin types (normal, oily, dry, combination, sensitive)',
      'Individuals with dull or tired-looking skin',
      'Clients experiencing mild acne or congestion',
      'First-time facial clients',
      'Anyone looking for regular skin maintenance'
    ],
    results: 'Immediate: Cleaner, brighter, and more refreshed skin. Improved hydration levels. Smoother skin texture. Long-term: Reduced breakouts, even skin tone, healthier skin barrier.',
    downtime: 'No downtime. You can return to daily activities immediately.',
    postCare: [
      'Avoid makeup for at least 6–8 hours',
      'Use a gentle cleanser and moisturizer',
      'Apply sunscreen daily (SPF 30+)',
      'Avoid harsh exfoliants for 48 hours',
      'Stay hydrated'
    ],
    frequency: 'Every 4–6 weeks',
    faqs: [
      { q: 'Is the Regular Facial painful?', a: 'No, the treatment is gentle and relaxing. Mild discomfort may occur during extraction if needed.' },
      { q: 'Can I get this facial if I have acne?', a: 'Yes, this facial helps in reducing mild acne and preventing future breakouts.' },
      { q: 'How soon will I see results?', a: 'Results are visible immediately after the treatment, with improved glow and texture.' },
      { q: 'Is it safe for sensitive skin?', a: 'Yes, products and techniques are customized specifically for sensitive skin types.' }
    ],
    metaTitle: 'Regular Facial Treatment | Deep Cleansing Facial | RD Harmony Med Spa',
    metaDescription: 'Experience a professional Regular Facial using Bioline skincare. Deep cleansing, hydration, and glowing skin in just one session. Book today.'
  },
  {
    id: 'hydrafacial',
    name: 'Hydrafacial',
    heroTitle: 'Instant Glow. Deep Hydration. Advanced Skin Rejuvenation.',
    heroSubtitle: 'Instant Glow. Deep Hydration. Advanced Skin Rejuvenation.',
    duration: '60 Minutes',
    price: '$150',
    category: 'Skincare',
    isMobileAvailable: false,
    description: 'Hydrafacial is an advanced, non-invasive medical-grade facial treatment designed to deeply cleanse, exfoliate, extract impurities, and infuse the skin with intensive hydration.',
    longDescription: 'Hydrafacial is an advanced, non-invasive medical-grade facial treatment designed to deeply cleanse, exfoliate, extract impurities, and infuse the skin with intensive hydration — all in one session. Unlike traditional facials, Hydrafacial uses patented vortex technology that works like a vacuum to gently remove debris from pores while simultaneously delivering nourishing serums deep into the skin. At RD Harmony Med Spa, we enhance your Hydrafacial experience using Bioline professional skincare boosters, ensuring superior hydration, repair, and long-lasting glow. This treatment is suitable for all skin types and delivers immediate, visible results with no downtime, making it one of the most popular and effective facial treatments available today.',
    image: '/images/facial_hydrafacial.jpg',
    technology: 'Advanced Hydrafacial vortex technology system, Bioline Professional Skincare Products (Premium Italian Brand), Medical-grade serums and antioxidants, Sterile and hygienic tools.',
    benefits: [
      'Deeply cleanses and detoxifies pores',
      'Instantly hydrates and plumps the skin',
      'Improves skin tone and texture',
      'Reduces fine lines and wrinkles',
      'Minimizes enlarged pores',
      'Brightens dull and uneven skin',
      'Helps control acne and congestion',
      'Provides immediate glow with zero downtime'
    ],
    idealFor: [
      'All skin types (including sensitive skin)',
      'Acne-prone and congested skin',
      'Dry or dehydrated skin',
      'Aging skin with fine lines',
      'Uneven skin tone or pigmentation',
      'Enlarged pores',
      'Dull or tired-looking skin'
    ],
    results: 'Immediate: Instantly glowing and hydrated skin, smoother texture, cleaner and refined pores. Long-term: Improved skin elasticity, reduced fine lines, balanced oil production, healthier, more radiant complexion.',
    downtime: 'No downtime. No redness (mild pinkness may occur for 1–2 hours). Resume normal activities immediately.',
    stepFlow: [
      { title: 'Step 1: Cleansing & Exfoliation', desc: 'Dead skin cells and surface impurities are gently removed to reveal fresh skin underneath.' },
      { title: 'Step 2: Acid Peel (Gentle)', desc: 'A mild, non-irritating peel is applied to loosen dirt and debris from pores without causing discomfort or downtime.' },
      { title: 'Step 3: Extraction (Vortex Suction)', desc: 'Using advanced vortex suction technology, blackheads, oil, and impurities are painlessly extracted from the skin.' },
      { title: 'Step 4: Hydration Infusion', desc: 'The skin is infused with powerful hydrating and antioxidant-rich serums, including customized Bioline boosters.' },
      { title: 'Step 5: Protection & Glow Finish', desc: 'Moisturizer and SPF are applied to protect and seal in hydration, leaving your skin radiant and refreshed.' }
    ],
    postCare: [
      'Avoid makeup for 6–8 hours',
      'Apply sunscreen (SPF 30+) daily',
      'Stay hydrated',
      'Avoid harsh exfoliants for 48 hours',
      'Use gentle skincare products'
    ],
    frequency: 'Once every 4 weeks. For acne or pigmentation: Every 2–3 weeks initially.',
    faqs: [
      { q: 'Is Hydrafacial painful?', a: 'No, it is a comfortable and relaxing treatment with a cooling sensation.' },
      { q: 'Can I do Hydrafacial before an event?', a: 'Yes, it is perfect before events as it gives instant glow with no downtime.' },
      { q: 'How long do results last?', a: 'Results typically last 4–6 weeks depending on your skincare routine.' },
      { q: 'Is it safe for sensitive skin?', a: 'Yes, the treatment is gentle and customizable for sensitive skin.' }
    ],
    metaTitle: 'Hydrafacial Treatment | Deep Cleansing & Hydration Facial | RD Harmony Med Spa',
    metaDescription: 'Get instant glowing skin with Hydrafacial using advanced vortex technology and Bioline boosters. No downtime. Book your session today.'
  },
  {
    id: 'oxygeneo-facial',
    name: 'OxyGeneo Facial',
    heroTitle: 'Oxygenate. Revitalize. Transform Your Skin From Within.',
    heroSubtitle: 'Oxygenate. Revitalize. Transform Your Skin From Within.',
    duration: '60 Minutes',
    price: '$225',
    category: 'Skincare',
    isMobileAvailable: false,
    description: 'An advanced, clinically proven 3-in-1 skin rejuvenation treatment that goes beyond traditional facials by working both on the surface and deep within the skin.',
    longDescription: 'OxyGeneo Facial is an advanced, clinically proven 3-in-1 skin rejuvenation treatment that goes beyond traditional facials by working both on the surface and deep within the skin. This innovative treatment combines exfoliation, natural oxygenation, and infusion of active nutrients to significantly improve skin health, texture, and radiance. Unlike standard oxygen facials that push oxygen onto the skin, OxyGeneo stimulates the body’s natural oxygenation process from within, resulting in superior absorption of active ingredients and longer-lasting results. At RD Harmony Med Spa, the treatment utilizes OxyGeneo\'s proprietary products, ensuring maximum hydration, repair, and visible skin transformation. This facial is ideal for clients looking for immediate glow, deep nourishment, and long-term skin improvement without any downtime.',
    image: '/images/facial_oxygeneo.jpg',
    technology: 'OxyGeneo advanced facial system, Capsugen exfoliation technology, OxyGeneo specialized products, Medical-grade serums and active ingredients.',
    benefits: [
      'Boosts natural oxygen levels in the skin',
      'Deep exfoliation for smoother texture',
      'Enhances absorption of active nutrients',
      'Improves skin tone and brightness',
      'Reduces fine lines and early signs of aging',
      'Helps treat pigmentation and uneven skin tone',
      'Stimulates collagen production',
      'Provides instant glow with long-lasting hydration'
    ],
    idealFor: [
      'Dull, tired-looking skin',
      'Uneven skin tone and pigmentation',
      'Aging skin with fine lines',
      'Dehydrated skin',
      'Sensitive skin (gentle and non-invasive)',
      'Clients seeking instant glow before events',
      'Individuals looking for anti-aging and skin revitalization'
    ],
    results: 'Immediate: Brighter, glowing skin, Improved hydration, Smoother texture. Long-term: Enhanced collagen production, Even skin tone, Reduced pigmentation, Healthier and stronger skin barrier.',
    downtime: 'No downtime. Mild redness may occur (subsides within a few hours). Resume normal activities immediately.',
    stepFlow: [
      { title: 'Step 1: Exfoliation (Capsugen Technology)', desc: 'A specialized capsule gently exfoliates the outer layer of the skin, removing dead cells and preparing it for treatment.' },
      { title: 'Step 2: Natural Oxygenation', desc: 'The interaction between the capsule and skin creates a CO₂-rich environment, triggering the body to send oxygen to the treated area. This improves blood circulation and cellular activity.' },
      { title: 'Step 3: Nutrient Infusion', desc: 'Active ingredients, vitamins, and specialized OxyGeneo serums are infused deep into the skin, where they are absorbed more effectively due to increased oxygenation.' },
      { title: 'Step 4: Massage & Hydration', desc: 'A relaxing facial massage enhances circulation and lymphatic drainage, followed by hydration and protective skincare application.' }
    ],
    postCare: [
      'Avoid makeup for 6–8 hours',
      'Apply SPF 30+ daily',
      'Stay hydrated',
      'Avoid harsh exfoliation for 48 hours',
      'Use gentle skincare products'
    ],
    frequency: 'Every 3–4 weeks for best results. Can be done before special occasions for instant glow.',
    faqs: [
      { q: 'How is OxyGeneo different from Hydrafacial?', a: 'OxyGeneo works by boosting natural oxygen levels from within, while Hydrafacial focuses more on extraction and hydration.' },
      { q: 'Is the treatment painful?', a: 'No, it is completely comfortable and relaxing.' },
      { q: 'Is it safe for sensitive skin?', a: 'Yes, the treatment is gentle and suitable for sensitive skin types.' },
      { q: 'When will I see results?', a: 'Results are visible immediately after the session.' }
    ],
    metaTitle: 'OxyGeneo Facial Treatment | Advanced Oxygen Skin Therapy | RD Harmony Med Spa',
    metaDescription: 'Revitalize your skin with OxyGeneo Facial. Advanced exfoliation, oxygenation, and hydration using specified OxyGeneo products. Book your session today.'
  },
  {
    id: 'microdermabrasion',
    name: 'Microdermabrasion',
    heroTitle: 'Refine. Renew. Reveal Smoother, Brighter Skin.',
    heroSubtitle: 'Refine. Renew. Reveal Smoother, Brighter Skin.',
    duration: '45 Minutes',
    price: '$120',
    category: 'Skincare',
    isMobileAvailable: false,
    description: 'A non-invasive, advanced exfoliation treatment designed to gently remove the outermost layer of dead skin cells, revealing a smoother, brighter, and more even complexion.',
    longDescription: 'Microdermabrasion is a non-invasive, advanced exfoliation treatment designed to gently remove the outermost layer of dead skin cells, revealing a smoother, brighter, and more even complexion. This treatment uses a diamond-tip microdermabrasion device, which precisely exfoliates the skin while simultaneously vacuuming away impurities and debris. Unlike harsh scrubs or chemical treatments, microdermabrasion offers controlled exfoliation that improves skin texture without irritation or downtime. At RD Harmony Med Spa, this treatment is enhanced with Bioline professional skincare products, ensuring your skin is not only exfoliated but also deeply nourished and hydrated after the procedure. Microdermabrasion is ideal for clients seeking immediate skin refreshment, improved texture, and a natural glow.',
    image: '/images/facial_microdermabrasion.jpg',
    technology: 'Diamond-tip microdermabrasion device, Vacuum suction technology, Bioline Professional Skincare Products (Premium Italian Brand), Medical-grade serums and moisturizers, Sterilized, hygienic equipment.',
    benefits: [
      'Removes dead skin cells effectively',
      'Improves skin texture and smoothness',
      'Reduces appearance of fine lines',
      'Minimizes mild acne scars and pigmentation',
      'Enhances skin brightness and glow',
      'Stimulates blood circulation',
      'Promotes natural collagen production',
      'Improves absorption of skincare products'
    ],
    idealFor: [
      'Dull and uneven skin tone',
      'Rough or textured skin',
      'Mild acne scars',
      'Fine lines and early signs of aging',
      'Clogged pores and blackheads',
      'Individuals seeking non-invasive skin rejuvenation'
    ],
    results: 'Immediate: Softer, smoother skin, brighter complexion, refined pores. Long-term: Improved skin texture, reduced pigmentation, healthier skin renewal cycle.',
    downtime: 'No downtime. Mild redness may occur for a few hours. Resume daily activities immediately.',
    stepFlow: [
      { title: 'Step 1: Skin Analysis', desc: 'A professional assessment is performed to understand your skin type and concerns.' },
      { title: 'Step 2: Cleansing', desc: 'The skin is thoroughly cleansed to remove surface dirt, oil, and makeup.' },
      { title: 'Step 3: Diamond-Tip Exfoliation', desc: 'A specialized diamond-tip device is used to gently exfoliate the outer layer of the skin while vacuum suction removes dead cells and debris.' },
      { title: 'Step 4: Targeted Treatment', desc: 'Additional focus is given to problem areas such as pigmentation, rough texture, or acne scars.' },
      { title: 'Step 5: Hydration & Nourishment', desc: 'Skin is treated with Bioline serums and moisturizers to restore hydration and calm the skin.' },
      { title: 'Step 6: Protection', desc: 'Sunscreen is applied to protect the newly exfoliated skin from UV damage.' }
    ],
    postCare: [
      'Avoid direct sun exposure for 24–48 hours',
      'Apply sunscreen (SPF 30+) daily',
      'Avoid exfoliating products for 2–3 days',
      'Keep skin hydrated with gentle moisturizers',
      'Avoid hot showers or steam for 24 hours'
    ],
    frequency: 'Every 3–4 weeks for optimal results.',
    faqs: [
      { q: 'Is microdermabrasion painful?', a: 'No, it is a comfortable treatment with a mild scratching sensation.' },
      { q: 'How many sessions do I need?', a: 'Visible results appear after one session, but multiple sessions improve long-term results.' },
      { q: 'Can it help with acne scars?', a: 'Yes, it helps improve mild acne scars and skin texture over time.' },
      { q: 'Is it safe for sensitive skin?', a: 'Yes, but the intensity is adjusted based on your skin type.' }
    ],
    metaTitle: 'Microdermabrasion Treatment | Skin Exfoliation & Brightening | RD Harmony Med Spa',
    metaDescription: 'Get smoother, brighter skin with Microdermabrasion using advanced diamond-tip technology and Bioline skincare. Book your session today.'
  },
  {
    id: 'dermaplanning',
    name: 'Dermaplaning',
    heroTitle: 'Silky Smooth Skin. Instant Glow. Flawless Finish.',
    heroSubtitle: 'Silky Smooth Skin. Instant Glow. Flawless Finish.',
    duration: '45 Minutes',
    price: '$100',
    category: 'Skincare',
    isMobileAvailable: false,
    description: 'A highly effective, non-invasive exfoliation treatment that removes dead skin cells and fine vellus hair (commonly known as peach fuzz) from the surface of the skin.',
    longDescription: 'Dermaplaning is a highly effective, non-invasive exfoliation treatment that removes dead skin cells and fine vellus hair (commonly known as peach fuzz) from the surface of the skin. Using a sterile, medical-grade blade, this precision technique gently scrapes away dull, damaged skin, revealing a smoother, brighter, and more refined complexion underneath. Unlike harsh exfoliating treatments, dermaplaning is gentle, controlled, and safe when performed by trained professionals. At RD Harmony Med Spa, dermaplaning is paired with Bioline professional skincare products to deeply nourish and hydrate the freshly exfoliated skin, maximizing results and enhancing post-treatment glow. This treatment is ideal for clients seeking instantly smoother skin, improved product absorption, and a flawless base for makeup application.',
    image: '/images/facial_dermaplaning.jpg',
    technology: 'Medical-grade sterile dermaplaning blade, Professional technique for safe exfoliation, Bioline Professional Skincare Products (Premium Italian Brand), Hydrating serums and soothing agents, Strict hygiene and sterilization protocols.',
    benefits: [
      'Instantly smooths and softens skin',
      'Removes dead skin cells and peach fuzz',
      'Enhances skin brightness and glow',
      'Improves makeup application (flawless finish)',
      'Increases absorption of skincare products',
      'Reduces appearance of fine lines',
      'Helps improve mild acne scarring',
      'Non-invasive with no downtime'
    ],
    idealFor: [
      'Dull and dry skin',
      'Rough or uneven texture',
      'Clients with peach fuzz',
      'Individuals wanting smoother makeup application',
      'Mild acne scarring',
      'Clients looking for instant glow without downtime'
    ],
    results: 'Immediate: Ultra-smooth skin, Brighter and more radiant complexion, Flawless makeup finish. Long-term: Improved skin texture, enhanced product effectiveness, healthier skin renewal cycle.',
    downtime: 'No downtime. Slight sensitivity may occur for a few hours. Resume normal activities immediately.',
    stepFlow: [
      { title: 'Step 1: Skin Consultation', desc: 'Your skin is analyzed to determine suitability and ensure optimal results.' },
      { title: 'Step 2: Deep Cleansing', desc: 'The skin is gently cleansed to remove makeup, oil, and impurities.' },
      { title: 'Step 3: Precision Dermaplaning', desc: 'A sterile surgical blade is used at a specific angle to carefully exfoliate the skin and remove fine hair, revealing a fresh layer of skin.' },
      { title: 'Step 4: Soothing & Hydration', desc: 'Post-exfoliation, calming serums and Bioline moisturizers are applied to restore hydration and balance.' },
      { title: 'Step 5: Protection', desc: 'Sunscreen is applied to protect the newly exposed skin from UV damage.' }
    ],
    postCare: [
      'Avoid direct sun exposure for 24–48 hours',
      'Apply SPF 30+ daily',
      'Avoid exfoliating products for 3 days',
      'Keep skin hydrated with gentle skincare',
      'Avoid heat treatments (sauna/steam) for 24 hours'
    ],
    frequency: 'Every 3–4 weeks for best results.',
    faqs: [
      { q: 'Will hair grow back thicker after dermaplaning?', a: 'No, hair will grow back at the same texture and rate as before.' },
      { q: 'Is dermaplaning painful?', a: 'No, it is a painless and relaxing procedure.' },
      { q: 'Can I wear makeup after treatment?', a: 'It is recommended to wait at least 6–8 hours.' },
      { q: 'Is it safe for sensitive skin?', a: 'Yes, when performed professionally, it is safe and gentle.' }
    ],
    metaTitle: 'Dermaplaning Facial | Smooth Skin & Peach Fuzz Removal | RD Harmony Med Spa',
    metaDescription: 'Achieve smooth, glowing skin with Dermaplaning. Remove dead skin and peach fuzz for a flawless finish. Book your session today.'
  },
  {
    id: 'chemical-peel',
    name: 'Chemical Peel',
    heroTitle: 'Resurface. Renew. Reveal Clearer, Brighter Skin.',
    heroSubtitle: 'Resurface. Renew. Reveal Clearer, Brighter Skin.',
    duration: '30 Minutes',
    price: '$130',
    category: 'Skincare',
    isMobileAvailable: false,
    description: 'A medical-grade skin resurfacing treatment designed to improve skin tone, texture, and overall clarity by removing damaged outer layers of the skin.',
    longDescription: 'A Chemical Peel is a medical-grade skin resurfacing treatment designed to improve skin tone, texture, and overall clarity by removing damaged outer layers of the skin. At RD Harmony Med Spa, we use the PCA Perfection Peel, a clinically advanced formulation known for delivering powerful results with minimal downtime. This treatment works by applying a customized blend of exfoliating acids that penetrate the skin to accelerate cell turnover and stimulate new skin regeneration. Chemical peels are highly effective for treating a wide range of concerns including acne, pigmentation, sun damage, and early signs of aging. The treatment promotes healthier, smoother, and more radiant skin over time. Each peel is tailored to your skin type and concern, ensuring safe and optimal results.',
    image: '/images/facial_chemical_peel.jpg',
    technology: 'PCA Perfection Peel (Medical-Grade Chemical Peel System), Professional pre- and post-care solutions, Medical-grade skincare protocols, Sterile and controlled application.',
    benefits: [
      'Improves skin tone and texture',
      'Reduces acne and breakouts',
      'Minimizes pigmentation and dark spots',
      'Softens fine lines and wrinkles',
      'Boosts collagen production',
      'Enhances overall skin clarity and brightness',
      'Helps unclog pores and reduce oiliness'
    ],
    idealFor: [
      'Acne-prone skin',
      'Hyperpigmentation and dark spots',
      'Sun-damaged skin',
      'Uneven skin tone',
      'Fine lines and early aging',
      'Oily and congested skin'
    ],
    results: 'Immediate: Brighter and refreshed skin, improved clarity. Post-Treatment (3–7 Days): Mild peeling or flaking may occur. Long-Term: Clearer, smoother skin, reduced pigmentation, improved overall skin health.',
    downtime: 'Mild peeling for 3–5 days (varies by skin type). Slight redness or tightness may occur. Minimal disruption to daily routine.',
    stepFlow: [
      { title: 'Step 1: Skin Consultation', desc: 'A detailed skin assessment is performed to determine the appropriate peel strength and formulation.' },
      { title: 'Step 2: Cleansing & Prep', desc: 'The skin is thoroughly cleansed and prepped to ensure even penetration of the peel solution.' },
      { title: 'Step 3: Application of Chemical Peel', desc: 'The PCA Perfection Peel solution is carefully applied to the skin. You may experience a mild tingling or warming sensation.' },
      { title: 'Step 4: Penetration & Activation', desc: 'The active ingredients begin to exfoliate the outer layers of the skin and stimulate cellular renewal.' },
      { title: 'Step 5: Post-Treatment Care', desc: 'A soothing moisturizer and SPF are applied to protect the skin and support healing.' }
    ],
    postCare: [
      'Avoid direct sun exposure',
      'Apply SPF 30+ daily (mandatory)',
      'Do NOT pick or peel the skin',
      'Avoid active ingredients (retinol, acids) for 5–7 days',
      'Keep skin hydrated with gentle moisturizers',
      'Avoid heat (sauna, hot showers) for 48 hours'
    ],
    frequency: 'Every 4–6 weeks depending on skin condition. Series of 3–6 treatments for best results.',
    faqs: [
      { q: 'Is a chemical peel painful?', a: 'You may feel mild tingling or warmth, but the treatment is generally well tolerated.' },
      { q: 'How long does peeling last?', a: 'Peeling usually starts after 2–3 days and lasts up to 5 days.' },
      { q: 'Can I wear makeup after the peel?', a: 'It is recommended to avoid makeup for at least 24 hours.' },
      { q: 'Is it safe for sensitive skin?', a: 'Yes, when customized properly during consultation.' }
    ],
    metaTitle: 'Chemical Peel Treatment | PCA Skin Peel | RD Harmony Med Spa',
    metaDescription: 'Improve acne, pigmentation, and skin texture with PCA Perfection Peel. Medical-grade chemical peel with visible results. Book now.'
  },
  {
    id: 'threading-eyebrow',
    name: 'Eye Brow Threading or Waxing',
    heroTitle: 'Precision Shaping for Perfect Brows',
    heroSubtitle: 'Precision Shaping for Perfect Brows',
    duration: '15 Minutes',
    price: '$10',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    description: 'Precision shaping for your eyebrows using expert threading or gentle waxing techniques to enhance your natural features.',
    longDescription: 'Precision shaping for your eyebrows using expert threading or gentle waxing techniques to enhance your natural features. Eye Brow Threading or Waxing is an ultra-detailed grooming service that creates clean, symmetrical brows tailored specifically to your face shape. Using medical-grade wax or high-precision threading, our experts ensure a professional finish with minimal irritation.',
    image: '/images/svc_eyebrow_threading.jpg',
    benefits: [
      'Perfectly shaped and defined eyebrows',
      'Enhances facial symmetry and balance',
      'Gentle on sensitive eyebrow skin',
      'Quick and precise treatment'
    ],
    stepFlow: [
      { title: 'Consultation (3 min)', desc: 'Analyze brow structure and discuss desired shape.' },
      { title: 'Preparation (2 min)', desc: 'Cleanse brow area to remove oils.' },
      { title: 'Shaping (8 min)', desc: 'Threading or waxing performed with high precision.' },
      { title: 'Soothe & Finish (2 min)', desc: 'Apply calming gel and provide aftercare guidance.' }
    ],
    productsUsed: 'Medical-grade wax, Soothing brow gel',
    postCare: [
      'Avoid touching or rubbing the area',
      'Avoid makeup for 6–8 hours',
      'Apply soothing gel if needed'
    ],
    precautions: [
      'Avoid if skin is irritated or recently exfoliated',
      'Notify your technician if using Retin-A or similar actives'
    ],
    faqs: [
      { q: 'Is it painful?', a: 'Mild discomfort that fades quickly after the session.' },
      { q: 'How often should I get my brows done?', a: 'Every 2–4 weeks is recommended for maintenance.' }
    ],
    metaTitle: 'Eye Brow Threading or Waxing | Precision Shaping | RD Harmony Med Spa',
    metaDescription: 'Get perfectly shaped, symmetrical brows with professional threading or waxing at RD Harmony Med Spa. Precise, hygienic, and expertly performed.'
  },
  {
    id: 'threading-upper-lips',
    name: 'Upper Lips Threading or Waxing',
    heroTitle: 'Remove Fine Hair with Precision',
    heroSubtitle: 'Remove Fine Hair with Precision',
    duration: '10 Minutes',
    price: '$5',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    description: 'Achieve smooth, flawless skin with our upper lip hair removal service using precise threading or gentle waxing.',
    longDescription: 'Achieve smooth, flawless skin with our upper lip hair removal service using precise threading or gentle waxing. Upper Lips Threading or Waxing removes fine hair effectively while minimizing irritation. This quick, professional session leaves your skin soft and clean with medical-grade products.',
    image: '/images/svc_upperlip.jpg',
    benefits: [
      'Removes fine hair for a smooth finish',
      'Exfoliates skin for a cleaner look',
      'Minimal irritation with medical-grade wax',
      'Quick, professional grooming'
    ],
    stepFlow: [
      { title: 'Consultation (2 min)', desc: 'Assess skin sensitivity.' },
      { title: 'Preparation (2 min)', desc: 'Cleanse skin and prep the area.' },
      { title: 'Removal (4 min)', desc: 'Threading or waxing performed with precision.' },
      { title: 'Soothing (2 min)', desc: 'Apply calming lotion.' }
    ],
    productsUsed: 'Medical-grade wax, Calming facial lotion',
    postCare: [
      'Avoid touching the area',
      'Avoid heat or sun exposure for 24 hours',
      'Apply soothing lotion if needed'
    ],
    faqs: [
      { q: 'Does it hurt?', a: 'Mild discomfort that disappears quickly.' },
      { q: 'How long does it last?', a: 'Smoothness typically lasts 2–4 weeks.' }
    ],
    metaTitle: 'Upper Lips Threading or Waxing | Smooth Facial Skin | RD Harmony Med Spa',
    metaDescription: 'Achieve smooth, hair-free upper lips with professional threading or waxing at RD Harmony Med Spa.'
  },
  {
    id: 'threading-forehead',
    name: 'Forehead Threading or Waxing',
    heroTitle: 'Smooth, Hair-Free Forehead',
    heroSubtitle: 'Smooth, Hair-Free Forehead',
    duration: '10 Minutes',
    price: '$5',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_forehead.jpg',
    description: 'Create a clean, polished appearance by removing unwanted forehead hair with expert threading or waxing.',
    longDescription: 'Create a clean, polished appearance by removing unwanted forehead hair with expert threading or waxing. Forehead Threading or Waxing removes fine hair and exfoliates the skin, enhancing your overall facial profile and providing a flawless canvas for skincare and makeup.',
    benefits: [
      'Clean hairline and polished finish',
      'Removes fine-textured hair effectively',
      'Exfoliates and smooths skin',
      'Gentle technique for even results'
    ],
    stepFlow: [
      { title: 'Preparation (3 min)', desc: 'Area is cleansed and prepped for hair removal.' },
      { title: 'Removal (5 min)', desc: 'Threading or waxing performed for even results.' },
      { title: 'Soothe (2 min)', desc: 'Cooling gel applied to calm the skin.' }
    ],
    productsUsed: 'Medical-grade wax, Cooling forehead gel',
    postCare: [
      'Avoid sun exposure for several hours',
      'Keep the forehead clean and hydrated',
      'Avoid harsh products for 24 hours'
    ],
    metaTitle: 'Forehead Threading or Waxing | Smooth Hair-Free Forehead | RD Harmony Med Spa',
    metaDescription: 'Professional forehead hair removal for a clean, polished look. Smooth skin with expert threading or waxing.'
  },
  {
    id: 'threading-chin',
    name: 'Chin Threading or Waxing',
    heroTitle: 'Gentle Hair Removal for a Smooth Chin',
    heroSubtitle: 'Gentle Hair Removal for a Smooth Chin',
    duration: '10 Minutes',
    price: '$3',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_chin.jpg',
    description: 'Expert threading or waxing for the chin area removes fine hair and exfoliates for a cleaner, smoother look.',
    longDescription: 'Expert threading or waxing for the chin area removes fine hair and exfoliates for a cleaner, smoother look. Chin Threading or Waxing is a quick, essential part of facial grooming that ensures your skin feels refreshed and looks polished, whether you prefer the precision of a thread or the efficiency of medical-grade wax.',
    benefits: [
      'Removes unwanted chin hair completely',
      'Leaves skin smooth and refreshed',
      'Exfoliates and improves skin texture',
      'Fast and minimally invasive'
    ],
    stepFlow: [
      { title: 'Cleanse (2 min)', desc: 'Clean chin area of oils and dirt.' },
      { title: 'Removal (6 min)', desc: 'Threading or waxing performed with precision.' },
      { title: 'Hydrate (2 min)', desc: 'Apply calming aloe or gentle lotion.' }
    ],
    productsUsed: 'Medical-grade wax, Aloe-based calming gel',
    postCare: [
      'Avoid touching the area for 4–6 hours',
      'Moisturize daily with a gentle lotion',
      'Avoid heat or sun exposure for 24 hours'
    ],
    testimonials: [
      { quote: "Quick and perfectly done! My chin feels so smooth.", author: "Aman P." }
    ],
    metaTitle: 'Chin Threading or Waxing | Professional Chin Hair Removal | RD Harmony Med Spa',
    metaDescription: 'Smooth, hair-free chin with professional threading or waxing at RD Harmony Med Spa. Fast and gentle.'
  },
  {
    id: 'threading-cheeks',
    name: 'Cheeks Threading or Waxing',
    heroTitle: 'Smooth, Hair-Free Cheeks',
    heroSubtitle: 'Smooth, Hair-Free Cheeks',
    duration: '10 Minutes',
    price: '$7',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_cheeks.jpg',
    description: 'Remove fine facial hair and peach fuzz from your cheeks for soft, smooth skin and a polished appearance.',
    longDescription: 'Remove fine facial hair and peach fuzz from your cheeks for soft, smooth skin and a polished appearance. Cheeks Threading or Waxing helps improve your overall facial tone and texture, making makeup application easier and giving your face a natural, healthy glow. We use skin-friendly methods to ensure comfort and smooth results.',
    benefits: [
      'Smooth, hair-free cheeks',
      'Removes fine peach fuzz for better skin tone',
      'Enhances makeup application smoothness',
      'Quick hair removal for a refined look'
    ],
    stepFlow: [
      { title: 'Skin Prep (2 min)', desc: 'Area is cleaned to ensure a clean removal process.' },
      { title: 'Hair Removal (6 min)', desc: 'Expert threading or waxing removes unwanted hair from the roots.' },
      { title: 'Hydration (2 min)', desc: 'Calming cooling gel is applied.' }
    ],
    productsUsed: 'Medical-grade wax or threading thread, Cooling facial gel',
    postCare: [
      'Avoid applying harsh products',
      'Keep the skin clean and hydrated',
      'Avoid direct sun exposure for 24 hours'
    ],
    metaTitle: 'Cheeks Threading or Waxing | Smooth Facial Skin | RD Harmony Med Spa',
    metaDescription: 'Achieve smooth, hair-free cheeks with professional threading or waxing at RD Harmony Med Spa. Perfect for fine facial hair.'
  },
  {
    id: 'threading-full-face',
    name: 'Full Face Threading or Waxing',
    heroTitle: 'Complete Facial Hair Removal & Exfoliation',
    heroSubtitle: 'Complete Facial Hair Removal & Exfoliation',
    duration: '30 Minutes',
    price: '$25',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    description: 'Complete facial grooming that removes unwanted hair from all areas, including eyebrows, lips, cheeks, and forehead.',
    longDescription: 'Complete facial grooming that removes unwanted hair from all areas, including eyebrows, lips, cheeks, and forehead. Full Face Threading or Waxing provides a deep, precision-based hair removal session that also acts as a natural exfoliant, leaving your entire face smooth, symmetrical, and radiant.',
    image: '/images/svc_fullface.jpg',
    benefits: [
      'Complete removal of unwanted facial hair',
      'Deep skin exfoliation and smoothing',
      'Perfect foundation for makeup and skincare',
      'Boosts facial symmetry and radiance'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Discuss skin sensitivities and mapping for brows.' },
      { title: 'Preparation (3 min)', desc: 'Cleanse face and apply pre-wax oil if needed.' },
      { title: 'Removal (18 min)', desc: 'Threading or waxing performed on all target facial zones.' },
      { title: 'Soothing (4 min)', desc: 'Apply cooling gel and perform facial massage.' }
    ],
    productsUsed: 'Medical-grade wax, Calm-skin facial serums',
    postCare: [
      'Avoid touching the face for several hours',
      'Use gentle cleansers and moisturizer',
      'Avoid makeup for at least 6–8 hours'
    ],
    faqs: [
      { q: 'Is it painful?', a: 'Moderate discomfort that subsides immediately with cooling gel.' },
      { q: 'How often should I get it?', a: 'Monthly maintenance is recommended.' }
    ],
    metaTitle: 'Full Face Threading or Waxing | Complete Facial Grooming | RD Harmony Med Spa',
    metaDescription: 'Get a completely smooth, hair-free face with professional threading or waxing at RD Harmony Med Spa. Full facial transformation.'
  },
  {
    id: 'waxing-full-arm',
    name: 'Full Arm Waxing',
    heroTitle: 'Smooth, Hair-Free Arms',
    heroSubtitle: 'Smooth, Hair-Free Arms',
    duration: '30 Minutes',
    price: '$28',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_fullarm.jpg',
    description: 'Full Arm Waxing removes hair from shoulder to wrist, leaving skin smooth and polished.',
    longDescription: 'Full Arm Waxing removes hair from shoulder to wrist, leaving skin smooth and polished. The treatment is ideal for daily confidence and aesthetics, providing a completely hair-free experience using medical-grade wax that is gentle on skin while being highly effective.',
    benefits: [
      'Completely smooth, hair-free arms',
      'Long-lasting results (3–6 weeks)',
      'Exfoliates dead skin cells',
      'Boosts daily confidence and hygiene'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Assess skin type and hair density.' },
      { title: 'Preparation (5 min)', desc: 'Cleanse area and apply pre-wax antiseptic.' },
      { title: 'Waxing (15–20 min)', desc: 'Hair removed from shoulder to wrist using strips.' },
      { title: 'Soothe (5 min)', desc: 'Apply calming lotion to reduce any redness.' }
    ],
    productsUsed: 'Medical-grade wax, Post-wax calming lotion',
    postCare: [
      'Avoid hot showers, saunas, or tanning for 24 hours',
      'Moisturize daily to keep skin soft',
      'Avoid tight clothing for several hours after session'
    ],
    faqs: [
      { q: 'Is it painful?', a: 'Mild discomfort that fades almost immediately.' },
      { q: 'How long do results last?', a: 'Typically 3–5 weeks depending on hair growth.' }
    ],
    metaTitle: 'Full Arm Waxing | Smooth Hair-Free Arms | RD Harmony Med Spa',
    metaDescription: 'Achieve perfectly smooth arms with professional Full Arm Waxing at RD Harmony Med Spa. Safe, effective, and hygienic.'
  },
  {
    id: 'waxing-half-arm',
    name: 'Half Arm Waxing',
    heroTitle: 'Quick Hair Removal for Forearms',
    heroSubtitle: 'Quick Hair Removal for Forearms',
    duration: '20 Minutes',
    price: '$18',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_halfarm.jpg',
    description: 'Half Arm Waxing removes hair from either upper or lower arm, offering quick results and smooth skin.',
    longDescription: 'Half Arm Waxing removes hair from either upper or lower arm, offering quick results and smooth skin. A perfect maintenance session for clients who prefer hair-free forearms or upper arms, performed with medical-grade wax for a gentle yet effective finish.',
    benefits: [
      'Targeted, quick hair removal',
      'Smooth, polished skin texture',
      'Minimal downtime and irritation',
      'Ideal for regular maintenance'
    ],
    stepFlow: [
      { title: 'Preparation (3 min)', desc: 'Cleanse the target area.' },
      { title: 'Waxing (12 min)', desc: 'Hair removed from lower or upper arm using professional wax.' },
      { title: 'Soothing (5 min)', desc: 'Apply post-treatment calming gel.' }
    ],
    productsUsed: 'Medical-grade wax, Calming skin lotion',
    postCare: [
      'Avoid heat and tanning for 24 hours',
      'Moisturize the area daily',
      'Avoid harsh scrubbing for 48 hours'
    ],
    faqs: [
      { q: 'How often should I get it?', a: 'Every 3–4 weeks is standard for consistent results.' }
    ],
    metaTitle: 'Half Arm Waxing | Smooth Forearms | RD Harmony Med Spa',
    metaDescription: 'Quick results with professional Half Arm Waxing at RD Harmony Med Spa. Smooth, hair-free skin for upper or lower arms.'
  },
  {
    id: 'waxing-full-leg',
    name: 'Full Leg Waxing',
    heroTitle: 'Smooth, Hair-Free Legs in One Session',
    heroSubtitle: 'Smooth, Hair-Free Legs in One Session',
    duration: '45 Minutes',
    price: '$38',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_fullleg.jpg',
    description: 'Full Leg Waxing is a comprehensive hair removal service that removes hair from the entire leg, leaving skin smooth and soft.',
    longDescription: 'Full Leg Waxing is a comprehensive hair removal service that removes hair from the entire leg, from upper thighs down to ankles. Our medical-grade wax ensures minimal irritation and maximum effectiveness, leaving your skin soft, exfoliated, and hair-free for weeks.',
    benefits: [
      'Smooth, hair-free legs for 3–6 weeks',
      'Exfoliates dead skin cells for softer texture',
      'Quick and professional hygiene standard',
      'Thinner regrowth over time'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Assess skin sensitivity and check for any allergies.' },
      { title: 'Preparation (5 min)', desc: 'Cleanse skin and apply pre-wax oil if needed.' },
      { title: 'Waxing (30–35 min)', desc: 'Apply wax in sections and remove hair using strips or hot wax.' },
      { title: 'Soothe & Moisturize (5 min)', desc: 'Apply post-wax calming lotion to reduce redness.' }
    ],
    productsUsed: 'Medical-grade wax, Pre- and post-wax care products',
    postCare: [
      'Avoid hot showers, saunas, or tanning for 24 hours',
      'Apply soothing lotion if needed',
      'Avoid tight clothing immediately after session'
    ],
    precautions: [
      'Avoid if skin has open cuts, infections, or irritation',
      'Not suitable for recently sunburned skin'
    ],
    faqs: [
      { q: 'Does it hurt?', a: 'Mild discomfort that fades quickly after removal.' },
      { q: 'How often should I get it?', a: 'Every 3–6 weeks depending on your hair growth.' }
    ],
    testimonials: [
      { quote: "Legs are silky smooth and last weeks!", author: "Simran A." }
    ],
    metaTitle: 'Full Leg Waxing | Smooth Hair-Free Legs | RD Harmony Med Spa',
    metaDescription: 'Achieve smooth, hair-free legs with our professional Full Leg Waxing service using medical-grade wax at RD Harmony Med Spa.'
  },
  {
    id: 'waxing-half-leg',
    name: 'Half Leg Waxing',
    heroTitle: 'Smooth Skin from Knee to Ankle',
    heroSubtitle: 'Smooth Skin from Knee to Ankle',
    duration: '30 Minutes',
    price: '$20',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_halfleg.jpg',
    description: 'Half Leg Waxing targets either the upper or lower leg, providing hair-free, smooth skin in a short session.',
    longDescription: 'Half Leg Waxing targets either the upper or lower leg, providing hair-free, smooth skin in a short session. Perfect for maintenance between full leg sessions or for clients who only require partial leg hair removal. Our professional aestheticians ensure even results and soft skin using medical-grade products.',
    benefits: [
      'Smooth, hair-free partial leg',
      'Quick and effective maintenance',
      'Exfoliates skin for softer feel',
      'Reduces need for frequent shaving'
    ],
    stepFlow: [
      { title: 'Consultation (3 min)', desc: 'Identify target area (upper/lower) and assess skin.' },
      { title: 'Preparation (4 min)', desc: 'Cleanse and prep the targeted section.' },
      { title: 'Waxing (18 min)', desc: 'Remove hair using professional-grade wax and strips.' },
      { title: 'Soothe (5 min)', desc: 'Apply calming lotion to treated area.' }
    ],
    productsUsed: 'Medical-grade wax, Calming skin lotion',
    postCare: [
      'Avoid hot showers and sun for 24 hours',
      'Moisturize the area regularly',
      'Avoid tight pants immediately after'
    ],
    faqs: [
      { q: 'Does it hurt?', a: 'Mild discomfort that subsides very quickly.' }
    ],
    metaTitle: 'Half Leg Waxing | Smooth Partial Leg | RD Harmony Med Spa',
    metaDescription: 'Smooth skin from knee to ankle with professional Half Leg Waxing at RD Harmony Med Spa. Fast and effective.'
  },
  {
    id: 'waxing-underarms',
    name: 'Underarms Waxing',
    heroTitle: 'Smooth, Fresh, Hair-Free Underarms',
    heroSubtitle: 'Smooth, Fresh, Hair-Free Underarms',
    duration: '15 Minutes',
    price: '$12',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_underarm.jpg',
    description: 'Underarms Waxing removes hair quickly and effectively, leaving skin smooth and soft.',
    longDescription: 'Underarms Waxing removes hair quickly and effectively, leaving skin smooth and soft. Medical-grade wax ensures gentle treatment even on the sensitive underarm area, preventing common issues like shaving bumps and razor burn.',
    benefits: [
      'Smooth, soft underarms for weeks',
      'Minimizes irritation and ingrown hairs',
      'Prevents dark shadows and razor bumps',
      'Quick and efficient session'
    ],
    stepFlow: [
      { title: 'Prep (3 min)', desc: 'Cleanse underarm area and pat dry.' },
      { title: 'Waxing (9 min)', desc: 'Apply warm wax and remove hair from the root.' },
      { title: 'Soothing (3 min)', desc: 'Apply calming gel.' }
    ],
    productsUsed: 'Medical-grade wax, Calming skin lotion',
    postCare: [
      'Avoid deodorant for 4–6 hours after treatment',
      'Avoid excessive sweating or heat for 24 hours',
      'Keep the area clean'
    ],
    testimonials: [
      { quote: "No more razor bumps! My underarms are so smooth.", author: "Kiran J." }
    ],
    metaTitle: 'Underarms Waxing | Smooth Hair-Free Underarms | RD Harmony Med Spa',
    metaDescription: 'Get smooth, hair-free underarms with professional waxing at RD Harmony Med Spa. Gentle and effective for sensitive skin.'
  },
  {
    id: 'waxing-brazilian',
    name: 'Brazilian Waxing',
    heroTitle: 'Full Brazilian Area Hair Removal with Precision',
    heroSubtitle: 'Full Brazilian Area Hair Removal with Precision',
    duration: '30 Minutes',
    price: '$30',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_brazilian.jpg',
    description: 'Brazilian Waxing removes hair from the front and back of the Brazilian area, providing smooth, clean skin.',
    longDescription: 'Brazilian Waxing removes hair from the front and back of the Brazilian area, providing smooth, clean skin. Our gentle medical-grade wax ensures minimal irritation and high hygiene standards for this sensitive treatment, providing long-lasting confidence and smooth results.',
    benefits: [
      'Complete hair removal from the Brazilian area',
      'Smooth skin for 3–4 weeks',
      'Hygienic and professional clinical standard',
      'Reduces ingrown hairs'
    ],
    stepFlow: [
      { title: 'Consultation (3 min)', desc: 'Discuss comfort and sensitivity.' },
      { title: 'Prep (5 min)', desc: 'Cleanse area and apply pre-wax oil.' },
      { title: 'Waxing (17 min)', desc: 'Remove hair from target Brazilian areas using strips or hard wax.' },
      { title: 'Soothe (5 min)', desc: 'Apply post-wax calming lotion.' }
    ],
    productsUsed: 'Medical-grade wax, Calming skin serums',
    postCare: [
      'Avoid tight clothing for 24 hours',
      'Avoid heat, saunas, and intense exercise',
      'Keep area moisturized but clean'
    ],
    precautions: [
      'Avoid during active infections or irritation',
      'Avoid waxing during menstruation for maximum comfort'
    ],
    testimonials: [
      { quote: "Super professional and comfortable experience. Highly recommend!", author: "Sonia R." }
    ],
    metaTitle: 'Brazilian Waxing | Full Brazilian Hair Removal | RD Harmony Med Spa',
    metaDescription: 'Professional Brazilian Waxing for complete, smooth hair removal. Gentle wax and expert care at RD Harmony Med Spa.'
  },
  {
    id: 'waxing-brazilian-numbing',
    name: 'Brazilian Waxing with Numbing Cream',
    heroTitle: 'Painless, Full Brazilian Hair Removal',
    heroSubtitle: 'Painless, Full Brazilian Hair Removal',
    duration: '45 Minutes',
    price: '$45',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    image: '/images/svc_brazilian_numb.jpg',
    description: 'For pain-sensitive clients, this service adds topical numbing cream to the Brazilian Waxing session.',
    longDescription: 'For pain-sensitive clients, this service adds topical numbing cream to the Brazilian Waxing session. Ensures a comfortable, nearly pain-free hair removal process while maintaining the same smooth, clean results across the Brazilian area.',
    benefits: [
      'Painless hair removal experience',
      'Ideal for first-time or sensitive clients',
      'Complete and smooth results',
      'Reduced post-treatment discomfort'
    ],
    stepFlow: [
      { title: 'Numbing Application (15 min)', desc: 'Topical cream applied to target zones to minimize sensation.' },
      { title: 'Waxing (25 min)', desc: 'Professional medical-grade wax hair removal.' },
      { title: 'Soothe (5 min)', desc: 'Apply calming gel.' }
    ],
    productsUsed: 'Medical-grade wax, Topical numbing cream',
    metaTitle: 'Brazilian Waxing with Numbing Cream | Pain-Free Grooming | RD Harmony Med Spa',
    metaDescription: 'Experience comfortably smooth skin with professional Brazilian Waxing and numbing cream at RD Harmony Med Spa.'
  },
  {
    id: 'microneedling',
    name: 'Microneedling',
    heroTitle: 'Stimulate Collagen, Renew Your Skin Naturally',
    heroSubtitle: 'Stimulate Collagen, Renew Your Skin Naturally',
    duration: '45 Minutes',
    price: '$225',
    category: 'Skincare',
    isMobileAvailable: true,
    description: 'Microneedling is a minimally invasive procedure using the SkinPen to create microchannels that stimulate natural collagen production.',
    longDescription: 'Microneedling is a minimally invasive procedure using the SkinPen, FDA and Health Canada-approved. Tiny needles create microchannels in the skin, stimulating collagen, improving texture, reducing fine lines, and enhancing absorption of serums. Ideal for skin rejuvenation, acne scars, and anti-aging.',
    image: '/images/svc_microneedle.jpg',
    technology: 'SkinPen (FDA & Health Canada Approved)',
    productsUsed: 'Hyaluronic acid serum',
    benefits: [
      'Reduces fine lines, scars, and pigmentation',
      'Improves elasticity, tone, and texture',
      'Minimal downtime for recovery'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Skin assessment and goal discussion.' },
      { title: 'Preparation (5 min)', desc: 'Cleanse and apply topical numbing cream for comfort.' },
      { title: 'Microneedling (25 min)', desc: 'SkinPen safely glided across target areas to create micro-channels.' },
      { title: 'Serum Application (5 min)', desc: 'Deep infusion of hyaluronic acid serum.' },
      { title: 'Aftercare Discussion (5 min)', desc: 'Guidance and instructions for optimal clinical results.' }
    ],
    postCare: [
      'Avoid makeup for 24 hours',
      'No exfoliation for 5–7 days',
      'Use gentle cleanser and moisturizer twice daily'
    ],
    precautions: [
      'Avoid if active acne, eczema, or psoriasis is present',
      'Not suitable for open wounds or irritated skin'
    ],
    testimonials: [
      { quote: "My skin looks smoother and more radiant after just one session.", author: "Melissa P." }
    ],
    metaTitle: 'Microneedling with SkinPen | Skin Rejuvenation | RD Harmony Med Spa',
    metaDescription: 'Stimulate collagen and improve skin texture with FDA-approved SkinPen microneedling.'
  },
  {
    id: 'prp-face',
    name: 'Platelet Rich Plasma (PRP) for Face',
    heroTitle: 'Natural Skin Regeneration: The Liquid Gold Facial',
    heroSubtitle: 'Transform your skin using the powerful regenerative properties of your own plasma growth factors.',
    duration: '1 Hour',
    price: '$400',
    category: 'Medical',
    isMobileAvailable: true,
    description: 'Microneedling creates micro-injuries to stimulate natural healing, followed by PRP application for enhanced absorption and facial rejuvenation.',
    longDescription: 'Microneedling involves using a specialized device with fine needles (SkinPen) to create tiny, controlled micro-injuries in the skin, stimulating the body’s natural healing response; PRP is then applied to the face, where it penetrates deeply through the microchannels created during the treatment for enhanced absorption and rejuvenation.',
    image: '/images/svc_prp_face.jpg',
    benefits: [
      'Stimulates collagen and elastin production',
      'Reduces appearance of deep fine lines',
      'Improves overall skin elasticity',
      'Safe, natural regenerative procedure'
    ],
    stepFlow: [
      { title: 'Blood Draw (10 min)', desc: 'A professional sample of your blood is safely collected.' },
      { title: 'Processing (15 min)', desc: 'Medical centrifuge separates the pure growth factors (plasma).' },
      { title: 'Numbing (15 min)', desc: 'Topical numbing applied to target areas for total comfort.' },
      { title: 'Injection (15 min)', desc: 'Strategic injection of PRP into target rejuvenation zones.' },
      { title: 'Post-Care (5 min)', desc: 'Restorative barrier application and aftercare guidance.' }
    ],
    postCare: [
      'Avoid sun and makeup for 24–48 hours',
      'Use gentle, non-active skincare products',
      'Stay hydrated to support tissue repair'
    ],
    metaTitle: 'PRP for Face | Collagen Stimulation | RD Harmony Med Spa',
    metaDescription: 'Rejuvenate skin naturally with PRP therapy. Stimulate collagen, reduce fine lines, and improve skin elasticity.'
  },
  {
    id: 'prp-hair',
    name: 'Platelet Rich Plasma (PRP) for Hair',
    heroTitle: 'Restore Natural Hair Growth & Density',
    heroSubtitle: 'Revitalize dormant follicles and combat hair loss using your body\'s own restorative biological factors.',
    duration: '1 Hour',
    price: '$375',
    category: 'Medical',
    isMobileAvailable: true,
    description: 'PRP stimulates dormant hair follicles using your own plasma, improving density, thickness, and reducing hair shedding.',
    longDescription: 'PRP stimulates dormant hair follicles using your own plasma, improving density, thickness, and reducing hair shedding. Safe, natural, and effective treatment for hair loss in men and women.',
    image: '/images/svc_prp_hair.jpg',
    benefits: [
      'Stimulates hair follicles for growth',
      'Improves existing hair thickness and density',
      'Reduces hair shedding Significantly',
      'Minimally invasive, natural treatment'
    ],
    stepFlow: [
      { title: '1. Consultation', desc: 'A thorough assessment is completed to evaluate hair loss, scalp condition, and suitability for PRP treatment.' },
      { title: '2. Blood Collection', desc: 'A small amount of your blood is drawn, similar to a routine lab test.' },
      { title: '3. PRP Preparation', desc: 'The blood is processed in a centrifuge to separate and concentrate the platelet-rich plasma (PRP).' },
      { title: '4. Scalp Preparation', desc: 'The scalp is cleansed, and a topical numbing agent may be applied for comfort.' },
      { title: '5. PRP Injections', desc: 'PRP is carefully injected into targeted areas of the scalp using fine needles to stimulate hair follicles.' },
      { title: '6. Post-Treatment Care', desc: 'Aftercare instructions are provided to support optimal results, with minimal downtime expected.' },
      { title: '7. Follow-Up Sessions', desc: 'A series of treatments is typically recommended for best results, along with maintenance sessions as needed.' }
    ],
    postCare: [
      'Avoid shampooing hair for 24 hours',
      'No heat or direct sun exposure on scalp',
      'Avoid vigorous exercise for 24 hours'
    ],
    metaTitle: 'PRP for Hair | Hair Restoration | RD Harmony Med Spa',
    metaDescription: 'Stimulate natural hair growth with PRP therapy. Safe, effective, and minimally invasive.'
  },
  {
    id: 'microneedling-boosters',
    name: 'Microneedling with Boosters',
    heroTitle: 'Advanced Skin Rejuvenation: The Cellular Repair Trio',
    heroSubtitle: 'Elevate your SkinPen treatment with potent Salmon DNA, NAD+, or Exosomes for unprecedented repair.',
    duration: '1 Hour',
    price: '$425',
    category: 'Skincare',
    isMobileAvailable: true,
    description: 'Combines SkinPen microneedling with boosters like Salmon DNA, NAD+, or Exosomes for deeper repair.',
    longDescription: 'Combines SkinPen microneedling with boosters like Salmon DNA, NAD+, or Exosomes for deeper repair, faster healing, and enhanced rejuvenation. Ideal for scars, aging, and pigmentation.',
    image: '/images/svc_microneedle_booster.jpg',
    technology: 'Salmon DNA / NAD+ / Exosomes / SkinPen',
    benefits: [
      'Stimulates deeper collagen and elastin repair',
      'Accelerates healing and repairs cell structure',
      'Significantly reduces scars and pigmentation',
      'Maximum skin hydration and youthful glow'
    ],
    stepFlow: [
      { title: 'Booster Selection (5 min)', desc: 'Consultation to select Salmon DNA, NAD+, or Exosomes.' },
      { title: 'Skin Prep (10 min)', desc: 'Cleanse and apply surgical-grade numbing.' },
      { title: 'Microneedling (25 min)', desc: 'Micro-channels created to host deep infusion.' },
      { title: 'Infusion (15 min)', desc: 'Intensive application of selected cellular boosters.' },
      { title: 'Post-Care Discussion (5 min)', desc: 'Instructions for maximum booster absorption.' }
    ],
    postCare: [
      'Avoid sun and makeup for 24 hours',
      'Use gentle moisturizers and SPF daily',
      'Allow skin to fully absorb booster nutrients'
    ],
    metaTitle: 'Microneedling with Boosters | Advanced Skin Repair | RD Harmony Med Spa',
    metaDescription: 'Boost your skin repair and rejuvenation with microneedling combined with Salmon DNA, NAD+, or Exosomes.'
  },
  {
    id: 'nano-ombre-brows',
    name: 'NANO & OMBRE Brows',
    heroTitle: 'Semi-Permanent Brow Enhancement for Perfect Symmetry',
    heroSubtitle: 'Semi-Permanent Brow Enhancement for Perfect Symmetry',
    duration: '2 Hours',
    price: '$200',
    category: 'Treatment',
    isMobileAvailable: false,
    description: 'NANO & OMBRE Brows are semi-permanent eyebrow treatments designed to create full, defined, and symmetrical brows using precision techniques.',
    longDescription: 'NANO & OMBRE Brows are semi-permanent eyebrow treatments designed to create full, defined, and symmetrical brows using precision techniques. NANO brows mimic individual hair strokes, while OMBRE provides soft shading for depth. Ideal for clients seeking low-maintenance, flawless brows with lasting artistic symmetry.',
    image: '/images/svc_nanobrows.jpg',
    benefits: [
      'Long-lasting (12–24 months) semi-permanent results',
      'Natural, defined, and symmetrical brows',
      'Saves significant time on daily makeup',
      'Enhances overall facial aesthetics'
    ],
    stepFlow: [
      { title: 'Consultation (10 min)', desc: 'Assess brow shape, skin tone, and client preference.' },
      { title: 'Numbing (15 min)', desc: 'Topical anesthetic applied to ensure a comfortable session.' },
      { title: 'Brow Mapping (15 min)', desc: 'Professional measurement and outlining of your ideal shape.' },
      { title: 'Pigmentation (60–75 min)', desc: 'Precision application of NANO strokes or OMBRE shading.' },
      { title: 'Soothe & Protect (5 min)', desc: 'Apply healing balm and provide deep aftercare instructions.' }
    ],
    productsUsed: 'Premium semi-permanent pigments, NANO microblading tools, Topical numbing cream',
    postCare: [
      'Avoid water, makeup, or sweat on brows for 7–10 days',
      'Apply healing balm exactly as instructed',
      'Avoid sun exposure or tanning beds during the initial healing phase'
    ],
    precautions: [
      'Avoid if pregnant or breastfeeding',
      'Notify technician of any pigment or metal allergies',
      'Avoid blood-thinning medications 24h prior'
    ],
    faqs: [
      { q: 'How long does it last?', a: '12–24 months with recommended touch-ups.' },
      { q: 'Is it painful?', a: 'Minimal discomfort thanks to our high-strength numbing cream.' },
      { q: 'Can I choose the style?', a: 'Yes, every session is fully customized to your face shape and goals.' }
    ],
    testimonials: [
      { quote: "Brows are perfect, symmetrical, and last for months. I love them!", author: "Ayesha K." }
    ],
    metaTitle: 'NANO & OMBRE Brows | Semi-Permanent Brow Enhancement | RD Harmony Med Spa',
    metaDescription: 'Achieve perfect, natural-looking brows with NANO & OMBRE techniques for long-lasting results. Professional brow mapping and pigmentation.'
  },
  {
    id: 'botox',
    name: 'Botox',
    heroTitle: 'Smooth Dynamic Lines & Rejuvenate Appearance',
    heroSubtitle: 'Smooth Dynamic Lines & Rejuvenate Appearance',
    duration: '1 Hour',
    price: '$11/unit',
    category: 'Injectables',
    isMobileAvailable: true,
    description: 'Neuromodulators that relax facial muscles to reduce dynamic wrinkles such as frown lines, crow’s feet, and forehead wrinkles.',
    longDescription: 'Botox is a neuromodulator that relaxes facial muscles to reduce dynamic wrinkles such as frown lines, crow’s feet, and forehead wrinkles. It restores a youthful, refreshed look without altering natural facial expressions, helping you maintain a natural, rested appearance.',
    image: '/images/svc_botox.jpg',
    benefits: [
      'Smooths fine lines and dynamic wrinkles',
      'Non-surgical, minimally invasive precision',
      'Quick procedure with little to no downtime',
      'Prevents active signs of aging'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Assess facial structure and unique wrinkle pattern.' },
      { title: 'Preparation (5 min)', desc: 'Cleanse and prep injection sites.' },
      { title: 'Injection (15–20 min)', desc: 'Administer small units at targeted muscle points.' },
      { title: 'Observation (5 min)', desc: 'Post-procedure monitoring and aftercare discussion.' }
    ],
    productsUsed: 'FDA-approved Botox®; Sterile needles and syringes',
    postCare: [
      'Avoid rubbing or massaging the treated area for 24 hours',
      'No strenuous exercise for 24 hours post-injection',
      'Avoid alcohol consumption immediately after treatment'
    ],
    precautions: [
      'Avoid if pregnant or breastfeeding',
      'Notify practitioner of any neuro-muscular disorders or allergies'
    ],
    faqs: [
      { q: 'When will results appear?', a: 'Typically 3–7 days for initial smoothing.' },
      { q: 'How long do results last?', a: '3–6 months depending on individual metabolism.' },
      { q: 'Does it hurt?', a: 'Only minor discomfort, often described as a slight pinch.' }
    ],
    testimonials: [
      { quote: "Lines softened and my face feels refreshed and natural.", author: "Priya S." }
    ],
    metaTitle: 'Botox | Wrinkle Reduction | RD Harmony Med Spa',
    metaDescription: 'Smooth dynamic lines and rejuvenate your appearance with professional Botox injections. Fast, safe, and natural results.'
  },
  {
    id: 'xeomin',
    name: 'Xeomin',
    heroTitle: 'Highly Purified Neurotoxin for Frown Lines',
    heroSubtitle: 'Highly Purified Neurotoxin for Frown Lines',
    duration: '1 Hour',
    price: '$8/unit',
    category: 'Injectables',
    isMobileAvailable: true,
    description: 'Xeomin is a highly purified neurotoxin that temporarily improves moderate-to-severe frown lines between the eyebrows.',
    longDescription: 'Xeomin is a highly purified neurotoxin that temporarily improves moderate-to-severe frown lines between the eyebrows. Its purified formulation reduces the chance of antibody resistance, offering smooth, natural results without unnecessary additive proteins.',
    image: '/images/svc_xeomin.jpg',
    benefits: [
      'Smooths moderate-to-severe frown lines',
      'Highly purified formulation',
      'No additive proteins',
      'Quick procedure with natural outcomes'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Assess facial structure and wrinkle patterns.' },
      { title: 'Prep (5 min)', desc: 'Cleanse and prep the targeted sites.' },
      { title: 'Injection (15–20 min)', desc: 'Administer Xeomin units with medical precision.' },
      { title: 'Monitoring (5 min)', desc: 'Review results and aftercare steps.' }
    ],
    productsUsed: 'FDA-approved Xeomin®',
    postCare: [
      'Avoid rubbing the area for 24 hours',
      'No strenuous exercise for 24 hours',
      'Avoid alcohol immediately after'
    ],
    faqs: [
      { q: 'How long do results last?', a: 'Typically 3–5 months.' },
      { q: 'Is it painful?', a: 'Minimal discomfort, similar to Botox.' }
    ],
    testimonials: [
      { quote: "Xeomin gave me such a clean, natural result. I love it!", author: "Priya S." }
    ],
    metaTitle: 'Xeomin Treatment | Highly Purified Wrinkle Relaxer | RD Harmony Med Spa',
    metaDescription: 'Target frown lines with Xeomin, the purified neurotoxin. Clean, natural wrinkle reduction with no additives. Book your unit at $8 today.'
  },
  {
    id: 'dysport',
    name: 'Dysport',
    heroTitle: 'Smooth Frown Lines Without Affecting Facial Expression',
    heroSubtitle: 'Smooth Frown Lines Without Affecting Facial Expression',
    duration: '1 Hour',
    price: '$7/unit',
    category: 'Injectables',
    isMobileAvailable: true,
    description: 'Dysport relaxes targeted facial muscles, smoothing wrinkles while maintaining natural facial movement.',
    longDescription: 'Dysport relaxes targeted facial muscles, smoothing wrinkles while maintaining natural facial movement. Ideal for frown lines, forehead lines, and crow’s feet, this fast-acting injectable provides smooth integration for an effortless aesthetic refresh.',
    image: '/images/svc_dysport.jpg',
    benefits: [
      'Smooths frown and forehead lines',
      'Maintains natural facial movement',
      'Fast-acting, smooth integration',
      'Relaxes targeted muscles effectively'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Assess facial structure and movement.' },
      { title: 'Preparation (5 min)', desc: 'Cleanse injection points.' },
      { title: 'Injection (15–20 min)', desc: 'Apply Dysport units to targeted areas.' },
      { title: 'Observation (5 min)', desc: 'Monitor for immediate reaction and discuss care.' }
    ],
    productsUsed: 'FDA-approved Dysport®',
    postCare: [
      'Avoid rubbing the area for 24 hours',
      'No exercise for 24 hours',
      'Avoid alcohol immediately after'
    ],
    faqs: [
      { q: 'When will I see results?', a: 'Often faster than Botox, within 2–4 days.' },
      { q: 'How long does it last?', a: 'Usually 3–5 months.' }
    ],
    metaTitle: 'Dysport Treatment | Fast-Acting Wrinkle Relaxer | RD Harmony Med Spa',
    metaDescription: 'Smooth your lines while keeping your natural expressions. Dysport injections available at RD Harmony Med Spa. Fast-acting and effective.'
  },

  {
    id: 'iv-vitamin-wellness',
    name: 'IV Vitamin: Wellness',
    heroTitle: 'Full-Body Rejuvenation & Hydration',
    heroSubtitle: 'Full-Body Rejuvenation & Hydration',
    duration: '1 Hour',
    price: '$220',
    category: 'IV Therapy',
    isMobileAvailable: true,
    description: 'A customized IV vitamin cocktail designed to boost vitality, mental clarity, hydration, and overall wellness.',
    longDescription: 'A customized IV vitamin cocktail designed to boost vitality, mental clarity, hydration, and overall wellness. Ideal for recovery from fatigue, stress, and nutrient deficiency, this medical-grade infusion delivers essential nutrients directly to your bloodstream for maximum cellular absorption.',
    image: '/images/svc_iv_wellness.jpg',
    benefits: [
      'Boosts energy and mental clarity',
      'Deep hydration for skin and body',
      'Supports and optimizes immune system',
      'Fights fatigue and nutritional gaps'
    ],
    stepFlow: [
      { title: 'Consultation & Vitals (5 min)', desc: 'Check health status and discuss treatment goals.' },
      { title: 'IV Prep (5 min)', desc: 'Sterilize area and set up medical-grade drip.' },
      { title: 'Infusion (45–50 min)', desc: 'Administer vitamins and hydration solution cellularly.' },
      { title: 'Post-Care (5 min)', desc: 'Remove IV and monitor patient for immediate vitality boost.' }
    ],
    productsUsed: 'Medical-grade IV solutions, Complex vitamins, Sterile IV kits',
    postCare: [
      'Drink plenty of water post-infusion',
      'Avoid alcohol for 12 hours',
      'Rest as needed to let nutrients work'
    ],
    precautions: [
      'Avoid if allergic to specific vitamins',
      'Consult if you have severe cardiac or renal conditions'
    ],
    faqs: [
      { q: 'How long do effects last?', a: 'Typically 3–5 days of peak vitality.' },
      { q: 'Is it safe?', a: 'Yes, fully monitored under medical supervision.' }
    ],
    testimonials: [
      { quote: "I feel rejuvenated and energized after every session.", author: "Tara V." }
    ],
    metaTitle: 'IV Vitamin Wellness Therapy | RD Harmony Med Spa',
    metaDescription: 'Boost your energy, hydration, and overall wellness with our IV Vitamin Therapy. Medical-grade infusions for maximum vitality.'
  },
  {
    id: 'iv-vitamin-mag-cal',
    name: 'IV Vitamin + Magnesium + Calcium',
    heroTitle: 'Vitality. Recovery. Resilience.',
    heroSubtitle: 'Vitality. Recovery. Resilience.',
    duration: '1 Hour',
    price: '$260',
    category: 'IV Therapy',
    isMobileAvailable: true,
    description: 'Optimize your cellular health and physical recovery with our magnesium and calcium enriched IV cocktail.',
    longDescription: 'Optimize your cellular health and physical recovery with our magnesium and calcium enriched IV cocktail. Ideal for muscle recovery, bone health, and nervous system support, this infusion combines essential minerals with deep hydration for a total body reset.',
    image: '/images/svc_iv_magcal.jpg',
    benefits: [
      'Accelerated muscle recovery post-exercise',
      'Enhanced nervous system and cognitive function',
      'Supports healthy bone density and mineral balance',
      'Reduces stress and physical anxiety'
    ],
    stepFlow: [
      { title: 'Screening (5 min)', desc: 'Check vitals and review mineral balance goals.' },
      { title: 'Setup (5 min)', desc: 'Sterilize site and prepare nutrient-rich mineral infusion.' },
      { title: 'Infusion (45 min)', desc: 'Controlled delivery of Magnesium, Calcium, and hydration.' },
      { title: 'Final Check (5 min)', desc: 'Monitor for immediate relaxation and vital signs.' }
    ],
    productsUsed: 'Medical-grade Magnesium & Calcium solutions, Sterile IV kits',
    postCare: [
      'Stay hydrated to help mineral absorption',
      'Allow your body to rest and recover',
      'Avoid heavy caffeine for 4 hours'
    ],
    precautions: [
       'Not suitable for patients with severe kidney or heart conditions',
       'Notify of any known mineral sensitivities'
    ],
    faqs: [
      { q: 'How do I feel after?', a: 'You may feel a warm, relaxed sensation as the minerals balance your system.' }
    ],
    testimonials: [
      { quote: "Recovered so much faster after my marathon training. Highly recommend!", author: "Mark D." }
    ],
    metaTitle: 'IV Vitamin + Magnesium + Calcium | Vitality Therapy | RD Harmony Med Spa',
    metaDescription: 'Optimize recovery and bone health with our Magnesium and Calcium enriched IV cocktail. Professional medical-grade infusions for cellular resilience.'
  },
  {
    id: 'iv-glutathione',
    name: 'Intravenous (IV) Glutathione',
    heroTitle: 'Master Antioxidant Drip',
    heroSubtitle: 'Master Antioxidant Drip',
    duration: '1 Hour',
    price: '$190',
    category: 'IV Therapy',
    isMobileAvailable: true,
    description: 'Concentrated glutathione infusion for skin brightening, liver detoxification, and cellular repair.',
    longDescription: "Deeply detoxify and brighten your system with the world's most powerful antioxidant. Intravenous (IV) Glutathione delivers the master antioxidant directly to your cells, bypassing the digestive system for unparalleled detoxification and skin-toning results.",
    image: '/images/svc_iv_glut.jpg',
    benefits: [
      'Systemic skin brightening and glow',
      'Potent liver and cellular detoxification',
      'Anti-inflammatory and age-defying effects',
      'Enhanced cellular energy and repair'
    ],
    stepFlow: [
      { title: 'Consultation (5 min)', desc: 'Assess skin goals and detox history.' },
      { title: 'Prep (5 min)', desc: 'Establish IV access in a luxury environment.' },
      { title: 'Antioxidant Infusion (45 min)', desc: 'Regulated delivery of high-dose Glutathione.' },
      { title: 'Post-Care (5 min)', desc: 'Hydration check and detox instructions.' }
    ],
    productsUsed: 'Medical-grade Glutathione, Sterile administration kits',
    postCare: [
       'Avoid direct intense sun exposure for 48 hours',
       'Hydrate exceptionally well to flush toxins',
       'Maintain a healthy balanced diet'
    ],
    faqs: [
      { q: 'When will I see skin results?', a: 'Initial brightening is often visible after 3–5 sessions.' }
    ],
    metaTitle: 'IV Glutathione Therapy | Master Antioxidant | RD Harmony Med Spa',
    metaDescription: 'Brighten skin and detoxify your body with master antioxidant IV Glutathione. Cellular repair and immune support at RD Harmony Med Spa.'
  },
  {
    id: 'iv-glutathione-vit-c',
    name: 'IV Glutathione and Vitamin C',
    heroTitle: 'The Ultimate Glow Cocktail',
    heroSubtitle: 'The Ultimate Glow Cocktail',
    duration: '1 Hour',
    price: '$240',
    category: 'IV Therapy',
    isMobileAvailable: true,
    description: 'A dual-action infusion of our master antioxidant and high-dose Vitamin C for unparalleled skin radiance and immune defense.',
    longDescription: 'A dual-action infusion of our master antioxidant and high-dose Vitamin C for unparalleled skin radiance and immune defense. This gold-standard drip combines two power-antioxidants to stimulate collagen, fight free radicals, and provide a robust defense for your immune system.',
    image: '/images/svc_iv_glut_vitc.jpg',
    benefits: [
      'Intense skin radiance and clarity',
      'Immune system optimization and defense',
      'Advanced collagen support for skin elasticity',
      'Total body rejuvenation and repair'
    ],
    stepFlow: [
      { title: 'Vital Check (5 min)', desc: 'Baseline vitals and medical review.' },
      { title: 'IV Setup (5 min)', desc: 'Sterile preparation of the antioxidants.' },
      { title: 'Synergy Infusion (45 min)', desc: 'Direct delivery of Vitamin C and Glutathione.' },
      { title: 'Instructions (5 min)', desc: 'Review results and scheduled boosters.' }
    ],
    productsUsed: 'Medical-grade Glutathione, High-dose Vitamin C, Sterile IV kits',
    postCare: [
      'Stay hydrated to maximize cellular uptake',
      'Enjoy your immediate radiant glow',
      'Standard post-IV hydration recommended'
    ],
    metaTitle: 'IV Glutathione and Vitamin C | Glow Cocktail | RD Harmony Med Spa',
    metaDescription: 'The ultimate skin brightening and immune-boosting drip. Dual-action antioxidants for radiance and total body wellness.'
  },
  {
    id: 'iv-calories-burn',
    name: 'Intravenous (IV) Calories Burn',
    heroTitle: 'Metabolic Catalyst. Energy Surge.',
    heroSubtitle: 'Metabolic Catalyst. Energy Surge.',
    duration: '1 Hour',
    price: '$250',
    category: 'IV Therapy',
    isMobileAvailable: true,
    description: 'A specialized blend of vitamins and amino acids designed to support fat metabolism and energy production.',
    longDescription: 'A specialized blend of vitamins and amino acids designed to support fat metabolism and energy production. This metabolic catalyst acts as a surge for your energy levels while accelerating your weight management journey with targeted nutritional support delivered directly to your circulatory system.',
    image: '/images/svc_iv_cal.jpg',
    benefits: [
      'Accelerated fat metabolism and processing',
      'Significant surge in energy levels',
      'Enhanced physical and mental performance',
      'Clinical nutritional support for weight goals'
    ],
    stepFlow: [
      { title: 'Metabolic Review (5 min)', desc: 'Brief consultation on weight goals.' },
      { title: 'Preparation (5 min)', desc: 'IV access established in a private lounge.' },
      { title: 'Metabolic Drip (45 min)', desc: 'Infusion of amino acids and metabolism boosters.' },
      { title: 'Final Vital Check (5 min)', desc: 'Assessment and post-care guidance.' }
    ],
    productsUsed: 'Medical-grade fat-metabolizing amino acids, B-Complex vitamins',
    postCare: [
       'Maintain a healthy balanced lifestyle for best results',
       'Hydrate exceptionally well post-treatment',
       'Regular exercise enhances the drip effect'
    ],
    metaTitle: 'IV Calories Burn Therapy | Metabolism Boost | RD Harmony Med Spa',
    metaDescription: 'Boost your metabolism and energy with our specialized IV Calories Burn drip. Accelerated fat processing and nutritional weight support.'
  },
  {
    id: 'iv-iron-infusion',
    name: 'Intravenous (IV) IRON Infusion',
    heroTitle: 'Vitality Restore. Iron Precision.',
    heroSubtitle: 'Vitality Restore. Iron Precision.',
    duration: '2 Hours',
    price: '$275',
    category: 'IV Therapy',
    isMobileAvailable: true,
    description: 'Combat chronic fatigue and restore essential iron levels with medical-grade precision infusions.',
    longDescription: 'Combat chronic fatigue and restore essential iron levels with medical-grade precision infusions. Using Venofer® iron sucrose, we restore ferritin levels and physical endurance, bypassing oral supplements that often cause digestive discomfort.',
    image: '/images/svc_iv_iron.jpg',
    benefits: [
      'Rapidly restores healthy ferritin levels',
      'Eliminates fatigue from chronic iron deficiency',
      'Significantly improves cognitive function',
      'Enhances physical endurance and stamina'
    ],
    stepFlow: [
      { title: 'Medical Review (10 min)', desc: 'Confirm blood work and iron levels.' },
      { title: 'Setup (10 min)', desc: 'Private monitored infusion setup.' },
      { title: 'Iron Delivery (120 min)', desc: 'Controlled Venofer delivery for safety.' },
      { title: 'Monitoring (10 min)', desc: 'Post-infusion observation for comfort.' }
    ],
    productsUsed: 'Venofer® Iron Sucrose, Sterile precision IV kits',
    postCare: [
      'Schedule follow-up blood work as directed',
      'Avoid heavy lifting for 2 hours post-infusion',
      'Stay hydrated and monitor energy levels'
    ],
    precautions: [
       'Requires recent iron-level blood work results',
       'Notify of any prior reactions to iron injections'
    ],
    metaTitle: 'IV Iron Infusion | Ferritin Restore | RD Harmony Med Spa',
    metaDescription: 'Combat iron-deficiency fatigue with medical-grade Venofer IV iron infusions. Safely and effectively restore your vitality.'
  },
  {
    id: 'vit-b12-injection',
    name: 'Vitamin B12 Injection',
    heroTitle: 'Targeted Wellness Boost',
    heroSubtitle: 'Targeted Wellness Boost',
    duration: '15 Minutes',
    price: '$80',
    category: 'Injection',
    isMobileAvailable: true,
    description: 'Rapidly elevate your energy levels and metabolic health with a high-potency Vitamin B12 injection.',
    longDescription: 'Rapidly elevate your energy levels and metabolic health with a high-potency Vitamin B12 injection. This concentrated intramuscular shot delivers instant vitality and supports metabolic function, mood, and mental clarity.',
    image: '/images/svc_b12.jpg',
    benefits: [
      'Surge in energy and mental focus',
      'Critical metabolic and nerve support',
      'Mood stabilization and clarity',
      'Optimized immune system defense'
    ],
    stepFlow: [
      { title: 'Brief Assessment (3 min)', desc: 'Review energy levels and goals.' },
      { title: 'Precision Shot (7 min)', desc: 'Concentrated intramuscular Vitamin B12 injection.' },
      { title: 'Post-Care (5 min)', desc: 'Guidelines for maintaining peak energy.' }
    ],
    productsUsed: 'High-potency Vitamin B12 (Cyanocobalamin)',
    postCare: [
      'Stay active to help circulation',
      'Monitor your energy peaks over next 48h',
      'Hydrate well'
    ],
    metaTitle: 'Vitamin B12 Injection | Energy Booster Shot | RD Harmony Med Spa',
    metaDescription: 'Get an immediate energy boost with professional Vitamin B12 injections. Boost metabolism and mental clarity at RD Harmony Med Spa.'
  },
  {
    id: 'vit-d-injection',
    name: 'Vitamin D Injection',
    heroTitle: 'Immune Guard. Solar Vitality.',
    heroSubtitle: 'Immune Guard. Solar Vitality.',
    duration: '15 Minutes',
    price: '$90',
    category: 'Injection',
    isMobileAvailable: true,
    description: 'Support your bone health and strengthen your immune defenses with clinical Vitamin D supplementation.',
    longDescription: 'Support your bone health and strengthen your immune defenses with clinical Vitamin D supplementation. Essential for maintenance during low-sunlight months, this clinical-grade shot ensures optimal skeletal health and mood regulation via direct absorption.',
    image: '/images/svc_vitd.jpg',
    benefits: [
      'Powerful immune system fortification',
      'Supports skeletal health and bone density',
      'Regulates mood and mental wellness',
      'Optimizes systemic calcium absorption'
    ],
    stepFlow: [
      { title: 'Skin Assessment (3 min)', desc: 'Review sunlight exposure and bone health concerns.' },
      { title: 'D3 Administration (7 min)', desc: 'High-potency Vitamin D injection.' },
      { title: 'Instructions (5 min)', desc: 'Recommended schedule for maintenance.' }
    ],
    productsUsed: 'Clinical-grade Vitamin D3',
    metaTitle: 'Vitamin D Injection | Immune Support Shot | RD Harmony Med Spa',
    metaDescription: 'Fortify your immune system and bone health with medical-grade Vitamin D injections. Clinical supplementation for year-round vitality.'
  },
  {
    id: 'lipotropic-injection',
    name: 'Lipotropic Fat Burning Injection',
    heroTitle: 'Lipo-Burn Precision. Metabolic Catalyst.',
    heroSubtitle: 'Lipo-Burn Precision. Metabolic Catalyst.',
    duration: '15 Minutes',
    price: '$150',
    category: 'Injection',
    isMobileAvailable: true,
    description: 'Metabolic kickstart using medical-grade lipotropic agents to help empty fat cells and boost energy.',
    longDescription: 'Metabolic kickstart using medical-grade lipotropic agents to help empty fat cells and boost energy. Using a concentrated MIC (Methionine, Inositol, Choline) + B12 blend, this injection optimizes liver function and fat processing for elevated metabolic performance.',
    image: '/images/svc_lipo.jpg',
    benefits: [
      'Significantly enhances fat metabolism',
      'Promoles liver detoxification and efficiency',
      'Immediate surge in energy levels',
      'Improved mental clarity and focus'
    ],
    stepFlow: [
      { title: 'Consultation (3 min)', desc: 'Review metabolic goals and baseline.' },
      { title: 'Lipo-Shot (7 min)', desc: 'Targeted MIC + B12 injection.' },
      { title: 'Guidance (5 min)', desc: 'Post-injection lifestyle and hydration tips.' }
    ],
    productsUsed: 'MIC (Methionine, Inositol, Choline) + B12 blend',
    postCare: [
      'Hydration is essential for metabolic clearing',
      'Maintain an active daily routine',
      'Slight site soreness is normal for a few hours'
    ],
    metaTitle: 'Lipotropic Fat Burning Injection | Lipo-Burn | RD Harmony Med Spa',
    metaDescription: 'Kickstart your metabolism with MIC + B12 Lipotropic injections. Professional fat-metabolizing agents for energy and weight management support.'
  },
  {
    id: 'prp-under-eye',
    name: 'PRP for Dark Under-Eye Circles',
    heroTitle: 'Revitalize and Brighten Under-Eye Areas',
    heroSubtitle: 'Natural restoration for dark circles and hollows using your own plasma.',
    duration: '1 Hour',
    price: '$220 (Package of 3 for $600)',
    category: 'Medical',
    isMobileAvailable: true,
    description: 'Uses platelet-rich plasma to stimulate cell regeneration, reducing dark circles and under-eye hollows.',
    longDescription: 'PRP for Dark Under-Eye Circles is a targeted treatment that utilizes the powerful growth factors in your own blood to rejuvenate the delicate skin under your eyes. It improves skin thickness, stimulates collagen, and significantly reduces the appearance of dark circles and hollows safely and naturally.',
    image: '/images/svc_prp_face.jpg',
    benefits: [
      'Reduces dark under-eye circles',
      'Improves under-eye hollowness',
      'Stimulates collagen for thicker, firmer skin',
      '100% natural and safe'
    ],
    stepFlow: [
      { title: '1. Consultation (5 min)', desc: 'Assess under-eye concerns and suitability.' },
      { title: '2. Blood Collection (15 min)', desc: 'A small blood sample is drawn.' },
      { title: '3. PRP Preparation (15 min)', desc: 'Centrifuge processing to isolate growth factors.' },
      { title: '4. Precision Injection (20 min)', desc: 'Careful micro-injections of PRP into the tear trough area.' },
      { title: '5. Post-Care (5 min)', desc: 'Soothing and aftercare instructions.' }
    ],
    postCare: [
      'Avoid touching the area for 12 hours',
      'Expect mild swelling or bruising',
      'Avoid strenuous exercise for 24 hours'
    ],
    metaTitle: 'PRP for Dark Under-Eye Circles | RD Harmony Med Spa',
    metaDescription: 'Eliminate dark circles naturally with targeted PRP treatments for the under-eye area. Safe, effective, and minimally invasive.'
  },
  {
    id: 'electrolysis',
    name: 'Electrolysis',
    heroTitle: 'Permanent Hair Removal',
    heroSubtitle: 'Safe, permanent hair removal for all skin and hair types.',
    duration: '15 Minutes+',
    price: 'Starting at $30',
    category: 'Threading & Waxing',
    isMobileAvailable: false,
    description: 'Permanent hair removal suitable for all hair colors and skin types.',
    longDescription: 'Electrolysis is an FDA-approved method for permanent hair removal. It works by targeting each hair follicle individually with a tiny electrical current, destroying its ability to produce hair. It is effective on all skin types and hair colors, making it a versatile option for any area of the body.',
    image: '/images/image_6.jpg',
    benefits: [
      '100% permanent hair removal',
      'Effective on all skin and hair colors',
      'FDA-approved safety for hair removal',
      'Ideal for small, stubborn areas'
    ],
    stepFlow: [
      { title: 'Consultation', desc: 'Assess target area and determine session length.' },
      { title: 'Preparation', desc: 'Cleanse the skin.' },
      { title: 'Treatment', desc: 'Insert a fine probe into the hair follicle and apply current.' },
      { title: 'Soothe', desc: 'Apply calming post-treatment lotion.' }
    ],
    postCare: [
      'Avoid sun exposure on the treated area',
      'Keep the area clean and avoid makeup for 24 hours',
      'Do not pluck or wax between sessions'
    ],
    metaTitle: 'Electrolysis Permanent Hair Removal | RD Harmony Med Spa',
    metaDescription: 'Achieve permanent hair removal with professional Electrolysis at RD Harmony Med Spa. Starting at just $30 for 15 minutes.'
  }
];
