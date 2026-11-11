import React from "react";
import { Navbar } from "@/components/clinic/Navbar";
import { Hero } from "@/components/clinic/Hero";
import { About } from "@/components/clinic/About";
import { Doctors } from "@/components/clinic/Doctors";
import { Services } from "@/components/clinic/Services";
import { WhyChooseUs } from "@/components/clinic/WhyChooseUs";
import { Appointment } from "@/components/clinic/Appointment";
import { LocationContact } from "@/components/clinic/LocationContact";
import { Footer } from "@/components/clinic/Footer";

export function LandingPage() {
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
