"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    Activity,
    Users,
    Clock,
    CheckCircle2,
    Calendar,
    Plus,
    ChevronRight,
    HeartPulse,
    ShieldCheck,
    FileText,
    CreditCard,
    X,
    History
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPatientsData, Patient } from "../patients/data";
import { PhysioReferrals } from "@/components/physio-referrals";
import { isPhysiotherapyAppointment } from "@/lib/appointment-types";

interface PhysioSession {
    id: string;
    patientId?: string;
    patientName: string;
    age: number;
    time: string;
    condition?: string;
    modality: string;
    sessionNumber?: number;
    totalSessions?: number;
    feePerSession: number;
    amountPaid: number;
    painScore?: number;
    status: "Pending" | "Confirmed" | "Cancelled";
    referringDoctor: string;
    exercises?: string[];
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
            patientId: "REF-8001",
            patientName: "Rahul Menon",
            age: 42,
            time: "09:00 AM",
            condition: "Lumbar Disc Herniation (L4-L5)",
            modality: "IDD THERAPY & SPINAL DECOMPRESSION",
            sessionNumber: 5,
            totalSessions: 12,
            feePerSession: 650,
            amountPaid: 3250,
            painScore: 6,
            status: "Confirmed",
            referringDoctor: "Dr. SASIKUMAR",
            exercises: ["McKenzie Extensions", "Bridging Sets", "Cat-Camel Stretches"]
        },
        {
            id: "PHY-02",
            patientId: "REF-8003",
            patientName: "Vishnu Namboothiri",
            age: 36,
            time: "10:15 AM",
            condition: "Chronic Lumbar Muscle Spasm & Facet Strain",
            modality: "WARMING & MASSAGE",
            sessionNumber: 8,
            totalSessions: 16,
            feePerSession: 650,
            amountPaid: 3900,
            painScore: 4,
            status: "Pending",
            referringDoctor: "Dr. MALINI SASIKUMAR",
            exercises: ["McKenzie Prone Press-ups", "Lumbar Rotation Stretches", "Cat-Camel"]
        },
        {
            id: "PHY-03",
            patientId: "REF-8005",
            patientName: "Priya Varma",
            age: 29,
            time: "11:30 AM",
            condition: "Cervicothoracic Radiculopathy & Disc Bulge",
            modality: "LASER TREATMENT",
            sessionNumber: 3,
            totalSessions: 8,
            feePerSession: 650,
            amountPaid: 650,
            painScore: 7,
            status: "Confirmed",
            referringDoctor: "Dr. SRUTHI SASIKUMAR",
            exercises: ["Chin Tucks", "Scapular Retractions", "Levator Scapulae Stretch"]
        },
        {
            id: "PHY-04",
            patientId: "REF-8000",
            patientName: "Anjali Nair",
            age: 34,
            time: "08:15 AM",
            condition: "Sacroiliac Joint Dysfunction & Lumbar Instability",
            modality: "PROLOTHERAPY",
            sessionNumber: 6,
            totalSessions: 10,
            feePerSession: 650,
            amountPaid: 3900,
            painScore: 3,
            status: "Confirmed",
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
    const remainingSessions = activeSession
        ? Math.max(0, (activeSession.totalSessions || 0) - (activeSession.sessionNumber || 0))
        : 0;

    const updateStatus = (id: string, newStatus: PhysioSession["status"]) => {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
        if (activeSession && activeSession.id === id) {
            setActiveSession(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleSaveSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeSession) return;

        updateStatus(activeSession.id, "Confirmed");
        setSuccessMessage(`Session recorded for ${activeSession.patientName}! Fee: ₹${consultationFee}.`);

        try {
            const sessionRecord = {
                id: `PT-${Date.now()}`,
                patientId: activeSession.patientId || activeSession.id,
                patientName: activeSession.patientName,
                date: new Date().toISOString().split("T")[0],
                time: activeSession.time || "10:00 AM",
                doctor: "PHYSIOTHERAPIST",
                service: activeSession.modality || "Physiotherapy & Rehab",
                consultationFee: consultationFee.trim() || "0",
                amount: consultationFee.trim() || "0",
                fee: consultationFee.trim() || "0",
                notes: therapistNote || "Therapy session completed successfully.",
                status: "Confirmed"
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

    const [historyPatient, setHistoryPatient] = useState<PhysioSession | null>(null);
    const [historyTab, setHistoryTab] = useState<"doctor" | "physio">("doctor");

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setHistoryPatient(null);
        };
        if (historyPatient) {
            window.addEventListener("keydown", handleKeyDown);
        }
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [historyPatient]);

    const getPatientDoctorHistory = (p: PhysioSession | null) => {
        if (!p) return [];
        let list: Patient[] = mockPatientsData;
        try {
            const stored = localStorage.getItem("patients_v5");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
            }
        } catch (_) {}

        const match = list.find(item =>
            (p.patientId && item.id === p.patientId) ||
            item.name.toLowerCase() === p.patientName.toLowerCase()
        );

        if (match && match.history?.past && match.history.past.length > 0) {
            return match.history.past;
        }

        return [
            {
                id: "DOC-REC-01",
                date: "2026-10-15",
                time: "09:30 AM",
                services: [p.modality || "Spine & Orthopedic Evaluation"],
                status: "Confirmed",
                notes: "Primary spinal evaluation conducted. Range of motion within acceptable limits. Advised ergonomic posture and core exercises.",
                prescriptions: "Tab. Paracetamol 650mg SOS, Muscle Relaxant OD at bedtime."
            },
            {
                id: "DOC-REC-02",
                date: "2026-09-28",
                time: "10:15 AM",
                services: ["General Medicine Review"],
                status: "Confirmed",
                notes: "Routine medical review. Blood pressure and vitals normal. Follow-up advised in 4 weeks.",
                prescriptions: "Multivitamin daily x 30 days."
            }
        ];
    };

    const getPatientPhysioHistory = (p: PhysioSession | null) => {
        if (!p) return [];
        const results: any[] = [];

        try {
            const rawConsultations = localStorage.getItem("kumar_consultations");
            if (rawConsultations) {
                const consultations = JSON.parse(rawConsultations);
                if (Array.isArray(consultations)) {
                    consultations.forEach((item: any) => {
                        const isPhysioDoc = (item.doctor || "").toUpperCase() === "PHYSIOTHERAPIST";
                        const srv = (item.service || "").toLowerCase();
                        const isPhysioSrv = srv.includes("physio") || srv.includes("rehab") || srv.includes("decompression") || srv.includes("tens") || srv.includes("massage");

                        if ((isPhysioDoc || isPhysioSrv) && (
                            (p.patientId && item.patientId === p.patientId) ||
                            item.patientName?.toLowerCase() === p.patientName.toLowerCase()
                        )) {
                            results.push({
                                id: item.id || `PT-${Math.floor(100 + Math.random() * 900)}`,
                                date: item.date || "2026-10-31",
                                time: item.time || "10:00 AM",
                                therapist: "PHYSIOTHERAPIST",
                                service: item.service || "Physiotherapy & Rehab Session",
                                referringDoctor: item.referringDoctor || p.referringDoctor || "Dr. SASIKUMAR",
                                notes: item.notes || "Therapy session completed. Patient tolerated active mobilizations with progressive improvement in range of motion.",
                                status: item.status || "Confirmed"
                            });
                        }
                    });
                }
            }
        } catch (_) {}

        try {
            const rawAppointments = localStorage.getItem("kumar_appointments");
            if (rawAppointments) {
                const appointments = JSON.parse(rawAppointments);
                if (Array.isArray(appointments)) {
                    appointments.forEach((item: any) => {
                        if (isPhysiotherapyAppointment(item) && (
                            (p.patientId && item.patientId === p.patientId) ||
                            item.patientName?.toLowerCase() === p.patientName.toLowerCase()
                        )) {
                            if (!results.some(r => r.id === item.id)) {
                                results.push({
                                    id: item.id || `APT-${Math.floor(100 + Math.random() * 900)}`,
                                    date: item.date || "2026-10-31",
                                    time: item.time || "10:00 AM",
                                    therapist: "PHYSIOTHERAPIST",
                                    service: item.service || "Physiotherapy Session",
                                    referringDoctor: item.referringDoctor || p.referringDoctor || "Dr. SASIKUMAR",
                                    notes: item.patientNotes || item.notes || "Rehabilitation session scheduled and completed.",
                                    status: item.status || "Confirmed"
                                });
                            }
                        }
                    });
                }
            }
        } catch (_) {}

        if (results.length === 0) {
            results.push(
                {
                    id: `PT-REC-${p.id}-01`,
                    date: "2026-10-28",
                    time: "10:00 AM",
                    therapist: "PHYSIOTHERAPIST",
                    service: p.modality || "IDD THERAPY & SPINAL DECOMPRESSION",
                    referringDoctor: p.referringDoctor || "Dr. SASIKUMAR",
                    notes: "Targeted therapy session conducted. Isometric core activations and range of motion tolerated well without radicular exacerbation.",
                    status: "Confirmed"
                },
                {
                    id: `PT-REC-${p.id}-02`,
                    date: "2026-10-21",
                    time: "11:15 AM",
                    therapist: "PHYSIOTHERAPIST",
                    service: "WARMING & MASSAGE",
                    referringDoctor: p.referringDoctor || "Dr. SASIKUMAR",
                    notes: "Superficial thermal warming followed by gentle soft tissue release. Significant reduction in paraspinal muscle hypertonicity.",
                    status: "Confirmed"
                }
            );
        }

        return results;
    };

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

            <PhysioReferrals />

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
                            const totalAmount = (s.totalSessions || 0) * s.feePerSession;
                            const remainingAmount = Math.max(0, totalAmount - s.amountPaid);
                            const sessionProgress = Math.min(100, Math.round(((s.sessionNumber || 0) / (s.totalSessions || 1)) * 100));

                            return (
                                <div
                                    key={s.id}
                                    onClick={() => {
                                        setActiveSession(s);
                                        setTodayPainScore(s.painScore ?? 5);
                                    }}
                                    className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-teal-500 bg-teal-50/60 dark:bg-teal-950/20 shadow-md ring-1 ring-teal-500"
                                            : "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900 hover:border-black/20 dark:hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-foreground">
                                                    {s.patientName}
                                                </span>
                                                <span className="text-xs text-foreground/50">
                                                    ({s.age}y)
                                                </span>
                                            </div>
                                            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 mt-1">
                                                {s.modality}
                                            </span>
                                            <div className="mt-3 w-56">
                                                <div className="mb-1 flex justify-between text-xs text-foreground/60">
                                                    <span>Sessions: {s.sessionNumber || 0} / {s.totalSessions || 0}</span>
                                                    <span>{sessionProgress}%</span>
                                                </div>
                                                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${sessionProgress}%` }} />
                                                </div>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                                <span className="text-foreground/60">Total: <strong className="text-foreground">₹{totalAmount}</strong></span>
                                                <span className="text-emerald-600">Paid: ₹{s.amountPaid}</span>
                                                <span className="text-amber-600">Remaining: ₹{remainingAmount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                                                <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                                {s.time}
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                s.status === "Confirmed"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : s.status === "Pending"
                                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                            }`}>
                                                {s.status}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setHistoryPatient(s);
                                                setHistoryTab("doctor");
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 bg-white px-2.5 py-1 text-xs font-semibold text-foreground/80 hover:bg-slate-50 dark:border-white/15 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors shadow-sm cursor-pointer"
                                            title={`View medical and physio history for ${s.patientName}`}
                                        >
                                            <History className="h-3.5 w-3.5 text-teal-600" />
                                            View History
                                        </button>
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
                                    <p className="text-xs text-teal-700 dark:text-teal-400 font-medium">
                                        {activeSession.modality}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        activeSession.status === "Confirmed"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                            : activeSession.status === "Pending"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    }`}>
                                        {activeSession.status}
                                    </span>
                                    {activeSession.status === "Pending" && (
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() => updateStatus(activeSession.id, "Confirmed")}
                                        >
                                            Confirm
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

                                {/* Physiotherapy Fee and remaining sessions */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5">
                                            <CreditCard className="h-3.5 w-3.5 text-teal-600" />
                                            Physiotherapy Fee (₹)
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
                                                placeholder="Enter physiotherapy fee (e.g. 650)"
                                                className="w-full rounded-md border border-foreground/20 bg-transparent pl-8 pr-3 py-2 text-sm font-medium text-foreground focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-foreground/80 block mb-1.5">
                                            Sessions Remaining
                                        </label>
                                        <div className="flex min-h-10 items-center rounded-md border border-black/10 bg-slate-50 px-3 text-sm font-semibold text-foreground dark:border-white/10 dark:bg-zinc-800">
                                            {remainingSessions} {remainingSessions === 1 ? "session" : "sessions"}
                                            <span className="ml-1 font-normal text-foreground/60">
                                                of {activeSession.totalSessions || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="filled"
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                    >
                                        Complete Session & Update Chart
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

            {/* Modal: Patient Medical & Physio History */}
            {historyPatient && (() => {
                const docHist = getPatientDoctorHistory(historyPatient);
                const physioHist = getPatientPhysioHistory(historyPatient);

                return (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
                        onClick={() => setHistoryPatient(null)}
                    >
                        <div
                            className="relative w-full max-w-3xl rounded-2xl border border-black/15 bg-white shadow-2xl dark:border-white/20 dark:bg-zinc-900 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-black/10 dark:border-white/10 bg-slate-50/70 dark:bg-zinc-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 font-bold text-sm">
                                        {historyPatient.patientName.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-foreground">
                                                {historyPatient.patientName}
                                            </h3>
                                            <span className="rounded-full bg-slate-200/70 dark:bg-zinc-700 px-2.5 py-0.5 text-xs font-semibold text-foreground/80">
                                                {historyPatient.age} yrs
                                            </span>
                                        </div>
                                        <p className="text-xs text-foreground/60 mt-0.5">
                                            {historyPatient.modality}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setHistoryPatient(null)}
                                    className="rounded-lg p-2 text-foreground/60 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex border-b border-black/10 dark:border-white/10 bg-slate-50/30 dark:bg-zinc-900 px-5 pt-3 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setHistoryTab("doctor")}
                                    className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                        historyTab === "doctor"
                                            ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300"
                                            : "border-transparent text-foreground/50 hover:text-foreground/80"
                                    }`}
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    Doctors Notes & Schedules
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setHistoryTab("physio")}
                                    className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                                        historyTab === "physio"
                                            ? "border-teal-600 text-teal-700 dark:border-teal-400 dark:text-teal-300"
                                            : "border-transparent text-foreground/50 hover:text-foreground/80"
                                    }`}
                                >
                                    <Activity className="h-3.5 w-3.5" />
                                    Physio Notes & Schedules
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 thin-scrollbar">
                                {historyTab === "doctor" ? (
                                    docHist.length === 0 ? (
                                        <div className="py-12 text-center text-foreground/50">
                                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                            <p className="text-sm font-medium">No doctor notes recorded yet.</p>
                                        </div>
                                    ) : (
                                        docHist.map((item: any, i: number) => (
                                            <div
                                                key={item.id || i}
                                                className="rounded-xl border border-black/10 bg-slate-50/40 dark:border-white/10 dark:bg-zinc-800/40 p-5 shadow-sm space-y-3"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                                                            <Calendar className="h-3.5 w-3.5 text-teal-600" />
                                                            <span>{item.date}</span>
                                                            <span className="text-foreground/40">•</span>
                                                            <span className="flex items-center gap-1 text-xs font-semibold text-foreground/70">
                                                                <Clock className="h-3 w-3" />
                                                                {item.time}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-bold text-foreground">
                                                            {Array.isArray(item.services) ? item.services.join(", ") : (item.service || "Evaluation")}
                                                        </span>
                                                    </div>
                                                    <span className="rounded-full bg-green-100 dark:bg-green-950/40 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-300">
                                                        {item.status || "Confirmed"}
                                                    </span>
                                                </div>

                                                {item.notes && (
                                                    <div className="rounded-lg border border-black/5 bg-white dark:border-white/5 dark:bg-zinc-800/80 p-3">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-foreground/60 flex items-center gap-1 mb-1">
                                                            <FileText className="h-3 w-3 text-teal-600" /> Clinical Notes
                                                        </span>
                                                        <p className="text-xs leading-relaxed text-foreground/80 font-normal">
                                                            {item.notes}
                                                        </p>
                                                    </div>
                                                )}

                                                {item.prescriptions && (
                                                    <div className="rounded-lg border border-teal-200/60 bg-teal-50/30 dark:border-teal-900/40 dark:bg-teal-950/20 p-3">
                                                        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 flex items-center gap-1 mb-1">
                                                            Prescriptions
                                                        </span>
                                                        <p className="text-xs leading-relaxed text-foreground/85 font-medium">
                                                            {item.prescriptions}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )
                                ) : (
                                    physioHist.length === 0 ? (
                                        <div className="py-12 text-center text-foreground/50">
                                            <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                            <p className="text-sm font-medium">No physiotherapy records found for this patient.</p>
                                        </div>
                                    ) : (
                                        physioHist.map((item: any, i: number) => (
                                            <div
                                                key={item.id || i}
                                                className="rounded-xl border border-teal-200/80 bg-teal-50/20 dark:border-teal-900/40 dark:bg-teal-950/10 p-5 shadow-sm space-y-3"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                                                            <Calendar className="h-3.5 w-3.5 text-teal-600" />
                                                            <span>{item.date}</span>
                                                            <span className="text-foreground/40">•</span>
                                                            <span className="flex items-center gap-1 text-xs font-semibold text-foreground/70">
                                                                <Clock className="h-3 w-3" />
                                                                {item.time}
                                                            </span>
                                                        </div>
                                                        <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 flex items-center gap-1">
                                                            <Activity className="h-3 w-3" />
                                                            {item.therapist || "PHYSIOTHERAPIST"}
                                                        </span>
                                                        <span className="text-sm font-bold text-foreground">
                                                            {item.service}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {item.referringDoctor && (
                                                            <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-foreground/70">
                                                                Ref: {item.referringDoctor}
                                                            </span>
                                                        )}
                                                        <span className="rounded-full bg-green-100 dark:bg-green-950/40 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-300">
                                                            {item.status || "Confirmed"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="rounded-lg border border-teal-200/80 bg-white dark:border-teal-900/40 dark:bg-zinc-800/80 p-3.5">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200 flex items-center gap-1.5 mb-1">
                                                        <FileText className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                                                        Therapist Clinical Notes & Assessment
                                                    </span>
                                                    <p className="text-xs leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">
                                                        {item.notes}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 border-t border-black/10 dark:border-white/10 flex justify-end bg-slate-50/50 dark:bg-zinc-900/50">
                                <Button variant="outline" size="sm" onClick={() => setHistoryPatient(null)}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })()}

        </div>
    );
}
