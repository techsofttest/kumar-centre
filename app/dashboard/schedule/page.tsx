"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
    Clock,
    User,
    CheckCircle2,
    Stethoscope,
    ShieldAlert,
    Calendar as CalendarIcon,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Activity,
    Plus,
    X,
    CreditCard
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { normalizeRole } from "@/lib/roles";

// Status Types
type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled";

interface ClinicalAppointment {
    id: string;
    patientId: string;
    patientName: string;
    service: string;
    clinician?: string;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
    notes: boolean;
    referringDoctor?: string;
    amount?: string | number;
}

const STATUS_OPTIONS: AppointmentStatus[] = ["Pending", "Confirmed", "Cancelled"];

const STATUS_STYLES: Record<AppointmentStatus, { pill: string; dot: string; option: string }> = {
    "Confirmed":  { pill: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",    dot: "bg-green-500",   option: "text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
    "Pending":    { pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300", dot: "bg-orange-500", option: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
    "Cancelled":  { pill: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",             dot: "bg-red-500",    option: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20" },
};

const formatDateYMD = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

// Custom Status Dropdown Component
function StatusDropdown({
    status,
    onChange,
}: {
    status: AppointmentStatus;
    onChange: (s: AppointmentStatus) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const styles = STATUS_STYLES[status] || STATUS_STYLES["Confirmed"];

    return (
        <div ref={ref} className="relative">
            {/* Trigger pill */}
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex h-9 items-center gap-1.5 rounded-full pl-3 pr-2.5 text-xs font-semibold transition-opacity hover:opacity-80 ${styles.pill}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                {status}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            {open && (
                <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-xl border border-black/[.1] bg-white dark:bg-zinc-950 dark:border-white/[.12] shadow-lg py-1.5">
                    {STATUS_OPTIONS.map((opt) => {
                        const s = STATUS_STYLES[opt];
                        const isActive = opt === status;
                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => { onChange(opt); setOpen(false); }}
                                className="flex w-full items-center justify-between gap-3 px-3 py-1.5 hover:bg-black/[.03] dark:hover:bg-white/[.04] transition-colors"
                            >
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.pill}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                                    {opt}
                                </span>
                                {isActive && (
                                    <svg className="h-3 w-3 text-foreground/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function ClinicianSchedule() {
    const [userRole, setUserRole] = useState<string>("Doctor");
    const todayYMD = useMemo(() => formatDateYMD(new Date()), []);
    
    // Default show only current day's schedule
    const [selectedDate, setSelectedDate] = useState<string>(todayYMD);

    // Next Session modal state (for Physiotherapists to schedule next therapy sessions)
    const [showNextSessionModal, setShowNextSessionModal] = useState(false);
    const [nextPatientName, setNextPatientName] = useState("");
    const [nextPatientId, setNextPatientId] = useState("");
    const [nextDate, setNextDate] = useState(todayYMD);
    const [nextTime, setNextTime] = useState("10:00 AM");
    const [nextService, setNextService] = useState("Spinal Decompression & Core Stabilization");
    const [nextDoctor, setNextDoctor] = useState("Dr. SASIKUMAR");
    const [nextFee, setNextFee] = useState("650");
    const [nextNotes, setNextNotes] = useState("");
    const [bookingToast, setBookingToast] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("userRole");
        if (stored) setUserRole(stored);
    }, []);

    const normalizedRole = normalizeRole(userRole);
    const isPhysio = normalizedRole === "Physiotherapist";

    // Base mock appointments aligned to today's date
    const [allAppointments, setAllAppointments] = useState<ClinicalAppointment[]>([]);

    useEffect(() => {
        const defaultDoctorMocks: ClinicalAppointment[] = [
            { id: "APT-101", patientId: "REF-8000", patientName: "Anjali Nair", service: "Spine & Orthopedic Evaluation", date: todayYMD, time: "09:00 AM", duration: 60, status: "Confirmed", notes: true, amount: "500" },
            { id: "APT-102", patientId: "REF-8001", patientName: "Rahul Menon", service: "IDD THERAPY Clinical Review", date: todayYMD, time: "10:30 AM", duration: 45, status: "Confirmed", notes: false, amount: "500" },
            { id: "APT-103", patientId: "REF-8002", patientName: "Deepa Pillai", service: "PROLOTHERAPY Consultation", date: todayYMD, time: "11:30 AM", duration: 45, status: "Confirmed", notes: false, amount: "500" },
            { id: "APT-104", patientId: "REF-8003", patientName: "Vishnu Namboothiri", service: "Spine Mobility Review", date: todayYMD, time: "02:00 PM", duration: 30, status: "Pending", notes: false, amount: "500" },
        ];

        const defaultPhysioMocks: ClinicalAppointment[] = [
            { id: "APT-PT-01", patientId: "REF-8001", patientName: "Rahul Menon", service: "IDD THERAPY & SPINAL DECOMPRESSION", date: todayYMD, time: "09:00 AM", duration: 45, status: "Confirmed", notes: true, referringDoctor: "Dr. SASIKUMAR", amount: "650" },
            { id: "APT-PT-02", patientId: "REF-8003", patientName: "Vishnu Namboothiri", service: "WARMING & MASSAGE with Deep Tissue Release", date: todayYMD, time: "10:15 AM", duration: 45, status: "Confirmed", notes: false, referringDoctor: "Dr. MALINI SASIKUMAR", amount: "650" },
            { id: "APT-PT-03", patientId: "REF-8002", patientName: "Priya Varma", service: "LASER TREATMENT & Cervical Mobilization", date: todayYMD, time: "11:30 AM", duration: 30, status: "Pending", notes: false, referringDoctor: "Dr. SRUTHI SASIKUMAR", amount: "650" },
            { id: "APT-PT-04", patientId: "REF-8000", patientName: "Anjali Nair", service: "PROLOTHERAPY Rehab & Core Strengthening", date: todayYMD, time: "02:00 PM", duration: 45, status: "Confirmed", notes: true, referringDoctor: "Dr. SREENATH", amount: "650" },
        ];

        const baseDefaults = isPhysio ? defaultPhysioMocks : defaultDoctorMocks;

        // Also load dynamically created appointments from localStorage
        try {
            const storedRaw = localStorage.getItem("kumar_appointments");
            if (storedRaw) {
                const storedList = JSON.parse(storedRaw);
                if (Array.isArray(storedList)) {
                    // Filter based on role: physio sees physio appointments, doctor sees doctor appointments
                    const relevantStored = storedList.filter((item: any) => {
                        const clinician = (item.clinician || "").toUpperCase();
                        const srv = (item.service || "").toLowerCase();
                        const isItemPhysio = clinician === "PHYSIOTHERAPIST" || srv.includes("physio") || srv.includes("rehab") || srv.includes("decompression") || srv.includes("tens") || srv.includes("cryo");
                        return isPhysio ? isItemPhysio : !isItemPhysio;
                    });

                    const mapped: ClinicalAppointment[] = relevantStored.map((item: any) => ({
                        id: item.id || `APT-${Math.floor(100 + Math.random() * 900)}`,
                        patientId: item.patientId || "PAT-1000",
                        patientName: item.patientName || "Walk-in Patient",
                        service: item.service || (isPhysio ? "Physiotherapy & Rehab" : "General Consultation"),
                        clinician: item.clinician || (isPhysio ? "PHYSIOTHERAPIST" : "Dr. SASIKUMAR"),
                        referringDoctor: item.referringDoctor || (isPhysio ? "Dr. SASIKUMAR" : undefined),
                        date: item.date || todayYMD,
                        time: item.time || "10:00 AM",
                        duration: 45,
                        status: (item.status as AppointmentStatus) || "Confirmed",
                        notes: !!item.patientNotes,
                        amount: item.amount || item.fee || (isPhysio ? "650" : "500")
                    }));

                    // Combine avoiding duplicate IDs
                    const ids = new Set(mapped.map(m => m.id));
                    const filteredDefaults = baseDefaults.filter(d => !ids.has(d.id));
                    setAllAppointments([...mapped, ...filteredDefaults]);
                    return;
                }
            }
        } catch (e) {
            console.error("Error loading stored appointments", e);
        }

        setAllAppointments(baseDefaults);
    }, [todayYMD, isPhysio]);

    // Navigate date forward & backward
    const handlePrevDay = () => {
        try {
            const [y, m, d] = selectedDate.split("-").map(Number);
            const prev = new Date(y, m - 1, d - 1);
            setSelectedDate(formatDateYMD(prev));
        } catch {
            setSelectedDate(todayYMD);
        }
    };

    const handleNextDay = () => {
        try {
            const [y, m, d] = selectedDate.split("-").map(Number);
            const next = new Date(y, m - 1, d + 1);
            setSelectedDate(formatDateYMD(next));
        } catch {
            setSelectedDate(todayYMD);
        }
    };

    const handleToday = () => {
        setSelectedDate(todayYMD);
    };

    const updateStatus = (id: string, newStatus: AppointmentStatus) => {
        setAllAppointments(prev => prev.map(apt =>
            apt.id === id ? { ...apt, status: newStatus } : apt
        ));
    };

    // Open booking modal for next therapy session
    const handleOpenNextBooking = (apt?: ClinicalAppointment) => {
        if (apt) {
            setNextPatientName(apt.patientName);
            setNextPatientId(apt.patientId);
            setNextService(apt.service);
            setNextDoctor(apt.referringDoctor || "Dr. SASIKUMAR");
            setNextFee(String(apt.amount || "650"));
        } else {
            setNextPatientName("Rahul Menon");
            setNextPatientId("REF-8001");
            setNextService("IDD THERAPY & SPINAL DECOMPRESSION");
            setNextDoctor("Dr. SASIKUMAR");
            setNextFee("650");
        }
        setNextDate(todayYMD);
        setNextTime("10:00 AM");
        setNextNotes("");
        setShowNextSessionModal(true);
    };

    const handleSaveNextTherapySession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nextPatientName.trim()) return;

        const newId = `APT-PT-${Date.now().toString().slice(-4)}`;
        const newAptRecord: ClinicalAppointment = {
            id: newId,
            patientId: nextPatientId || `PAT-${Math.floor(100 + Math.random() * 900)}`,
            patientName: nextPatientName.trim(),
            service: nextService.trim() || "Physiotherapy & Rehab Session",
            clinician: "PHYSIOTHERAPIST",
            referringDoctor: nextDoctor || "Dr. SASIKUMAR",
            date: nextDate,
            time: nextTime,
            duration: 45,
            status: "Confirmed",
            notes: !!nextNotes,
            amount: nextFee.trim() || "650"
        };

        // Save into kumar_appointments in localStorage so Receptionist and Admin see it immediately
        try {
            const existingRaw = localStorage.getItem("kumar_appointments");
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            const savedAppointment = {
                id: newId,
                patientId: newAptRecord.patientId,
                patientName: newAptRecord.patientName,
                service: newAptRecord.service,
                clinician: "PHYSIOTHERAPIST",
                referringDoctor: nextDoctor || "Dr. SASIKUMAR",
                date: nextDate,
                time: nextTime,
                duration: 45,
                status: "Confirmed",
                amount: newAptRecord.amount,
                fee: newAptRecord.amount,
                patientNotes: nextNotes || `Next therapy follow-up session. Referred by ${nextDoctor || "Dr. SASIKUMAR"}.`,
                internalNotes: `Booked by Physiotherapist for next rehab session. Referring Doctor: ${nextDoctor || "Dr. SASIKUMAR"}.`
            };
            localStorage.setItem("kumar_appointments", JSON.stringify([savedAppointment, ...existing]));
        } catch (err) {
            console.error("Failed to save next therapy session", err);
        }

        // Add to local state if on the same date or upcoming
        setAllAppointments(prev => [newAptRecord, ...prev]);
        setShowNextSessionModal(false);
        setBookingToast(`Next therapy session confirmed for ${nextPatientName} on ${nextDate} at ${nextTime}! (Visible to Receptionist and Admin)`);
        setTimeout(() => setBookingToast(null), 5000);
    };

    // Filtered by selected date: default shows only current day's schedule
    const displayedAppointments = useMemo(() => {
        return allAppointments.filter(apt => apt.date === selectedDate);
    }, [allAppointments, selectedDate]);

    const isToday = selectedDate === todayYMD;

    // Formatted date string for display
    const formattedDateText = useMemo(() => {
        try {
            const [y, m, d] = selectedDate.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            return dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
        } catch {
            return selectedDate;
        }
    }, [selectedDate]);

    const isAuthorized = ["Doctor", "Physiotherapist", "admin", "super_admin", "clinician", "administrator"].includes(userRole) || ["Doctor", "Physiotherapist"].includes(normalizedRole);

    if (!isAuthorized) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-400" />
                <h1 className="text-2xl font-bold text-foreground">Clinical Access Required</h1>
                <p className="mt-2 text-foreground/60">
                    This module is restricted to medical and clinical personnel (Doctors, Physiotherapists & Administrators).
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-8">

            {/* Notification Toast */}
            {bookingToast && (
                <div className="flex items-center gap-3 rounded-xl border border-teal-300 bg-teal-50 p-4 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 animate-in fade-in duration-300">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="text-sm font-medium">{bookingToast}</span>
                </div>
            )}

            {/* Header & Metrics */}
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                            isPhysio
                                ? "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        }`}>
                            {isPhysio ? "Physiotherapy & Rehabilitation Department" : "Kumar Centres Clinical Schedule"}
                        </span>
                        {isToday && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                Today
                            </span>
                        )}
                    </div>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        {isPhysio ? "Physiotherapy Schedule" : "My Schedule"}
                    </h1>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground/70">
                        <CalendarIcon className={`h-4 w-4 ${isPhysio ? "text-teal-600" : "text-[#3C43EC]"}`} />
                        <span>{formattedDateText}</span>
                    </div>
                </div>

                {/* Actions & Metrics */}
                <div className="flex flex-wrap items-center gap-4">

                    <div className="flex gap-3">
                        <div className="flex flex-col rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 px-5 py-3 dark:border-white/[.22] shadow-sm">
                            <span className="text-xs font-semibold uppercase text-foreground/50">Scheduled</span>
                            <span className="text-2xl font-bold text-foreground">{displayedAppointments.length}</span>
                        </div>
                        <div className="flex flex-col rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 px-5 py-3 dark:border-white/[.22] shadow-sm">
                            <span className="text-xs font-semibold uppercase text-foreground/50">Confirmed</span>
                            <span className="text-2xl font-bold text-emerald-600">
                                {displayedAppointments.filter(a => a.status === "Confirmed").length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Date Navigation Bar (Forward, Backward, Today, Picker) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-black/[.12] bg-white p-4 shadow-sm dark:border-white/[.15] dark:bg-zinc-900">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handlePrevDay}
                        icon={ChevronLeft}
                        className="h-10 px-3.5"
                    >
                        Previous Day
                    </Button>

                    <Button
                        type="button"
                        variant={isToday ? "filled" : "outline"}
                        size="sm"
                        onClick={handleToday}
                        className={`h-10 px-4 ${isToday ? (isPhysio ? "bg-teal-600 hover:bg-teal-700 text-white" : "bg-[#3C43EC] hover:bg-[#3239cb] text-white") : ""}`}
                    >
                        Today
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleNextDay}
                        className="h-10 px-3.5 flex items-center gap-1.5"
                    >
                        <span>Next Day</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 shrink-0">
                        Jump to Date:
                    </span>
                    <div className="w-52">
                        <DatePicker
                            value={selectedDate}
                            onChange={(d) => {
                                if (d) setSelectedDate(d);
                            }}
                            placeholder="Select date"
                        />
                    </div>
                </div>
            </div>

            {/* Clinical Timeline Feed */}
            <div className="flex flex-col gap-4">
                {displayedAppointments.map((apt) => (
                    <div
                        key={apt.id}
                        className={`group relative flex flex-col gap-4 rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 transition-all dark:border-white/[.22] md:flex-row md:items-center md:justify-between shadow-sm ${
                            apt.status === "Confirmed" ? "border-green-300 dark:border-green-700/60" : ""
                        }`}
                    >
                        {/* Timeline Indicator Line */}
                        <div className="absolute bottom-0 left-8 top-0 hidden w-px bg-black/[.04] dark:bg-white/[.04] md:block -z-10" />

                        {/* Left: Time & Patient Info */}
                        <div className="flex items-start gap-6 md:items-center">
                            <div className="flex flex-col items-start md:items-end md:w-24">
                                <span className="text-lg font-bold text-foreground">{apt.time.split(" ")[0]}</span>
                                <span className="text-xs font-medium text-foreground/50">{apt.time.split(" ")[1]}</span>
                                <span className="mt-1 flex items-center gap-1 text-xs font-medium text-foreground/40">
                                    <Clock className="h-3 w-3" /> {apt.duration}m
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-xl font-semibold tracking-tight text-foreground">{apt.patientName}</h3>
                                    {!isPhysio && apt.referringDoctor && (
                                        <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
                                            Ref: {apt.referringDoctor}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-sm font-medium ${isPhysio ? "text-teal-700 dark:text-teal-300" : "text-blue-600 dark:text-blue-400"}`}>
                                    {apt.service}
                                </span>
                                {!isPhysio && (
                                    <div className="flex items-center gap-2 text-xs text-foreground/50">
                                        <span>ID: {apt.patientId}</span>
                                        <span>•</span>
                                        <span>Ref: {apt.id}</span>
                                        {apt.amount && (
                                            <>
                                                <span>•</span>
                                                <span className="font-semibold text-emerald-600">₹{apt.amount}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Clinical Actions */}
                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-black/[.15] pt-4 dark:border-white/[.22] md:mt-0 md:border-0 md:pt-0">

                            {/* Custom Status Pill Dropdown */}
                            <StatusDropdown
                                status={apt.status}
                                onChange={(s) => updateStatus(apt.id, s)}
                            />

                            {/* Direct Link to Patient Detail Page in Patient Database */}
                            <Link
                                href={`/dashboard/patients/${apt.patientId}`}
                                className="flex h-10 items-center justify-center gap-2 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.22] dark:hover:bg-[#1a1a1a]"
                            >
                                <User className="h-4 w-4" />
                                Patient Details
                            </Link>

                            {/* Direct Link to Consult / Start Session */}
                            {isPhysio ? (
                                <Link
                                    href="/dashboard/physiotherapist"
                                    className="flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
                                >
                                    <Activity className="h-4 w-4" />
                                    Start Therapy
                                </Link>
                            ) : (
                                <Link
                                    href="/dashboard/doctor"
                                    className="flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-all bg-[#3C43EC] text-white hover:bg-[#3239cb]"
                                >
                                    <Stethoscope className="h-4 w-4" />
                                    Consult
                                </Link>
                            )}

                        </div>
                    </div>
                ))}

                {displayedAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/[.15] py-16 dark:border-white/[.22] bg-slate-50/50 dark:bg-zinc-900/30">
                        <CalendarDays className="mb-3 h-10 w-10 text-foreground/30" />
                        <p className="text-base font-semibold text-foreground">
                            No {isPhysio ? "therapy sessions" : "appointments"} scheduled for {formattedDateText}
                        </p>
                        <p className="text-xs text-foreground/50 mt-1">
                            Navigate forward or backward to view other dates on your clinical schedule.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleToday}
                            >
                                Return to Today
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal: Schedule Next Therapy Session */}
            {showNextSessionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-black/15 bg-white p-6 shadow-2xl dark:border-white/20 dark:bg-zinc-900 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                                    <Activity className="h-4 w-4" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Schedule Next Therapy Session</h3>
                                    <p className="text-xs text-foreground/60">This appointment will be visible to Receptionists and Admins</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowNextSessionModal(false)}
                                className="rounded-lg p-1.5 text-foreground/60 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveNextTherapySession} className="mt-5 space-y-4">
                            {/* Patient Name */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                    Patient Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nextPatientName}
                                    onChange={(e) => setNextPatientName(e.target.value)}
                                    placeholder="Enter patient name"
                                    className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/15"
                                />
                            </div>

                            {/* Service / Modality */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                    Therapy Modality / Service
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nextService}
                                    onChange={(e) => setNextService(e.target.value)}
                                    placeholder="e.g. Spinal Decompression & Core Stabilization"
                                    className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/15"
                                />
                            </div>

                            {/* Clinician & Referring Doctor */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                        Assigned Clinician
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value="PHYSIOTHERAPIST"
                                        className="w-full rounded-lg border border-black/15 bg-slate-100 dark:bg-white/5 px-3 py-2 text-xs font-bold text-teal-700 dark:text-teal-300 dark:border-white/15 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                        Referring Doctor
                                    </label>
                                    <select
                                        value={nextDoctor}
                                        onChange={(e) => setNextDoctor(e.target.value)}
                                        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/15 dark:bg-zinc-900"
                                    >
                                        <option value="Dr. SASIKUMAR">Dr. SASIKUMAR</option>
                                        <option value="Dr. MALINI SASIKUMAR">Dr. MALINI SASIKUMAR</option>
                                        <option value="Dr. SRUTHI SASIKUMAR">Dr. SRUTHI SASIKUMAR</option>
                                        <option value="Dr. SREENATH">Dr. SREENATH</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                        Next Session Date
                                    </label>
                                    <DatePicker
                                        value={nextDate}
                                        minDate={todayYMD}
                                        onChange={(d) => {
                                            if (d) setNextDate(d);
                                        }}
                                        placeholder="Select date"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                        Session Time
                                    </label>
                                    <select
                                        value={nextTime}
                                        onChange={(e) => setNextTime(e.target.value)}
                                        className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/15 dark:bg-zinc-900"
                                    >
                                        <option value="09:00 AM">09:00 AM</option>
                                        <option value="09:45 AM">09:45 AM</option>
                                        <option value="10:30 AM">10:30 AM</option>
                                        <option value="11:15 AM">11:15 AM</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="02:00 PM">02:00 PM</option>
                                        <option value="03:00 PM">03:00 PM</option>
                                        <option value="04:00 PM">04:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            {/* Fee */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground/80 mb-1 flex items-center gap-1.5">
                                    <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                                    Therapy Session Fee (₹)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground/50">₹</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={nextFee}
                                        onChange={(e) => setNextFee(e.target.value)}
                                        className="w-full rounded-lg border border-black/15 bg-transparent pl-8 pr-3 py-2 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/15"
                                    />
                                </div>
                            </div>

                            {/* Session Notes */}
                            <div>
                                <label className="block text-xs font-semibold text-foreground/80 mb-1">
                                    Session Instructions / Target Modality Notes
                                </label>
                                <textarea
                                    rows={2}
                                    value={nextNotes}
                                    onChange={(e) => setNextNotes(e.target.value)}
                                    placeholder="e.g. Progress to 45 lbs traction, evaluate lumbar flexion tolerance..."
                                    className="w-full rounded-lg border border-black/15 bg-transparent p-2.5 text-xs text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-white/15"
                                />
                            </div>

                            <div className="pt-2 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNextSessionModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="filled"
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
                                >
                                    Confirm & Book Next Session
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
