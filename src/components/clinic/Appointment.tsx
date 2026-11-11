import { useState, useEffect, useCallback, type FormEvent } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Phone,
  AlertCircle,
  Loader2,
  Clock,
} from "lucide-react";
import { CLINIC, DOCTORS } from "./clinic-info";
import {
  createAppointmentApi,
  fetchDoctorsFromTimelyApi,
  fetchDoctorSlotsApi,
  type AppointmentSlot,
} from "@/lib/api";

type FormState = {
  name: string;
  mobile: string;
  doctor: string;
  date: string;
  time: string;
  reason: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = { name: "", mobile: "", doctor: "", date: "", time: "", reason: "" };

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 3) errors.name = "Please enter your full name.";
  const digits = values.mobile.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) errors.mobile = "Please enter a valid 10-digit mobile number.";
  if (!values.date) {
    errors.date = "Please choose a preferred date.";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(`${values.date}T00:00:00`) < today) errors.date = "Please choose today or a future date.";
  }
  if (!values.time) errors.time = "Please select an available time slot.";
  return errors;
}

const SHIFTS = ["Morning Shift", "Afternoon Shift", "Evening Shift"];

export function Appointment() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedName, setSubmittedName] = useState<string | null>(null);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [doctorOptions, setDoctorOptions] = useState<
    { id: string; name: string; specialization: string }[]
  >(() => DOCTORS.map((d) => ({ id: d.id, name: d.name, specialization: d.specialization })));

  // Slot state
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Load doctors from API
  useEffect(() => {
    fetchDoctorsFromTimelyApi()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((d) => ({
            id: d._id,
            name: d.name.replace(/^dr[\.\s_]*/i, "Dr. "),
            specialization: d.specialization || "General Medicine",
          }));
          setDoctorOptions(formatted);
        }
      })
      .catch(() => {});

    const onSelectDoctor = (e: any) => {
      if (e.detail?.doctorName) {
        setValues((v) => ({ ...v, doctor: e.detail.doctorName }));
      }
    };
    window.addEventListener("select-doctor", onSelectDoctor);
    return () => window.removeEventListener("select-doctor", onSelectDoctor);
  }, []);

  // Fetch slots when doctor + date both set
  const loadSlots = useCallback(
    async (doctorName: string, date: string) => {
      const doctorId = doctorOptions.find((d) => d.name === doctorName)?.id;
      if (!doctorId || !date) {
        setSlots([]);
        setSelectedSlotId(null);
        setValues((v) => ({ ...v, time: "" }));
        return;
      }
      setSlotsLoading(true);
      setSlotsError(null);
      setSlots([]);
      setSelectedSlotId(null);
      setValues((v) => ({ ...v, time: "" }));
      try {
        const fetched = await fetchDoctorSlotsApi(doctorId, date);
        setSlots(fetched);
      } catch {
        setSlotsError("Could not load slots. Please try again.");
      } finally {
        setSlotsLoading(false);
      }
    },
    [doctorOptions]
  );

  // Re-fetch whenever doctor or date changes (and both are set)
  useEffect(() => {
    if (values.doctor && values.date) {
      loadSlots(values.doctor, values.date);
    } else {
      setSlots([]);
      setSelectedSlotId(null);
      setValues((v) => ({ ...v, time: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.doctor, values.date]);

  const set = (field: keyof FormState) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setApiError(null);
  };

  const selectSlot = (slot: AppointmentSlot) => {
    setSelectedSlotId(slot._id);
    setValues((v) => ({ ...v, time: slot.startTime }));
    setErrors((prev) => ({ ...prev, time: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await createAppointmentApi({
        name: values.name.trim(),
        mobile: values.mobile,
        doctor: values.doctor || "Any Available Doctor",
        date: values.date,
        time: values.time,
        reason: values.reason.trim(),
      });

      setSubmittedName(values.name.trim());
      if (response.data?._id) setAppointmentId(response.data._id);
      setValues(EMPTY);
      setSlots([]);
      setSelectedSlotId(null);
    } catch (err: any) {
      console.error("Appointment booking error:", err);
      setApiError(err.message || "Failed to submit request. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  // Available slots only, grouped by shift
  const availableSlots = slots.filter((s) => s.isAvailable && !s.isBooked);
  const showSlotSection =
    !slotsLoading && values.doctor && values.date && !slotsError;

  return (
    <section id="appointment" className="scroll-mt-20 bg-muted/30 py-4 sm:py-6 lg:py-7">
      <div className="section-shell grid items-start gap-6 lg:gap-8 lg:grid-cols-[1fr_1.1fr]">
        {/* Left column */}
        <div>
          <p className="section-eyebrow">Appointments</p>
          <h2 className="section-title mt-2 sm:mt-3">
            Need Medical Assistance?
            <span className="block text-primary">Book Your Appointment.</span>
          </h2>
          <p className="mt-2.5 max-w-md leading-relaxed text-sm sm:text-base text-muted-foreground">
            Select a doctor and date to see real-time available slots. Our team will confirm
            your booking over a call.
          </p>

          <a
            href={CLINIC.phoneHref}
            className="mt-5 inline-flex items-center gap-4 rounded-2xl border border-border bg-card p-3.5 pr-5 shadow-sm transition-all hover:border-primary/40"
            aria-label={`Call ${CLINIC.name} at ${CLINIC.phoneDisplay}`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-left leading-tight">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Click to call
              </span>
              <span className="block text-lg font-extrabold text-foreground">{CLINIC.phoneDisplay}</span>
            </span>
          </a>
        </div>

        {/* Right column — form */}
        <form
          noValidate
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card p-7 shadow-md sm:p-9"
          aria-label="Appointment request form"
        >
          {submittedName ? (
            <div role="status" className="flex flex-col items-start gap-4 py-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">Thank you, {submittedName}!</h3>
                {appointmentId && (
                  <p className="mt-1 text-xs font-mono font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md inline-block">
                    Reference ID: #{appointmentId.slice(-6).toUpperCase()}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Your request has been received. To confirm your slot right away, please call{" "}
                  <a href={CLINIC.phoneHref} className="font-bold text-primary underline underline-offset-2">
                    {CLINIC.phoneDisplay}
                  </a>{" "}
                  during clinic hours.
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary mt-2"
                onClick={() => {
                  setSubmittedName(null);
                  setAppointmentId(null);
                  setErrors({});
                  setSlots([]);
                  setSelectedSlotId(null);
                }}
              >
                <CalendarCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                Book another appointment
              </button>
            </div>
          ) : (
            <>
              {apiError && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-xs font-semibold text-destructive">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-bold">Notice</p>
                    <p className="mt-0.5">{apiError}</p>
                  </div>
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <Field
                  id="appt-name"
                  label="Full Name"
                  value={values.name}
                  onChange={set("name")}
                  error={errors.name}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
                {/* Mobile */}
                <Field
                  id="appt-mobile"
                  label="Mobile Number"
                  type="tel"
                  inputMode="tel"
                  value={values.mobile}
                  onChange={set("mobile")}
                  error={errors.mobile}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  required
                />

                {/* Doctor */}
                <div className="sm:col-span-2">
                  <label htmlFor="appt-doctor" className="block text-xs font-bold text-foreground">
                    Select Doctor (optional)
                  </label>
                  <select
                    id="appt-doctor"
                    value={values.doctor}
                    onChange={set("doctor")}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground transition-all focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-ring/20"
                  >
                    <option value="">Any Available Doctor / General Consultation</option>
                    {doctorOptions.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} — {d.specialization}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date */}
                <div className="sm:col-span-2">
                  <Field
                    id="appt-date"
                    label="Preferred Date"
                    type="date"
                    value={values.date}
                    onChange={set("date")}
                    error={errors.date}
                    min={today}
                    required
                  />
                </div>

                {/* Slot Picker */}
                {values.doctor && values.date && (
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-xs font-bold text-foreground">
                      Available Slots{" "}
                      <span aria-hidden="true" className="text-destructive">*</span>
                    </label>

                    {/* Loading */}
                    {slotsLoading && (
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        Loading available slots…
                      </div>
                    )}

                    {/* Error */}
                    {slotsError && !slotsLoading && (
                      <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs font-semibold text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {slotsError}
                        <button
                          type="button"
                          className="ml-auto underline underline-offset-2 hover:no-underline"
                          onClick={() => loadSlots(values.doctor, values.date)}
                        >
                          Retry
                        </button>
                      </div>
                    )}

                    {/* No slots */}
                    {showSlotSection && availableSlots.length === 0 && (
                      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground">
                        <Clock className="h-4 w-4 shrink-0 text-primary" />
                        No slots available for this date. Please try a different date.
                      </div>
                    )}

                    {/* Slots grouped by shift */}
                    {showSlotSection && availableSlots.length > 0 && (
                      <div className="space-y-4 rounded-2xl border border-[#0D9488]/20 bg-[#E8F8F5]/40 p-4">
                        {SHIFTS.map((shift) => {
                          const shiftSlots = availableSlots.filter((s) => s.shift === shift);
                          if (!shiftSlots.length) return null;
                          return (
                            <div key={shift}>
                              <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#0D6E5C]">
                                {shift}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {shiftSlots.map((slot) => {
                                  const isSelected = selectedSlotId === slot._id;
                                  return (
                                    <button
                                      key={slot._id}
                                      type="button"
                                      onClick={() => selectSlot(slot)}
                                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#0D9488]/40 ${
                                        isSelected
                                          ? "border-[#0D6E5C] bg-[#0D6E5C] text-white shadow-sm"
                                          : "border-[#0D9488]/30 bg-white text-gray-700 hover:border-[#0D9488] hover:text-[#0D6E5C] hover:bg-[#D4F4EC]/50"
                                      }`}
                                      aria-pressed={isSelected}
                                    >
                                      {slot.startTime}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                        {/* Selected slot badge */}
                        {selectedSlotId && (
                          <p className="mt-1 text-xs font-semibold text-[#0D6E5C]">
                            ✓ Selected:{" "}
                            {slots.find((s) => s._id === selectedSlotId)?.startTime} —{" "}
                            {slots.find((s) => s._id === selectedSlotId)?.endTime}
                          </p>
                        )}
                        {errors.time && (
                          <p role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
                            {errors.time}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Validation error when slot section not visible */}
                    {!values.doctor || (!values.date && errors.time) ? (
                      <p role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
                        {errors.time}
                      </p>
                    ) : null}
                  </div>
                )}

                {/* Reason */}
                <div className="sm:col-span-2">
                  <Field
                    id="appt-reason"
                    label="Reason for Visit (optional)"
                    value={values.reason}
                    onChange={set("reason")}
                    placeholder="e.g. fever and cold since 2 days"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary mt-7 w-full disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Submitting Request…
                  </>
                ) : (
                  <>
                    <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                    Submit Appointment Request
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                This sends a request — the clinic confirms your slot over a call.
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  error?: string | undefined;
  placeholder?: string;
  type?: string;
  inputMode?: "tel" | "text";
  autoComplete?: string;
  min?: string;
  required?: boolean;
};

function Field({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  min,
  required,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-bold text-foreground">
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive">
            {" "}
            *
          </span>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        min={min}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none ${
          error ? "border-destructive" : "border-input"
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
