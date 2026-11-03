"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Stethoscope,
    Users,
    Clock,
    FileText,
    CheckCircle2,
    AlertCircle,
    Calendar,
    ChevronRight,
    Activity,
    Plus,
    UserCheck,
    Pill,
    Search,
    HeartPulse,
    Send,
    CreditCard,
    History,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPatientsData, Patient } from "@/app/dashboard/patients/data";

interface PatientQueueItem {
    id: string;
    token: string;
    patientId?: string;
    patientName: string;
    age: number;
    gender: string;
    time: string;
    service: string;
    reason: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    priority: "Normal" | "Urgent";
}

export default function DoctorDashboard() {
    const [queue, setQueue] = useState<PatientQueueItem[]>([
        {
            id: "APT-201",
            token: "DOC-01",
            patientId: "REF-8000",
            patientName: "Anjali Nair",
            age: 34,
            gender: "Female",
            time: "09:30 AM",
            service: "Spine & Orthopedic Evaluation",
            reason: "Acute lumbar disc pain radiating to right leg; MRI shows L4-L5 bulge",
            status: "Confirmed",
            priority: "Urgent"
        },
        {
            id: "APT-202",
            token: "DOC-02",
            patientId: "REF-8004",
            patientName: "Anoop Kumar",
            age: 48,
            gender: "Male",
            time: "10:00 AM",
            service: "General Medicine Review",
            reason: "Follow-up for chronic posture-related cervical discomfort",
            status: "Pending",
            priority: "Normal"
        },
        {
            id: "APT-203",
            token: "DOC-03",
            patientId: "REF-8002",
            patientName: "Priya Varma",
            age: 29,
            gender: "Female",
            time: "10:30 AM",
            service: "PROLOTHERAPY Consultation",
            reason: "Evaluation for lumbar ligament prolotherapy injection therapy",
            status: "Confirmed",
            priority: "Normal"
        },
        {
            id: "APT-204",
            token: "DOC-04",
            patientId: "REF-8001",
            patientName: "Rahul Menon",
            age: 42,
            gender: "Male",
            time: "11:15 AM",
            service: "IDD THERAPY Clinical Review",
            reason: "Chronic lower back ache; candidate for decompression therapy",
            status: "Pending",
            priority: "Normal"
        },
        {
            id: "APT-200",
            token: "DOC-00",
            patientId: "REF-8003",
            patientName: "Deepa Pillai",
            age: 38,
            gender: "Female",
            time: "08:45 AM",
            service: "Post-Therapy Follow-up",
            reason: "Evaluation post-laser therapy; mobility progress check",
            status: "Confirmed",
            priority: "Normal"
        }
    ]);

    const [activePatient, setActivePatient] = useState<PatientQueueItem | null>(queue[0]);
    const [consultationNotes, setConsultationNotes] = useState("");
    const [prescriptionText, setPrescriptionText] = useState("");
    const [consultationFee, setConsultationFee] = useState("500");
    const [referToPhysio, setReferToPhysio] = useState(false);
    const [savedNotification, setSavedNotification] = useState<string | null>(null);

    const updatePatientStatus = (id: string, newStatus: PatientQueueItem["status"]) => {
        setQueue(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        if (activePatient && activePatient.id === id) {
            setActivePatient(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleSaveConsultation = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activePatient) return;

        updatePatientStatus(activePatient.id, "Confirmed");

        // Save consultation details to localStorage so Patient Database can display all previous schedules with notes and prescriptions
        const consultationRecord = {
            id: `CNS-${Date.now()}`,
            patientId: activePatient.patientId,
            patientName: activePatient.patientName,
            date: new Date().toISOString().split("T")[0],
            time: activePatient.time || "10:00 AM",
            doctor: "Dr. SASIKUMAR",
            service: "Doctor Consultation",
            consultationFee: consultationFee.trim() || "0",
            amount: consultationFee.trim() || "0",
            fee: consultationFee.trim() || "0",
            notes: consultationNotes,
            prescriptions: prescriptionText,
            referToPhysio: referToPhysio,
            status: "Confirmed"
        };

        try {
            const existingRaw = localStorage.getItem("kumar_consultations");
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            localStorage.setItem("kumar_consultations", JSON.stringify([consultationRecord, ...existing]));

            const pStored = localStorage.getItem("patients_v5");
            if (pStored) {
                const patientsList = JSON.parse(pStored);
                const updatedList = patientsList.map((p: any) => {
                    if (p.id === activePatient.patientId || p.name === activePatient.patientName) {
                        const past = p.history?.past || [];
                        return {
                            ...p,
                            history: {
                                ...p.history,
                                past: [
                                    {
                                        id: consultationRecord.id,
                                        date: consultationRecord.date,
                                        time: consultationRecord.time,
                                        services: [consultationRecord.service],
                                        status: "Confirmed",
                                        amount: consultationFee.trim() || "0",
                                        fee: consultationFee.trim() || "0",
                                        consultationFee: consultationFee.trim() || "0",
                                        notes: consultationNotes,
                                        prescriptions: prescriptionText,
                                        doctor: consultationRecord.doctor,
                                        referToPhysio: referToPhysio
                                    },
                                    ...past
                                ]
                            }
                        };
                    }
                    return p;
                });
                localStorage.setItem("patients_v5", JSON.stringify(updatedList));
            }
        } catch (err) {
            console.error("Failed to persist consultation", err);
        }

        setSavedNotification(`Consultation for ${activePatient.patientName} saved successfully! ${referToPhysio ? "Referred to Physiotherapy." : ""}`);
        
        setTimeout(() => {
            setSavedNotification(null);
        }, 4000);

        setConsultationNotes("");
        setPrescriptionText("");
        setReferToPhysio(false);
    };

    const [historyPatient, setHistoryPatient] = useState<PatientQueueItem | null>(null);
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

    const getPatientDoctorHistory = (p: PatientQueueItem | null) => {
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
                services: [p.service || "Spine & Orthopedic Evaluation"],
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

    const getPatientPhysioHistory = (p: PatientQueueItem | null) => {
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
                                referringDoctor: item.referringDoctor || "Dr. SASIKUMAR",
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
                        const isPhysioClinician = (item.clinician || "").toUpperCase() === "PHYSIOTHERAPIST";
                        const srv = (item.service || "").toLowerCase();
                        const isPhysioSrv = srv.includes("physio") || srv.includes("rehab") || srv.includes("decompression") || srv.includes("massage");

                        if ((isPhysioClinician || isPhysioSrv) && (
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
                                    referringDoctor: item.referringDoctor || "Dr. SASIKUMAR",
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
                    service: "IDD THERAPY & SPINAL DECOMPRESSION",
                    referringDoctor: "Dr. SASIKUMAR",
                    notes: "Targeted lumbar decompression applied at 35kg tension for 20 mins. Core isometric activations tolerated well.",
                    status: "Confirmed"
                },
                {
                    id: `PT-REC-${p.id}-02`,
                    date: "2026-10-21",
                    time: "11:15 AM",
                    therapist: "PHYSIOTHERAPIST",
                    service: "WARMING & MASSAGE with Deep Tissue Release",
                    referringDoctor: "Dr. MALINI SASIKUMAR",
                    notes: "Myofascial release of paraspinal musculature. Patient reports improved flexibility and reduction in morning stiffness.",
                    status: "Confirmed"
                }
            );
        }

        return results;
    };

    const doctorHistory = historyPatient ? getPatientDoctorHistory(historyPatient) : [];
    const physioHistory = historyPatient ? getPatientPhysioHistory(historyPatient) : [];

    return (
        <div className="flex w-full flex-col gap-8 p-8">
            {/* Notification alert */}
            {savedNotification && (
                <div className="flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300 animate-in fade-in slide-in-from-top duration-300">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                    <span className="text-sm font-medium">{savedNotification}</span>
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Doctor Portal • Kumar Centres
                        </span>
                    </div>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        Doctor OPD Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        Dr. SASIKUMAR, MD • Consultation Suite Room 101 • Today's Clinical Schedule
                    </p>
                </div>

                {/* Quick actions for Doctor */}
                <div className="flex flex-wrap gap-2.5">
                    <Link href="/dashboard/schedule">
                        <Button variant="outline" icon={Calendar}>
                            My Schedule
                        </Button>
                    </Link>
                    <Link href="/dashboard/patients">
                        <Button variant="filled" icon={FileText} className="bg-[#3C43EC] hover:bg-[#3239cb] text-white">
                            Patient Database
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Split layout: Patient Queue on Left, Active Consultation Workspace on Right */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                
                {/* Left: Patient Queue (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                            Today's OPD Patient Queue
                        </h2>
                        <span className="text-xs text-foreground/60">
                            Click a patient to open clinical workspace
                        </span>
                    </div>

                    <div className="space-y-3">
                        {queue.map((patient) => {
                            const isSelected = activePatient?.id === patient.id;
                            return (
                                <div
                                    key={patient.id}
                                    onClick={() => setActivePatient(patient)}
                                    className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                        isSelected
                                            ? "border-[#3C43EC] bg-blue-50/60 dark:bg-blue-950/20 shadow-md ring-1 ring-[#3C43EC]"
                                            : "border-black/10 bg-white dark:border-white/10 dark:bg-zinc-900 hover:border-black/20 dark:hover:border-white/20"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs">
                                            {patient.token}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm text-foreground">
                                                    {patient.patientName}
                                                </span>
                                                <span className="text-xs text-foreground/50">
                                                    ({patient.age}y • {patient.gender})
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-foreground/75 mt-0.5">
                                                {patient.service}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                                                <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                                {patient.time}
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                patient.status === "Confirmed"
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                    : patient.status === "Pending"
                                                    ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                            }`}>
                                                {patient.status}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setHistoryPatient(patient);
                                                setHistoryTab("doctor");
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-foreground/80 hover:bg-[#3C43EC] hover:text-white hover:border-[#3C43EC] transition-all shadow-sm"
                                        >
                                            <History className="h-3.5 w-3.5" />
                                            View History
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Active Consultation Console (5 cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        Active Consultation Console
                    </h2>

                    {activePatient ? (
                        <div className="flex flex-col rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                            {/* Patient Info Bar */}
                            <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                                        Token {activePatient.token}
                                    </span>
                                    <h3 className="text-xl font-bold text-foreground">
                                        {activePatient.patientName}
                                    </h3>
                                    <p className="text-xs text-foreground/60">
                                        {activePatient.age} years old • {activePatient.gender} • Slot: {activePatient.time}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        activePatient.status === "Confirmed"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                            : activePatient.status === "Pending"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                    }`}>
                                        {activePatient.status}
                                    </span>
                                    {activePatient.status === "Pending" && (
                                        <Button
                                            size="sm"
                                            variant="filled"
                                            onClick={() => updatePatientStatus(activePatient.id, "Confirmed")}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                        >
                                            Confirm
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Patient Chief Complaint */}
                            <div className="my-4 rounded-lg bg-slate-50 dark:bg-white/5 p-3.5 border border-black/5 dark:border-white/5">
                                <span className="text-xs font-bold text-foreground/70 uppercase tracking-wide">
                                    Chief Complaint / Primary Symptom:
                                </span>
                                <p className="mt-1 text-sm text-foreground">
                                    {activePatient.reason}
                                </p>
                            </div>

                            {/* Doctor Note & Prescription Form */}
                            <form onSubmit={handleSaveConsultation} className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5">
                                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                                        Notes
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={consultationNotes}
                                        onChange={(e) => setConsultationNotes(e.target.value)}
                                        placeholder="Enter clinical notes, patient symptoms, observations and diagnosis..."
                                        className="w-full rounded-md border border-foreground/20 bg-transparent p-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5">
                                        <Pill className="h-3.5 w-3.5 text-emerald-600" />
                                        Prescriptions
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={prescriptionText}
                                        onChange={(e) => setPrescriptionText(e.target.value)}
                                        placeholder="Enter medication details, dosage, instructions (e.g. Paracetamol 500mg TDS x 5 days)..."
                                        className="w-full rounded-md border border-foreground/20 bg-transparent p-2.5 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                    />
                                </div>

                                {/* Physiotherapy Fee Textbox */}
                                <div>
                                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
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
                                            placeholder="Enter physiotherapy fee (e.g. 500)"
                                            className="w-full rounded-md border border-foreground/20 bg-transparent pl-8 pr-3 py-2 text-sm font-medium text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                                        />
                                    </div>
                                </div>

                                {/* Refer to Physio Checkbox immediately before saving consultation */}
                                <div className="flex items-center gap-3 rounded-lg border border-teal-200 bg-teal-50/50 dark:border-teal-900 dark:bg-teal-950/20 p-3">
                                    <input
                                        id="referPhysio"
                                        type="checkbox"
                                        checked={referToPhysio}
                                        onChange={(e) => setReferToPhysio(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                                    />
                                    <label htmlFor="referPhysio" className="text-xs text-foreground cursor-pointer select-none">
                                        <span className="font-semibold text-teal-700 dark:text-teal-300">
                                            Refer to Physio
                                        </span>
                                        <span className="block text-foreground/60 text-[11px]">
                                            Check to refer patient to physiotherapy and rehabilitation team
                                        </span>
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="filled"
                                        className="w-full bg-[#3C43EC] hover:bg-[#3239cb] text-white h-11"
                                    >
                                        Save Consultation
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-black/20 p-12 text-center dark:border-white/20">
                            <Stethoscope className="h-10 w-10 text-foreground/40 mb-3" />
                            <p className="text-sm font-medium text-foreground">No patient selected</p>
                            <p className="text-xs text-foreground/60 mt-1">Select any patient from the queue to start</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Patient Clinical History Modal */}
            {historyPatient && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setHistoryPatient(null)}
                >
                    <div
                        className="relative w-full max-w-3xl rounded-2xl bg-white dark:bg-zinc-900 border border-black/15 dark:border-white/20 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-sm">
                                    {historyPatient.token}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold text-foreground">
                                            {historyPatient.patientName}
                                        </h3>
                                        <span className="text-xs text-foreground/50 font-medium">
                                            ({historyPatient.age}y • {historyPatient.gender})
                                        </span>
                                    </div>
                                    <p className="text-xs text-foreground/60 mt-0.5">
                                        Patient Clinical History & Treatment Records
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setHistoryPatient(null)}
                                className="rounded-lg p-2 text-foreground/60 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Tabs */}
                        <div className="flex border-b border-black/10 dark:border-white/10 px-6 bg-slate-50/50 dark:bg-zinc-900/50">
                            <button
                                onClick={() => setHistoryTab("doctor")}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                                    historyTab === "doctor"
                                        ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                                        : "border-transparent text-foreground/60 hover:text-foreground"
                                }`}
                            >
                                <Stethoscope className="h-4 w-4" />
                                Doctors Notes & Schedules ({doctorHistory.length})
                            </button>
                            <button
                                onClick={() => setHistoryTab("physio")}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                                    historyTab === "physio"
                                        ? "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400"
                                        : "border-transparent text-foreground/60 hover:text-foreground"
                                }`}
                            >
                                <Activity className="h-4 w-4" />
                                Physio Notes & Schedules ({physioHistory.length})
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 thin-scrollbar">
                            {historyTab === "doctor" ? (
                                doctorHistory.length === 0 ? (
                                    <div className="py-12 text-center text-foreground/50">
                                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm font-medium">No previous doctor records found for this patient.</p>
                                    </div>
                                ) : (
                                    doctorHistory.map((rec: any, i: number) => (
                                        <div
                                            key={rec.id || i}
                                            className="rounded-xl border border-black/10 dark:border-white/10 p-5 bg-white dark:bg-zinc-800/60 shadow-sm space-y-3"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 dark:border-white/5 pb-3">
                                                <div>
                                                    <h4 className="font-bold text-sm text-foreground">
                                                        {Array.isArray(rec.services) ? rec.services.join(", ") : rec.service || "Doctor Consultation"}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-foreground/70">
                                                        <span className="flex items-center gap-1 font-medium">
                                                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                                                            {rec.date}
                                                        </span>
                                                        {rec.time && (
                                                            <span className="flex items-center gap-1 font-medium">
                                                                <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                                                {rec.time}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="self-start sm:self-auto rounded-full bg-green-100 dark:bg-green-950/40 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-300">
                                                    {rec.status || "Confirmed"}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                <div className="rounded-lg border border-blue-200/70 bg-blue-50/50 p-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                                                    <span className="font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                                                        <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Clinical Notes
                                                    </span>
                                                    <p className="text-foreground/85 font-medium leading-relaxed">
                                                        {rec.notes || "Targeted spinal evaluation and clinical consultation conducted. Vitals recorded. Patient advised targeted spine mobilization exercises."}
                                                    </p>
                                                </div>
                                                <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/50 p-3 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                                    <span className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                                                        <Pill className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Prescriptions
                                                    </span>
                                                    <p className="text-foreground/85 font-medium leading-relaxed">
                                                        {rec.prescriptions || "Tab. Paracetamol 500mg SOS, Multivitamin once daily."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                physioHistory.length === 0 ? (
                                    <div className="py-12 text-center text-foreground/50">
                                        <Activity className="h-8 w-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm font-medium">No physiotherapy records found for this patient.</p>
                                    </div>
                                ) : (
                                    physioHistory.map((item: any, i: number) => (
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
            )}
        </div>
    );
}
