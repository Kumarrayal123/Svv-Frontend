/**
 * Single source of truth for the clinic's contact details, hours and links.
 * Update the values here and the whole website stays in sync.
 */
export const CLINIC = {
  name: "S.V.V. Clinic",
  motto: "The Right Choices",
  area: "Madhapur, Hyderabad",
  tagline: "The Right Choices for Healthcare & Family Wellness",
  phoneHref: "tel:+919518312766",
  phoneDisplay: "+91 95183 12766",
  address:
    "H No: 1, Sri Sai Balaji Avenue, Flat No. 301, 98/9/25/P, Arunodaya Colony, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081",
  hours: [
    { day: "Monday", time: "9:00 AM – 9:30 PM" },
    { day: "Tuesday", time: "9:00 AM – 9:30 PM" },
    { day: "Wednesday", time: "9:00 AM – 9:30 PM" },
    { day: "Thursday", time: "9:00 AM – 9:30 PM" },
    { day: "Friday", time: "9:00 AM – 9:30 PM" },
    { day: "Saturday", time: "9:00 AM – 9:30 PM" },
    { day: "Sunday", time: "10:00 AM – 6:00 PM" },
  ],
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(
    "SVV Poly Clinic, Sri Sai Balaji Avenue, Arunodaya Colony, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081",
  )}&output=embed`,
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    "SVV Poly Clinic, Sri Sai Balaji Avenue, Arunodaya Colony, Sri Sai Nagar, Madhapur, Hyderabad, Telangana 500081",
  )}`,
} as const;

export type Doctor = {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  specialization: string;
  experience: string;
  availability: string;
  bio: string;
  focusAreas: string[];
  department: string;
  image?: string;
  consultationFee?: number;
  phone?: string;
  email?: string;
  availableDays?: string[];
  availableTime?: string;
};

export const DOCTORS: readonly Doctor[] = [
  {
    id: "dr-s-karunakar",
    name: "Dr. S. Karunakar",
    designation: "General Physician",
    department: "General Medicine",
    qualification: "MBBS, MD (Internal Medicine)",
    specialization: "General Medicine & Chronic Care",
    experience: "15+ Years Experience",
    availability: "Mon - Sat  10:00 AM – 5:00 PM",
    bio: "Expert in preventive healthcare, general medicine, and lifestyle management. Focused on holistic and patient-centered care.",
    focusAreas: ["Preventive Care", "Lifestyle Guidance", "Health Checkups"],
  },
  {
    id: "dr-abhigna-jupaka",
    name: "Dr. Abhigna Jupaka",
    designation: "Family Physician",
    department: "Family Health",
    qualification: "MBBS, DNB (Family Medicine)",
    specialization: "Family Health & Preventive Care",
    experience: "8+ Years Experience",
    availability: "Mon - Sat  10:00 AM – 5:00 PM",
    bio: "Specializing in patient-centered primary care, preventive screenings, women's health, and lifestyle counseling. Focused on holistic and compassionate family healthcare.",
    focusAreas: ["Preventive Care", "Lifestyle Guidance", "Women's Health"],
  },
  {
    id: "dr-vamshi-krishna",
    name: "Dr. Vamshi Krishna",
    designation: "Consultant Specialist & Surgeon",
    department: "General Surgery",
    qualification: "MBBS, MS, MCh",
    specialization: "Specialist Consultations & Surgical Assessments",
    experience: "12+ Years Experience",
    availability: "Mon - Sat  10:00 AM – 5:00 PM",
    bio: "Providing comprehensive specialist consultations, surgical assessments, wound care, and advanced therapeutic guidance for complex conditions.",
    focusAreas: ["Surgical Guidance", "Pre/Post-Op Care", "Clinical Evaluations"],
  },
] as const;
