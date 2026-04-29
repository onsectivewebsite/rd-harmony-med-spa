export type ConsentField =
  | { type: 'text'; key: string; label: string; required?: boolean; placeholder?: string }
  | { type: 'date'; key: string; label: string; required?: boolean }
  | { type: 'textarea'; key: string; label: string; required?: boolean; placeholder?: string }
  | { type: 'yesno'; key: string; label: string; required?: boolean }
  | { type: 'checklist'; key: string; label: string; options: string[] }
  | { type: 'note'; text: string };

export interface ConsentTemplate {
  id: string;
  title: string;
  intro: string;
  fields: ConsentField[];
  acknowledgment: string;
}

const COMMON_INTAKE: ConsentField[] = [
  { type: 'text', key: 'full_name', label: 'Full Legal Name', required: true },
  { type: 'date', key: 'dob', label: 'Date of Birth', required: true },
  { type: 'text', key: 'phone', label: 'Phone Number', required: true },
  { type: 'text', key: 'email', label: 'Email Address', required: true },
  { type: 'text', key: 'emergency_name', label: 'Emergency Contact Name', required: true },
  { type: 'text', key: 'emergency_phone', label: 'Emergency Contact Phone', required: true },
  {
    type: 'checklist',
    key: 'medical_conditions',
    label: 'Do you have any of the following? (check all that apply)',
    options: [
      'Diabetes',
      'High blood pressure',
      'Heart condition',
      'Autoimmune disorder',
      'Cancer (current or past)',
      'Epilepsy / seizures',
      'Bleeding disorder',
      'Keloid scarring',
      'Active skin infection',
      'None of the above',
    ],
  },
  { type: 'textarea', key: 'allergies', label: 'List any allergies (medications, foods, latex, topical products)', placeholder: 'e.g. penicillin, latex, lidocaine' },
  { type: 'textarea', key: 'medications', label: 'Current medications (include vitamins, supplements, hormones)', placeholder: 'e.g. metformin, multivitamin' },
  { type: 'yesno', key: 'pregnant_or_breastfeeding', label: 'Are you currently pregnant or breastfeeding?', required: true },
  { type: 'yesno', key: 'photo_consent', label: 'Do you consent to before/after photos for clinical record?', required: true },
];

const SKINCARE_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'recent_retinoid', label: 'Have you used Retin-A, tretinoin, or retinol in the last 7 days?', required: true },
  { type: 'yesno', key: 'recent_peel', label: 'Have you had a chemical peel or laser in the last 14 days?', required: true },
  { type: 'yesno', key: 'recent_sun', label: 'Have you had significant sun exposure or sunburn in the last 7 days?', required: true },
  { type: 'yesno', key: 'isotretinoin_6mo', label: 'Have you taken Accutane / isotretinoin in the last 6 months?', required: true },
  { type: 'yesno', key: 'cold_sores', label: 'Do you have a history of cold sores or herpes simplex?', required: true },
];

const THREADING_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'recent_retinoid', label: 'Have you used Retin-A, tretinoin, or retinol in the last 5 days?', required: true },
  { type: 'yesno', key: 'isotretinoin_6mo', label: 'Have you taken Accutane / isotretinoin in the last 6 months?', required: true },
  { type: 'yesno', key: 'recent_antibiotics', label: 'Are you currently taking antibiotics or steroids?', required: true },
  { type: 'yesno', key: 'recent_facial', label: 'Have you had a facial, peel, or microdermabrasion in the last 48 hours?', required: true },
];

const WAXING_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'isotretinoin_12mo', label: 'Have you taken Accutane / isotretinoin in the last 12 months?', required: true },
  { type: 'yesno', key: 'recent_retinoid', label: 'Have you used Retin-A or tretinoin on the area in the last 7 days?', required: true },
  { type: 'yesno', key: 'recent_sunburn', label: 'Do you have sunburn, cuts, or open lesions on the area to be waxed?', required: true },
  { type: 'yesno', key: 'recent_antibiotics', label: 'Are you currently taking antibiotics or photosensitizing medication?', required: true },
  { type: 'yesno', key: 'numbing_cream', label: 'Will you be using or applying numbing cream prior to service? (we cannot guarantee results if applied)' },
];

