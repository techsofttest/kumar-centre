"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    Phone,
    MapPin,
    Stethoscope,
    FileText,
    ChevronLeft,
    CheckCircle2,
    Building2,
    CalendarCheck,
    AlertCircle,
    Search,
    X,
    UserPlus,
    UserCheck,
    Check,
    Cake,
    Activity
} from "lucide-react";
import { mockPatientsData, Patient } from "@/app/dashboard/patients/data";
import { DatePicker } from "@/components/ui/date-picker";

const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

// Accurate age calculation based on Date of Birth (YYYY-MM-DD)
const calculateAge = (dobString?: string) => {
    if (!dobString) return "";
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return "";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 0 ? age.toString() : "0";
};

const DOCTORS = [
    { id: "doc1", name: "Dr. SASIKUMAR", title: "Senior Consultant Physician" },
    { id: "doc2", name: "Dr. MALINI SASIKUMAR", title: "Consultant Physician" },
    { id: "doc3", name: "Dr. SRUTHI SASIKUMAR", title: "Consultant Physician" },
    { id: "doc4", name: "Dr. SREENATH", title: "General Medicine" },
    { id: "doc5", name: "PHYSIOTHERAPIST", title: "Lead Physiotherapist" }
];

const TIME_SLOTS = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM"
];

interface AppointmentForm {
    firstName: string;
    lastName: string;
    dob: string;
    age: string;
    phone: string;
    location: string;
    address: string;
    service: string;
    amount: string;
    date: string;
    time: string;
    doctor: string;
    notes: string;
}

