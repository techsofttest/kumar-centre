"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    FileText,
    Clock,
    ChevronRight,
    Download,
    FileCheck2,
    Stethoscope,
    ChevronLeft,
    Check,
    AlertCircle,
    User,
    Pill,
    Activity,
    CheckCircle2
} from "lucide-react";
import { Patient, AppointmentRecord, mockPatientsData, getAptFinancials, getClinicalNotes } from "../data";
import { DatePicker } from "@/components/ui/date-picker";

export default function PatientDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [patients, setPatients] = useState<Patient[]>([]);
    const [patient, setPatient] = useState<Patient | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "upcoming" | "past" | "physio">("profile");
    const [filterDate, setFilterDate] = useState<string>("");
    const [showNotesDetail, setShowNotesDetail] = useState(false);

    const getStatusBadge = (status: string) => {
        let colors = "bg-black/[.05] dark:bg-white/[.05] text-foreground/90";
        if (status === "Confirmed") {
            colors = "bg-green-500/15 text-green-700 dark:text-green-500";
        } else if (status === "Pending") {
            colors = "bg-amber-500/15 text-amber-700 dark:text-amber-500";
        } else if (status === "Cancelled") {
            colors = "bg-red-500/15 text-red-700 dark:text-red-500";
        }
        return (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full self-start sm:self-auto ${colors}`}>
                {status}
            </span>
        );
    };

    // Edit states
    const [editName, setEditName] = useState("");
    const [editDob, setEditDob] = useState("");
    const [editGender, setEditGender] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [editAddress, setEditAddress] = useState("");

    // Load data from localStorage on mount
    useEffect(() => {
        const storedPatients = localStorage.getItem("patients_v5");
        let list: Patient[] = [];
        if (storedPatients) {
            try {
                list = JSON.parse(storedPatients);
            } catch (e) {
                list = mockPatientsData;
            }
        } else {
            list = mockPatientsData;
            localStorage.setItem("patients_v5", JSON.stringify(mockPatientsData));
        }
        setPatients(list);

        // Find match
        const match = list.find(p => p.id === id);
        if (match) {
            setPatient(match);
            setEditName(match.name);
            setEditDob(match.dob);
            setEditGender(match.gender);
            setEditEmail(match.email);
            setEditPhone(match.phone);
            setEditAddress(match.address);
        }
    }, [id]);

    // Reset notes detail state when tab swaps
    useEffect(() => {
        setShowNotesDetail(false);
    }, [activeTab]);

    const handleUpdatePatient = () => {
        if (!patient) return;
        const updatedList = patients.map(p => {
            if (p.id === patient.id) {
                const updated = {
                    ...p,
                    name: editName,
                    dob: editDob,
                    gender: editGender,
                    email: editEmail,
                    phone: editPhone,
                    address: editAddress
                };
                setPatient(updated);
                return updated;
            }
            return p;
        });
        setPatients(updatedList);
        localStorage.setItem("patients_v5", JSON.stringify(updatedList));
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const physioSchedules = useMemo(() => {
        if (!patient) return [];
        const results: any[] = [];
        try {
            const rawConsultations = localStorage.getItem("kumar_consultations");
            if (rawConsultations) {
                const consultations = JSON.parse(rawConsultations);
                if (Array.isArray(consultations)) {
                    consultations.forEach((item: any) => {
                        const isPhysioDoc = (item.doctor || "").toUpperCase() === "PHYSIOTHERAPIST";
                        const srv = (item.service || "").toLowerCase();
                        const isPhysioSrv = srv.includes("physio") || srv.includes("rehab") || srv.includes("decompression") || srv.includes("tens") || srv.includes("cryo");

                        if ((isPhysioDoc || isPhysioSrv) && (
                            item.patientId === patient.id ||
                            item.patientName?.toLowerCase() === patient.name?.toLowerCase()
                        )) {
                            results.push({
                                id: item.id || `PT-${Math.floor(100 + Math.random() * 900)}`,
                                date: item.date || "2026-10-31",
                                time: item.time || "10:00 AM",
                                therapist: "PHYSIOTHERAPIST",
                                service: item.service || "Physiotherapy & Rehab Session",
                                painScore: item.painScore || 5,
                                referringDoctor: item.referringDoctor || "Dr. SASIKUMAR",
                                notes: item.notes || "Therapy session completed. Patient tolerated active mobilizations with progressive improvement in range of motion.",
                                fee: item.consultationFee || item.amount || item.fee || "650",
                                status: item.status || "Completed"
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
                        const isPhysioSrv = srv.includes("physio") || srv.includes("rehab") || srv.includes("decompression") || srv.includes("tens") || srv.includes("cryo");

                        if ((isPhysioClinician || isPhysioSrv) && (
                            item.patientId === patient.id ||
                            item.patientName?.toLowerCase() === patient.name?.toLowerCase()
                        )) {
                            if (!results.some(r => r.id === item.id)) {
                                results.push({
                                    id: item.id || `APT-${Math.floor(100 + Math.random() * 900)}`,
                                    date: item.date || "2026-10-31",
                                    time: item.time || "10:00 AM",
                                    therapist: "PHYSIOTHERAPIST",
                                    service: item.service || "Physiotherapy Session",
                                    painScore: item.painScore || 4,
                                    referringDoctor: item.referringDoctor || "Dr. SASIKUMAR",
                                    notes: item.patientNotes || item.notes || "Rehabilitation session scheduled and recorded.",
                                    fee: item.fee || item.amount || "650",
                                    status: item.status || "Confirmed"
                                });
                            }
                        }
                    });
                }
            }
        } catch (_) {}

        if (results.length === 0) {
            if (patient.name === "Rahul Menon" || patient.name === "James Holden" || patient.id === "PAT-002" || patient.id === "REF-8001") {
                results.push({
                    id: "PT-REC-001",
                    date: "2026-10-28",
                    time: "09:00 AM",
                    therapist: "PHYSIOTHERAPIST",
                    service: "IDD THERAPY & SPINAL DECOMPRESSION",
                    painScore: 4,
                    referringDoctor: "Dr. SASIKUMAR",
                    notes: "Targeted lumbar decompression applied at 35kg tension for 20 mins. Core isometric activations tolerated well.",
                    fee: "650",
                    status: "Completed"
                });
            } else if (patient.name === "Anjali Nair" || patient.name === "Eleanor Vance" || patient.id === "PAT-001" || patient.id === "REF-8000") {
                results.push({
                    id: "PT-REC-101",
                    date: "2026-10-25",
                    time: "08:15 AM",
                    therapist: "PHYSIOTHERAPIST",
                    service: "PROLOTHERAPY Rehab & Core Strengthening",
                    painScore: 3,
                    referringDoctor: "Dr. SREENATH",
                    notes: "Sacroiliac joint and lumbar stability showing clear clinical improvement. Active flexion and pain-free range increased.",
                    fee: "650",
                    status: "Completed"
                });
            }
        }

        return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [patient]);

    if (!patient) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8">
                <p className="text-foreground/60">Loading patient details...</p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col p-8">
            {/* Back Button */}
            <div className="mb-4">
                <button
                    onClick={() => router.push("/dashboard/patients")}
                    className="flex items-center gap-1 text-sm font-bold text-foreground/70 hover:text-foreground transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" /> Back
                </button>
            </div>

            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/[.15] dark:border-white/[.22] pb-6 mb-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xl">
                        {getInitials(patient.name)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">{patient.name}</h1>
                        <div className="flex items-center gap-2 mt-1 text-sm text-foreground/80 font-medium">
                            <span>ID: {patient.id}</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                        </div>
                    </div>
                </div>

                <Link href="/dashboard/appointments/new">
                    <Button variant="filled" size="sm" icon={CalendarIcon} className="bg-[#3C43EC] hover:bg-[#3239cb] text-white">
                        Book Appointment
                    </Button>
                </Link>
            </div>

            {/* Content Container */}
            <div className="mx-auto w-full max-w-4xl bg-white dark:bg-zinc-900 border border-black/[.15] dark:border-white/[.22] rounded-2xl p-8">
                {/* Tabs */}
                <div className="flex text-sm font-bold border-b border-black/[.15] dark:border-white/[.22] mb-6 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`mr-6 border-b-2 pb-3 transition-colors shrink-0 ${activeTab === "profile" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                    >
                        Profile Details
                    </button>
                    <button
                        onClick={() => setActiveTab("upcoming")}
                        className={`mr-6 border-b-2 pb-3 transition-colors shrink-0 ${activeTab === "upcoming" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                    >
                        Upcoming Appointments
                    </button>
                    <button
                        onClick={() => setActiveTab("past")}
                        className={`mr-6 border-b-2 pb-3 transition-colors shrink-0 ${activeTab === "past" ? "border-brand text-brand dark:text-white" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                    >
                        Doctors Notes & Schedules
                    </button>
                    <button
                        onClick={() => setActiveTab("physio")}
                        className={`border-b-2 pb-3 transition-colors shrink-0 ${activeTab === "physio" ? "border-teal-600 text-teal-600 dark:text-teal-400 font-bold" : "border-transparent text-foreground/70 hover:text-foreground/90"}`}
                    >
                        Physio Notes & Schedules
                    </button>
                </div>

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <div className="flex flex-col gap-6 animate-in fade-in">
                        <div className="space-y-6 rounded-xl border border-black/[.15] dark:border-white/[.22] p-6 bg-black/[.01] dark:bg-white/[.01]">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/70">Edit Patient Details</h3>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-foreground">Full Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-foreground">Date of Birth</label>
                                    <DatePicker
                                        value={editDob}
                                        onChange={(d) => setEditDob(d)}
                                        placeholder="Select date of birth"
                                        maxDate={new Date().toISOString().split("T")[0]}
                                        allowClear
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-foreground">Gender</label>
                                    <select
                                        value={editGender}
                                        onChange={(e) => setEditGender(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                    >
                                        <option value="Female">Female</option>
                                        <option value="Male">Male</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-foreground">Mobile Number</label>
                                    <input
                                        type="text"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-bold text-foreground">Address</label>
                                    <input
                                        type="text"
                                        value={editAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-blue-600 focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button variant="filled" onClick={handleUpdatePatient}>
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* UPCOMING TAB */}
                {activeTab === "upcoming" && (
                    <div className="flex flex-col gap-8 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                            <h2 className="text-lg font-bold text-foreground">Upcoming Appointments</h2>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <label className="text-sm font-bold text-foreground">Filter by Date:</label>
                                <DatePicker
                                    value={filterDate}
                                    onChange={(d) => setFilterDate(d)}
                                    placeholder="Filter date..."
                                    allowClear
                                    className="w-44"
                                />
                                {filterDate && (
                                    <button
                                        onClick={() => setFilterDate("")}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {patient.history.future.filter(apt => !filterDate || apt.date === filterDate).length === 0 ? (
                                <p className="text-sm text-foreground/60 font-medium">No upcoming appointments{filterDate && ' on this date'}.</p>
                            ) : (
                                patient.history.future
                                    .filter(apt => !filterDate || apt.date === filterDate)
                                    .map(apt => {
                                        const financials = getAptFinancials(apt);
                                        return (
                                            <div key={apt.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-black/[.15] dark:border-white/[.22] p-4 gap-4 sm:gap-0">
                                                <div>
                                                    <p className="text-sm font-bold text-foreground">{apt.services.join(", ")}</p>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                        <span className="flex items-center gap-1 text-xs text-foreground/80 font-medium"><CalendarIcon className="h-3.5 w-3.5" /> {apt.date}</span>
                                                        {apt.time && <span className="flex items-center gap-1 text-xs text-foreground/80 font-medium"><Clock className="h-3.5 w-3.5" /> {apt.time}</span>}
                                                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-500"><Check className="h-3.5 w-3.5" /> Paid: ₹{financials.paid}</span>
                                                        {financials.pending > 0 && (
                                                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-500"><AlertCircle className="h-3.5 w-3.5" /> Pending: ₹{financials.pending}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                {getStatusBadge(apt.status)}
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                )}

                {/* PAST RECORDS TAB */}
                {activeTab === "past" && (
                    <div className="flex flex-col gap-8 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                            <h2 className="text-lg font-bold text-foreground">Doctors Notes & Schedules</h2>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <label className="text-sm font-bold text-foreground">Filter by Date:</label>
                                <DatePicker
                                    value={filterDate}
                                    onChange={(d) => setFilterDate(d)}
                                    placeholder="Filter date..."
                                    allowClear
                                    className="w-44"
                                />
                                {filterDate && (
                                    <button
                                        onClick={() => setFilterDate("")}
                                        className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto thin-scrollbar pr-2">
                            {patient.history.past.filter(apt => !filterDate || apt.date === filterDate).length === 0 ? (
                                <p className="text-sm text-foreground/60 font-medium">No past records{filterDate && ' on this date'}.</p>
                            ) : (
                                patient.history.past
                                    .filter(apt => !filterDate || apt.date === filterDate)
                                    .map(apt => {
                                        const financials = getAptFinancials(apt);
                                        const aptNotes = (apt as any).notes || "Routine consultation conducted. Vitals recorded.";
                                        const aptPrescriptions = (apt as any).prescriptions || "Tab. Paracetamol 500mg SOS, Multivitamin once daily.";
                                        return (
                                            <div key={apt.id} className="flex flex-col rounded-xl border border-black/[.15] dark:border-white/[.22] p-5 gap-3 bg-black/[.01] dark:bg-white/[.01]">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[.08] pb-3 dark:border-white/[.08]">
                                                    <div>
                                                        <p className="text-sm font-bold text-foreground">{apt.services.join(", ")}</p>
                                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                            <span className="flex items-center gap-1 text-xs text-foreground/80 font-medium"><CalendarIcon className="h-3.5 w-3.5" /> {apt.date}</span>
                                                            {apt.time && <span className="flex items-center gap-1 text-xs text-foreground/80 font-medium"><Clock className="h-3.5 w-3.5" /> {apt.time}</span>}
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(apt.status)}
                                                </div>

                                                {/* Notes & Prescriptions */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                                    <div className="rounded-lg border border-blue-200/70 bg-blue-50/50 p-3 text-xs dark:border-blue-900/40 dark:bg-blue-950/20">
                                                        <span className="font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                                                            <FileText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Notes
                                                        </span>
                                                        <p className="text-foreground/85 font-medium leading-relaxed">{aptNotes}</p>
                                                    </div>
                                                    <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/50 p-3 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
                                                        <span className="font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wide flex items-center gap-1 mb-1">
                                                            <Pill className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Prescriptions
                                                        </span>
                                                        <p className="text-foreground/85 font-medium leading-relaxed">{aptPrescriptions}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </div>
                )}

                {/* PHYSIO SCHEDULES & NOTES TAB */}
                {activeTab === "physio" && (
                    <div className="flex flex-col gap-6 animate-in fade-in">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-foreground">Physiotherapy Schedules & Clinical Notes</h2>
                                <p className="text-xs text-foreground/60 mt-0.5">
                                    Rehabilitation timeline and physiotherapist notes.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {physioSchedules.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-black/[.15] dark:border-white/[.22] p-8 text-center">
                                    <Activity className="h-8 w-8 text-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-foreground/60">No physiotherapy schedules or notes recorded for this patient.</p>
                                </div>
                            ) : (
                                physioSchedules.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-2xl border border-teal-200/80 bg-teal-50/20 p-6 dark:border-teal-900/40 dark:bg-teal-950/10 shadow-sm"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[.08] pb-4 dark:border-white/[.08]">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                                                    <CalendarIcon className="h-4 w-4 text-teal-600" />
                                                    <span>{item.date}</span>
                                                    <span className="text-foreground/40">•</span>
                                                    <span className="flex items-center gap-1 text-xs font-semibold text-foreground/70">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        {item.time}
                                                    </span>
                                                </div>

                                                <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 flex items-center gap-1">
                                                    <Activity className="h-3 w-3" />
                                                    {item.therapist}
                                                </span>

                                                <span className="text-sm font-bold text-foreground">
                                                    {item.service}
                                                </span>


                                            </div>

                                            <div className="flex items-center gap-2">
                                                {item.referringDoctor && (
                                                    <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-1 text-xs font-semibold text-foreground/70">
                                                        Ref: {item.referringDoctor}
                                                    </span>
                                                )}
                                                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 dark:bg-green-950/40 dark:text-green-300 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>



                                        <div className="mt-4 rounded-xl border border-teal-200/80 bg-white dark:border-teal-900/40 dark:bg-zinc-800/80 p-4">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                                                <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                                                Therapist Clinical Notes & Assessment
                                            </div>
                                            <p className="mt-2 text-sm leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">
                                                {item.notes}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
