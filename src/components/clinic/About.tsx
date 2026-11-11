import { ClipboardList, HeartPulse, Stethoscope, Syringe, CheckCircle2 } from "lucide-react";
import clinicInterior from "@/assets/clinic-interior.jpg";
import { useContent } from "@/lib/content-context";

const DEFAULT_HIGHLIGHTS = [
  { icon: Stethoscope, label: "Consultations for common illnesses" },
  { icon: Syringe, label: "Wound care, injections & saline" },
  { icon: HeartPulse, label: "Physiotherapy & rehabilitation" },
  { icon: ClipboardList, label: "Diagnostic support services" },
];

export function About() {
  const { content } = useContent();
  const about = content.about;

  return (
    <section id="about" className="scroll-mt-20 py-4 sm:py-6 lg:py-7">
      <div className="section-shell grid items-center gap-6 lg:gap-8 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-border shadow-md">
            <img
              src={about?.image || clinicInterior}
              alt="The welcoming reception and waiting area of SVV Poly Clinic"
              width={1280}
              height={900}
              loading="lazy"
              className="aspect-[4/3] h-auto w-full object-cover"
            />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="section-eyebrow">{about?.eyebrow || "About Us"}</p>
          <h2 className="section-title mt-2 sm:mt-3">
            {about?.title || "Healthcare You Can Trust"}
          </h2>

          <p className="mt-3 leading-relaxed text-muted-foreground text-sm sm:text-base">
            {about?.paragraph1 ||
              "SVV Poly Clinic is dedicated to providing comprehensive healthcare services for individuals of all ages. Our aim is to make essential healthcare services accessible in a comfortable and welcoming environment."}
          </p>
          <p className="mt-2.5 leading-relaxed text-muted-foreground text-sm sm:text-base">
            {about?.paragraph2 ||
              "From consultations for common illnesses to wound care, injections, physiotherapy, and diagnostic services, we strive to support the everyday healthcare needs of our community."}
          </p>

          <ul className="mt-5 sm:mt-6 grid gap-3 sm:grid-cols-2">
            {about?.features?.length
              ? about.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                      <CheckCircle2 className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-foreground">{feat}</span>
                  </li>
                ))
              : DEFAULT_HIGHLIGHTS.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent">
                      <Icon className="h-4.5 w-4.5 text-primary" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-foreground">{label}</span>
                  </li>
                ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
