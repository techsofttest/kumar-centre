"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
    Activity,
    Users,
    Clock,
    CheckCircle2,
    Calendar,
    Plus,
    ChevronRight,
    TrendingUp,
    Zap,
    HeartPulse,
    ShieldCheck,
    FileText,
    CreditCard,
    X,
    CalendarPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

interface PhysioSession {
    id: string;
    patientName: string;
    age: number;
    time: string;
    condition: string;
    modality: string;
    sessionNumber: number;
    totalSessions: number;
    painScore: number; // 1-10
    status: "Scheduled" | "In Therapy" | "Completed";
    referringDoctor: string;
    exercises: string[];
}

export default function PhysiotherapistDashboard() {
    const todayYMD = useMemo(() => {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }, []);

    const [sessions, setSessions] = useState<PhysioSession[]>([
        {
            id: "PHY-01",
            patientName: "Rahul Menon",
            age: 42,
            time: "09:00 AM",
            condition: "Lumbar Disc Herniation (L4-L5)",
            modality: "IDD THERAPY & SPINAL DECOMPRESSION",
            sessionNumber: 5,
            totalSessions: 12,
            painScore: 6,
            status: "In Therapy",
            referringDoctor: "Dr. SASIKUMAR",
            exercises: ["McKenzie Extensions", "Bridging Sets", "Cat-Camel Stretches"]
        },
        {
            id: "PHY-02",
            patientName: "Vishnu Namboothiri",
            age: 36,
            time: "10:15 AM",
            condition: "Chronic Lumbar Muscle Spasm & Facet Strain",
            modality: "WARMING & MASSAGE with Deep Tissue Release",
            sessionNumber: 8,
            totalSessions: 16,
            painScore: 4,
            status: "Scheduled",
            referringDoctor: "Dr. MALINI SASIKUMAR",
            exercises: ["McKenzie Prone Press-ups", "Lumbar Rotation Stretches", "Cat-Camel"]
        },
        {
            id: "PHY-03",
            patientName: "Priya Varma",
            age: 29,
            time: "11:30 AM",
            condition: "Cervicothoracic Radiculopathy & Disc Bulge",
            modality: "LASER TREATMENT & Cervical Mobilization",
            sessionNumber: 3,
            totalSessions: 8,
            painScore: 7,
            status: "Scheduled",
            referringDoctor: "Dr. SRUTHI SASIKUMAR",
            exercises: ["Chin Tucks", "Scapular Retractions", "Levator Scapulae Stretch"]
        },
        {
            id: "PHY-04",
            patientName: "Anjali Nair",
            age: 34,
            time: "08:15 AM",
            condition: "Sacroiliac Joint Dysfunction & Lumbar Instability",
            modality: "PROLOTHERAPY Rehab & Core Strengthening",
            sessionNumber: 6,
            totalSessions: 10,
            painScore: 3,
            status: "Completed",
            referringDoctor: "Dr. SREENATH",
            exercises: ["Pelvic Tilts", "Bridging Exercises", "Bird-Dog Core Stability"]
        }
    ]);

    const [activeSession, setActiveSession] = useState<PhysioSession | null>(sessions[0]);
    const [todayPainScore, setTodayPainScore] = useState<number>(activeSession?.painScore || 5);
    const [completedExercises, setCompletedExercises] = useState<string[]>([]);
    const [therapistNote, setTherapistNote] = useState("");
    const [consultationFee, setConsultationFee] = useState("650");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Next Session modal state
    const [showNextSessionModal, setShowNextSessionModal] = useState(false);
    const [nextPatientName, setNextPatientName] = useState("");
    const [nextDate, setNextDate] = useState(todayYMD);
    const [nextTime, setNextTime] = useState("10:00 AM");
    const [nextModality, setNextModality] = useState("");
    const [nextDoctor, setNextDoctor] = useState("Dr. SASIKUMAR");
    const [nextFee, setNextFee] = useState("650");
    const [nextNotes, setNextNotes] = useState("");

    const updateStatus = (id: string, newStatus: PhysioSession["status"]) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        if (activeSession && activeSession.id === id) {
            setActiveSession(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleSaveSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSession) return;

        updateStatus(activeSession.id, "Completed");
        setSuccessMessage(`Session recorded for ${activeSession.patientName}! Fee: ₹${consultationFee}.`);

        // Also persist to kumar_consultations so Patient Database displays it
        try {
            const sessionRecord = {
                id: `PT-${Date.now()}`,
                patientName: activeSession.patientName,
                date: new Date().toISOString().split("T")[0],
                time: activeSession.time || "10:00 AM",
                doctor: "PHYSIOTHERAPIST",
                service: activeSession.modality || "Physiotherapy & Rehab",
                consultationFee: consultationFee.trim() || "0",
                amount: consultationFee.trim() || "0",
                fee: consultationFee.trim() || "0",
                notes: therapistNote || "Therapy session completed successfully.",
                status: "Completed"
            };
            const existingRaw = localStorage.getItem("kumar_consultations");
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            localStorage.setItem("kumar_consultations", JSON.stringify([sessionRecord, ...existing]));
        } catch (err) {
            console.error("Failed to persist physio session", err);
        }

        setTimeout(() => setSuccessMessage(null), 4000);
        setTherapistNote("");
        setCompletedExercises([]);
    };

    const openNextSessionBooking = (session?: PhysioSession | null) => {
        const s = session || activeSession;
        if (s) {
            setNextPatientName(s.patientName);
            setNextModality(s.modality);
            setNextDoctor(s.referringDoctor || "Dr. SASIKUMAR");
        } else {
            setNextPatientName("Rahul Menon");
            setNextModality("IDD THERAPY & SPINAL DECOMPRESSION");
            setNextDoctor("Dr. SASIKUMAR");
        }
        setNextDate(todayYMD);
        setNextTime("10:00 AM");
        setNextFee("650");
        setNextNotes("");
        setShowNextSessionModal(true);
    };

    const handleSaveNextAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nextPatientName.trim()) return;

        const newId = `APT-PT-${Date.now().toString().slice(-4)}`;
        const newAppointment = {
            id: newId,
            patientId: activeSession?.id || `PAT-${Math.floor(100 + Math.random() * 900)}`,
            patientName: nextPatientName.trim(),
            service: nextModality.trim() || "Physiotherapy & Rehab Session",
            clinician: "PHYSIOTHERAPIST",
            referringDoctor: nextDoctor,
            date: nextDate,
            time: nextTime,
            duration: 45,
            status: "Confirmed",
            amount: nextFee.trim() || "650",
            fee: nextFee.trim() || "650",
            patientNotes: nextNotes || `Next therapy follow-up session. Referring doctor: ${nextDoctor}.`,
            internalNotes: `Booked by Physiotherapist. Referring doctor: ${nextDoctor}. Visible to Receptionist and Admin.`
        };

        try {
            const existingRaw = localStorage.getItem("kumar_appointments");
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            localStorage.setItem("kumar_appointments", JSON.stringify([newAppointment, ...existing]));
        } catch (err) {
            console.error("Failed to persist next appointment", err);
        }

        // Also if date is today, append to current sessions
        if (nextDate === todayYMD) {
            setSessions(prev => [
                ...prev,
                {
                    id: `PHY-${Math.floor(10 + Math.random() * 89)}`,
                    patientName: nextPatientName.trim(),
                    age: activeSession?.age || 35,
                    time: nextTime,
                    condition: activeSession?.condition || "Rehabilitation Follow-up",
                    modality: nextModality.trim(),
                    sessionNumber: (activeSession?.sessionNumber || 1) + 1,
                    totalSessions: activeSession?.totalSessions || 10,
                    painScore: todayPainScore,
                    status: "Scheduled",
                    referringDoctor: nextDoctor,
                    exercises: activeSession?.exercises || ["Active Range of Motion Sets"]
                }
            ]);
        }

        setShowNextSessionModal(false);
        setSuccessMessage(`Next therapy session confirmed for ${nextPatientName} on ${nextDate} at ${nextTime}! (Visible to Receptionists and Admins)`);
        setTimeout(() => setSuccessMessage(null), 5000);
    };

    const toggleExercise = (ex: string) => {
        setCompletedExercises(prev =>
            prev.includes(ex) ? prev.filter(e => e !== ex) : [...prev, ex]
        );
    };

    const inTherapyCount = sessions.filter(s => s.status === "In Therapy").length;
    const completedCount = sessions.filter(s => s.status === "Completed").length;
    const scheduledCount = sessions.filter(s => s.status === "Scheduled").length;

    return (
        <div className="flex w-full flex-col gap-8 p-8">
            {/* Success Toast */}
            {successMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-teal-300 bg-teal-50 p-4 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300 animate-in fade-in slide-in-from-top duration-300">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 dark:text-teal-400 shrink-0" />
                    <span className="text-sm font-medium">{successMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                            Physiotherapy & Rehabilitation • Kumar Centres
                        </span>
                    </div>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        Physiotherapist Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        PHYSIOTHERAPIST • Rehabilitation Suite Bay 1-4 • Physical Therapy Operations
                    </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    <Button
                        variant="filled"
                        icon={CalendarPlus}
                        onClick={() => openNextSessionBooking()}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
                    >
                        Schedule Next Therapy Session
                    </Button>
                    <Link href="/dashboard/schedule">
                        <Button variant="outline" icon={Calendar}>
                            Therapy Schedule
                        </Button>
                    </Link>
                    <Link href="/dashboard/patients">
                        <Button variant="outline" icon={FileText}>
                            Patient Database
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">In Rehab Bay Now</span>
                        <Zap className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{inTherapyCount}</span>
                        <span className="text-xs font-medium text-teal-600">Active modality</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Scheduled Today</span>
                        <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{scheduledCount}</span>
                        <span className="text-xs font-medium text-blue-600">Upcoming sessions</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Completed Sessions</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{completedCount}</span>
                        <span className="text-xs font-medium text-emerald-600">Logged today</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Avg. Recovery Rate</span>
                        <TrendingUp className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">88%</span>
                        <span className="text-xs font-medium text-green-600">+5% vs target</span>
                    </div>
                </div>
            </div>

            {/* Split layout: Schedule on left, Rehab Workspace on right */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                {/* Left: Today's Sessions List (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                            Today's Therapy Roster
                        </h2>
                        <span className="text-xs text-foreground/60">
                            Select patient to log therapy session and notes
                        </span>
                    </div>

                    <div className="space-y-3">
                        {sessions.map((s) => {
                            const isSelected = activeSession?.id === s.id;

                            return (
                                <div
                                    key={s.id}
                                    onClick={() => {
                                        setActiveSession(s);
                                        setTodayPainScore(s.painScore);
                                    }}
                                    className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/20 shadow-md ring-1 ring-teal-500"
                                            : "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900 hover:border-black/20 dark:hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 font-bold text-xs">
                                            {s.id}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-foreground">
                                                    {s.patientName}
                                                </span>
                                                <span className="text-xs text-foreground/50">
                                                    ({s.age}y)
                                                </span>
                                                <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-foreground/70">
                                                    Ref: {s.referringDoctor}
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 mt-0.5">
                                                {s.condition}
                                            </span>
                                            <span className="text-xs text-foreground/60 mt-0.5">
                                                Modality: {s.modality}
                                            </span>


                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                                        <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                                            <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                            {s.time}
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            s.status === "In Therapy"
                                                ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 animate-pulse"
                                                : s.status === "Scheduled"
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        }`}>
                                            {s.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Active Therapy Workspace (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        Physical Therapy & Rehab Console
                    </h2>

                    {activeSession ? (
                        <div className="flex flex-col rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                                        Rehab Bay
                                    </span>
                                    <h3 className="text-xl font-bold text-foreground">
                                        {activeSession.patientName}
                                    </h3>
                                    <p className="text-xs text-foreground/60">
                                        {activeSession.condition}
                                    </p>
                                </div>

                                <div>
                                    {activeSession.status !== "In Therapy" && activeSession.status !== "Completed" && (
                                        <Button
                                            size="sm"
                                            className="bg-teal-600 hover:bg-teal-700 text-white"
                                            onClick={() => updateStatus(activeSession.id, "In Therapy")}
                                        >
                                            Begin Therapy
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleSaveSession} className="space-y-5 mt-4">




                                {/* Clinical Notes */}
                                <div>
                                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                                        Session Assessment & Range of Motion (ROM)
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={therapistNote}
                                        onChange={(e) => setTherapistNote(e.target.value)}
                                        placeholder="Note patient tolerance, joint mobility, ultrasound dosage..."
                                        className="w-full rounded-md border border-foreground/20 bg-transparent p-2.5 text-sm text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    />
                                </div>

                                {/* Consultation / Therapy Fee */}
                                <div>
                                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                                        Consultation / Therapy Fee (₹)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-foreground/50">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={consultationFee}
                                            onChange={(e) => setConsultationFee(e.target.value)}
                                            placeholder="Enter session fee (e.g. 650)"
                                            className="w-full rounded-md border border-foreground/20 bg-transparent pl-8 pr-3 py-2 text-sm font-medium text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                                    <Button
                                        type="submit"
                                        variant="filled"
                                        className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                                    >
                                        Complete Session & Update Chart
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => openNextSessionBooking(activeSession)}
                                        className="border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-300 dark:hover:bg-teal-950/40"
                                    >
                                        Book Next Session
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => updateStatus(activeSession.id, "Scheduled")}
                                    >
                                        Reschedule
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/20 p-12 text-center dark:border-white/20">
                            <Activity className="h-10 w-10 text-foreground/40 mb-3" />
                            <p className="text-sm font-medium text-foreground">No session selected</p>
                            <p className="text-xs text-foreground/60 mt-1">Select a patient from the roster to begin therapy</p>
                        </div>
                    )}
                </div>

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
                                    <p className="text-xs text-foreground/60">This appointment is saved as a Physio appointment and visible to Receptionists and Admins</p>
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

                        <form onSubmit={handleSaveNextAppointment} className="mt-5 space-y-4">
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
                                    Therapy Modality / Service Required
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nextModality}
                                    onChange={(e) => setNextModality(e.target.value)}
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
                                        Next Session Date (Current/Future Only)
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

                            {/* Consultation Fee */}
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
                                    Rehab Instructions / Target Modality Notes
                                </label>
                                <textarea
                                    rows={2}
                                    value={nextNotes}
                                    onChange={(e) => setNextNotes(e.target.value)}
                                    placeholder="e.g. Next session to advance to active resisted exercises, check lumbar extension..."
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
