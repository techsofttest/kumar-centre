"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import { DatePicker } from "@/components/ui/date-picker";
import { AppointmentStatus, StatusDropdown } from "@/components/ui/status-dropdown";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Calendar as CalendarIcon,
    Clock,
    User,
    Stethoscope,
    FileText,
    AlertCircle,
    X,
    Check,
    Ban,
    CreditCard
} from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { normalizeRole } from "@/lib/roles";
import { APPOINTMENT_TYPES, getAppointmentType } from "@/lib/appointment-types";
import type { AppointmentType } from "@/lib/appointment-types";

type RoleType = string;

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    service: string;
    clinician: string;
    date: string;
    time: string;
    status: AppointmentStatus;
    appointmentType?: AppointmentType;
    internalNotes: string;
    patientNotes: string;
    patientPhone?: string;
    amount?: string | number;
    fee?: string | number;
    cancellationDate?: string;
    cancellationReason?: string;
    cancelledBy?: string;
}

const servicesData = [
    { id: "s1", category: "Consultations", name: "Spine & Orthopedic Consultation", price: 500, duration: "30 mins", description: "Comprehensive spinal evaluation and clinical review.", prep: "Previous MRI/X-Rays if available.", clinicians: ["Dr. SASIKUMAR", "Dr. MALINI SASIKUMAR"] },
    { id: "s2", category: "Consultations", name: "General Medicine Review", price: 500, duration: "30 mins", description: "General health examination and diagnostic review.", prep: "None.", clinicians: ["Dr. SASIKUMAR", "Dr. SRUTHI SASIKUMAR", "Dr. SREENATH"] },
    { id: "s3", category: "Physiotherapy & Rehab", name: "WARMING & MASSAGE", price: 650, duration: "45 mins", description: "Therapeutic warming and targeted deep tissue back massage.", prep: "None.", clinicians: ["PHYSIOTHERAPIST"] },
    { id: "s4", category: "Advanced Spine Care", name: "IDD THERAPY", price: 1500, duration: "45 mins", description: "Intervertebral Differential Dynamics non-surgical decompression.", prep: "Comfortable wear.", clinicians: ["Dr. SASIKUMAR", "PHYSIOTHERAPIST"] },
    { id: "s5", category: "Advanced Spine Care", name: "LASER TREATMENT", price: 1200, duration: "30 mins", description: "Class IV high-intensity targeted laser spine therapy.", prep: "None.", clinicians: ["Dr. SASIKUMAR", "PHYSIOTHERAPIST"] },
    { id: "s6", category: "Regenerative Spine Care", name: "PROLOTHERAPY", price: 2500, duration: "45 mins", description: "Regenerative joint and lumbar ligament injection.", prep: "Previous reports required.", clinicians: ["Dr. SASIKUMAR", "Dr. MALINI SASIKUMAR"] },
    { id: "s7", category: "Advanced Spine Care", name: "SPINAL DECOMPRESSION", price: 1800, duration: "45 mins", description: "Computerized axial spinal decompression therapy.", prep: "Comfortable clothing.", clinicians: ["PHYSIOTHERAPIST", "Dr. SREENATH"] },
];