const MICRONEEDLING_PRP_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'blood_thinners', label: 'Are you taking blood thinners (aspirin, warfarin, ibuprofen, fish oil)?', required: true },
  { type: 'yesno', key: 'isotretinoin_6mo', label: 'Have you taken Accutane / isotretinoin in the last 6 months?', required: true },
  { type: 'yesno', key: 'cold_sores', label: 'Do you have a history of cold sores or herpes simplex (you may need antiviral prophylaxis)?', required: true },
  { type: 'yesno', key: 'recent_botox', label: 'Have you had Botox or filler in the treatment area in the last 14 days?', required: true },
  { type: 'yesno', key: 'autoimmune', label: 'Do you have any autoimmune or bleeding disorder?', required: true },
  { type: 'yesno', key: 'recent_sun', label: 'Have you had significant sun exposure or tanning in the last 14 days?', required: true },
];

const COSMETIC_TATTOO_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'blood_thinners', label: 'Are you taking blood thinners or aspirin?', required: true },
  { type: 'yesno', key: 'keloid_history', label: 'Do you have a history of keloid or hypertrophic scarring?', required: true },
  { type: 'yesno', key: 'eye_condition', label: 'Do you have any eye conditions (glaucoma, conjunctivitis, recent surgery)?', required: true },
  { type: 'yesno', key: 'prior_pmu', label: 'Have you had prior permanent makeup, microblading, or tattoos in this area?', required: true },
  { type: 'yesno', key: 'metal_allergy', label: 'Do you have any allergies to metals, dyes, or topical anesthetics?', required: true },
  { type: 'yesno', key: 'mri_planned', label: 'Do you have an MRI scheduled in the next 30 days?', required: true },
];

const INJECTABLES_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'neuromuscular', label: 'Do you have a neuromuscular disease (Myasthenia gravis, ALS, Lambert-Eaton)?', required: true },
  { type: 'yesno', key: 'botulinum_allergy', label: 'Have you ever had an allergic reaction to botulinum toxin or albumin?', required: true },
  { type: 'yesno', key: 'blood_thinners', label: 'Are you taking blood thinners (aspirin, warfarin, NSAIDs, fish oil)?', required: true },
  { type: 'yesno', key: 'recent_aminoglycosides', label: 'Are you currently taking aminoglycoside antibiotics?', required: true },
  { type: 'yesno', key: 'planned_surgery', label: 'Do you have any surgery planned in the next 14 days?', required: true },
  { type: 'yesno', key: 'prior_injectables', label: 'Have you had prior neurotoxin or filler treatments?', required: true },
  { type: 'textarea', key: 'expectations', label: 'Briefly describe what you hope to achieve with this treatment' },
];

const IV_INJECTION_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'kidney_liver', label: 'Do you have any kidney or liver disease?', required: true },
  { type: 'yesno', key: 'vein_issues', label: 'Do you have a history of difficult veins, fainting, or needle phobia?', required: true },
  { type: 'yesno', key: 'prior_iv_reaction', label: 'Have you ever had a reaction to IV vitamins, B12, or glutathione?', required: true },
  { type: 'yesno', key: 'g6pd', label: 'Do you have G6PD deficiency? (relevant for high-dose vitamin C)', required: true },
  { type: 'yesno', key: 'thyroid', label: 'Do you have any thyroid condition (relevant for iodine, iron infusions)?', required: true },
  { type: 'yesno', key: 'recent_bloodwork', label: 'Have you had recent bloodwork? (we may request a copy)', required: true },
];

const ELECTROLYSIS_FIELDS: ConsentField[] = [
  ...COMMON_INTAKE,
  { type: 'yesno', key: 'pacemaker', label: 'Do you have a pacemaker, defibrillator, or implanted electrical device?', required: true },
  { type: 'yesno', key: 'metal_implant', label: 'Do you have metal implants in or near the treatment area?', required: true },
  { type: 'yesno', key: 'blood_thinners', label: 'Are you taking blood thinners or have a clotting disorder?', required: true },
  { type: 'yesno', key: 'hormonal', label: 'Are you on any hormonal medication (hormone therapy, birth control)?', required: true },
  { type: 'yesno', key: 'numbing_cream', label: 'Do you plan to apply numbing cream before treatment?' },
];

