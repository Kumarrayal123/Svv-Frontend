import { useState } from "react";
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  HeartPulse,
  Phone,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  X,
} from "lucide-react";
import { CLINIC } from "./clinic-info";

// --- Precise Outline SVG Medical Icons Matching the User's Screenshot ---

function GeneralSurgeryIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 36 L26 22 L22 18 L8 32 Z" />
      <path d="M22 18 L32 8 C33 7 35 7 36 8 C37 9 37 11 36 12 L26 22" />
      <path d="M10 34 L6 38 C5 39 5 41 6 42 C7 43 9 43 10 42 L14 38" />
      <circle cx="34" cy="14" r="7" className="stroke-primary" fill="white" strokeWidth="2" />
      <path d="M34 11 v6 M31 14 h6" strokeWidth="2" stroke="currentColor" />
    </svg>
  );
}

function PlasticSurgeryIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16 C16 10 20 6 24 6 C28 6 32 10 32 16 C32 24 30 29 27 33 C26 34.5 24 36 24 36 C24 36 22 34.5 21 33 C18 29 16 24 16 16 Z" />
      <path d="M17 14 C19 11 23 11 24 13 C25 11 29 11 31 14" />
      <path d="M20 19 h0.01 M28 19 h0.01" strokeWidth="3" />
      <path d="M24 21 v3 h-1" />
      <path d="M22 28 C23 29 25 29 26 28" />
      <path d="M13 18 L10 18 M13 24 L9 24 M14 30 L11 31" strokeDasharray="1.5 2" />
      <path d="M35 18 L38 18 M35 24 L39 24 M34 30 L37 31" strokeDasharray="1.5 2" />
    </svg>
  );
}

function UrologyIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 12 C13 12 11 15 11 19 C11 24 14 26 17 26 C19 26 19 23 18 20 C17.5 17 18.5 14 17 12 Z" />
      <path d="M31 12 C35 12 37 15 37 19 C37 24 34 26 31 26 C29 26 29 23 30 20 C30.5 17 29.5 14 31 12 Z" />
      <path d="M17 25 C17 31 21 33 22 36" />
      <path d="M31 25 C31 31 27 33 26 36" />
      <path d="M21 36 C21 35 27 35 27 36 C28 39 27 42 24 42 C21 42 20 39 21 36 Z" />
    </svg>
  );
}

function CardiologyIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 39 C24 39 8 28 8 18 C8 12.5 12.5 8 18 8 C21 8 23 9.5 24 11 C25 9.5 27 8 30 8 C35.5 8 40 12.5 40 18 C40 28 24 39 24 39 Z" />
      <path d="M14 22 L19 22 L21 16 L24 28 L27 18 L29 23 L34 23" strokeWidth="2.4" />
    </svg>
  );
}

function GastroIntestinalIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 14 C18 10 30 10 34 14 C35 17 34 21 30 22 C26 23 18 23 15 20 C13 18 13 16 14 14 Z" />
      <path d="M28 14 C31 16 35 20 34 26 C33 32 28 35 22 34 C18 33 17 29 19 25 C20 22 23 20 23 16" />
      <path d="M22 34 C22 38 27 39 29 37 C31 35 30 32 27 32" />
    </svg>
  );
}

function OncologyIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 8 C20 8 17 12 17 17 C17 22 21 27 24 31 L32 40 M24 8 C28 8 31 12 31 17 C31 22 27 27 24 31 L16 40" />
      <path d="M20 36 L17 40 M28 36 L31 40" />
    </svg>
  );
}

function OphthalmologyIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 24 C14 15 34 15 40 24 C34 33 14 33 8 24 Z" />
      <circle cx="24" cy="24" r="6" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
    </svg>
  );
}

function OrthopaedicsIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 8 v8 C20 16 18 18 19 21 C20 23 22 23 23 21 L24 20 L25 21 C26 23 28 23 29 21 C30 18 28 16 26 16 v-8 Z" />
      <path d="M22 40 v-8 C20 32 18 30 19 27 C20 25 22 25 23 27 L24 28 L25 27 C26 25 28 25 29 27 C30 30 28 32 26 32 v8 Z" />
      <path d="M14 18 C11 22 11 26 14 30" />
      <path d="M34 18 C37 22 37 26 34 30" />
    </svg>
  );
}

function NeurosurgeryIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 10 C18 10 13 14 13 21 C11 23 10 27 12 30 C13 33 16 35 18 35 C19 37 22 38 24 38 C26 38 29 37 30 35 C32 35 35 33 36 30 C38 27 37 23 35 21 C35 14 30 10 24 10 Z" />
      <path d="M24 10 v28" strokeDasharray="3 3" />
      <path d="M18 17 C21 18 21 23 17 24 C14 25 15 28 18 29" />
      <path d="M30 17 C27 18 27 23 31 24 C34 25 33 28 30 29" />
      <path d="M21 34 C21 31 23 29 24 29 C25 29 27 31 27 34" />
    </svg>
  );
}

function GynaecologyIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 36 L24 28 C27 26 30 23 29 18 C28 14 24 14 24 14 C24 14 20 14 19 18 C18 23 21 26 24 28" />
      <path d="M19 18 C16 16 11 16 10 19 C9 22 12 25 15 24" />
      <circle cx="12" cy="22" r="3" />
      <path d="M29 18 C32 16 37 16 38 19 C39 22 36 25 33 24" />
      <circle cx="36" cy="22" r="3" />
      <path d="M22 36 h4 v4 h-4 Z" />
    </svg>
  );
}

function PainManagementIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16 h14 v19 C30 37 28 39 26 39 h-6 C18 39 16 37 16 35 Z" />
      <path d="M18 12 h10 v4 h-10 Z" />
      <path d="M23 23 v6 M20 26 h6" strokeWidth="2" />
      <rect x="31" y="27" width="6" height="12" rx="3" transform="rotate(-30 31 27)" />
      <line x1="32" y1="32" x2="38" y2="29" strokeWidth="1.8" />
    </svg>
  );
}

// --- 4 Main Medical Services Categories Requested by User ---

type MedicalCategory = {
  id: string;
  title: string;
  icon: typeof Stethoscope;
  iconColor: string;
  badge: string;
  description: string;
  items: string[];
};

const MEDICAL_CATEGORIES: MedicalCategory[] = [
  {
    id: "general-medical-care",
    title: "General Medical Care",
    icon: Stethoscope,
    iconColor: "text-[#046FB7]",
    badge: "Primary Consultation",
    description: "Comprehensive medical evaluation and fast-acting relief for acute symptoms, seasonal infections, and common illnesses.",
    items: [
      "Fever",
      "Cold and Cough",
      "Sore Throat",
      "Flu and Viral Illnesses",
      "Body Pains",
      "Headache",
      "Common Infections",
    ],
  },
  {
    id: "digestive-health",
    title: "Digestive Health",
    icon: Activity,
    iconColor: "text-[#1AAF99]",
    badge: "Gastro & Nutrition",
    description: "Expert diagnostic care and targeted therapy for gastrointestinal discomfort, acid reflux, and acute stomach disorders.",
    items: [
      "Loose Motions and Diarrhea",
      "Vomiting",
      "Constipation",
      "Acidity",
      "Gastritis",
      "Indigestion",
      "Food Poisoning",
    ],
  },
  {
    id: "other-health-concerns",
    title: "Other Health Concerns",
    icon: Sparkles,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badge: "Wellness & Lifestyle",
    description: "Holistic primary care and specialized evaluations for endocrine, dermatological, and lifestyle-related conditions.",
    items: [
      "Urinary Tract Infections",
      "Skin Allergies and Rashes",
      "Dehydration",
      "PCOD",
      "Obesity",
      "Hair Fall",
    ],
  },
  {
    id: "clinical-support-services",
    title: "Clinical and Support Services",
    icon: Syringe,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: "Procedure & Rehab",
    description: "Complete in-clinic procedural assistance, emergency first aid, physical rehabilitation, and on-site support services.",
    items: [
      "First Aid",
      "Wound Care and Dressings",
      "IV and IM Injections",
      "Saline Administration",
      "Physiotherapy and Rehabilitation",
      "Diagnostic Services",
      "Minor Procedures",
    ],
  },
];

// --- 12 Specialties matching the previous figure ---

type Specialty = {
  id: string;
  title: string;
  icon: typeof GeneralSurgeryIcon;
  description: string;
  commonTreatments: string[];
  doctorInCharge: string;
};