export default function NewAppointmentPage() {
    const router = useRouter();

    // Patient selection mode: "new" or "existing"
    const [patientType, setPatientType] = useState<"new" | "existing">("new");

    // All available patients loaded from storage / mock
    const [patientsList, setPatientsList] = useState<Patient[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");

    // Searchable dropdown state
    const [searchQuery, setSearchQuery] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Form fields
    const [formData, setFormData] = useState<AppointmentForm>({
        firstName: "",
        lastName: "",
        dob: "",
        age: "",
        phone: "",
        location: "",
        address: "",
        service: "WARMING & MASSAGE",
        amount: "650",
        date: getTodayDate(),
        time: "10:00 AM",
        doctor: DOCTORS[0].name,
        notes: ""
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [bookingRef, setBookingRef] = useState("");
    const [generatedPatientId, setGeneratedPatientId] = useState("");
    const [submittedData, setSubmittedData] = useState<AppointmentForm | null>(null);

    // Load patients database on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("patients_v5");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setPatientsList(parsed);
                    return;
                }
            }
        } catch (e) {
            console.error("Error loading patients", e);
        }
        setPatientsList(mockPatientsData);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filtered patients for searchable dropdown
    const filteredPatients = useMemo(() => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return patientsList.slice(0, 15);
        return patientsList.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.phone.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q) ||
            (p.dob && p.dob.includes(q)) ||
            (p.address && p.address.toLowerCase().includes(q))
        ).slice(0, 20);
    }, [searchQuery, patientsList]);

    // Handle selecting an existing patient
    const handleSelectPatient = (patient: Patient) => {
        setSelectedPatientId(patient.id);
        const nameParts = (patient.name || "").trim().split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        const dob = patient.dob || "";
        const age = (patient as any).age?.toString() || calculateAge(dob);
        const location = (patient as any).location || (patient.address ? patient.address.split(",").slice(-2)[0]?.trim() : "") || "Kumar Centres Main";

        setFormData(prev => ({
            ...prev,
            firstName,
            lastName,
            dob,
            age,
            phone: patient.phone || "",
            location,
            address: patient.address || ""
        }));

        setSearchQuery(`${patient.name} (${patient.id})`);
        setIsDropdownOpen(false);
        if (errorMsg) setErrorMsg("");
    };

    // Switch between New and Existing
    const handlePatientTypeChange = (type: "new" | "existing") => {
        setPatientType(type);
        setErrorMsg("");
        setSelectedPatientId("");
        setSearchQuery("");
        setFormData(prev => ({
            ...prev,
            firstName: "",
            lastName: "",
            dob: "",
            age: "",
            phone: "",
            location: "",
            address: ""
        }));
    };

    const handleInputChange = (field: keyof AppointmentForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errorMsg) setErrorMsg("");
    };

    // Automatically compute age whenever DOB changes
    const handleDobChange = (dobValue: string) => {
        const computedAge = calculateAge(dobValue);
        setFormData(prev => ({
            ...prev,
            dob: dobValue,
            age: computedAge
        }));
        if (errorMsg) setErrorMsg("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.firstName.trim()) {
            setErrorMsg("Please enter the patient's first name.");
            return;
        }
        if (!formData.lastName.trim()) {
            setErrorMsg("Please enter the patient's last name.");
            return;
        }
        if (!formData.phone.trim()) {
            setErrorMsg("Please enter a contact phone number.");
            return;
        }
        if (!formData.date) {
            setErrorMsg("Please select an appointment date.");
            return;
        }
        const today = getTodayDate();
        if (formData.date < today) {
            setErrorMsg("Past dates are not allowed for appointments. Please choose today or a future date.");
            return;
        }
        if (formData.dob && formData.dob > today) {
            setErrorMsg("Future dates are not allowed for Date of Birth.");
            return;
        }
        if (!formData.doctor) {
            setErrorMsg("Please select the doctor to be consulted.");
            return;
        }

        const ref = "APT-" + Math.floor(100000 + Math.random() * 900000);
        setBookingRef(ref);
        setSubmittedData({ ...formData });

        let patientIdToUse = selectedPatientId;

        // If new patient, save to patients database (localStorage) for future use
        if (patientType === "new" || !selectedPatientId) {
            const newPatientId = "PAT-" + Math.floor(1000 + Math.random() * 9000);
            patientIdToUse = newPatientId;
            setGeneratedPatientId(newPatientId);

            const newPatientObj: Patient & { age?: string; location?: string } = {
                id: newPatientId,
                name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
                dob: formData.dob.trim(),
                phone: formData.phone.trim(),
                age: formData.age.trim(),
                location: formData.location.trim(),
                address: formData.address.trim(),
                gender: "Unspecified",
                email: "",
                history: {
                    past: [],
                    future: [{
                        id: ref,
                        date: formData.date,
                        time: formData.time,
                        services: [formData.service.trim() || "General Consultation"],
                        status: "Pending"
                    }]
                },
                vault: {
                    questionnaires: 0,
                    consents: 0,
                    notes: formData.notes ? 1 : 0
                }
            };

            const updatedPatients = [newPatientObj, ...patientsList];
            setPatientsList(updatedPatients);
            try {
                localStorage.setItem("patients_v5", JSON.stringify(updatedPatients));
            } catch (err) {
                console.error("Failed to save patient locally", err);
            }
        }

        // Save appointment to localStorage
        try {
            const existingRaw = localStorage.getItem("kumar_appointments");
            const existing = existingRaw ? JSON.parse(existingRaw) : [];
            const newRecord = {
                id: ref,
                patientId: patientIdToUse,
                patientName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
                service: formData.service.trim() || "General Consultation",
                clinician: formData.doctor,
                amount: formData.amount.trim() || "0",
                fee: formData.amount.trim() || "0",
                date: formData.date,
                time: formData.time,
                status: "Confirmed",
                internalNotes: `DOB: ${formData.dob || "N/A"} (${formData.age ? formData.age + " yrs" : "N/A"}) | Location: ${formData.location || "N/A"} | Address: ${formData.address || "N/A"} | Phone: ${formData.phone}`,
                patientNotes: formData.notes,
                phone: formData.phone,
                dob: formData.dob,
                age: formData.age,
                location: formData.location,
                address: formData.address
            };
            localStorage.setItem("kumar_appointments", JSON.stringify([newRecord, ...existing]));
        } catch (err) {
            console.error("Failed to save appointment locally", err);
        }

        setIsConfirmed(true);
    };

    const handleReset = () => {
        setFormData({
            firstName: "",
            lastName: "",
            dob: "",
            age: "",
            phone: "",
            location: "",
            address: "",
            service: "WARMING & MASSAGE",
            amount: "650",
            date: getTodayDate(),
            time: "10:00 AM",
            doctor: DOCTORS[0].name,
            notes: ""
        });
        setSelectedPatientId("");
        setSearchQuery("");
        setGeneratedPatientId("");
        setErrorMsg("");
        setIsConfirmed(false);
        setSubmittedData(null);
    };

    // Confirmation Screen
    if (isConfirmed && submittedData) {
        return (
            <div className="flex min-h-[85vh] w-full flex-col items-center justify-center p-6">
                <div className="w-full max-w-xl rounded-2xl border border-black/[.15] bg-white p-8 shadow-xl dark:border-white/[.22] dark:bg-zinc-900 md:p-10">
                    <div className="flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Kumar Centres
                        </span>
                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                            Appointment Confirmed
                        </h1>
                        <p className="mt-1 text-sm text-foreground/60">
                            The consultation booking has been recorded successfully.
                        </p>
                    </div>

                    {/* Booking Reference Box */}
                    <div className="mt-6 flex flex-col items-center justify-center rounded-xl bg-slate-50 p-4 text-center dark:bg-zinc-800/60 border border-black/[.08] dark:border-white/[.1]">
                        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/60">
                            Booking Reference
                        </span>
                        <span className="mt-1 font-mono text-2xl font-black tracking-widest text-[#3C43EC] dark:text-blue-400">
                            {bookingRef}
                        </span>
                        {generatedPatientId && (
                            <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                New Patient Saved: <span className="font-mono font-bold">{generatedPatientId}</span>
                            </div>
                        )}
                        {selectedPatientId && !generatedPatientId && (
                            <div className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                                Existing Patient ID: <span className="font-mono font-bold">{selectedPatientId}</span>
                            </div>
                        )}
                    </div>

                    {/* Summary Card */}
                    <div className="mt-6 divide-y divide-black/[.08] dark:divide-white/[.1] rounded-xl border border-black/[.1] dark:border-white/[.15] bg-white dark:bg-zinc-900/50 text-sm">
                        <div className="flex items-center justify-between p-3.5">
                            <span className="text-foreground/60">Patient Name</span>
                            <span className="font-semibold text-foreground">
                                {submittedData.firstName} {submittedData.lastName}
                            </span>
                        </div>
                        {submittedData.dob && (
                            <div className="flex items-center justify-between p-3.5">
                                <span className="text-foreground/60">Date of Birth (Age)</span>
                                <span className="font-medium text-foreground">
                                    {submittedData.dob} {submittedData.age ? `(${submittedData.age} yrs)` : ""}
                                </span>
                            </div>
                        )}
                        {!submittedData.dob && submittedData.age && (
                            <div className="flex items-center justify-between p-3.5">
                                <span className="text-foreground/60">Age</span>
                                <span className="font-medium text-foreground">{submittedData.age} yrs</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between p-3.5">
                            <span className="text-foreground/60">Phone</span>
                            <span className="font-medium text-foreground">{submittedData.phone}</span>
                        </div>
                        {submittedData.location && (
                            <div className="flex items-center justify-between p-3.5">
                                <span className="text-foreground/60">Location</span>
                                <span className="font-medium text-foreground">{submittedData.location}</span>
                            </div>
                        )}
                        {submittedData.address && (
                            <div className="flex items-start justify-between p-3.5 gap-4">
                                <span className="text-foreground/60 shrink-0">Address</span>
                                <span className="font-medium text-foreground text-right">{submittedData.address}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between p-3.5">
                            <span className="text-foreground/60">Service Required</span>
                            <span className="font-semibold text-foreground">{submittedData.service || "General Consultation"}</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5">
                            <span className="text-foreground/60">Doctor to Consult</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-400">{submittedData.doctor}</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5">
                            <span className="text-foreground/60">Consultation Fee</span>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">₹{submittedData.amount || "0"}</span>
                        </div>
                        <div className="flex items-center justify-between p-3.5">
                            <span className="text-foreground/60">Date & Time</span>
                            <span className="font-medium text-foreground">
                                {submittedData.date} • {submittedData.time}
                            </span>
                        </div>
                        {submittedData.notes && (
                            <div className="flex flex-col p-3.5 gap-1">
                                <span className="text-foreground/60">Notes</span>
                                <span className="font-normal text-foreground/80 italic">{submittedData.notes}</span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Button
                            variant="filled"
                            className="flex-1 justify-center"
                            onClick={() => router.push("/dashboard/appointments")}
                        >
                            View in Appointments
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 justify-center"
                            onClick={handleReset}
                        >
                            Book Another
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-full w-full flex-col">
            {/* Page Header */}
            <div className="flex flex-col gap-4 border-b border-black/[.15] px-8 py-6 dark:border-white/[.22]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/appointments"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[.15] bg-white text-foreground/70 transition-colors hover:bg-slate-100 hover:text-foreground dark:border-white/[.22] dark:bg-zinc-900 dark:hover:bg-white/[.05]"
                        title="Back to Appointments"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                Kumar Centres
                            </span>
                            <span className="text-xs text-foreground/50">• Consultation Booking</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                            Create Appointment
                        </h1>
                        <p className="text-xs text-foreground/60">
                            Select an existing patient or register a new patient, then choose the consulting doctor.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <div className="flex-1 overflow-auto p-6 md:p-8 thin-scrollbar">
                <div className="mx-auto max-w-3xl">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {errorMsg && (
                            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}

                        {/* Patient Type Switcher (New vs Existing) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-black/[.15] bg-white p-5 dark:border-white/[.22] dark:bg-zinc-900">
                            <div>
                                <h3 className="text-sm font-bold text-foreground">Patient Category</h3>
                                <p className="text-xs text-foreground/60 mt-0.5">
                                    Choose whether this appointment is for an existing record or a new patient.
                                </p>
                            </div>

                            <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-zinc-800 border border-black/[.08] dark:border-white/[.1] w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => handlePatientTypeChange("new")}
                                    className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        patientType === "new"
                                            ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-900 dark:text-white"
                                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    }`}
                                >
                                    <UserPlus className="h-3.5 w-3.5" />
                                    New Patient
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePatientTypeChange("existing")}
                                    className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                                        patientType === "existing"
                                            ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-900 dark:text-white"
                                            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                    }`}
                                >
                                    <UserCheck className="h-3.5 w-3.5" />
                                    Existing Patient
                                </button>
                            </div>
                        </div>

                        {/* Searchable Dropdown for Existing Patient */}
                        {patientType === "existing" && (
                            <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">
                                            Search & Select Existing Patient
                                        </label>
                                    </div>
                                    {selectedPatientId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedPatientId("");
                                                setSearchQuery("");
                                                setFormData(prev => ({
                                                    ...prev,
                                                    firstName: "",
                                                    lastName: "",
                                                    dob: "",
                                                    age: "",
                                                    phone: "",
                                                    location: "",
                                                    address: ""
                                                }));
                                            }}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Clear Selection
                                        </button>
                                    )}
                                </div>

                                <div className="relative" ref={dropdownRef}>
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="Type patient name, phone number, or ID (e.g. Eleanor, REF-8000)..."
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setIsDropdownOpen(true);
                                                if (selectedPatientId) setSelectedPatientId("");
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            className="h-11 w-full rounded-lg border border-black/[.15] bg-white pl-10 pr-10 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setSelectedPatientId("");
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        firstName: "",
                                                        lastName: "",
                                                        dob: "",
                                                        age: "",
                                                        phone: "",
                                                        location: "",
                                                        address: ""
                                                    }));
                                                }}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Dropdown Results Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute left-0 top-full z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-black/[.15] bg-white shadow-xl dark:border-white/[.22] dark:bg-zinc-900">
                                            {filteredPatients.length === 0 ? (
                                                <div className="p-4 text-center">
                                                    <p className="text-xs text-foreground/60">No patient found matching "{searchQuery}"</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            handlePatientTypeChange("new");
                                                            const parts = searchQuery.trim().split(" ");
                                                            if (parts.length > 0) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    firstName: parts[0] || "",
                                                                    lastName: parts.slice(1).join(" ") || ""
                                                                }));
                                                            }
                                                        }}
                                                        className="mt-2 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        + Register as New Patient
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="divide-y divide-black/[.06] dark:divide-white/[.08]">
                                                    {filteredPatients.map(patient => {
                                                        const isSelected = selectedPatientId === patient.id;
                                                        const pAge = (patient as any).age?.toString() || calculateAge(patient.dob);
                                                        return (
                                                            <div
                                                                key={patient.id}
                                                                onClick={() => handleSelectPatient(patient)}
                                                                className={`flex items-center justify-between p-3.5 cursor-pointer transition-colors ${
                                                                    isSelected
                                                                        ? "bg-blue-50 dark:bg-blue-950/40"
                                                                        : "hover:bg-slate-50 dark:hover:bg-zinc-800/60"
                                                                }`}
                                                            >
                                                                <div className="flex flex-col gap-0.5">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-sm font-semibold text-foreground">
                                                                            {patient.name}
                                                                        </span>
                                                                        <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400">
                                                                            {patient.id}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 text-xs text-foreground/60">
                                                                        <span>{patient.phone}</span>
                                                                        {patient.dob && (
                                                                            <span>• DOB: {patient.dob} {pAge ? `(${pAge} yrs)` : ""}</span>
                                                                        )}
                                                                        {patient.address && <span>• {patient.address}</span>}
                                                                    </div>
                                                                </div>
                                                                {isSelected && (
                                                                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedPatientId && (
                                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-100/70 dark:bg-green-950/30 px-3 py-2 text-xs font-medium text-green-800 dark:text-green-300">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                        <span>
                                            Patient details auto-filled. You only need to set the Doctor, Date, Time & Notes below.
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Section 1: Patient Basic Details */}
                        <div className="rounded-2xl border border-black/[.15] bg-white p-6 dark:border-white/[.22] dark:bg-zinc-900 md:p-8">
                            <div className="flex items-center justify-between border-b border-black/[.08] pb-4 dark:border-white/[.1] mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <h2 className="text-base font-bold text-foreground">
                                        Patient Details
                                    </h2>
                                </div>
                                {patientType === "existing" && selectedPatientId && (
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        Auto-filled from database
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter first name"
                                        value={formData.firstName}
                                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                                        className="h-11 w-full rounded-lg border border-black/[.15] bg-white px-3.5 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter last name"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                                        className="h-11 w-full rounded-lg border border-black/[.15] bg-white px-3.5 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                    />
                                </div>

                                {/* Date of Birth (DOB) */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Date of Birth (DOB)
                                    </label>
                                    <DatePicker
                                        value={formData.dob}
                                        onChange={handleDobChange}
                                        placeholder="Select date of birth"
                                        maxDate={getTodayDate()}
                                        allowClear
                                    />
                                </div>

                                {/* Age (Auto-calculated from DOB) */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                            Age
                                        </label>
                                        {formData.age && (
                                            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                                Auto-calculated
                                            </span>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Cake className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="text"
                                            readOnly
                                            placeholder="Auto-calculated from DOB"
                                            value={formData.age ? `${formData.age} years old` : ""}
                                            className="h-11 w-full rounded-lg border border-black/[.15] bg-slate-50 pl-10 pr-3.5 text-sm font-medium text-foreground cursor-not-allowed dark:border-white/[.22] dark:bg-zinc-800/60"
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="e.g. +91 98765 43210"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className="h-11 w-full rounded-lg border border-black/[.15] bg-white pl-10 pr-3.5 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Location / Area
                                    </label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="e.g. Kumar Centre - Main Branch / City Area"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            className="h-11 w-full rounded-lg border border-black/[.15] bg-white pl-10 pr-3.5 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-foreground/40 pointer-events-none" />
                                        <textarea
                                            rows={2}
                                            placeholder="Door number, street address, locality, postal code"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            className="w-full resize-none rounded-lg border border-black/[.15] bg-white pl-10 pr-3.5 pt-2.5 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Consultation & Doctor */}
                        <div className="rounded-2xl border border-black/[.15] bg-white p-6 dark:border-white/[.22] dark:bg-zinc-900 md:p-8">
                            <div className="flex items-center gap-2 border-b border-black/[.08] pb-4 dark:border-white/[.1] mb-6">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                                    <Stethoscope className="h-4 w-4" />
                                </div>
                                <h2 className="text-base font-bold text-foreground">
                                    Consultation Details
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                {/* Service Required */}
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Service Required <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Activity className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter service required (e.g. WARMING & MASSAGE, IDD THERAPY, LASER TREATMENT, PROLOTHERAPY...)"
                                            value={formData.service}
                                            onChange={(e) => handleInputChange("service", e.target.value)}
                                            className="h-11 w-full rounded-lg border border-black/[.15] bg-white pl-10 pr-3.5 text-sm font-medium text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                        />
                                    </div>
                                </div>

                                {/* Doctor / Clinician to be Consulted */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Doctor / Clinician to Consult <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.doctor}
                                        onChange={(e) => handleInputChange("doctor", e.target.value)}
                                        className="h-11 w-full rounded-lg border border-black/[.15] bg-white px-3.5 text-sm font-medium text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900 cursor-pointer"
                                    >
                                        {DOCTORS.map((doc) => (
                                            <option key={doc.id} value={doc.name}>
                                                {doc.name} — {doc.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>


                                {/* Date (Default: Today's Date) */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                            Appointment Date <span className="text-red-500">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange("date", getTodayDate())}
                                            className="text-[11px] font-semibold text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            Set Today
                                        </button>
                                    </div>
                                    <DatePicker
                                        value={formData.date}
                                        onChange={(d) => handleInputChange("date", d)}
                                        placeholder="Select appointment date"
                                        minDate={getTodayDate()}
                                        required
                                    />
                                </div>

                                {/* Preferred Time */}
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                        Preferred Time Slot
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40 pointer-events-none" />
                                        <select
                                            value={formData.time}
                                            onChange={(e) => handleInputChange("time", e.target.value)}
                                            className="h-11 w-full rounded-lg border border-black/[.15] bg-white pl-10 pr-3.5 text-sm font-medium text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900 cursor-pointer"
                                        >
                                            {TIME_SLOTS.map((slot) => (
                                                <option key={slot} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Notes */}
                        <div className="rounded-2xl border border-black/[.15] bg-white p-6 dark:border-white/[.22] dark:bg-zinc-900 md:p-8">
                            <div className="flex items-center gap-2 border-b border-black/[.08] pb-4 dark:border-white/[.1] mb-6">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <h2 className="text-base font-bold text-foreground">
                                    Notes & Observations
                                </h2>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter consultation reason, symptoms, patient preferences, or internal remarks..."
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange("notes", e.target.value)}
                                    className="w-full resize-none rounded-lg border border-black/[.15] bg-white p-3.5 text-sm text-foreground focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 dark:border-white/[.22] dark:bg-zinc-900"
                                />
                            </div>
                        </div>

                        {/* Submission Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Link href="/dashboard/appointments">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="px-6 h-11"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                variant="filled"
                                icon={CalendarCheck}
                                className="px-8 h-11 bg-[#3C43EC] hover:bg-[#3238c9] text-white"
                            >
                                Confirm & Book Appointment
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