const ACK_GENERIC = `I confirm that the information I have provided above is true and complete to the best of my knowledge. I understand the nature of the treatment, its risks, benefits, and possible side effects (which may include but are not limited to: temporary redness, swelling, bruising, sensitivity, pigmentation changes, infection, and rare allergic reactions). I have had the opportunity to ask questions, and I voluntarily consent to receive the treatment. I release RD Harmony Med Spa and its staff from liability arising from undisclosed medical conditions, allergies, or failure to follow post-care instructions.`;

const ACK_INJECTABLES = `I confirm that the information I have provided above is true and complete to the best of my knowledge. I have been informed of the nature of neurotoxin treatment, the expected results, alternatives (including no treatment), and risks which include but are not limited to: bruising, swelling, headache, asymmetry, ptosis (eyelid droop), dry eye, infection, allergic reaction, and the possibility that results may be less than expected and require touch-ups (which may incur additional cost). I understand results are not permanent and typically last 3-4 months. I voluntarily consent to receive this treatment and release RD Harmony Med Spa and its staff from liability arising from undisclosed medical conditions or failure to follow post-care.`;

const ACK_IV = `I confirm that the information I have provided above is true and complete to the best of my knowledge. I understand that IV therapy and vitamin injections carry risks including but not limited to: bruising, infection at the injection site, vein irritation, allergic reaction, dizziness, and electrolyte imbalance. I understand that IV therapy is not a substitute for medical care and that I should consult my physician for any underlying medical conditions. I voluntarily consent to this treatment and release RD Harmony Med Spa and its staff from liability arising from undisclosed medical conditions.`;

export const TEMPLATES: Record<string, ConsentTemplate> = {
  skincare: {
    id: 'skincare',
    title: 'Skincare Treatment Consent',
    intro: 'Please complete this form before your facial or skincare treatment. Your honest answers help us deliver safe, effective results.',
    fields: SKINCARE_FIELDS,
    acknowledgment: ACK_GENERIC,
  },
  threading: {
    id: 'threading',
    title: 'Threading Service Consent',
    intro: 'Please complete this form before your threading appointment.',
    fields: THREADING_FIELDS,
    acknowledgment: ACK_GENERIC,
  },
  waxing: {
    id: 'waxing',
    title: 'Waxing Service Consent',
    intro: 'Please complete this form before your waxing appointment.',
    fields: WAXING_FIELDS,
    acknowledgment: ACK_GENERIC,
  },
  'microneedling-prp': {
    id: 'microneedling-prp',
    title: 'Microneedling / PRP Consent',
    intro: 'This treatment involves controlled skin trauma. Please answer all questions thoroughly.',
    fields: MICRONEEDLING_PRP_FIELDS,
    acknowledgment: ACK_GENERIC,
  },
  'cosmetic-tattoo': {
    id: 'cosmetic-tattoo',
    title: 'Cosmetic Tattoo / Microblading Consent',
    intro: 'Permanent makeup involves the deposit of pigment into the skin. Please answer all questions thoroughly.',
    fields: COSMETIC_TATTOO_FIELDS,
    acknowledgment: ACK_GENERIC,
  },
  injectables: {
    id: 'injectables',
    title: 'Neurotoxin Injectable Consent (Botox / Dysport / Xeomin)',
    intro: 'Neurotoxin treatment is a medical procedure. Please complete all sections fully and honestly.',
    fields: INJECTABLES_FIELDS,
    acknowledgment: ACK_INJECTABLES,
  },
  'iv-injection': {
    id: 'iv-injection',
    title: 'IV Therapy / Vitamin Injection Consent',
    intro: 'Please complete this form before your IV or injection appointment.',
    fields: IV_INJECTION_FIELDS,
    acknowledgment: ACK_IV,
  },
  electrolysis: {
    id: 'electrolysis',
    title: 'Electrolysis Hair Removal Consent',
    intro: 'Please complete this form before your electrolysis appointment.',
    fields: ELECTROLYSIS_FIELDS,
    acknowledgment: ACK_GENERIC,
  },
};

