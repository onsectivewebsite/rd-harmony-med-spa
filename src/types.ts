export interface FAQ {
  q: string;
  a: string;
}

export interface StepFlow {
  title: string;
  desc?: string;
}

export interface Service {
  id: string;
  name: string;
  heroTitle?: string;
  heroSubtitle?: string;
  duration: string;
  price: string;
  category: 'Treatment' | 'Consultation' | 'Injection' | 'IV Therapy' | 'Skincare' | 'Other' | 'Threading & Waxing' | 'Medical' | 'Injectables';
  description?: string;
  isMobileAvailable?: boolean;
  image?: string;
  benefits?: string[];
  details?: string[];
  idealFor?: string[]; // Target Audience: Skin types, conditions
  longDescription?: string; // Overview: What treatment is, Why it's effective
  experience?: string;
  postCare?: string[]; // Aftercare: Detailed instructions
  whyChooseUs?: string;
  technology?: string; // Technology / Products Used
  productsUsed?: string;
  faqs?: FAQ[];
  recovery?: string; // Timeline / Downtime
  downtime?: string;
  results?: string; // Expected results
  stepFlow?: StepFlow[]; // How it works (Step Flow UI)
  frequency?: string; // Recommended frequency
  metaTitle?: string; // SEO Meta Title
  metaDescription?: string; // SEO Meta Description
  skinConcern?: ('Acne' | 'Anti-aging' | 'Pigmentation' | 'Hair Loss' | 'Dryness' | 'General Wellness' | 'Uneven Tone' | 'Dullness')[]; // For Filtering
  testimonials?: { quote: string; author: string }[];
  precautions?: string[];
}
