import { Activity, ClipboardPlus, HandHeart, MapPin, Stethoscope, Users, ShieldCheck, type LucideIcon } from "lucide-react";
import { useContent } from "@/lib/content-context";

type Reason = { icon: LucideIcon; title: string; text: string };

const DEFAULT_REASONS: Reason[] = [
  {
    icon: Users,
    title: "Care for Individuals & Families",
    text: "Healthcare services for individuals and families of all ages, under one roof.",
  },
  {
    icon: Stethoscope,
    title: "Everyday Illness Support",
    text: "Support for common illnesses and everyday health concerns, from fevers to digestive issues.",
  },
  {
    icon: ClipboardPlus,
    title: "Essential Clinical Care",
    text: "First aid, wound care, injections, saline administration and minor procedures.",
  },
  {
    icon: Activity,
    title: "Physiotherapy & Rehabilitation",
    text: "Physiotherapy and rehabilitation services to help you recover and stay mobile.",
  },
  {
    icon: MapPin,
    title: "Convenient Madhapur Location",
    text: "Located in Sri Sai Nagar, Madhapur — easy to reach for nearby residents and professionals.",
  },
  {
    icon: HandHeart,
    title: "Patient-Focused Environment",
    text: "A welcoming, patient-focused environment where you are heard and cared for.",
  },
];

export function WhyChooseUs() {
  const { content } = useContent();
  const why = content.whyChooseUs;

  return (
    <section id="why-us" className="scroll-mt-20 py-4 sm:py-6 lg:py-7">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="section-eyebrow">{why?.eyebrow || "Why Choose Us"}</p>
          <h2 className="section-title mt-2 sm:mt-3">
            {why?.title || "Why Choose SVV Poly Clinic?"}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            {why?.subtitle || "A neighbourhood clinic built around accessible, honest and patient-focused care."}
          </p>
        </div>

        <ul className="mt-5 sm:mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {why?.items?.length
            ? why.items.map((item, idx) => (
                <li key={idx} className="flex flex-col gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                    <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight text-foreground">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </li>
              ))
            : DEFAULT_REASONS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex flex-col gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-extrabold tracking-tight text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
