import { MapPin, Navigation, Phone } from "lucide-react";
import { CLINIC } from "./clinic-info";
import { useContent } from "@/lib/content-context";

export function LocationContact() {
  const { content } = useContent();
  const clinic = content.clinicInfo || CLINIC;
  return (
    <section id="contact" className="scroll-mt-20 py-4 sm:py-6 lg:py-7">
      <div className="section-shell">
        <div className="max-w-2xl">
          <p className="section-eyebrow">Visit Us</p>
          <h2 className="section-title mt-2 sm:mt-3">Clinic Location & Contact</h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            We are easy to find in {clinic.area}. Walk in during clinic hours or call ahead.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                Address
              </h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted-foreground">{clinic.address}</p>
              <a
                href={clinic.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-4"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Get Directions
              </a>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-base font-extrabold text-foreground">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                Phone
              </h3>
              <a
                href={clinic.phoneHref}
                className="mt-2 inline-flex items-center gap-2 text-lg font-extrabold text-primary underline-offset-4 hover:underline"
                aria-label={`Call ${clinic.name} at ${clinic.phoneDisplay}`}
              >
                {clinic.phoneDisplay}
              </a>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-foreground">Opening Hours</h3>
              <dl className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card px-5">
                {(clinic.hours || CLINIC.hours).map(({ day, time }) => (
                  <div key={day} className="flex items-center justify-between gap-4 py-2.5">
                    <dt className="text-sm font-semibold text-foreground">{day}</dt>
                    <dd className="text-sm font-medium text-muted-foreground">{time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border shadow-sm">
            <iframe
              title={`Map showing the location of ${clinic.name}, ${clinic.area}`}
              src={clinic.mapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-full min-h-[420px] w-full border-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
