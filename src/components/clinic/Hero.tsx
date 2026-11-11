import {
  ArrowRight,
  BarChart3,
  Calendar,
  Clock,
  Heart,
  Phone,
  ShieldCheck,
  Star,
  UserCheck,
} from "lucide-react";
import { CLINIC } from "./clinic-info";
import { useContent } from "@/lib/content-context";
import heroDoctorCare from "@/assets/hero-doctor-care.jpg";
import drKarunakar from "@/assets/dr-karunakar.jpg";
import drAbhigna from "@/assets/dr-abhigna.jpg";
import drVamshi from "@/assets/dr-vamshi.jpg";

export function Hero() {
  const { content } = useContent();
  const hero = content.hero;
  const clinic = content.clinicInfo || CLINIC;

  return (
    <section id="home" className="relative overflow-hidden bg-background pt-2 pb-3 sm:pt-3 sm:pb-5 lg:pt-3 lg:pb-6">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/4 h-[32rem] w-[32rem] rounded-full bg-secondary/8 blur-3xl" />

      <div className="section-shell">
        <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* --- LEFT COLUMN: Typography, CTAs & Social Proof --- */}
          <div className="flex flex-col items-start">
            {/* Top Eyebrow with Dot */}
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[#1AAF99] animate-pulse" />
              <span>{hero?.badge || "Better Care. Brighter Tomorrows."}</span>
            </div>

            {/* Main Headline - Fluid on Mobile & Desktop */}
            <h1 className="mt-2.5 sm:mt-3 text-3xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-extrabold tracking-tight text-foreground leading-[1.12] sm:leading-[1.08]">
              {hero?.titleLine1 || "Healthcare"} <br />
              <span className="font-serif italic font-normal text-[#1AAF99] pr-1">Made</span>{" "}
              <span className="text-foreground">{hero?.titleLine2 || "Human"}</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3 sm:mt-4 max-w-lg text-sm sm:text-lg leading-relaxed text-muted-foreground">
              {hero?.description || `Accessible. Affordable. Personalized healthcare for you and your loved ones in ${clinic.area}.`}
            </p>

            {/* CTA Buttons - Full Width Stack on Mobile, Row on Tablets/Desktop */}
            <div className="mt-5 sm:mt-6 flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#074A74] px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-[#046FB7] hover:shadow-lg active:scale-[0.98]"
              >
                <span>{hero?.primaryCta || "Book an Appointment"}</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={clinic.phoneHref}
                className="inline-flex items-center justify-center gap-2.5 rounded-full border border-border bg-white/90 dark:bg-card/90 px-5 py-3 text-sm font-bold text-foreground shadow-2xs backdrop-blur-xs transition-all hover:bg-accent active:scale-[0.98]"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1AAF99]/15 text-[#1AAF99]">
                  <Phone className="h-3 w-3" />
                </span>
                <span>{hero?.secondaryCta || "Call Clinic Desk"}</span>
              </a>
            </div>

            {/* Patient Trust Indicators */}
            <div className="mt-5 sm:mt-6 flex items-center gap-3 select-none">
              <div className="flex -space-x-2 overflow-hidden py-0.5">
                <img
                  src={drKarunakar}
                  alt="Dr. S. Karunakar"
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-background object-cover"
                />
                <img
                  src={drAbhigna}
                  alt="Dr. Abhigna Jupaka"
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-background object-cover"
                />
                <img
                  src={drVamshi}
                  alt="Dr. Vamshi Krishna"
                  className="inline-block h-8 w-8 sm:h-9 sm:w-9 rounded-full ring-2 ring-background object-cover"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-foreground">4.9</span>
                </div>
                <span className="text-[11px] font-medium text-muted-foreground">
                  Rated by 1,200+ families
                </span>
              </div>
            </div>

            {/* Micro Highlights Pill Row */}
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-muted-foreground border-t border-border/60 pt-4 w-full">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[#1AAF99]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold text-foreground/90 leading-tight">
                  Certified <br className="hidden sm:inline" /> Doctors
                </span>
              </div>

              <div className="h-5 w-px bg-border/80 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[#1AAF99]">
                  <Clock className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold text-foreground/90 leading-tight">
                  Open 7 Days <br className="hidden sm:inline" /> a Week
                </span>
              </div>

              <div className="h-5 w-px bg-border/80 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[#1AAF99]">
                  <Calendar className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold text-foreground/90 leading-tight">
                  Easy <br className="hidden sm:inline" /> Scheduling
                </span>
              </div>
            </div>

            {/* Artistic Handwritten Flourish */}
            <div className="mt-4 sm:mt-5 relative select-none">
              <p className="font-serif italic text-sm sm:text-base lg:text-lg font-medium text-muted-foreground/75 tracking-wide -rotate-6">
                Healthier <br /> Happier You
              </p>
              <svg className="absolute -bottom-2 left-12 sm:left-14 w-16 sm:w-20 h-4 sm:h-5 text-[#1AAF99]/60" viewBox="0 0 100 24" fill="none">
                <path d="M4 14 C25 22 55 -2 75 14 C85 22 92 8 98 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Responsive Doctor Visual & Floating Cards --- */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Base Doctor Image Frame */}
            <div className="relative aspect-[4/3] sm:aspect-[1.12/1] w-full overflow-hidden rounded-2xl sm:rounded-[2.2rem] bg-muted shadow-lg sm:shadow-xl border border-border/60">
              <img
                src={hero?.careImage || hero?.heroImage || heroDoctorCare}
                alt="Doctor consulting patient warmly at SVV Clinic"
                className="h-full w-full object-cover object-[center_20%]"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

              {/* Handwritten Quote in Image Background */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 hidden sm:block select-none">
                <p className="font-serif italic text-xs sm:text-sm font-semibold text-white/90 drop-shadow-md tracking-wide text-right leading-snug">
                  A healthier <br />
                  tomorrow, <br />
                  together
                </p>
              </div>

              {/* --- FLOATING CARD 1: Top-Left --- */}
              <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl bg-white/95 dark:bg-card/95 p-2 sm:p-3 shadow-md backdrop-blur-md border border-white/70 dark:border-border max-w-[165px] sm:max-w-[200px]">
                <div className="flex h-7 w-7 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-[#1AAF99]/15 text-[#1AAF99]">
                  <Heart className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 fill-[#1AAF99]/25" />
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-extrabold text-foreground leading-tight">Compassionate Care</p>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 leading-tight">Every Step of the Way</p>
                </div>
              </div>

              {/* --- FLOATING CARD 4: Bottom-Right --- */}
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-4 sm:right-4 z-20 rounded-xl sm:rounded-2xl bg-[#E6FAF6]/95 dark:bg-teal-950/90 p-2 sm:p-3.5 shadow-md border border-teal-100 dark:border-teal-900 backdrop-blur-md">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#1AAF99]" />
                  <div>
                    <p className="text-[11px] sm:text-xs font-extrabold text-foreground leading-none">20k+</p>
                    <p className="text-[8px] sm:text-[9px] font-semibold text-muted-foreground mt-0.5">Patients Trust SVV Clinic</p>
                  </div>
                </div>
                <div className="mt-1.5 sm:mt-2 flex items-end gap-1 h-3.5 sm:h-5 pl-0.5">
                  <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 bg-[#1AAF99]/30 rounded-full" />
                  <div className="w-1 sm:w-1.5 h-1.5 sm:h-2.5 bg-[#1AAF99]/40 rounded-full" />
                  <div className="w-1 sm:w-1.5 h-2.5 sm:h-3.5 bg-[#1AAF99]/60 rounded-full" />
                  <div className="w-1 sm:w-1.5 h-3 sm:h-4 bg-[#1AAF99]/80 rounded-full" />
                  <div className="w-1 sm:w-1.5 h-3.5 sm:h-5 bg-[#1AAF99] rounded-full" />
                </div>
              </div>
            </div>

            {/* --- FLOATING CARD 2: Middle-Right --- */}
            <div className="hidden sm:block absolute top-16 right-0 lg:-right-4 z-20 w-[210px] sm:w-[220px] rounded-2xl bg-white/95 dark:bg-card/95 p-3.5 shadow-xl backdrop-blur-md border border-white/70 dark:border-border">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-foreground">
                <Calendar className="h-3.5 w-3.5 text-[#046FB7]" />
                <span>Your Next Appointment</span>
              </div>

              <div className="mt-2.5 flex items-center gap-2 rounded-xl bg-muted/50 p-2 border border-border/40">
                <img
                  src={drKarunakar}
                  alt="Dr. S. Karunakar"
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-foreground leading-tight truncate">Dr. S. Karunakar</p>
                  <p className="text-[10px] font-semibold text-[#1AAF99]">General Physician</p>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-semibold text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Mon – Sat
                </span>
                <span>• 10:00 AM – 5:00 PM</span>
              </div>
            </div>

            {/* Floating Specialist Doctor Avatar */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 z-20 items-center gap-2 rounded-2xl bg-white/95 dark:bg-card/95 p-2.5 shadow-lg backdrop-blur-md border border-white/70 dark:border-border">
              <img
                src={drAbhigna}
                alt="Dr. Abhigna Jupaka"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#1AAF99]"
              />
              <div>
                <p className="text-xs font-bold text-foreground leading-tight">Dr. Abhigna Jupaka</p>
                <p className="text-[10px] text-muted-foreground">Family Physician</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
