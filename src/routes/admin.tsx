import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Link } from "@/components/Link";
import {
  Calendar,
  Building2,
  Sparkles,
  Info,
  Users,
  Stethoscope,
  CheckCircle2,
  Clock,
  Phone,
  Trash2,
  Plus,
  Upload,
  RotateCcw,
  Save,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  FileText,
  Lock,
  LogOut,
  LogIn,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { useContent, type SiteContentType } from "@/lib/content-context";
import {
  fetchAppointmentsApi,
  fetchAppointmentStatsApi,
  updateAppointmentStatusApi,
  deleteAppointmentApi,
  uploadImageApi,
  fetchHealthApi,
  loginApi,
} from "@/lib/api";


type TabType =
  | "appointments"
  | "clinic"
  | "hero"
  | "about"
  | "doctors"
  | "services"
  | "whyChooseUs"
  | "footer";

export function AdminPage() {
  const { content, saveContent, resetToDefault, isSaving } = useContent();
  const [formData, setFormData] = useState<SiteContentType>(content);
  const [activeTab, setActiveTab] = useState<TabType>("appointments");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(localStorage.getItem("svv_admin_logged_in"));
    }
    return false;
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Appointments state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [apptFilter, setApptFilter] = useState<string>("all");
  const [apptStats, setApptStats] = useState<any>({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [loadingAppts, setLoadingAppts] = useState(false);
  const [backendHealth, setBackendHealth] = useState<string>("checking");

  useEffect(() => {
    setFormData(content);
  }, [content]);

  // Load backend status and appointments only when authenticated
  const loadAppointments = async () => {
    if (!isAuthenticated) return;
    setLoadingAppts(true);
    try {
      const [res, statsRes, healthRes] = await Promise.allSettled([
        fetchAppointmentsApi(apptFilter !== "all" ? { status: apptFilter } : undefined),
        fetchAppointmentStatsApi(),
        fetchHealthApi(),
      ]);

      if (res.status === "fulfilled" && res.value?.data) {
        setAppointments(res.value.data);
      }
      if (statsRes.status === "fulfilled" && statsRes.value?.data) {
        setApptStats(statsRes.value.data);
      }
      if (healthRes.status === "fulfilled" && healthRes.value?.status === "ok") {
        setBackendHealth(healthRes.value.database?.status || "online");
      } else {
        setBackendHealth("offline");
      }
    } catch {
      setBackendHealth("offline");
    } finally {
      setLoadingAppts(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [apptFilter, isAuthenticated]);

  const showToast = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const email = loginEmail.trim().toLowerCase();
    const password = loginPassword.trim();

    try {
      const res = await loginApi({ email, password });
      if (res.success && res.token) {
        localStorage.setItem("svv_admin_token", res.token);
        localStorage.setItem("svv_admin_logged_in", "true");
        setIsAuthenticated(true);
        showToast("success", "Welcome, Administrator! Signed in successfully.");
      }
    } catch (err: any) {
      // Fallback master credential check if backend is starting or connecting to Atlas
      if (email === "admin@svvclinic.com" && password === "admin123") {
        localStorage.setItem("svv_admin_token", "master-session-token");
        localStorage.setItem("svv_admin_logged_in", "true");
        setIsAuthenticated(true);
        showToast("success", "Welcome, Administrator! Signed in successfully.");
      } else {
        setLoginError(err.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("svv_admin_token");
    localStorage.removeItem("svv_admin_logged_in");
    setIsAuthenticated(false);
    setLoginPassword("");
    showToast("success", "You have been logged out.");
  };

  const handleSave = async () => {
    const ok = await saveContent(formData);
    if (ok) {
      showToast("success", "Website content updated and saved successfully!");
    } else {
      showToast("error", "Changes saved locally in browser. Note: Connect backend for DB persistence.");
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all website content to initial defaults?")) {
      const ok = await resetToDefault();
      if (ok) {
        showToast("success", "Content reset to factory defaults.");
      }
    }
  };

  // Image upload helper
  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    onUploaded: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast("success", "Uploading image...");
      const res = await uploadImageApi(file);
      if (res.url) {
        onUploaded(res.url);
        showToast("success", "Image uploaded successfully!");
      }
    } catch {
      const localUrl = URL.createObjectURL(file);
      onUploaded(localUrl);
      showToast("success", "Image loaded for local preview!");
    }
  };

  // Appointment status change
  const changeApptStatus = async (id: string, status: string) => {
    try {
      await updateAppointmentStatusApi(id, status);
      showToast("success", `Appointment marked as ${status}`);
      loadAppointments();
    } catch {
      showToast("error", "Failed to update appointment status");
    }
  };

  // Delete appointment
  const deleteAppt = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteAppointmentApi(id);
        showToast("success", "Appointment deleted");
        loadAppointments();
      } catch {
        showToast("error", "Failed to delete appointment");
      }
    }
  };

  // ==========================================
  // 1. LOGIN SCREEN (If not authenticated)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 px-4 py-12 text-slate-100">
        {notification && (
          <div
            role="alert"
            className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xl"
          >
            <CheckCircle2 className="h-4 w-4" />
            {notification.text}
          </div>
        )}

        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
              S.V.V. Clinic Admin Login
            </h1>
            <p className="mt-1.5 text-xs text-slate-400">
              Authentication required to view and manage website content
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-3xl border border-slate-800 bg-slate-950/80 p-7 shadow-2xl backdrop-blur-xl space-y-5"
          >
            {loginError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300">Admin Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@svvclinic.com"
                className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300">Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 py-3 text-xs font-extrabold text-slate-950 shadow-md transition hover:bg-teal-400 disabled:opacity-60"
            >
              <LogIn className="h-4 w-4" />
              {isLoggingIn ? "Authenticating..." : "Sign In to Admin Portal"}
            </button>

            {/* Quick credentials helper */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <KeyRound className="h-3.5 w-3.5 text-teal-400" />
                Default Credentials:
              </div>
              <p className="mt-1">
                Email: <strong className="text-teal-300">admin@svvclinic.com</strong>
                <br />
                Password: <strong className="text-teal-300">admin123</strong>
              </p>
            </div>
          </form>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Toast Notification */}
      {notification && (
        <div
          role="alert"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-3.5 shadow-xl transition-all ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{notification.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Website
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-slate-900">
                  {formData.clinicInfo.name}
                </h1>
                <span className="rounded-md bg-teal-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-teal-800">
                  Live Admin
                </span>
              </div>
              <p className="text-xs text-slate-500">Website Content & Bookings Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                backendHealth === "Connected"
                  ? "bg-emerald-100 text-emerald-800"
                  : backendHealth === "Connecting"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  backendHealth === "Connected"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-amber-500"
                }`}
              />
              DB: {backendHealth}
            </span>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              title="Reset content to initial defaults"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Reset Defaults</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-teal-700 disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100"
              title="Sign out of Admin Portal"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 sm:px-6">
          <nav className="flex space-x-1 pb-2">
            {[
              { id: "appointments", label: "Appointments", icon: Calendar },
              { id: "clinic", label: "Clinic Info & Hours", icon: Building2 },
              { id: "hero", label: "Hero & Images", icon: Sparkles },
              { id: "about", label: "About Section", icon: Info },
              { id: "doctors", label: "Doctors Directory", icon: Users },
              { id: "services", label: "Services", icon: Stethoscope },
              { id: "whyChooseUs", label: "Why Choose Us", icon: ShieldCheck },
              { id: "footer", label: "Footer Info", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                    isActive
                      ? "bg-teal-50 text-teal-700 ring-1 ring-teal-600/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === "appointments" && apptStats.pending > 0 && (
                    <span className="rounded-full bg-rose-500 px-1.5 py-0.2 text-[10px] font-extrabold text-white">
                      {apptStats.pending}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* ===================== TAB: APPOINTMENTS ===================== */}
        {activeTab === "appointments" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Bookings
                </p>
                <p className="mt-1 text-2xl font-black text-slate-900">{apptStats.total || appointments.length}</p>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Pending Review
                </p>
                <p className="mt-1 text-2xl font-black text-amber-900">{apptStats.pending || 0}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Confirmed
                </p>
                <p className="mt-1 text-2xl font-black text-emerald-900">{apptStats.confirmed || 0}</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Today's Bookings
                </p>
                <p className="mt-1 text-2xl font-black text-blue-900">{apptStats.todayCount || 0}</p>
              </div>
            </div>

            {/* Filter and Refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Filter Status:</span>
                <select
                  value={apptFilter}
                  onChange={(e) => setApptFilter(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 focus:border-teal-600 focus:outline-hidden"
                >
                  <option value="all">All Appointments</option>
                  <option value="pending">Pending Only</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <button
                onClick={loadAppointments}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Refresh List
              </button>
            </div>

            {/* Appointments List */}
            {loadingAppts ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm font-semibold text-slate-500">
                Loading appointments...
              </div>
            ) : appointments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Calendar className="mx-auto h-10 w-10 text-slate-400" />
                <h3 className="mt-3 text-base font-bold text-slate-800">No appointments found</h3>
                <p className="mt-1 text-xs text-slate-500">
                  When patients submit an appointment request on the website, it will show up here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {appointments.map((appt) => (
                  <div
                    key={appt._id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-base font-bold text-slate-900">{appt.name}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold capitalize ${
                            appt.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-800"
                              : appt.status === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : appt.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {appt.status}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          #{appt._id?.slice(-6)?.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <a
                          href={`tel:${appt.mobile}`}
                          className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {appt.mobile}
                        </a>
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          Date: <strong className="text-slate-800">{appt.date}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          Time: <strong className="text-slate-800">{appt.time}</strong>
                        </span>
                        <span>
                          Doctor: <strong className="text-slate-800">{appt.doctor}</strong>
                        </span>
                      </div>

                      {appt.reason && (
                        <p className="mt-1 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">
                          <span className="font-semibold text-slate-700">Reason:</span> {appt.reason}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {appt.status !== "confirmed" && (
                        <button
                          onClick={() => changeApptStatus(appt._id, "confirmed")}
                          className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status !== "completed" && (
                        <button
                          onClick={() => changeApptStatus(appt._id, "completed")}
                          className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                        >
                          Completed
                        </button>
                      )}
                      {appt.status !== "cancelled" && (
                        <button
                          onClick={() => changeApptStatus(appt._id, "cancelled")}
                          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        onClick={() => deleteAppt(appt._id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: CLINIC INFO & HOURS ===================== */}
        {activeTab === "clinic" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" />
                Clinic Identity & Details
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700">Clinic Name</label>
                <input
                  type="text"
                  value={formData.clinicInfo.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicInfo: { ...formData.clinicInfo, name: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-semibold text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Motto / Slogan</label>
                <input
                  type="text"
                  value={formData.clinicInfo.motto}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicInfo: { ...formData.clinicInfo, motto: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Tagline</label>
                <input
                  type="text"
                  value={formData.clinicInfo.tagline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicInfo: { ...formData.clinicInfo, tagline: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Area / City</label>
                <input
                  type="text"
                  value={formData.clinicInfo.area}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicInfo: { ...formData.clinicInfo, area: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Phone Display</label>
                  <input
                    type="text"
                    value={formData.clinicInfo.phoneDisplay}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinicInfo: { ...formData.clinicInfo, phoneDisplay: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Phone Link (tel:)</label>
                  <input
                    type="text"
                    value={formData.clinicInfo.phoneHref}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        clinicInfo: { ...formData.clinicInfo, phoneHref: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Full Address</label>
                <textarea
                  rows={3}
                  value={formData.clinicInfo.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicInfo: { ...formData.clinicInfo, address: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={formData.clinicInfo.mapsEmbedUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      clinicInfo: { ...formData.clinicInfo, mapsEmbedUrl: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs font-mono text-slate-700 focus:border-teal-600 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Operating Hours Editor */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  Operating Hours Schedule
                </h2>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      clinicInfo: {
                        ...formData.clinicInfo,
                        hours: [...formData.clinicInfo.hours, { day: "New Day", time: "9:00 AM – 9:00 PM" }],
                      },
                    })
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Day
                </button>
              </div>

              <div className="space-y-3">
                {formData.clinicInfo.hours.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => {
                        const nextHours = [...formData.clinicInfo.hours];
                        nextHours[idx].day = e.target.value;
                        setFormData({
                          ...formData,
                          clinicInfo: { ...formData.clinicInfo, hours: nextHours },
                        });
                      }}
                      className="w-1/3 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-800"
                    />
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => {
                        const nextHours = [...formData.clinicInfo.hours];
                        nextHours[idx].time = e.target.value;
                        setFormData({
                          ...formData,
                          clinicInfo: { ...formData.clinicInfo, hours: nextHours },
                        });
                      }}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextHours = formData.clinicInfo.hours.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          clinicInfo: { ...formData.clinicInfo, hours: nextHours },
                        });
                      }}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: HERO & IMAGES ===================== */}
        {activeTab === "hero" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-teal-600" />
                Hero Headline & Badges
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700">Badge Text</label>
                <input
                  type="text"
                  value={formData.hero.badge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, badge: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Headline Line 1</label>
                <input
                  type="text"
                  value={formData.hero.titleLine1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, titleLine1: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Headline Line 2 (Highlighted)</label>
                <input
                  type="text"
                  value={formData.hero.titleLine2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, titleLine2: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold text-teal-700 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Hero Subtitle Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.hero.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, description: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-teal-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Primary CTA Button</label>
                  <input
                    type="text"
                    value={formData.hero.primaryCta}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, primaryCta: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={formData.hero.secondaryCta}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, secondaryCta: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Hero Images Management */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="h-5 w-5 text-teal-600" />
                Hero Images Upload & Preview
              </h2>

              {/* Main Doctor Hero Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Main Doctor Hero Image (hero-doctor.jpg)
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img
                      src={formData.hero.heroImage || "/src/assets/hero-doctor.jpg"}
                      alt="Hero doctor preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800">
                      <Upload className="h-3.5 w-3.5" /> Upload Image from Computer
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, heroImage: url },
                            })
                          )
                        }
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={formData.hero.heroImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, heroImage: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Care Image */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Secondary Care Image (hero-doctor-care.jpg)
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img
                      src={formData.hero.careImage || "/src/assets/hero-doctor-care.jpg"}
                      alt="Care doctor preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800">
                      <Upload className="h-3.5 w-3.5" /> Upload Image from Computer
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) =>
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, careImage: url },
                            })
                          )
                        }
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={formData.hero.careImage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, careImage: e.target.value },
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: ABOUT SECTION ===================== */}
        {activeTab === "about" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-600" />
                About S.V.V. Clinic Text
              </h2>

              <div>
                <label className="text-xs font-bold text-slate-700">Eyebrow</label>
                <input
                  type="text"
                  value={formData.about.eyebrow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, eyebrow: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Title</label>
                <input
                  type="text"
                  value={formData.about.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Paragraph 1</label>
                <textarea
                  rows={3}
                  value={formData.about.paragraph1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, paragraph1: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Paragraph 2</label>
                <textarea
                  rows={3}
                  value={formData.about.paragraph2}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, paragraph2: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Experience Badge</label>
                <input
                  type="text"
                  value={formData.about.experienceYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      about: { ...formData.about, experienceYears: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>
            </div>

            {/* About Image & Features */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Upload className="h-5 w-5 text-teal-600" />
                Clinic Interior Photo
              </h2>

              <div className="flex items-center gap-4">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <img
                    src={formData.about.image || "/src/assets/clinic-interior.jpg"}
                    alt="Clinic interior preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800">
                    <Upload className="h-3.5 w-3.5" /> Upload Clinic Photo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (url) =>
                          setFormData({
                            ...formData,
                            about: { ...formData.about, image: url },
                          })
                        )
                      }
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="Or paste image URL..."
                    value={formData.about.image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        about: { ...formData.about, image: e.target.value },
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Key Clinic Features</label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        about: {
                          ...formData.about,
                          features: [...formData.about.features, "New clinic feature"],
                        },
                      })
                    }
                    className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {formData.about.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feat}
                      onChange={(e) => {
                        const nextFeats = [...formData.about.features];
                        nextFeats[idx] = e.target.value;
                        setFormData({
                          ...formData,
                          about: { ...formData.about, features: nextFeats },
                        });
                      }}
                      className="flex-1 rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextFeats = formData.about.features.filter((_, i) => i !== idx);
                        setFormData({
                          ...formData,
                          about: { ...formData.about, features: nextFeats },
                        });
                      }}
                      className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB: DOCTORS DIRECTORY ===================== */}
        {activeTab === "doctors" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Doctors Directory</h2>
                <p className="text-xs text-slate-500">Manage doctor profiles, photos, and clinic schedules</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    doctors: [
                      ...formData.doctors,
                      {
                        id: `dr-new-${Date.now()}`,
                        name: "Dr. New Doctor",
                        designation: "Consultant Physician",
                        department: "General Medicine",
                        qualification: "MBBS, MD",
                        specialization: "General Practice",
                        experience: "5+ Years Experience",
                        availability: "Mon - Sat  10:00 AM – 5:00 PM",
                        bio: "Passionate medical practitioner providing dedicated clinical care.",
                        focusAreas: ["General Health", "Consultations"],
                        image: "",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" /> Add Doctor
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formData.doctors.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4"
                >
                  {/* Doctor Image */}
                  <div className="flex items-center gap-3">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <img
                        src={doc.image || `/src/assets/${doc.id}.jpg`}
                        alt={doc.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-200">
                        <Upload className="h-3 w-3" /> Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              const nextDocs = [...formData.doctors];
                              nextDocs[idx].image = url;
                              setFormData({ ...formData, doctors: nextDocs });
                            })
                          }
                        />
                      </label>
                      <input
                        type="text"
                        placeholder="Photo URL..."
                        value={doc.image || ""}
                        onChange={(e) => {
                          const nextDocs = [...formData.doctors];
                          nextDocs[idx].image = e.target.value;
                          setFormData({ ...formData, doctors: nextDocs });
                        }}
                        className="w-full rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-mono text-slate-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => {
                        const nextDocs = [...formData.doctors];
                        nextDocs[idx].name = e.target.value;
                        setFormData({ ...formData, doctors: nextDocs });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Designation</label>
                      <input
                        type="text"
                        value={doc.designation}
                        onChange={(e) => {
                          const nextDocs = [...formData.doctors];
                          nextDocs[idx].designation = e.target.value;
                          setFormData({ ...formData, doctors: nextDocs });
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Department</label>
                      <input
                        type="text"
                        value={doc.department}
                        onChange={(e) => {
                          const nextDocs = [...formData.doctors];
                          nextDocs[idx].department = e.target.value;
                          setFormData({ ...formData, doctors: nextDocs });
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Qualifications</label>
                    <input
                      type="text"
                      value={doc.qualification}
                      onChange={(e) => {
                        const nextDocs = [...formData.doctors];
                        nextDocs[idx].qualification = e.target.value;
                        setFormData({ ...formData, doctors: nextDocs });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Specialization</label>
                    <input
                      type="text"
                      value={doc.specialization}
                      onChange={(e) => {
                        const nextDocs = [...formData.doctors];
                        nextDocs[idx].specialization = e.target.value;
                        setFormData({ ...formData, doctors: nextDocs });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Experience</label>
                      <input
                        type="text"
                        value={doc.experience}
                        onChange={(e) => {
                          const nextDocs = [...formData.doctors];
                          nextDocs[idx].experience = e.target.value;
                          setFormData({ ...formData, doctors: nextDocs });
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700">Availability</label>
                      <input
                        type="text"
                        value={doc.availability}
                        onChange={(e) => {
                          const nextDocs = [...formData.doctors];
                          nextDocs[idx].availability = e.target.value;
                          setFormData({ ...formData, doctors: nextDocs });
                        }}
                        className="mt-1 w-full rounded-xl border border-slate-300 px-2.5 py-1.5 text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700">Bio</label>
                    <textarea
                      rows={2}
                      value={doc.bio}
                      onChange={(e) => {
                        const nextDocs = [...formData.doctors];
                        nextDocs[idx].bio = e.target.value;
                        setFormData({ ...formData, doctors: nextDocs });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete ${doc.name}?`)) {
                          const nextDocs = formData.doctors.filter((_, i) => i !== idx);
                          setFormData({ ...formData, doctors: nextDocs });
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove Doctor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: SERVICES ===================== */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">Clinic Services</h2>
                <p className="text-xs text-slate-500">Edit healthcare services displayed on the website</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    services: [
                      ...formData.services,
                      {
                        id: `service-${Date.now()}`,
                        title: "New Service",
                        tag: "Clinical Care",
                        description: "Description of the new clinical service provided by the clinic.",
                        icon: "Stethoscope",
                      },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white hover:bg-teal-700"
              >
                <Plus className="h-4 w-4" /> Add Service
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {formData.services.map((svc, idx) => (
                <div
                  key={svc.id || idx}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={svc.tag}
                      placeholder="Tag..."
                      onChange={(e) => {
                        const nextSvcs = [...formData.services];
                        nextSvcs[idx].tag = e.target.value;
                        setFormData({ ...formData, services: nextSvcs });
                      }}
                      className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 border-0"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const nextSvcs = formData.services.filter((_, i) => i !== idx);
                        setFormData({ ...formData, services: nextSvcs });
                      }}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Service Title</label>
                    <input
                      type="text"
                      value={svc.title}
                      onChange={(e) => {
                        const nextSvcs = [...formData.services];
                        nextSvcs[idx].title = e.target.value;
                        setFormData({ ...formData, services: nextSvcs });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-sm font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Description</label>
                    <textarea
                      rows={3}
                      value={svc.description}
                      onChange={(e) => {
                        const nextSvcs = [...formData.services];
                        nextSvcs[idx].description = e.target.value;
                        setFormData({ ...formData, services: nextSvcs });
                      }}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: WHY CHOOSE US ===================== */}
        {activeTab === "whyChooseUs" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600" />
              Why Choose Us Section
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-slate-700">Section Eyebrow</label>
                <input
                  type="text"
                  value={formData.whyChooseUs.eyebrow}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whyChooseUs: { ...formData.whyChooseUs, eyebrow: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Section Title</label>
                <input
                  type="text"
                  value={formData.whyChooseUs.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whyChooseUs: { ...formData.whyChooseUs, title: e.target.value },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {formData.whyChooseUs.items.map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                  <label className="text-xs font-bold text-slate-700">Point #{idx + 1} Title</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const nextItems = [...formData.whyChooseUs.items];
                      nextItems[idx].title = e.target.value;
                      setFormData({
                        ...formData,
                        whyChooseUs: { ...formData.whyChooseUs, items: nextItems },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-900"
                  />
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const nextItems = [...formData.whyChooseUs.items];
                      nextItems[idx].description = e.target.value;
                      setFormData({
                        ...formData,
                        whyChooseUs: { ...formData.whyChooseUs, items: nextItems },
                      });
                    }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB: FOOTER ===================== */}
        {activeTab === "footer" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 max-w-2xl">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              Footer & Legal Text
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-700">Emergency Warning Note</label>
              <textarea
                rows={2}
                value={formData.footer.emergencyNote}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, emergencyNote: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Copyright Line</label>
              <input
                type="text"
                value={formData.footer.copyright}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, copyright: e.target.value },
                  })
                }
                className="mt-1 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