const SPECIALTIES: Specialty[] = [
  {
    id: "general-surgery",
    title: "General Surgery",
    icon: GeneralSurgeryIcon,
    description: "Surgical evaluations and treatments for acute and chronic conditions, skin excisions, trauma, and elective procedures.",
    commonTreatments: ["Appendectomy", "Hernia Repair", "Gallbladder Stones", "Minor Abscess Drainage", "Lipoma & Cyst Excision"],
    doctorInCharge: "Dr. Vamshi Krishna",
  },
  {
    id: "plastic-surgery",
    title: "Plastic Surgery",
    icon: PlasticSurgeryIcon,
    description: "Reconstructive, corrective, and aesthetic clinical evaluations to restore form, function, and aesthetic confidence.",
    commonTreatments: ["Scar Revision", "Mole & Keloid Removal", "Facial Trauma Reconstruction", "Burn Care", "Aesthetic Skin Consultations"],
    doctorInCharge: "Dr. Vamshi Krishna",
  },
  {
    id: "urology",
    title: "Urology",
    icon: UrologyIcon,
    description: "Comprehensive medical and clinical care for kidneys, ureters, urinary bladder, and male reproductive tract.",
    commonTreatments: ["Kidney Stones", "Urinary Tract Infections (UTI)", "Prostate Enlargement", "Urine Incontinence", "Hematuria Evaluation"],
    doctorInCharge: "Dr. S. Karunakar",
  },
  {
    id: "cardiology",
    title: "Cardiology",
    icon: CardiologyIcon,
    description: "Preventive and diagnostic cardiac assessments, blood pressure control, heart rhythm evaluations, and lifestyle therapy.",
    commonTreatments: ["Hypertension Management", "ECG Assessments", "Cholesterol / Lipid Profiling", "Chest Pain Screening", "Cardiovascular Risk Analysis"],
    doctorInCharge: "Dr. S. Karunakar",
  },
  {
    id: "gastro-surgery",
    title: "GastroIntestinal Surgery",
    icon: GastroIntestinalIcon,
    description: "Specialized care for disorders of the stomach, intestines, colon, liver, pancreas, and gastrointestinal tract.",
    commonTreatments: ["Severe Acidity & GERD", "Piles, Fissures & Fistula Care", "Gallbladder Disorders", "Intestinal Obstruction", "Irritable Bowel Syndrome"],
    doctorInCharge: "Dr. Vamshi Krishna",
  },
  {
    id: "oncology",
    title: "Oncology",
    icon: OncologyIcon,
    description: "Early preventative cancer screenings, secondary opinions, symptom evaluations, and supportive oncology care.",
    commonTreatments: ["Preventive Health Screenings", "Biopsy & Scan Interpretation", "Symptom Investigations", "Second Opinions", "Supportive Palliative Care"],
    doctorInCharge: "Dr. S. Karunakar & Specialists",
  },
  {
    id: "ophthalmology",
    title: "Ophthalmology",
    icon: OphthalmologyIcon,
    description: "Primary visual health checks, eye infections, ocular strain assessments, and specialist referrals.",
    commonTreatments: ["Vision & Refraction Checks", "Conjunctivitis & Eye Allergies", "Digital Eye Strain", "Cataract Evaluations", "Dry Eyes Treatment"],
    doctorInCharge: "Dr. Abhigna Jupaka",
  },
  {
    id: "orthopaedics",
    title: "Orthopaedics",
    icon: OrthopaedicsIcon,
    description: "Treatment for bones, joints, ligaments, spine, and musculoskeletal conditions from injury to degenerative arthritis.",
    commonTreatments: ["Knee & Joint Pain", "Spine & Lumbar Strain", "Arthritis Management", "Sports Injuries & Sprains", "Fracture Assessment & Splinting"],
    doctorInCharge: "Dr. Vamshi Krishna",
  },
  {
    id: "neurosurgery",
    title: "Neurosurgery",
    icon: NeurosurgeryIcon,
    description: "Specialized clinical diagnosis and management of brain, spine, nerve disorders, sciatica, and cranial trauma.",
    commonTreatments: ["Slip Disc & Sciatica", "Chronic Severe Headaches & Migraines", "Spinal Trauma & Pain", "Nerve Compression Syndromes", "Post-Trauma Guidance"],
    doctorInCharge: "Dr. Vamshi Krishna",
  },
  {
    id: "gynaecology",
    title: "Gynaecology",
    icon: GynaecologyIcon,
    description: "Dedicated healthcare for women across all stages of life, from adolescent health to pregnancy care and menopause.",
    commonTreatments: ["PCOD / PCOS Management", "Menstrual Irregularities", "Pre-Natal & Post-Natal Guidance", "Pelvic Pain Consultations", "Cervical & Breast Screenings"],
    doctorInCharge: "Dr. Abhigna Jupaka",
  },
  {
    id: "pain-management",
    title: "Pain Management",
    icon: PainManagementIcon,
    description: "Multidisciplinary management for chronic, post-surgical, neurological, and degenerative pain conditions.",
    commonTreatments: ["Chronic Back & Neck Pain", "Joint Pain Injections", "Nerve Pain (Neuropathy)", "Fibromyalgia Care", "Post-Surgical Pain Relief"],
    doctorInCharge: "Dr. S. Karunakar",
  },
];

