import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { CLINIC } from "./clinic-info";
import { useContent } from "@/lib/content-context";
import svvLogo from "@/assets/svv-logo.jpg";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Doctors", href: "#doctors" },
  { label: "Our Services", href: "#services" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
] as const;

export function Navbar() {
  const { content } = useContent();
  const clinic = content.clinicInfo || CLINIC;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md transition-shadow ${
        scrolled ? "shadow-sm" : "border-transparent"
      }`}
    >
      <nav className="section-shell flex h-16 items-center justify-between gap-4" aria-label="Main navigation">
        <a href="#home" className="flex items-center gap-3" aria-label={`${clinic.name} home`}>
          <img
            src={svvLogo}
            alt="S.V.V. Clinic Logo"
            className="h-11 w-11 shrink-0 rounded-xl object-contain bg-white p-0.5 shadow-xs border border-border"
          />
          <span className="leading-tight">
            <span className="block text-base font-extrabold tracking-tight">
              <span className="text-[#074A74]">S.V.V.</span>{" "}
              <span className="text-[#1AAF99]">CLINIC</span>
            </span>
            <span className="block text-[11px] font-semibold text-muted-foreground">{clinic.motto || clinic.area}</span>
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={clinic.phoneHref}
            className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-accent sm:inline-flex"
            aria-label={`Call ${clinic.name} at ${clinic.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call Now
          </a>
          <a href="#appointment" className="btn-primary hidden px-5 py-2 sm:inline-flex">
            Book Appointment
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-border bg-background lg:hidden">
          <ul className="section-shell flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 flex flex-col gap-2 px-3">
              <a href="#appointment" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Book Appointment
              </a>
              <a href={clinic.phoneHref} className="btn-secondary w-full">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {clinic.phoneDisplay}
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
