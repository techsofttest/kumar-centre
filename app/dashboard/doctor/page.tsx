"use client";

import { useState } from "react";
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
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    status: "Waiting" | "In Consultation" | "Completed" | "Pending Lab";
    priority: "Normal" | "Urgent";
}

export default function DoctorDashboard() {
    const [queue, setQueue] = useState<PatientQueueItem[]>([
        {
            id: "APT-201",
            token: "DOC-01",
            patientName: "Eleanor Vance",
            age: 34,
            gender: "Female",
            time: "09:30 AM",
            service: "Cardiology Review",
            reason: "Persistent palpitations & elevated resting heart rate",
            status: "In Consultation",
            priority: "Urgent"
        },
        {
            id: "APT-202",
            token: "DOC-02",
            patientName: "Marcus Thorne",
            age: 48,
            gender: "Male",
            time: "10:00 AM",
            service: "General Medicine",
            reason: "Routine diabetic management & lipid panel review",
            status: "Waiting",
            priority: "Normal"
        },
        {
            id: "APT-203",
            token: "DOC-03",
            patientName: "Sophia Sterling",
            age: 29,
            gender: "Female",
            time: "10:30 AM",
            service: "Well Woman Consultation",
            reason: "Pre-natal ultrasound follow-up discussion",
            status: "Waiting",
            priority: "Normal"
        },
        {
            id: "APT-204",
            token: "DOC-04",
            patientName: "James Holden",
            age: 42,
            gender: "Male",
            time: "11:15 AM",
            service: "Musculoskeletal Assessment",
            reason: "Chronic lower back ache; candidate for physio referral",
            status: "Waiting",
            priority: "Normal"
        },
        {
            id: "APT-200",
            token: "DOC-00",
            patientName: "Naomi Nagata",
            age: 38,
            gender: "Female",
            time: "08:45 AM",
            service: "Post-op Follow-up",
            reason: "Wound assessment & suture check",
            status: "Completed",
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

        updatePatientStatus(activePatient.id, "Completed");

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
            status: "Completed"
        };

        try {
            const existingRaw = localStorage.getItem("kumar_consultations");
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            localStorage.setItem("kumar_consultations", JSON.stringify([consultationRecord, ...existing]));

            const pStored = localStorage.getItem("patients_v3");
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
                                        status: "Completed",
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
                localStorage.setItem("patients_v3", JSON.stringify(updatedList));
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

    const waitingCount = queue.filter(q => q.status === "Waiting").length;
    const completedCount = queue.filter(q => q.status === "Completed").length;
    const inProgressCount = queue.filter(q => q.status === "In Consultation").length;

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

            {/* Key Clinical Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Patients in Queue</span>
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{waitingCount}</span>
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Waiting in lounge</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">In Consultation</span>
                        <Activity className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{inProgressCount}</span>
                        <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Currently active</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Consultations Done</span>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{completedCount}</span>
                        <span className="text-xs font-medium text-emerald-600">Completed today</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Total Scheduled</span>
                        <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{queue.length}</span>
                        <span className="text-xs font-medium text-purple-600">Full shift volume</span>
                    </div>
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
                                                {patient.priority === "Urgent" && (
                                                    <span className="rounded-full bg-red-100 dark:bg-red-900/40 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
                                                        Urgent
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-foreground/75 mt-0.5">
                                                {patient.service}
                                            </span>
                                            <span className="text-xs text-foreground/60 line-clamp-1 italic mt-0.5">
                                                "{patient.reason}"
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                                        <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                                            <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                            {patient.time}
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            patient.status === "In Consultation"
                                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 animate-pulse"
                                                : patient.status === "Waiting"
                                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                        }`}>
                                            {patient.status}
                                        </span>
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

                                <div className="flex gap-2">
                                    {activePatient.status !== "In Consultation" && activePatient.status !== "Completed" && (
                                        <Button
                                            size="sm"
                                            variant="filled"
                                            onClick={() => updatePatientStatus(activePatient.id, "In Consultation")}
                                        >
                                            Start Consult
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

                                {/* Consultation Fee Textbox */}
                                <div>
                                    <label className="text-xs font-semibold text-foreground/80 block mb-1.5 flex items-center gap-1.5">
                                        <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
                                        Consultation Fee (₹)
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
                                            placeholder="Enter consultation fee (e.g. 500)"
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
        </div>
    );
}