const SERVICE_TO_TEMPLATE: Record<string, string> = {
  'free-consult': '',
  'regular-facial': 'skincare',
  'hydrafacial': 'skincare',
  'oxygeneo-facial': 'skincare',
  'microdermabrasion': 'skincare',
  'dermaplanning': 'skincare',
  'chemical-peel': 'skincare',
  'threading-eyebrow': 'threading',
  'threading-upper-lips': 'threading',
  'threading-forehead': 'threading',
  'threading-chin': 'threading',
  'threading-cheeks': 'threading',
  'threading-full-face': 'threading',
  'waxing-full-arm': 'waxing',
  'waxing-half-arm': 'waxing',
  'waxing-full-leg': 'waxing',
  'waxing-half-leg': 'waxing',
  'waxing-underarms': 'waxing',
  'waxing-brazilian': 'waxing',
  'waxing-brazilian-numbing': 'waxing',
  'microneedling': 'microneedling-prp',
  'prp-face': 'microneedling-prp',
  'prp-hair': 'microneedling-prp',
  'microneedling-boosters': 'microneedling-prp',
  'prp-under-eye': 'microneedling-prp',
  'nano-ombre-brows': 'cosmetic-tattoo',
  'botox': 'injectables',
  'xeomin': 'injectables',
  'dysport': 'injectables',
  'iv-vitamin-wellness': 'iv-injection',
  'iv-vitamin-mag-cal': 'iv-injection',
  'iv-glutathione': 'iv-injection',
  'iv-glutathione-vit-c': 'iv-injection',
  'iv-calories-burn': 'iv-injection',
  'iv-iron-infusion': 'iv-injection',
  'vit-b12-injection': 'iv-injection',
  'vit-d-injection': 'iv-injection',
  'lipotropic-injection': 'iv-injection',
  'electrolysis': 'electrolysis',
};

export function templateForServiceId(serviceId: string): ConsentTemplate | null {
  const tplId = SERVICE_TO_TEMPLATE[serviceId];
  if (!tplId) return null;
  return TEMPLATES[tplId] || null;
}

export function templateForServiceName(serviceName: string): { id: string; template: ConsentTemplate | null } {
  const norm = serviceName.trim().toLowerCase();
  for (const [id, tplId] of Object.entries(SERVICE_TO_TEMPLATE)) {
    if (id.replace(/-/g, ' ') === norm) {
      return { id, template: tplId ? TEMPLATES[tplId] : null };
    }
  }
  if (norm.includes('facial') || norm.includes('peel') || norm.includes('hydrafacial') || norm.includes('microderm') || norm.includes('dermaplan')) {
    return { id: '', template: TEMPLATES.skincare };
  }
  if (norm.includes('threading')) return { id: '', template: TEMPLATES.threading };
  if (norm.includes('waxing')) return { id: '', template: TEMPLATES.waxing };
  if (norm.includes('microneedling') || norm.includes('prp')) return { id: '', template: TEMPLATES['microneedling-prp'] };
  if (norm.includes('brow') && norm.includes('ombre')) return { id: '', template: TEMPLATES['cosmetic-tattoo'] };
  if (norm.includes('botox') || norm.includes('xeomin') || norm.includes('dysport')) return { id: '', template: TEMPLATES.injectables };
  if (norm.includes(' iv ') || norm.startsWith('iv ') || norm.includes('vitamin') || norm.includes('injection') || norm.includes('infusion') || norm.includes('glutathione') || norm.includes('lipotropic')) {
    return { id: '', template: TEMPLATES['iv-injection'] };
  }
  if (norm.includes('electrolysis')) return { id: '', template: TEMPLATES.electrolysis };
  if (norm.includes('consultation')) return { id: '', template: null };
  return { id: '', template: null };
}
