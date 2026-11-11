import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/clinic/Navbar";
import { Hero } from "@/components/clinic/Hero";
import { About } from "@/components/clinic/About";
import { Doctors } from "@/components/clinic/Doctors";
import { Services } from "@/components/clinic/Services";
import { WhyChooseUs } from "@/components/clinic/WhyChooseUs";
import { Appointment } from "@/components/clinic/Appointment";
import { LocationContact } from "@/components/clinic/LocationContact";
import { Footer } from "@/components/clinic/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "S.V.V. Clinic — The Right Choices | Madhapur, Hyderabad",
      },
      {
        name: "description",
        content:
          "S.V.V. Clinic in Madhapur, Hyderabad offers experienced consultations with Dr. S. Karunakar, Dr. Abhigna Jupaka, and Dr. Vamshi Krishna. Book an appointment or call +91 95183 12766.",
      },
      { property: "og:title", content: "S.V.V. Clinic — The Right Choices" },
      {
        property: "og:description",
        content:
          "Comprehensive healthcare for you and your family in Madhapur, Hyderabad with our experienced medical doctors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Doctors />
        <Services />
        <WhyChooseUs />
        <Appointment />
        <LocationContact />
      </main>
      <Footer />
    </div>
  );
}
