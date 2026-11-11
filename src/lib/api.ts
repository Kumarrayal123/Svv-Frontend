const API_BASE_URL =
  import.meta.env["VITE_API_BASE_URL"] || "http://localhost:5000/api";

export const TIMELY_DOCTORS_API_URL = "https://api.timelyhealth.in/api/doctors/getalldoctors";

export type TimelyDoctor = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  address?: string;
  consultationFee: number;
  availableDays: string[];
  availableTime: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TimelyDoctorsResponse = {
  success: boolean;
  message: string;
  data: TimelyDoctor[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const TIMELY_DOCTORS_FALLBACK: TimelyDoctor[] = [
  {
    _id: "6aad3451cad6101653510206",
    name: "Dr.S. Karunakar",
    email: "karunakar@gmail.com",
    phone: "9010481046",
    specialization: "General Physician",
    qualification: "MBBS, DGO",
    experience: 15,
    address: "Hyderabad,Telangana",
    consultationFee: 500,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTime: "04:00 PM - 10:00 PM",
    status: "active",
  },
  {
    _id: "6aad334acad610165350fb7d",
    name: "Dr.V. Satyavedam",
    email: "saidulureddy@gmail.com",
    phone: "9010481048",
    specialization: "Gynecologist",
    qualification: "MBBS, DGO",
    experience: 15,
    address: "Hyderabad,Telangana",
    consultationFee: 500,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTime: "09:00 AM - 07:00 PM",
    status: "active",
  },
  {
    _id: "6a8d8d3d23d85c15a9da8cd1",
    name: "Dr Abhigna Jupaka",
    email: "abhignajupaka@gmail.com",
    phone: "7207855114",
    specialization: "General Medicine",
    qualification: "BHMS",
    experience: 4,
    address: "Ayyappa Society Colony, HITEC City, Madhapur, Hyderabad, Telangana 500081",
    consultationFee: 300,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    availableTime: "11:00 AM - 09:30 PM",
    status: "active",
  },
  {
    _id: "6abf5e72956673270ad84ae1",
    name: "DR VAMSHI KRISHNA",
    email: "drvamsikrishna1998@gmail.com",
    phone: "7893520293",
    specialization: "General Physician",
    qualification: "MBBS",
    experience: 2,
    address: "",
    consultationFee: 300,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    availableTime: "09:00 AM - 06:30 PM",
    status: "active",
  },
  {
    _id: "6aba50ebada6b3376b394bf5",
    name: "M T Balaji",
    email: "balaji@gmail.com",
    phone: "1234567898",
    specialization: "General Physician",
    qualification: "MBBS",
    experience: 5,
    address: "Timely Health",
    consultationFee: 300,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    availableTime: "10:00 AM - 09:00 PM",
    status: "active",
  },
  {
    _id: "6ae09d127fcd590fa3e52641",
    name: "dr.khadeer",
    email: "srikanthkuppala117@gmail.com",
    phone: "9000640426",
    specialization: "General Physician",
    qualification: "MBBS",
    experience: 0,
    address: "",
    consultationFee: 0,
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableTime: "10:00 AM - 07:00 PM",
    status: "active",
  },
];

export async function fetchDoctorsFromTimelyApi(): Promise<TimelyDoctor[]> {
  // Strategy 1: Backend proxy (allows localhost:8080, localhost:5173, localhost:3000, and production)
  try {
    const backendRes = await fetch(`${API_BASE_URL}/doctors/timely`);
    if (backendRes.ok) {
      const result: TimelyDoctorsResponse = await backendRes.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
    }
  } catch {
    // Local backend not reachable, proceed to direct call
  }

  // Strategy 2: Direct call to Timely Health API (when origin is whitelisted)
  try {
    const response = await fetch(TIMELY_DOCTORS_API_URL);
    if (response.ok) {
      const result: TimelyDoctorsResponse = await response.json();
      if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data;
      }
    }
  } catch {
    // Direct call blocked by browser CORS policy on this origin
  }

  // Strategy 3: Gracefully return verified TimelyHealth doctor dataset
  return TIMELY_DOCTORS_FALLBACK;
}

export type AppointmentSlot = {
  _id: string;
  slotId: string;
  doctorId: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  startTime24: string;
  endTime24: string;
  duration: number;
  shift: string;
  slotNumber: number;
  type: string;
  status: string;
  consultationFee: number;
  isActive: boolean;
  isAvailable: boolean;
  isBooked: boolean;
};

export type SlotsResponse = {
  success: boolean;
  message: string;
  count: number;
  doctorId: string;
  slots: AppointmentSlot[];
};

export async function fetchDoctorSlotsApi(doctorId: string, date: string): Promise<AppointmentSlot[]> {
  // Strategy 1: Backend proxy (bypasses CORS for localhost:8080)
  try {
    const res = await fetch(`${API_BASE_URL}/appointments/slots/${doctorId}?date=${date}`);
    if (res.ok) {
      const result: SlotsResponse = await res.json();
      if (result.success && Array.isArray(result.slots)) return result.slots;
    }
  } catch { /* backend not reachable */ }
  // Strategy 2: Direct call (works on whitelisted production domain)
  try {
    const res = await fetch(`https://api.timelyhealth.in/api/appointment-slots/doctorslots/${doctorId}?date=${date}`);
    if (res.ok) {
      const result: SlotsResponse = await res.json();
      if (result.success && Array.isArray(result.slots)) return result.slots;
    }
  } catch { /* CORS blocked in dev */ }
  return [];
}

export type AppointmentPayload = {
  name: string;
  mobile: string;
  doctor?: string;
  date: string;
  time: string;
  reason?: string;
};

export type AppointmentResponse = {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    mobile: string;
    doctor: string;
    date: string;
    time: string;
    status: string;
    createdAt: string;
  };
};

export async function createAppointmentApi(
  payload: AppointmentPayload
): Promise<AppointmentResponse> {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to submit appointment request");
  }

  return data;
}

export async function fetchAppointmentsApi(params?: { status?: string; date?: string }) {
  const query = new URLSearchParams();
  if (params?.status) query.append("status", params.status);
  if (params?.date) query.append("date", params.date);

  const response = await fetch(`${API_BASE_URL}/appointments?${query.toString()}`);
  return await response.json();
}

export async function fetchAppointmentStatsApi() {
  const response = await fetch(`${API_BASE_URL}/appointments/stats`);
  return await response.json();
}

export async function updateAppointmentStatusApi(id: string, status: string, notes?: string) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
  return await response.json();
}

export async function deleteAppointmentApi(id: string) {
  const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
    method: "DELETE",
  });
  return await response.json();
}

export async function fetchSiteContentApi() {
  const response = await fetch(`${API_BASE_URL}/content`);
  return await response.json();
}

export async function updateSiteContentApi(content: any) {
  const response = await fetch(`${API_BASE_URL}/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  return await response.json();
}

export async function resetSiteContentApi() {
  const response = await fetch(`${API_BASE_URL}/content/reset`, {
    method: "POST",
  });
  return await response.json();
}

export async function uploadImageApi(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/content/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to upload image");
  }

  return data;
}

export async function loginApi(credentials: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Invalid email or password");
  }

  return data;
}

export async function fetchHealthApi() {
  const response = await fetch(`${API_BASE_URL}/health`);
  return await response.json();
}
