export interface FAQ {
  q: string;
  a: string;
}

export interface StepFlow {
  title: string;
  desc?: string;
}

export interface ServiceOption {
  id: string; // Unique within the service; used to preselect in booking
  name: string; // e.g. "Signature", "Deluxe"
  price: string;
  duration?: string;
  description?: string;
  benefits?: string[]; // Tier-specific highlights shown on the option card
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  price?: string;
  description?: string;
  image?: string;
}

export interface Offer {
  id: string;
  serviceId?: string; // Links to a Service for the "View Treatment" CTA
  title: string; // Promotional/ad name shown to customers
  subtitle?: string; // e.g. the underlying treatment name
  description: string;
  image: string;
  originalPrice?: string; // Struck-through "before" price
  offerPrice: string; // Discounted price
  badge?: string; // e.g. "Limited Time Offer"
  highlights?: string[];
}

export interface Service {
  id: string;
  name: string;
  heroTitle?: string;
  heroSubtitle?: string;
  duration: string;
  price: string;
  promoPrice?: string;
  originalPrice?: string;
  category: 'Treatment' | 'Consultation' | 'Injection' | 'IV Therapy' | 'Skincare' | 'Other' | 'Threading & Waxing' | 'Medical' | 'Injectables';
  description?: string;
  options?: ServiceOption[]; // Price tiers / packages (e.g. Signature vs Deluxe)
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
  active?: boolean;
  sortOrder?: number;
}
