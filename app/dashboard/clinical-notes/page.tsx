"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    ChevronLeft,
    Save,
    Lock,
    Stethoscope,
    AlertCircle,
    AlertTriangle,
    FileCheck2,
    FileText,
    Clock,
    ShieldBan,
    Activity,
    Plus
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Mock interface for the form state
interface ClinicalNoteForm {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
    internalNotes: string;
}

function ClinicalNotesContent() {
    const searchParams = useSearchParams();
    const aptId = searchParams.get("aptId") || "APT-101";

    // Stored Role
    const [userRole, setUserRole] = useState<string>("Doctor");

    useEffect(() => {
        const stored = localStorage.getItem("userRole");
        if (stored) setUserRole(stored);
    }, []);

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const [allergiesList, setAllergiesList] = useState<string[]>(["Penicillin"]);
    const [newAllergyInput, setNewAllergyInput] = useState("");
    const [activeNoteTab, setActiveNoteTab] = useState<"form" | "medical" | "internal" | "patient">("form");

    const [formData, setFormData] = useState<ClinicalNoteForm>({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        internalNotes: ""
    });

    // Mock Patient Context fetched via aptId
    const patientContext = {
        name: "Anjali Nair",
        dob: "1992-04-15",
        id: "PAT-001",
        service: "IDD THERAPY & Lumbar Assessment",
        time: "09:00 AM",
        allergies: ["Penicillin"],
        medicalNotes: "Patient has a history of mild asthma. No previous surgeries.",
        internalStaffNote: "Follow up on prescribed physical therapy.",
        patientNote: "Please explain the exercises during the session."
    };

    const isAuthorized = ["Doctor", "Physiotherapist", "admin", "super_admin", "clinician", "administrator"].includes(userRole);

    // Security layer: Block operational staff
    if (!isAuthorized) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldBan className="mb-4 h-12 w-12 text-zinc-500" />
                <h1 className="text-2xl font-bold text-foreground">Clinical Clearance Required</h1>
                <p className="mt-2 text-foreground/60">
                    You do not have the required permissions to author or view clinical notes.
                </p>
            </div>
        );
    }

    // Simulate Auto-Save Feature
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData.objective.length > 0 || formData.subjective.length > 0) {
                setLastSaved(new Date());
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [formData]);

    const handleSignAndLock = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            // Build note content from SOAP fields
            const parts = [
                formData.subjective && `Subjective: ${formData.subjective}`,
                formData.objective  && `Objective: ${formData.objective}`,
                formData.assessment && `Assessment: ${formData.assessment}`,
                formData.plan       && `Plan: ${formData.plan}`,
            ].filter(Boolean).join('\n\n');

            const newNote = {
                id: `NOTE-${Date.now()}`,
                date: new Date().toISOString().split('T')[0],
                author: "Dr. (Current User)",
                service: patientContext.service,
                content: parts || "(No content entered)",
                patientId: patientContext.id,
                medicalNotes: patientContext.medicalNotes || undefined,
                internalStaffNote: patientContext.internalStaffNote || undefined,
                patientNote: patientContext.patientNote || undefined,
            };

            try {
                const existing = JSON.parse(localStorage.getItem('insight_clinical_notes') || '[]');
                localStorage.setItem('insight_clinical_notes', JSON.stringify([newNote, ...existing]));
            } catch (_) {}

            setIsSaving(false);
            alert("Chart locked and cryptographically signed.");
        }, 1500);
    };

    const getInitials = (name: string) =>
        name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);

    return (
        <div className="flex h-full w-full flex-col">

            {/* Context Header */}
            <div className="border-b border-black/[.15] px-8 py-6 dark:border-white/[.22]">
                <div className="mx-auto flex max-w-5xl items-center justify-between">
                    <div className="flex flex-col gap-4">

                        {/* Back Button */}
                        <Link
                            href="/dashboard/schedule"
                            className="flex items-center gap-1 text-sm font-bold text-foreground/70 hover:text-foreground transition-colors w-fit"
                        >
                            <ChevronLeft className="h-4 w-4" /> Back to Schedule
                        </Link>

                        {/* Avatar + Name */}
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-lg">
                                {getInitials(patientContext.name)}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-bold tracking-tight text-foreground">{patientContext.name}</h1>
                                    <span className="rounded bg-violet-100 px-2.5 py-0.5 text-xs font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
                                        {patientContext.service}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-foreground/60 mt-0.5">
                                    <span>DOB: {patientContext.dob}</span>
                                    <span>•</span>
                                    <span>ID: {patientContext.id}</span>
                                    <span>•</span>
                                    <span>Ref: {aptId}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">

                        {/* DOB Card */}
                        <div className="rounded-xl border border-black/[.15] dark:border-white/[.22] p-4 bg-white dark:bg-zinc-900 min-w-[140px] h-28 flex flex-col justify-between">
                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                Date of Birth
                            </span>
                            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 block">{patientContext.dob}</span>
                        </div>

                        {/* Allergy Card */}
                        <div className="rounded-xl border border-black/[.15] dark:border-white/[.22] p-4 bg-white dark:bg-zinc-900 min-w-[160px] h-28 flex flex-col justify-between relative group cursor-help transition-all">
                            <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                <AlertTriangle className="h-3.5 w-3.5 text-red-500" /> Allergies
                            </span>
                            <div>
                                <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 block truncate">
                                    {allergiesList.length === 0 ? "None" : allergiesList.slice(0, 2).join(", ")}
                                </span>
                                {allergiesList.length > 2 && (
                                    <span className="text-[12px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
                                        +{allergiesList.length - 2} more
                                    </span>
                                )}
                            </div>

                            {/* Hover Popover */}
                            {allergiesList.length > 0 && (
                                <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-50 w-64 rounded-lg border border-black/[.15] bg-white p-3 shadow-lg dark:bg-zinc-900 dark:border-white/[.22] animate-in fade-in slide-in-from-top-1">
                                    <span className="block text-[12px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                                        All Allergies ({allergiesList.length})
                                    </span>
                                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto thin-scrollbar">
                                        {allergiesList.map((allergy, idx) => (
                                            <span key={idx} className="rounded px-3 py-1 text-[12px] font-bold bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                                                {allergy}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Save Status */}
                        {/* <div className="flex items-center gap-2 text-xs font-medium text-foreground/50">
                            {lastSaved ? (
                                <>
                                    <Save className="h-3 w-3 text-green-500" />
                                    Draft saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </>
                            ) : (
                                <>
                                    <Clock className="h-3 w-3" />
                                    Not saved
                                </>
                            )}
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Main Clinical Form / Notes Section */}
            <div className="flex-1 overflow-y-auto thin-scrollbar bg-white dark:bg-zinc-950/10">
                <div className="mx-auto w-full max-w-5xl p-8">
                    {/* Tabs */}
                    <div className="flex border-b border-black/[.15] dark:border-white/[.22] mb-8 text-sm font-bold overflow-x-auto thin-scrollbar">
                        <button
                            type="button"
                            onClick={() => setActiveNoteTab("form")}
                            className={`mr-6 border-b-2 pb-3 whitespace-nowrap transition-colors ${activeNoteTab === "form" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Write Clinical Note
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveNoteTab("medical")}
                            className={`mr-6 border-b-2 pb-3 whitespace-nowrap transition-colors ${activeNoteTab === "medical" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Medical Information / Notes
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveNoteTab("internal")}
                            className={`mr-6 border-b-2 pb-3 whitespace-nowrap transition-colors ${activeNoteTab === "internal" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Booking Internal Staff Note
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveNoteTab("patient")}
                            className={`border-b-2 pb-3 whitespace-nowrap transition-colors ${activeNoteTab === "patient" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                        >
                            Booking Patient Note
                        </button>
                    </div>

                    {activeNoteTab === "form" && (
                        <form onSubmit={handleSignAndLock} className="flex flex-col gap-8">

                            {/* Section: Allergies */}
                            <div className="flex flex-col gap-6 rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-8 dark:border-white/[.22] dark:bg-zinc-900">
                                <div className="flex items-center gap-2 border-b border-black/[.04] pb-4 dark:border-white/[.04]">
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Patient Allergies</h2>
                                </div>

                                <div className="flex flex-col gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80 block">
                                            Active Allergies List
                                        </label>
                                        <div className="flex flex-wrap gap-2 p-3 min-h-[40px] rounded-md bg-black/[.01] dark:bg-white/[.01]">
                                            {allergiesList.length === 0 ? (
                                                <span className="text-xs text-foreground/40 font-medium">No allergies reported.</span>
                                            ) : (
                                                allergiesList.map((allergy, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-2 rounded-full bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400 px-3.5 py-1.5 text-sm font-semibold"
                                                    >
                                                        {allergy}
                                                        <button
                                                            type="button"
                                                            onClick={() => setAllergiesList(allergiesList.filter((_, i) => i !== index))}
                                                            className="hover:text-red-900 dark:hover:text-red-200 transition-colors font-bold text-base ml-1 leading-none"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80">
                                            Add Allergy Medicine
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newAllergyInput}
                                                onChange={(e) => setNewAllergyInput(e.target.value)}
                                                placeholder="e.g. Penicillin, Latex, Nuts"
                                                className="w-full h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                icon={Plus}
                                                className="h-10 px-3"
                                                onClick={() => {
                                                    if (newAllergyInput.trim()) {
                                                        setAllergiesList([...allergiesList, newAllergyInput.trim()]);
                                                        setNewAllergyInput("");
                                                    }
                                                }}
                                            >
                                                Add
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Clinical Observations (SOAP Format) */}
                            <div className="flex flex-col gap-6 rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-8 dark:border-white/[.22] dark:bg-zinc-900">
                                <div className="flex items-center gap-2 border-b border-black/[.04] pb-4 dark:border-white/[.04]">
                                    <Stethoscope className="h-5 w-5 text-brand" />
                                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Consultation Notes</h2>
                                </div>

                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80">
                                            Subjective (Patient's reported symptoms/history)
                                        </label>
                                        <textarea
                                            value={formData.subjective}
                                            onChange={(e) => setFormData({ ...formData, subjective: e.target.value })}
                                            placeholder="Patient reports feeling..."
                                            className="w-full resize-y rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22] min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80">
                                            Objective (Clinical findings, scan measurements)
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.objective}
                                                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                                                placeholder="Gestational sac measures... Heart rate at..."
                                                className="w-full resize-y rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22] min-h-[150px]"
                                            />
                                            {/* Quick-insert tools for Sonographers */}
                                            <div className="absolute bottom-3 right-3 flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => setFormData({ ...formData, objective: formData.objective + "CRL: mm " })}
                                                >
                                                    + Insert CRL
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => setFormData({ ...formData, objective: formData.objective + "FHR: bpm " })}
                                                >
                                                    + Insert FHR
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80">
                                            Assessment & Diagnosis
                                        </label>
                                        <textarea
                                            value={formData.assessment}
                                            onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                                            placeholder="Primary diagnosis..."
                                            className="w-full resize-y rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22] min-h-[100px]"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground/80">
                                            Plan (Treatment, prescriptions, follow-up)
                                        </label>
                                        <textarea
                                            value={formData.plan}
                                            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                            placeholder="Prescribed..."
                                            className="w-full resize-y rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22] min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Internal Communications */}
                            <div className="flex flex-col gap-6 rounded-xl border border-black/[.15] bg-white p-8 dark:border-white/[.22] dark:bg-zinc-900">
                                <div className="flex items-center gap-2 border-b border-black/[.04] pb-4 dark:border-white/[.04]">
                                    <Activity className="h-5 w-5 text-brand" />
                                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Internal Staff Instructions</h2>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground/80">
                                        Notes for reception or other practitioners (Not visible to patient)
                                    </label>
                                    <textarea
                                        value={formData.internalNotes}
                                        onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                                        placeholder="Needs follow-up booking in 2 weeks. Ensure bloodwork forms are printed."
                                        className="w-full resize-y rounded-md border border-black/[.15] bg-white p-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22] dark:bg-zinc-900 min-h-[80px]"
                                    />
                                </div>
                            </div>

                            {/* Submission / Lock Block */}
                            <div className="flex items-center justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 dark:bg-brand/20">
                                        <FileCheck2 className="h-6 w-6 text-brand dark:text-white" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">Finalize Chart</p>
                                        <p className="text-sm text-foreground/60">By locking this note, it becomes a permanent medical record.</p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="filled"
                                    loading={isSaving}
                                    icon={Lock}
                                    className="px-8 py-3 text-sm font-bold"
                                >
                                    Sign & Lock Record
                                </Button>
                            </div>

                        </form>
                    )}

                    {activeNoteTab === "medical" && (
                        <div className="rounded-xl border border-black/[.15] bg-white p-8 dark:border-white/[.22] dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b border-black/[.04] pb-4 dark:border-white/[.04] mb-4">
                                <FileText className="h-5 w-5 text-brand" />
                                <h2 className="text-lg font-semibold tracking-tight text-foreground">Medical Information / Notes</h2>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/80 font-medium">{patientContext.medicalNotes}</p>
                        </div>
                    )}

                    {activeNoteTab === "internal" && (
                        <div className="rounded-xl border border-black/[.15] bg-white p-8 dark:border-white/[.22] dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b border-black/[.04] pb-4 dark:border-white/[.04] mb-4">
                                <AlertCircle className="h-5 w-5 text-brand" />
                                <h2 className="text-lg font-semibold tracking-tight text-foreground">Booking Internal Staff Note</h2>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/80 font-medium">{patientContext.internalStaffNote}</p>
                        </div>
                    )}

                    {activeNoteTab === "patient" && (
                        <div className="rounded-xl border border-black/[.15] bg-white p-8 dark:border-white/[.22] dark:bg-zinc-900">
                            <div className="flex items-center gap-2 border-b border-black/[.04] pb-4 dark:border-white/[.04] mb-4">
                                <FileText className="h-5 w-5 text-brand" />
                                <h2 className="text-lg font-semibold tracking-tight text-foreground">Booking Patient Note</h2>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/80 font-medium">{patientContext.patientNote}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Next.js requires components utilizing useSearchParams to be wrapped in a Suspense boundary
export default function ClinicalNotes() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center text-foreground/50">Loading chart...</div>}>
            <ClinicalNotesContent />
        </Suspense>
    );
}