export function Services() {
  const [activeTab, setActiveTab] = useState<"medical-services" | "specialties">("medical-services");
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [viewAllModalOpen, setViewAllModalOpen] = useState(false);

  return (
    <section id="services" className="scroll-mt-20 bg-muted/30 py-4 sm:py-6 lg:py-7">
      <div className="section-shell">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Clinical Services &amp; Specialities</p>
            <h2 className="section-title mt-2 sm:mt-3">
              Comprehensive Medical Services <span className="text-primary">Under One Roof</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
              {CLINIC.name} provides integrated everyday outpatient medical care, timely symptomatic relief, and
              consultations with qualified specialists in Madhapur, Hyderabad.
            </p>
          </div>

          {/* Segmented View Switcher */}
          <div className="inline-flex rounded-2xl bg-muted p-1.5 border border-border/70 self-start md:self-auto shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab("medical-services")}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "medical-services"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Everyday Medical Services
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("specialties")}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "specialties"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Specialities &amp; Surgeries
            </button>
          </div>
        </div>

        {/* --- VIEW 1: Spacious Grouped Medical Services (Requested in latest prompt) --- */}
        {activeTab === "medical-services" && (
          <div className="mt-6 sm:mt-8 space-y-6 animate-in fade-in duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              {MEDICAL_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-border/50 bg-card/80 p-7 sm:p-9 shadow-xs backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:bg-card hover:shadow-lg"
                  >
                    <div>
                      {/* Category Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent ${cat.iconColor} border border-border/40 shadow-2xs`}>
                            <Icon className="h-6 w-6" aria-hidden="true" />
                          </span>
                          <div>
                            <h3 className="text-xl font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                              {cat.title}
                            </h3>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                              {cat.badge}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {cat.description}
                      </p>

                      {/* Spacious Checkmark List (No heavy borders) */}
                      <div className="mt-6 border-t border-border/40 pt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                          Treatments &amp; Conditions Covered:
                        </p>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {cat.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground/90 transition-colors hover:text-primary"
                            >
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Check className="h-3 w-3 stroke-[3]" />
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Booking Prompt */}
                    <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
                      <a
                        href="#appointment"
                        className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline group-hover:translate-x-1 transition-transform"
                      >
                        Book Consultation for {cat.title}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                      <a
                        href={CLINIC.phoneHref}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Call Desk
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Teaser for Specialities */}
            <div className="rounded-3xl border border-sky-200 bg-[#E2F2FB]/70 dark:bg-[#074A74]/20 dark:border-sky-800 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-extrabold text-[#074A74] dark:text-sky-200">
                  Looking for specialist consultations (Urology, Cardiology, Surgery, etc.)?
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  We also host regular specialist OPDs and surgical pre/post evaluations right here in Madhapur.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("specialties")}
                className="btn-primary shrink-0 py-2.5 px-5 text-xs font-bold"
              >
                View 12 Speciality Departments
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 2: 6-Column Specialities Grid Matching the Figure --- */}
        {activeTab === "specialties" && (
          <div className="mt-12 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4.5">
              {SPECIALTIES.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedSpecialty(item)}
                    className="group relative flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-4 sm:p-5 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-md active:scale-[0.98] min-h-[155px] sm:min-h-[175px]"
                    aria-label={`View details for ${item.title}`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center text-[#046FB7] transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-10 w-10 text-[#046FB7] transition-colors group-hover:text-primary" />
                    </div>
                    <h3 className="mt-3.5 text-xs sm:text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-primary leading-snug">
                      {item.title}
                    </h3>
                  </button>
                );
              })}

              {/* 12th Highlighted Card: "View All Specialities By SVV Clinic" */}
              <div
                onClick={() => setViewAllModalOpen(true)}
                className="group flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border border-sky-200 bg-[#E2F2FB] dark:bg-[#074A74]/30 dark:border-sky-800 p-4 sm:p-5 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-md cursor-pointer min-h-[155px] sm:min-h-[175px]"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setViewAllModalOpen(true);
                }}
                aria-label="View all specialities offered by SVV Clinic"
              >
                <h3 className="text-xs sm:text-sm font-extrabold text-[#074A74] dark:text-sky-200 leading-snug">
                  View All Specialities By SVV Clinic
                </h3>
                <button
                  type="button"
                  className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#046FB7] bg-white px-3.5 py-1 text-xs font-bold text-[#046FB7] shadow-2xs transition-all hover:bg-[#046FB7] hover:text-white group-hover:scale-105"
                >
                  View All
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setActiveTab("medical-services")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                ← Return to Everyday Medical Services
              </button>
            </div>
          </div>
        )}

        {/* Quick Consultation Ribbon */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Need guidance on the right treatment or specialist?</p>
              <p className="text-xs text-muted-foreground">Our clinic reception in Madhapur is open all 7 days to assist you.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a href={CLINIC.phoneHref} className="btn-secondary w-full sm:w-auto py-2.5 px-4 text-xs font-bold">
              <Phone className="h-3.5 w-3.5 text-primary" />
              {CLINIC.phoneDisplay}
            </a>
            <a href="#appointment" className="btn-primary w-full sm:w-auto py-2.5 px-5 text-xs font-bold">
              <CalendarCheck className="h-3.5 w-3.5" />
              Book Consultation
            </a>
          </div>
        </div>
      </div>

      {/* --- Specialty Details Modal --- */}
      {selectedSpecialty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedSpecialty(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedSpecialty(null)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-[#046FB7] border border-border">
                <selectedSpecialty.icon className="h-9 w-9 text-[#046FB7]" />
              </div>
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Speciality</span>
                <h3 className="text-2xl font-extrabold text-foreground">{selectedSpecialty.title}</h3>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {selectedSpecialty.description}
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
              <p className="text-xs font-extrabold uppercase tracking-wider text-foreground">
                Key Treatments &amp; Conditions Managed:
              </p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {selectedSpecialty.commonTreatments.map((treatment) => (
                  <li key={treatment} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-secondary shrink-0" />
                    <span>{treatment}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-accent/70 px-4 py-2.5 text-xs font-semibold text-foreground">
              <span className="text-muted-foreground">Consulting Doctor:</span>
              <span className="font-bold text-primary">{selectedSpecialty.doctorInCharge}</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="#appointment"
                onClick={() => setSelectedSpecialty(null)}
                className="btn-primary w-full py-2.5 text-xs font-bold"
              >
                <CalendarCheck className="h-4 w-4" />
                Book Appointment for {selectedSpecialty.title}
              </a>
              <a
                href={CLINIC.phoneHref}
                className="btn-secondary w-full sm:w-auto py-2.5 px-4 text-xs font-bold"
              >
                <Phone className="h-4 w-4 text-primary" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* --- View All Specialities Directory Modal --- */}
      {viewAllModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setViewAllModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setViewAllModalOpen(false)}
              className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Close directory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-w-xl">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Clinical Directory</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                All Specialities at {CLINIC.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Our clinic connects you to qualified specialists and clinical care under one roof in Madhapur.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {SPECIALTIES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex items-start gap-3.5 rounded-2xl border border-border bg-muted/30 p-3.5 transition-all hover:border-primary/40 hover:bg-muted/60"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-[#046FB7] border border-border shadow-2xs">
                      <Icon className="h-7 w-7 text-[#046FB7]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{item.description}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setViewAllModalOpen(false);
                          setSelectedSpecialty(item);
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        Details &amp; Treatments <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-5">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Need help finding the right department? Contact our desk anytime during clinic hours.
              </p>
              <a
                href="#appointment"
                onClick={() => setViewAllModalOpen(false)}
                className="btn-primary w-full sm:w-auto py-2.5 px-6 text-xs font-bold"
              >
                <CalendarCheck className="h-4 w-4" />
                Book an Appointment
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
