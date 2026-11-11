import { Clock, MapPin, Phone } from "lucide-react";
import { CLINIC } from "./clinic-info";
import { useContent } from "@/lib/content-context";
import svvLogo from "@/assets/svv-logo.jpg";

const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Doctors", href: "#doctors" },
  { label: "Our Services", href: "#services" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Book Appointment", href: "#appointment" },
] as const;

const SERVICE_LINKS = [
  "General Surgery",
  "Plastic Surgery",
  "Urology",
  "Cardiology",
  "Orthopaedics",
  "Neurosurgery",
 
] as const;

export function Footer() {
  const { content } = useContent();
  const clinic = content.clinicInfo || CLINIC;
  const footer = content.footer;

  return (
    <footer className="border-t border-primary/15 bg-muted">
      <div className="section-shell grid gap-6 py-6 sm:py-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={svvLogo}
              alt="S.V.V. Clinic Logo"
              className="h-12 w-12 shrink-0 rounded-xl object-contain bg-white p-1 border border-border shadow-xs"
            />
            <div>
              <p className="text-lg font-extrabold tracking-tight">
                <span className="text-[#074A74]">S.V.V.</span>{" "}
                <span className="text-[#1AAF99]">CLINIC</span>
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {clinic.motto}
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {clinic.tagline}. Accessible consultations, everyday treatments and essential clinical care for families in{" "}
            {clinic.area}.
          </p>
        </div>

        <nav aria-label="Quick links">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Medical services">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Services</h3>
          <ul className="mt-4 space-y-2.5">
            {SERVICE_LINKS.map((label) => (
              <li key={label}>
                <a href="#services" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-foreground">Contact & Hours</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>{clinic.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <a href={clinic.phoneHref} className="font-bold text-primary hover:underline">
                {clinic.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>
                Mon–Sat: 9:00 AM – 9:30 PM
                <br />
                Sunday: 10:00 AM – 6:00 PM
              </span>
            </li>
          </ul>
          <a
            href={clinic.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Google Maps Directions
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="section-shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>{footer?.copyright || `© ${new Date().getFullYear()} ${clinic.name}. All rights reserved.`}</p>
          <p>{clinic.area}, Telangana</p>
        </div>
      </div>
    </footer>
  );
}
