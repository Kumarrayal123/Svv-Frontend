import React, { createContext, useContext, useEffect, useState } from "react";
import { CLINIC, DOCTORS, Doctor } from "@/components/clinic/clinic-info";
import { fetchSiteContentApi, updateSiteContentApi, resetSiteContentApi } from "./api";

export type ClinicInfoType = {
  name: string;
  motto: string;
  area: string;
  tagline: string;
  phoneDisplay: string;
  phoneHref: string;
  address: string;
  hours: { day: string; time: string }[];
  mapsEmbedUrl: string;
  directionsUrl: string;
};

export type HeroType = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  heroImage: string;
  careImage: string;
  stats: { value: string; label: string }[];
};

export type AboutType = {
  eyebrow: string;
  title: string;
  paragraph1: string;
  paragraph2: string;
  experienceYears: string;
  image: string;
  features: string[];
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: string;
};

export type WhyChooseItem = {
  title: string;
  description: string;
  icon: string;
};

export type SiteContentType = {
  clinicInfo: ClinicInfoType;
  hero: HeroType;
  about: AboutType;
  services: ServiceItem[];
  whyChooseUs: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: WhyChooseItem[];
  };
  doctors: (Doctor & { image?: string })[];
  footer: {
    emergencyNote: string;
    copyright: string;
  };
};

const defaultContent: SiteContentType = {
  clinicInfo: {
    name: CLINIC.name,
    motto: CLINIC.motto,
    area: CLINIC.area,
    tagline: CLINIC.tagline,
    phoneDisplay: CLINIC.phoneDisplay,
    phoneHref: CLINIC.phoneHref,
    address: CLINIC.address,
    hours: CLINIC.hours.map((h) => ({ day: h.day, time: h.time })),
    mapsEmbedUrl: CLINIC.mapsEmbedUrl,
    directionsUrl: CLINIC.directionsUrl,
  },
  hero: {
    badge: "Trusted Healthcare in Madhapur",
    titleLine1: "Personalized Medical Care",
    titleLine2: "For You & Your Family",
    description:
      "Experienced doctors providing comprehensive primary care, specialist consultations, and diagnostic guidance with empathy and excellence.",
    primaryCta: "Book Appointment",
    secondaryCta: "Call Now",
    heroImage: "",
    careImage: "",
    stats: [
      { value: "15+", label: "Years Experience" },
      { value: "10k+", label: "Happy Patients" },
      { value: "7 Days", label: "Open Every Week" },
    ],
  },
  about: {
    eyebrow: "About S.V.V. Clinic",
    title: "Dedicated to Compassionate and Quality Healthcare",
    paragraph1:
      "S.V.V. Clinic is an established multi-specialty healthcare facility located in the heart of Madhapur, Hyderabad. We provide primary healthcare, specialist doctor consultations, preventative checkups, and chronic disease management.",
    paragraph2:
      "Our clinic is led by seasoned physicians with deep clinical experience who take the time to listen, explain diagnoses thoroughly, and create personalized treatment pathways.",
    experienceYears: "15+ Years of Care",
    image: "",
    features: [
      "Senior Physicians with 15+ years experience",
      "Comprehensive diagnostics & lifestyle counseling",
      "Open 7 days a week including Sunday consultations",
      "Comfortable, hygienic, patient-first environment",
    ],
  },
  services: [
    {
      id: "general-medicine",
      title: "General Medicine & Health Checkups",
      description:
        "Treatment for fever, infections, hypertension, diabetes, and comprehensive physical wellness evaluations.",
      tag: "Primary Care",
      icon: "Stethoscope",
    },
    {
      id: "family-health",
      title: "Family Healthcare & Wellness",
      description:
        "Holistic care for all age groups, preventive screenings, pediatric advice, and lifestyle management.",
      tag: "Family Wellness",
      icon: "HeartPulse",
    },
    {
      id: "surgical-consult",
      title: "Surgical Consultations & Minor Procedures",
      description:
        "Expert pre/post-operative evaluation, wound dressing, minor surgical procedures, and second opinions.",
      tag: "Specialist Care",
      icon: "Activity",
    },
    {
      id: "chronic-disease",
      title: "Chronic Disease Management",
      description:
        "Long-term care plans for hypertension, thyroid disorders, asthma, cholesterol, and diabetes.",
      tag: "Chronic Care",
      icon: "ShieldPlus",
    },
    {
      id: "diagnostics",
      title: "Lab Investigations & Diagnostic Guidance",
      description:
        "Fast referral and clinical evaluation for blood tests, ECG, imaging, and full body health panels.",
      tag: "Diagnostics",
      icon: "ClipboardCheck",
    },
    {
      id: "preventive-counseling",
      title: "Preventive Care & Health Counseling",
      description:
        "Personalized dietary counseling, immunization advice, stress management, and preventative health plans.",
      tag: "Preventive",
      icon: "Sparkles",
    },
  ],
  whyChooseUs: {
    eyebrow: "Why Patients Choose Us",
    title: "Clinical Excellence With Human Warmth",
    subtitle:
      "We believe medical care should be attentive, transparent, and built on trust.",
    items: [
      {
        title: "Experienced Medical Doctors",
        description:
          "15+ years of combined clinical excellence across internal medicine, family health, and surgery.",
        icon: "Award",
      },
      {
        title: "Patient-Centered Approach",
        description:
          "Transparent medical advice, unhurried consultations, and detailed explanations of your treatment options.",
        icon: "HeartHandshake",
      },
      {
        title: "Convenient Madhapur Location",
        description:
          "Easily accessible in Arunodaya Colony, Madhapur with open hours every day of the week.",
        icon: "MapPin",
      },
      {
        title: "Quick Appointment Turnaround",
        description:
          "Prompt confirmations over call so you never have to wait anxiously for an appointment slot.",
        icon: "Clock",
      },
    ],
  },
  doctors: DOCTORS.map((d) => ({ ...d })),
  footer: {
    emergencyNote:
      "For severe medical emergencies, please visit the nearest hospital emergency room immediately.",
    copyright: `© ${new Date().getFullYear()} S.V.V. Clinic. All rights reserved.`,
  },
};

