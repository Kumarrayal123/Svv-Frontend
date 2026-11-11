import { useState, useEffect } from "react";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Clock,
  Eye,
  GraduationCap,
  HeartPulse,
  Leaf,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Star,
  X,
  AlertCircle,
} from "lucide-react";
import { CLINIC, DOCTORS, type Doctor } from "./clinic-info";
import { useContent } from "@/lib/content-context";
import { fetchDoctorsFromTimelyApi, type TimelyDoctor } from "@/lib/api";
import drKarunakar from "@/assets/dr-karunakar.jpg";
import drAbhigna from "@/assets/dr-abhigna.jpg";
import drVamshi from "@/assets/dr-vamshi.jpg";
import heroDoctor from "@/assets/hero-doctor.jpg";

const KNOWN_IMAGES: Record<string, string> = {
  "dr-s-karunakar": drKarunakar,
  "dr-abhigna-jupaka": drAbhigna,
  "dr-vamshi-krishna": drVamshi,
};

/**
 * Standardize doctor names to respectful Title Case with Dr. prefix
 * e.g. "dr.khadeer" -> "Dr. Khadeer", "DR VAMSHI KRISHNA" -> "Dr. Vamshi Krishna"
 */
function formatDoctorName(raw: string): string {
  if (!raw) return "Doctor";
  let clean = raw.trim();
  // Strip any leading Dr. or Dr or dr.
  clean = clean.replace(/^dr[\.\s_]*/i, "").trim();

  const titleCased = clean
    .split(/\s+/)
    .map((part) => {
      if (part.length === 1) return part.toUpperCase() + ".";
      if (/^[a-zA-Z]\.$/.test(part)) return part.toUpperCase();
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ")
    .replace(/\s+/g, " ");

  return `Dr. ${titleCased}`;
}

/**
 * Map doctor photo using known files or graceful fallbacks
 */
function resolveDoctorPhoto(name: string, id: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("karunakar")) return drKarunakar;
  if (lower.includes("abhigna")) return drAbhigna;
  if (lower.includes("vamshi") || lower.includes("vamsi")) return drVamshi;
  if (lower.includes("satyavedam")) return heroDoctor;
  if (KNOWN_IMAGES[id]) return KNOWN_IMAGES[id];
  return heroDoctor;
}

/**
 * Clean experience display
 */
function formatExperience(exp?: number | string): string {
  if (typeof exp === "number") {
    if (exp <= 0) return "Clinical Practitioner";
    return `${exp}+ Years Experience`;
  }
  if (typeof exp === "string" && exp.trim()) {
    if (/^\d+$/.test(exp.trim())) {
      const n = parseInt(exp.trim(), 10);
      return n > 0 ? `${n}+ Years Experience` : "Clinical Practitioner";
    }
    return exp;
  }
  return "Experienced Doctor";
}

/**
 * Clean available days formatting
 */
function formatAvailableDays(days?: string[]): string {
  if (!days || days.length === 0) return "Mon - Sat (By Appointment)";
  if (days.length === 7) return "Mon - Sun (All 7 Days)";
  if (days.length === 6 && !days.includes("Sunday")) return "Mon - Sat";
  return days.map((d) => d.slice(0, 3)).join(", ");
}

/**
 * Generate medical department from specialization
 */
function deriveDepartment(spec: string): string {
  const lower = (spec || "").toLowerCase();
  if (lower.includes("gynec")) return "Obstetrics & Gynecology";
  if (lower.includes("surg")) return "General Surgery";
  if (lower.includes("pediat")) return "Pediatrics";
  if (lower.includes("ortho")) return "Orthopedics";
  if (lower.includes("cardio")) return "Cardiology";
  if (lower.includes("physician") || lower.includes("medicine")) return "General Medicine";
  return spec || "General Healthcare";
}

/**
 * Generate comprehensive bio and focus areas based on doctor profile
 */
function deriveBioAndFocus(doc: {
  name: string;
  specialization: string;
  qualification: string;
  experience: number | string;
}): { bio: string; focusAreas: string[] } {
  const lower = (doc.specialization || "").toLowerCase();
  const name = doc.name;

  if (lower.includes("gynec")) {
    return {
      bio: `${name} is an experienced specialist dedicated to comprehensive women's health, prenatal & antenatal care, reproductive wellness, and compassionate family healthcare.`,
      focusAreas: ["Women's Health", "Obstetric Care", "Reproductive Wellness"],
    };
  }

  if (lower.includes("surg")) {
    return {
      bio: `${name} provides specialist surgical consultations, comprehensive diagnostic assessments, wound management, and pre/post-operative patient guidance.`,
      focusAreas: ["Surgical Assessment", "Pre/Post-Op Care", "Clinical Diagnostics"],
    };
  }

  if (name.toLowerCase().includes("abhigna")) {
    return {
      bio: `${name} specializes in patient-centered primary care, preventive screenings, women's wellness, and personalized lifestyle counseling for all age groups.`,
      focusAreas: ["Preventive Care", "Lifestyle Guidance", "Family Wellness"],
    };
  }

  return {
    bio: `${name} provides dedicated clinical evaluations, acute and chronic disease management, preventive health checkups, and holistic patient-centered primary care.`,
    focusAreas: ["Primary Care", "Chronic Disease Management", "Preventive Health"],
  };
}

/**
 * Map TimelyHealth API payload to Doctor model
 */
function mapTimelyDoctorToDoctor(item: TimelyDoctor): Doctor {
  const formattedName = formatDoctorName(item.name);
  const dept = deriveDepartment(item.specialization);
  const qual = item.qualification && item.qualification.trim().length > 0 ? item.qualification.trim() : "MBBS / Qualified Practitioner";
  const expStr = formatExperience(item.experience);
  const daysStr = formatAvailableDays(item.availableDays);
  const timeStr = item.availableTime && item.availableTime.trim() ? item.availableTime.trim() : "10:00 AM – 8:00 PM";
  const { bio, focusAreas } = deriveBioAndFocus({
    name: formattedName,
    specialization: item.specialization,
    qualification: qual,
    experience: item.experience,
  });

  return {
    id: item._id,
    name: formattedName,
    designation: item.specialization || "Consultant Physician",
    department: dept,
    qualification: qual,
    specialization: item.specialization || "General Medicine",
    experience: expStr,
    availability: `${daysStr} • ${timeStr}`,
    bio,
    focusAreas,
    image: resolveDoctorPhoto(formattedName, item._id),
    consultationFee: item.consultationFee,
    phone: item.phone,
    email: item.email,
    availableDays: item.availableDays,
    availableTime: item.availableTime,
  };
}

export function Doctors() {
  const { content } = useContent();
  const clinic = content.clinicInfo || CLINIC;

  const [doctorsList, setDoctorsList] = useState<Doctor[]>(() => {
    return (content.doctors?.length ? content.doctors : DOCTORS).map((d) => ({
      ...d,
      image: d.image || resolveDoctorPhoto(d.name, d.id),
    }));
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const loadDoctors = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await fetchDoctorsFromTimelyApi();
      if (Array.isArray(data) && data.length > 0) {
        // Filter active doctors (or all if status not marked)
        const activeList = data.filter((d) => !d.status || d.status.toLowerCase() === "active");
        const listToMap = activeList.length > 0 ? activeList : data;
        const mapped = listToMap.map(mapTimelyDoctorToDoctor);
        setDoctorsList(mapped);
      }
    } catch (err: any) {
      console.warn("Could not load doctors from Timely API, falling back to local list:", err);
      setApiError("Unable to load latest doctor schedule from Timely Health server. Showing standard clinic directory.");
      // Keep existing list or fallback to default DOCTORS
      const fallback = (content.doctors?.length ? content.doctors : DOCTORS).map((d) => ({
        ...d,
        image: d.image || resolveDoctorPhoto(d.name, d.id),
      }));
      setDoctorsList(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Close modal on Escape key press and manage body scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDoctor(null);
    };
    if (selectedDoctor) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedDoctor]);

  return (
    <section id="doctors" className="scroll-mt-20 bg-muted/30 py-6 sm:py-8 lg:py-10">
      <div className="section-shell">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="section-eyebrow">Our Doctors</p>
            <h2 className="section-title mt-2 sm:mt-3">
              Experienced Physicians <span className="text-primary">Dedicated to Your Care</span>
            </h2>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-muted-foreground">
              Meet the qualified medical team at {clinic.name}. With decades of combined clinical experience, our doctors
              provide compassionate, evidence-based care for you and your family.
            </p>
          </div>

          {/* Quick Refresh / Status Indicator */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              type="button"
              onClick={loadDoctors}
              disabled={isLoading}
              title="Refresh doctor schedules"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-border bg-white dark:bg-card px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-2xs hover:border-[#0D9488] hover:text-[#0D6E5C] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#0D9488] ${isLoading ? "animate-spin" : ""}`} />
              <span>{isLoading ? "Updating..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {apiError && (
          <div className="mt-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/90 dark:border-amber-900/60 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={loadDoctors}
              className="ml-3 shrink-0 font-bold underline hover:text-amber-950 dark:hover:text-amber-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Doctor Cards Grid */}
        <div className="mt-6 sm:mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading && doctorsList.length === 0 ? (
            // Skeleton Loaders
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xs animate-pulse"
              >
                <div>
                  <div className="aspect-[1.3/1] w-full rounded-xl bg-gray-200" />
                  <div className="mt-3.5 space-y-2">
                    <div className="h-5 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="mt-3 space-y-2">
                      <div className="h-3 w-4/5 rounded bg-gray-200" />
                      <div className="h-3 w-3/5 rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3.5 border-t border-gray-100 flex gap-2">
                  <div className="h-8 flex-1 rounded-full bg-gray-200" />
                  <div className="h-8 flex-[1.8] rounded-full bg-gray-200" />
                </div>
              </div>
            ))
          ) : (
            doctorsList.map((doc) => {
              const photoSrc = doc.image || resolveDoctorPhoto(doc.name, doc.id);
              const fee = doc.consultationFee;

              return (
                <article
                  key={doc.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 dark:border-border/70 bg-white dark:bg-card p-4 sm:p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-[#0D9488]/40 hover:shadow-lg"
                >
                  <div>
                    {/* Doctor Image with Badges */}
                    <div
                      onClick={() => setSelectedDoctor(doc)}
                      className="relative aspect-[1.3/1] w-full cursor-pointer overflow-hidden rounded-xl bg-muted"
                    >
                      <img
                        src={photoSrc}
                        alt={`${doc.name} - ${doc.designation}`}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      {/* Top-Right Department Pill Badge */}
                      <span className="absolute top-2.5 right-2.5 rounded-full bg-[#E8F8F5] dark:bg-teal-950/90 text-[#0D9488] dark:text-[#14B8A6] px-2.5 py-0.5 text-xs font-semibold border border-[#0D9488]/20 shadow-2xs backdrop-blur-xs">
                        {doc.department}
                      </span>

                      {/* Top-Left Consultation Fee Badge */}
                      {typeof fee === "number" && fee > 0 && (
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-[#132A44]/90 backdrop-blur-xs text-white px-2.5 py-0.5 text-xs font-bold shadow-xs">
                          ₹{fee} Fee
                        </span>
                      )}
                    </div>

                    {/* Doctor Name & Details */}
                    <div className="mt-3.5">
                      <h3
                        onClick={() => setSelectedDoctor(doc)}
                        className="cursor-pointer text-base sm:text-lg font-bold text-gray-900 dark:text-white transition-colors hover:text-[#0D9488]"
                      >
                        {doc.name}
                      </h3>
                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-[#0D9488]">
                        {doc.designation}
                      </p>

                      {/* Metadata Rows with Teal Icons */}
                      <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden="true" />
                          <span className="font-medium truncate">{doc.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden="true" />
                          <span className="font-medium">{doc.experience}</span>
                        </div>
                        {doc.availability && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 shrink-0 text-[#0D9488]" aria-hidden="true" />
                            <span className="font-medium truncate">{doc.availability}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Row: View Option & Book Appointment Option */}
                  <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-border/60 flex items-center gap-2">
                    {/* View Option Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedDoctor(doc)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 dark:border-border bg-gray-50/80 dark:bg-muted/40 py-2 px-3 text-xs font-bold text-gray-700 dark:text-gray-200 transition-all hover:border-[#0D9488] hover:bg-[#E8F8F5] hover:text-[#0D6E5C]"
                      aria-label={`View details of ${doc.name}`}
                    >
                      <Eye className="h-3.5 w-3.5 text-[#0D9488]" aria-hidden="true" />
                      <span>View</span>
                    </button>

                    {/* Book Appointment Option */}
                    <a
                      href="#appointment"
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("select-doctor", { detail: { doctorName: doc.name } }));
                      }}
                      className="flex-[1.8] inline-flex items-center justify-between rounded-full border border-[#0D9488] bg-white dark:bg-card px-3.5 py-2 text-xs font-bold text-[#0D6E5C] dark:text-[#14B8A6] transition-all hover:bg-[#0D6E5C] hover:text-white group/btn shadow-2xs"
                      aria-label={`Book appointment with ${doc.name}`}
                    >
                      <span>Book Appointment</span>
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0D6E5C] text-white text-[11px] transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:bg-white group-hover/btn:text-[#0D6E5C]">
                        →
                      </span>
                    </a>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {/* Doctor Profile Modal */}
      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="doctor-modal-name"
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#EBF7F5] dark:bg-card border border-[#BCE8DE] dark:border-teal-900/60 shadow-2xl p-5 sm:p-6 lg:p-7 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedDoctor(null)}
              className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-muted text-gray-500 hover:text-gray-900 hover:bg-white shadow-2xs transition-all"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Body: Left Photo + Center Info + Right CTAs & Timings */}
            <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] lg:gap-7 items-start">
              {/* Left Column: Doctor Photo with Top & Bottom Overlaid Badges */}
              <div className="relative mx-auto md:mx-0 w-56 sm:w-60 md:w-52 lg:w-60 h-[220px] sm:h-[240px] shrink-0 overflow-hidden rounded-2xl bg-muted shadow-sm">
                <img
                  src={selectedDoctor.image || resolveDoctorPhoto(selectedDoctor.name, selectedDoctor.id)}
                  alt={selectedDoctor.name}
                  className="h-full w-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60" />

                {/* Top-Left: "★ Featured Doctor" Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#D4F4EC]/95 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-[#0D6E5C] shadow-2xs">
                  <Star className="h-3 w-3 fill-current text-[#0D6E5C]" />
                  <span>Featured Doctor</span>
                </div>

                {/* Bottom-Left: "X+ Years Experience" Badge */}
                <div className="absolute bottom-3 left-3 rounded-full bg-[#132A44] px-3 py-1 text-xs font-semibold text-white shadow-xs">
                  {selectedDoctor.experience}
                </div>
              </div>

              {/* Middle Column: Doctor Details, Bio, & Tags */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3
                    id="doctor-modal-name"
                    className="text-2xl sm:text-3xl font-extrabold text-[#0F2A4A] dark:text-white leading-tight"
                  >
                    {selectedDoctor.name}
                  </h3>
                  <p className="mt-1 text-sm sm:text-base font-bold text-[#0D9488]">
                    {selectedDoctor.designation} • {selectedDoctor.department}
                  </p>

                  {/* Metadata Row */}
                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-[#0D9488]" />
                      <span>{selectedDoctor.qualification}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-[#0D9488]" />
                      <span>{selectedDoctor.experience}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-[#0D9488]" />
                      <span>Consultation at SVV Poly Clinic</span>
                    </div>
                    {typeof selectedDoctor.consultationFee === "number" && selectedDoctor.consultationFee > 0 && (
                      <div className="flex items-center gap-1.5 font-bold text-[#0D6E5C] dark:text-[#14B8A6]">
                        <span>Consultation Fee: ₹{selectedDoctor.consultationFee}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio Paragraph */}
                  <p className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                    {selectedDoctor.bio}
                  </p>
                </div>

                {/* Focus Areas matching Figure 2 pill badges */}
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {selectedDoctor.focusAreas.map((area, idx) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#D4F4EC] dark:bg-teal-950/80 px-3 py-1.5 text-xs font-semibold text-[#0D6E5C] dark:text-[#14B8A6]"
                    >
                      {idx === 0 && <ShieldCheck className="h-3.5 w-3.5 text-[#0D9488]" />}
                      {idx === 1 && <Leaf className="h-3.5 w-3.5 text-[#0D9488]" />}
                      {idx >= 2 && <HeartPulse className="h-3.5 w-3.5 text-[#0D9488]" />}
                      <span>{area}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Book Appointment CTA + WhatsApp + Timings */}
              <div className="w-full md:w-56 shrink-0 border-t md:border-t-0 md:border-l border-[#BCE8DE]/80 dark:border-border/60 pt-5 md:pt-0 md:pl-6 flex flex-col justify-between">
                <div>
                  {/* Primary CTA: "Book Appointment →" with Calendar icon */}
                  <a
                    href="#appointment"
                    onClick={() => {
                      const docName = selectedDoctor.name;
                      setSelectedDoctor(null);
                      window.dispatchEvent(new CustomEvent("select-doctor", { detail: { doctorName: docName } }));
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0D6E5C] hover:bg-[#074A3E] px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99]"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Book Appointment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>

                  {/* Secondary CTA: "Chat on WhatsApp" with WhatsApp icon */}
                  <a
                    href={`https://wa.me/919518312766?text=${encodeURIComponent(
                      `Hello SVV Clinic, I would like to consult with ${selectedDoctor.name}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl border border-[#0D6E5C] bg-white dark:bg-card px-4 py-2 text-xs sm:text-sm font-bold text-[#0D6E5C] dark:text-[#14B8A6] shadow-2xs transition-all hover:bg-[#E8F8F5]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366]" />
                    <span>Chat on WhatsApp</span>
                  </a>

                  {/* Direct Phone Call Button if doctor has phone or clinic */}
                  <a
                    href={selectedDoctor.phone ? `tel:${selectedDoctor.phone}` : "tel:+919518312766"}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 dark:border-border bg-gray-50/80 dark:bg-muted/40 px-4 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all hover:bg-gray-100"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#0D9488]" />
                    <span>Call: {selectedDoctor.phone || "+91 95183 12766"}</span>
                  </a>
                </div>

                {/* Timings Section */}
                <div className="mt-4 border-t border-[#BCE8DE]/80 dark:border-border/60 pt-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0D6E5C] dark:text-[#14B8A6]">
                    <Clock className="h-4 w-4 text-[#0D9488]" />
                    <span>Timings</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {selectedDoctor.availability}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">(By Appointment Only)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