export default function AppointmentsManager() {
    // DEMONSTRATION ONLY: Mock role loadable from localStorage/Context
    const [userRole, setUserRole] = useState<RoleType>("reception");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole") as RoleType | null;
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    const normalizedRole = normalizeRole(userRole);
    const isDoctor = normalizedRole === "Doctor";
    const isPhysio = normalizedRole === "Physiotherapist";
    const canManageAppointmentStatus = normalizedRole === "admin" || normalizedRole === "Receptionist";
    const getTodayDateString = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    // Security layer: Block clinical staff from this operational view


    const generateAppointments = (): Appointment[] => {
        const list: Appointment[] = [];
        const patients = [
            { id: "PAT-001", name: "Anjali Nair" },
            { id: "PAT-002", name: "Rahul Menon" },
            { id: "PAT-003", name: "Priya Varma" },
            { id: "PAT-004", name: "Vishnu Namboothiri" },
            { id: "PAT-005", name: "Deepa Pillai" },
            { id: "PAT-006", name: "Arjun Kurup" },
            { id: "PAT-007", name: "Meera Nambiar" },
            { id: "PAT-008", name: "Malavika Panicker" },
            { id: "PAT-009", name: "Reshma Thomas" },
            { id: "PAT-010", name: "Lakshmi Warrier" },
            { id: "PAT-011", name: "Suresh Kumar" },
            { id: "PAT-012", name: "Sreekumar Varma" },
        ];
        const services = [
            "WARMING & MASSAGE", "IDD THERAPY", "LASER TREATMENT", "PROLOTHERAPY", 
            "SPINAL DECOMPRESSION", "TRIGGER POINT INJECTION", "MYOFASCIAL RELEASE", "CORE STABILIZATION & REHAB", "ULTRASOUND & HEAT THERAPY"
        ];
        const clinicians = [
            "Dr. SASIKUMAR", "Dr. MALINI SASIKUMAR", "Dr. SRUTHI SASIKUMAR", "Dr. SREENATH", "PHYSIOTHERAPIST"
        ];
        const statuses: AppointmentStatus[] = [
            "Confirmed", "Pending", "Cancelled"
        ];
        
        let idCounter = 201;
        // Generate from July 8 (08) to July 20 (20)
        for (let day = 8; day <= 20; day++) {
            const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
            // 10 appointments per day
            for (let i = 0; i < 10; i++) {
                const hour = 9 + Math.floor(i / 2);
                const minute = (i % 2) * 30;
                const timeStr = `${String(hour === 12 ? 12 : hour % 12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
                
                const patient = patients[(day * 3 + i) % patients.length];
                const service = services[(day * 2 + i * 5) % services.length];
                const clinician = clinicians[(day + i * 2) % clinicians.length];
                const status = statuses[(day * i + 3) % statuses.length];
                
                list.push({
                    id: `APT-${idCounter++}`,
                    patientId: patient.id,
                    patientName: patient.name,
                    service,
                    clinician,
                    date: dateStr,
                    time: timeStr,
                    status,
                    internalNotes: "",
                    patientNotes: ""
                });
            }
        }
        return list;
    };

    // Mock Database
    const [appointments, setAppointments] = useState<Appointment[]>(() => generateAppointments());

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const [editService, setEditService] = useState("");
    const [editAppointmentType, setEditAppointmentType] = useState<AppointmentType>("New Registration");
    const [editAmount, setEditAmount] = useState("");
    const [editDate, setEditDate] = useState("");
    const [editTime, setEditTime] = useState("");
    const [editClinician, setEditClinician] = useState("");
    const [editInternalNotes, setEditInternalNotes] = useState("");
    const [editPatientNotes, setEditPatientNotes] = useState("");
    const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
    const [reminderSuccessMsg, setReminderSuccessMsg] = useState<string | null>(null);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [filterCategory, setFilterCategory] = useState<string>("All");
    const [filterService, setFilterService] = useState<string>("All");
    const [filterClinician, setFilterClinician] = useState<string>("All");
    const [filterAppointmentType, setFilterAppointmentType] = useState<string>("All");

    useEffect(() => {
        try {
            const storedRaw = localStorage.getItem("kumar_appointments");
            if (!storedRaw) return;
            const stored: unknown = JSON.parse(storedRaw);
            if (!Array.isArray(stored)) return;

            const savedAppointments = stored.filter((item): item is Record<string, unknown> =>
                !!item && typeof item === "object" && !Array.isArray(item) &&
                typeof item.id === "string" && typeof item.patientName === "string"
            ).map((item): Appointment => ({
                id: item.id as string,
                patientId: typeof item.patientId === "string" ? item.patientId : "",
                patientName: item.patientName as string,
                service: typeof item.service === "string" ? item.service : "General Consultation",
                clinician: typeof item.clinician === "string" ? item.clinician : "Dr. SASIKUMAR",
                date: typeof item.date === "string" ? item.date : getTodayDateString(),
                time: typeof item.time === "string" ? item.time : "09:00 AM",
                status: item.status === "Pending" || item.status === "Cancelled" ? item.status : "Confirmed",
                appointmentType: getAppointmentType({
                    appointmentType: typeof item.appointmentType === "string" ? item.appointmentType : undefined,
                    clinician: typeof item.clinician === "string" ? item.clinician : undefined,
                    service: typeof item.service === "string" ? item.service : undefined,
                }),
                internalNotes: typeof item.internalNotes === "string" ? item.internalNotes : "",
                patientNotes: typeof item.patientNotes === "string" ? item.patientNotes : "",
                patientPhone: typeof item.phone === "string" ? item.phone : undefined,
                amount: typeof item.amount === "string" || typeof item.amount === "number" ? item.amount : undefined,
                fee: typeof item.fee === "string" || typeof item.fee === "number" ? item.fee : undefined,
            }));

            setAppointments((current) => {
                const byId = new Map(current.map((appointment) => [appointment.id, appointment]));
                savedAppointments.forEach((appointment) => byId.set(appointment.id, appointment));
                return Array.from(byId.values());
            });
        } catch (error) {
            console.error("Error loading saved appointments", error);
        }
    }, []);

    const handleSendWhatsAppReminder = (apt: Appointment) => {
        const phone = apt.patientPhone || "9447123456";
        const cleanPhone = String(phone).replace(/[^0-9]/g, "");
        const formattedPhone = cleanPhone.startsWith("91") && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;
        const msg = encodeURIComponent(
            `Hello ${apt.patientName}, this is a reminder for your upcoming appointment (${apt.service}) with ${apt.clinician} at Kumar Centres on ${apt.date} at ${apt.time}. Please let us know if you need to reschedule.`
        );
        window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
        setReminderSuccessMsg(`WhatsApp reminder sent to ${apt.patientName}!`);
        setTimeout(() => setReminderSuccessMsg(null), 4000);
    };

    const [filterDate, setFilterDate] = useState(getTodayDateString());

    const uniqueClinicians = Array.from(new Set(appointments.map(a => a.clinician)));

    const filteredAppointments = appointments.filter(apt => {
        const matchesSearch = searchQuery === "" || 
            apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
            apt.id.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterStatus === "All" || apt.status === filterStatus;
        
        let matchesService = true;
        if (filterCategory !== "All") {
            const aptCategory = servicesData.find(s => s.name === apt.service)?.category;
            matchesService = aptCategory === filterCategory;
            if (matchesService && filterService !== "All") {
                matchesService = apt.service === filterService;
            }
        }
        
        const matchesClinician = filterClinician === "All" || apt.clinician === filterClinician;
        const matchesAppointmentType = filterAppointmentType === "All" ||
            getAppointmentType(apt) === filterAppointmentType;
        const matchesDate = !filterDate || apt.date === filterDate;
        
        return matchesSearch && matchesStatus && matchesService && matchesClinician && matchesAppointmentType && matchesDate;
    });

    useEffect(() => {
        setIsCancelling(false);
        setSaveSuccessMsg(false);
        if (selectedApt) {
            setEditService(selectedApt.service || "");
            setEditAppointmentType(getAppointmentType(selectedApt));
            setEditAmount(selectedApt.amount !== undefined && selectedApt.amount !== null ? String(selectedApt.amount) : (selectedApt.fee !== undefined ? String(selectedApt.fee) : ""));
            setEditDate(selectedApt.date || "");
            setEditTime(selectedApt.time || "09:00 AM");
            setEditClinician(selectedApt.clinician || "Dr. SASIKUMAR");
            setEditInternalNotes(selectedApt.internalNotes || "");
            setEditPatientNotes(selectedApt.patientNotes || "");
        }
    }, [selectedApt?.id]);

    const handleSaveChanges = () => {
        if (!selectedApt) return;
        const updatedApt: Appointment = {
            ...selectedApt,
            appointmentType: editAppointmentType,
            service: editService.trim() || selectedApt.service,
            amount: editAmount.trim(),
            fee: editAmount.trim(),
            date: editDate || selectedApt.date,
            time: editTime || selectedApt.time,
            clinician: editClinician || selectedApt.clinician,
            internalNotes: editInternalNotes,
            patientNotes: editPatientNotes,
        };
        setAppointments(prev => prev.map(a => a.id === selectedApt.id ? updatedApt : a));
        setSelectedApt(updatedApt);

        try {
            const savedRaw = localStorage.getItem("kumar_appointments");
            let savedList = savedRaw ? JSON.parse(savedRaw) : [];
            if (Array.isArray(savedList)) {
                const idx = savedList.findIndex((a: any) => a.id === selectedApt.id);
                if (idx >= 0) {
                    savedList[idx] = updatedApt;
                } else {
                    savedList = [updatedApt, ...savedList];
                }
                localStorage.setItem("kumar_appointments", JSON.stringify(savedList));
            }
        } catch (err) {
            console.error("Error updating appointment", err);
        }

        setSaveSuccessMsg(true);
        setTimeout(() => setSaveSuccessMsg(false), 3000);
    };

    useEffect(() => {
        try {
            const savedRaw = localStorage.getItem("kumar_appointments");
            if (savedRaw) {
                const saved = JSON.parse(savedRaw);
                if (Array.isArray(saved) && saved.length > 0) {
                    setAppointments(prev => {
                        const savedById = new Map(saved.map(appointment => [appointment.id, appointment]));
                        const existingIds = new Set(prev.map(appointment => appointment.id));
                        const savedAppointments = saved.filter(appointment => !existingIds.has(appointment.id));
                        return [
                            ...savedAppointments,
                            ...prev.map(appointment => savedById.get(appointment.id) ?? appointment),
                        ];
                    });
                }
            }
        } catch (e) {
            console.error("Error loading saved appointments", e);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id");
            if (id) {
                const found = appointments.find(a => a.id === id);
                if (found) {
                    setSelectedApt(found);
                }
            }
        }
    }, [appointments]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const getStatusBadge = (status: AppointmentStatus) => {
        switch (status) {
            case "Confirmed": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "Pending": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
            case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
        }
    };

    const handleStatusUpdate = (id: string, newStatus: AppointmentStatus) => {
        const appointment = appointments.find(apt => apt.id === id);
        if (!appointment) return;

        const updatedAppointment = { ...appointment, status: newStatus };
        setAppointments(prev => prev.map(apt => apt.id === id ? updatedAppointment : apt));
        if (selectedApt?.id === id) {
            setSelectedApt(updatedAppointment);
        }

        try {
            const savedRaw = localStorage.getItem("kumar_appointments");
            const savedAppointments: Appointment[] = savedRaw ? JSON.parse(savedRaw) : [];
            const savedIndex = savedAppointments.findIndex(apt => apt.id === id);
            if (savedIndex >= 0) {
                savedAppointments[savedIndex] = updatedAppointment;
            } else {
                savedAppointments.unshift(updatedAppointment);
            }
            localStorage.setItem("kumar_appointments", JSON.stringify(savedAppointments));
        } catch (error) {
            console.error("Error updating appointment status", error);
        }
    };

    if (userRole === "clinician" || userRole === "Doctor" || userRole === "Physiotherapist") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <Ban className="mb-4 h-12 w-12 text-zinc-500" />
                <h1 className="text-2xl font-bold text-foreground">Operational Queue View</h1>
                <p className="mt-2 text-foreground/60 max-w-md">
                    Clinical staff track patient appointments directly through their clinical schedule and specialized dashboard.
                </p>
                <div className="mt-6 flex gap-3">
                    <Link href="/dashboard/schedule">
                        <Button variant="filled">Open My Schedule</Button>
                    </Link>
                    <Link href={userRole === "Physiotherapist" ? "/dashboard/physiotherapist" : "/dashboard/doctor"}>
                        <Button variant="outline">Back to My Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left Pane: Data Table (Shrinks if drawer is open) */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${(selectedApt || isFilterOpen) ? "w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header & Toolbar */}
                <div className="flex flex-col gap-4 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Appointments</h1>
                            <p className="mt-1 text-sm text-foreground/60">Manage bookings, modifications, and cancellations.</p>
                        </div>
                        {!isDoctor && !isPhysio && (
                            <Link href="/dashboard/appointments/new">
                                <Button variant="filled" icon={Plus}>
                                    New Appointment
                                </Button>
                            </Link>
                        )}
                    </div>

                    {reminderSuccessMsg && (
                        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
                            <WhatsAppIcon className="h-5 w-5 text-emerald-600 shrink-0" />
                            {reminderSuccessMsg}
                        </div>
                    )}

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search by patient name, ID, or reference..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                            />
                        </div>
                        <div className="flex gap-2">
                            <DatePicker
                                value={filterDate}
                                onChange={(d) => setFilterDate(d)}
                                placeholder="Filter by date..."
                                allowClear
                                className="w-full sm:w-52"
                            />
                            <Button variant="outline" icon={Filter} onClick={() => {
                                setSelectedApt(null);
                                setIsFilterOpen(true);
                            }}>
                                Filter
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Patient</th>
                                    <th className="px-6 py-4 font-medium">Service & Clinician</th>
                                    <th className="px-6 py-4 font-medium">Appointment Type</th>
                                    <th className="px-6 py-4 font-medium">Date & Time</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.15] dark:divide-white/[.22]">
                                {filteredAppointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <CalendarIcon className="h-8 w-8 text-foreground/30" />
                                                <p className="font-semibold text-foreground/80">No appointments scheduled</p>
                                                <p className="text-xs text-foreground/50">Please select a different date or refine your filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredAppointments.map((apt) => (
                                        <tr
                                            key={apt.id}
                                            onClick={() => {
                                                setIsFilterOpen(false);
                                                setSelectedApt(apt);
                                            }}
                                            className={`cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04] ${selectedApt?.id === apt.id ? "bg-brand/5 dark:bg-brand/10" : ""}`}
                                        >
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs">
                                                        {getInitials(apt.patientName)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-foreground">{apt.patientName}</span>
                                                        <span className="text-xs text-foreground/50">{apt.id}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-foreground/90">{apt.service}</span>
                                                        {(apt.amount || apt.fee) && (
                                                            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                                ₹{apt.amount || apt.fee}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                                                        <Stethoscope className="h-3 w-3" /> {apt.clinician}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-xs text-foreground/70">
                                                {getAppointmentType(apt)}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-foreground/90 flex items-center gap-1">
                                                        <CalendarIcon className="h-3 w-3" /> {apt.date}
                                                    </span>
                                                    <span className="text-xs text-foreground/50 flex items-center gap-1 mt-0.5">
                                                        <Clock className="h-3 w-3" /> {apt.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                {canManageAppointmentStatus ? (
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <StatusDropdown
                                                            status={apt.status}
                                                            onChange={(status) => handleStatusUpdate(apt.id, status)}
                                                        />
                                                    </div>
                                                ) : (
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(apt.status)}`}>
                                                        {apt.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                    {canManageAppointmentStatus && apt.status === "Pending" && (
                                                        <Button
                                                            size="sm"
                                                            variant="filled"
                                                            onClick={() => handleStatusUpdate(apt.id, "Confirmed")}
                                                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                                                        >
                                                            Confirm
                                                        </Button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSendWhatsAppReminder(apt)}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                                        title={`Send WhatsApp reminder to ${apt.patientName}`}
                                                    >
                                                        <WhatsAppIcon className="h-5 w-5 shrink-0" />
                                                        Send Reminder
                                                    </button>
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        icon={MoreVertical}
                                                        onClick={() => {
                                                            setIsFilterOpen(false);
                                                            setSelectedApt(apt);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Right Pane: Contextual Drawer (Edit / Notes / Cancel) */}
            {selectedApt && (
                <DetailDrawer
                    onClose={() => setSelectedApt(null)}
                    title="Booking Details"
                    subtitle={selectedApt.id}
                >
                    <div className="flex flex-col gap-8">

                        {/* Action Banner */}
                        <div className="flex flex-col gap-4 rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 p-4 dark:border-white/[.22] dark:bg-zinc-900">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                        {getInitials(selectedApt.patientName)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">{selectedApt.patientName}</span>
                                        <span className="text-xs text-foreground/50">{selectedApt.id}</span>
                                        {(selectedApt.amount || selectedApt.fee) && (
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                                Fee: ₹{selectedApt.amount || selectedApt.fee}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(selectedApt.status)}`}>
                                    {selectedApt.status}
                                </span>
                            </div>

                        </div>

                        {selectedApt.status === "Cancelled" ? (
                            <div className="flex flex-col gap-4 pb-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Cancellation Details</h3>
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-900/30 dark:bg-zinc-900/10">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="block text-xs font-medium text-zinc-800/70 dark:text-zinc-400/70 mb-1">Reason for Cancellation</span>
                                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedApt.cancellationReason || "No reason provided"}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="block text-xs font-medium text-zinc-800/70 dark:text-zinc-400/70 mb-1">Date</span>
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedApt.cancellationDate || "Unknown"}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs font-medium text-zinc-800/70 dark:text-zinc-400/70 mb-1">Cancelled By</span>
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-300">{selectedApt.cancelledBy || "Unknown staff"}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : isCancelling ? (
                            <div className="flex flex-col gap-4 pb-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Cancel Appointment</h3>
                                <div className="flex flex-col gap-3">
                                    <p className="text-xs text-foreground/70">
                                        Cancelling will release this time slot. You must provide a reason.
                                    </p>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-foreground/80">Cancellation Reason</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Patient requested, No show..."
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                        />
                                    </div>

                                    {/* <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-foreground/80">Cancellation Date</label>
                                            <input
                                                type="date"
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                            />
                                        </div> */}

                                    <div className="flex gap-2 mt-2">
                                        <Button variant="outline" className="flex-[2] whitespace-nowrap border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" icon={Ban} onClick={() => {
                                            handleStatusUpdate(selectedApt.id, "Cancelled");
                                            setIsCancelling(false);
                                        }}>
                                            Confirm Cancel
                                        </Button>
                                        <Button variant="outline" className="flex-1" onClick={() => setIsCancelling(false)}>
                                            Back
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Modification Form (SRS Requirement) */}
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50">Modify Details</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground/70">
                                                Appointment Type
                                            </label>
                                            <select
                                                value={editAppointmentType}
                                                onChange={(e) => setEditAppointmentType(e.target.value as AppointmentType)}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22] dark:bg-zinc-900"
                                            >
                                                {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground/70">
                                                Service Required <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={editService}
                                                onChange={(e) => setEditService(e.target.value)}
                                                placeholder="Enter service name (e.g. General Consultation, Cardiology Review...)"
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                            />
                                        </div>



                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-foreground/70">Date</label>
                                                <DatePicker
                                                    value={editDate}
                                                    minDate={getTodayDateString()}
                                                    onChange={(d) => setEditDate(d)}
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-foreground/70">Time</label>
                                                <input
                                                    type="text"
                                                    value={editTime}
                                                    onChange={(e) => setEditTime(e.target.value)}
                                                    placeholder="e.g. 10:00 AM"
                                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-foreground/70">Assigned Clinician</label>
                                            <select
                                                value={editClinician}
                                                onChange={(e) => setEditClinician(e.target.value)}
                                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                                            >
                                                <option value="Dr. SASIKUMAR">Dr. SASIKUMAR — Senior Consultant Physician</option>
                                                <option value="Dr. MALINI SASIKUMAR">Dr. MALINI SASIKUMAR — Consultant Physician</option>
                                                <option value="Dr. SRUTHI SASIKUMAR">Dr. SRUTHI SASIKUMAR — Consultant Physician</option>
                                                <option value="Dr. SREENATH">Dr. SREENATH — General Medicine</option>
                                                <option value="PHYSIOTHERAPIST">PHYSIOTHERAPIST — Lead Physiotherapist</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>


                                {saveSuccessMsg && (
                                    <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 text-green-700 dark:text-green-300 text-xs font-medium">
                                        <Check className="h-4 w-4 shrink-0" />
                                        Appointment details and physiotherapy fee updated successfully!
                                    </div>
                                )}

                                <Button
                                    variant="filled"
                                    className="w-full mt-2 bg-[#3C43EC] hover:bg-[#3239cb] text-white"
                                    onClick={handleSaveChanges}
                                >
                                    Save Changes
                                </Button>
                            </>
                        )}

                    </div>
                </DetailDrawer>
            )}

            {/* Filter Drawer */}
            {isFilterOpen && (
                <DetailDrawer
                    onClose={() => setIsFilterOpen(false)}
                    title="Filter Appointments"
                    subtitle="Refine your view"
                >
                    <div className="flex flex-col gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Appointment Type</label>
                            <select
                                value={filterAppointmentType}
                                onChange={(e) => setFilterAppointmentType(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] dark:bg-zinc-900"
                            >
                                <option value="All">All Appointment Types</option>
                                {APPOINTMENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Service Category</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => {
                                    setFilterCategory(e.target.value);
                                    setFilterService("All");
                                }}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Categories</option>
                                <option value="Advanced Spine Care">Advanced Spine Care</option>
                                <option value="Physiotherapy & Rehab">Physiotherapy & Rehab</option>
                                <option value="Regenerative Spine Care">Regenerative Spine Care</option>
                                <option value="Consultations">Consultations</option>
                            </select>
                        </div>

                        {/* Service Filter */}
                        <div className={`transition-opacity duration-300 ${filterCategory === "All" ? "opacity-50 pointer-events-none" : ""}`}>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Specific Service</label>
                            <select
                                value={filterService}
                                onChange={(e) => setFilterService(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Services</option>
                                {filterCategory !== "All" && servicesData.filter(s => s.category === filterCategory).map(s => (
                                    <option key={s.id} value={s.name}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Clinician Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-foreground/80">Clinician</label>
                            <select
                                value={filterClinician}
                                onChange={(e) => setFilterClinician(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                            >
                                <option value="All">All Clinicians</option>
                                {uniqueClinicians.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button variant="filled" className="flex-1" onClick={() => setIsFilterOpen(false)}>Apply Filters</Button>
                            <Button variant="outline" className="flex-1" onClick={() => {
                                setFilterStatus("All");
                                setFilterCategory("All");
                                setFilterService("All");
                                setFilterClinician("All");
                                setFilterAppointmentType("All");
                            }}>Reset Filters</Button>
                        </div>
                    </div>
                </DetailDrawer>
            )}
        </div>
    );
}