type ContentContextType = {
  content: SiteContentType;
  isLoading: boolean;
  isSaving: boolean;
  saveContent: (updated: SiteContentType) => Promise<boolean>;
  resetToDefault: () => Promise<boolean>;
  reload: () => Promise<void>;
};

const ContentContext = createContext<ContentContextType>({
  content: defaultContent,
  isLoading: false,
  isSaving: false,
  saveContent: async () => false,
  resetToDefault: async () => false,
  reload: async () => {},
});

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContentType>(defaultContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const load = async () => {
    try {
      const res = await fetchSiteContentApi();
      if (res.success && res.data) {
        setContent((prev) => ({
          ...prev,
          ...res.data,
          clinicInfo: { ...prev.clinicInfo, ...(res.data.clinicInfo || {}) },
          hero: { ...prev.hero, ...(res.data.hero || {}) },
          about: { ...prev.about, ...(res.data.about || {}) },
          whyChooseUs: { ...prev.whyChooseUs, ...(res.data.whyChooseUs || {}) },
          footer: { ...prev.footer, ...(res.data.footer || {}) },
        }));
      }
    } catch (err) {
      // Backend not yet reachable, fallback silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveContent = async (updated: SiteContentType): Promise<boolean> => {
    setIsSaving(true);
    setContent(updated);
    try {
      const res = await updateSiteContentApi(updated);
      if (res.success) {
        if (res.data) {
          setContent((prev) => ({ ...prev, ...res.data }));
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to persist content to backend:", err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const res = await resetSiteContentApi();
      if (res.success) {
        setContent(defaultContent);
        return true;
      }
      return false;
    } catch {
      setContent(defaultContent);
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        isLoading,
        isSaving,
        saveContent,
        resetToDefault,
        reload: load,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
