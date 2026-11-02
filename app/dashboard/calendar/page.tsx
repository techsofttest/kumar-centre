"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Filter,
    Clock,
    Search,
    FileText,
    Stethoscope,
    UserCheck,
    Activity
} from "lucide-react";
import { normalizeRole } from "@/lib/roles";

// Status Types
type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled";

interface Appointment {
    id: string;
    patient: string;
    service: string;
    staffId: string;
    date: string;
    startTime: string; // e.g., "09:00"
    durationMinutes: number;
    status: AppointmentStatus;
}

type RoleType = string;

const formatDateYMD = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const convertTimeTo24 = (t: string) => {
    if (!t) return "10:00";
    if (!t.includes("AM") && !t.includes("PM")) return t;
    const parts = t.trim().split(" ");
    const time = parts[0];
    const modifier = parts[1];
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return `${String(hours).padStart(2, "0")}:${String(minutes || 0).padStart(2, "0")}`;
};

export default function CalendarMatrix() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const todayYMD = useMemo(() => formatDateYMD(new Date()), []);

    // Role state
    const [userRole, setUserRole] = useState<RoleType>("Doctor");
    const [currentDoctor, setCurrentDoctor] = useState<string>("Dr. SASIKUMAR");

    // Current viewing date (defaults to today)
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("All");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [storedAppointments, setStoredAppointments] = useState<Appointment[]>([]);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // The clinical staff roster for Calendar Matrix: ONLY Doctors and Physio
    const staff = useMemo(() => [
        { id: "S1", name: "Dr. SASIKUMAR", role: "Doctor" },
        { id: "S2", name: "Dr. MALINI SASIKUMAR", role: "Doctor" },
        { id: "S3", name: "Dr. SRUTHI SASIKUMAR", role: "Doctor" },
        { id: "S4", name: "Dr. SREENATH", role: "Doctor" },
        { id: "S5", name: "PHYSIOTHERAPIST", role: "Physiotherapist" },
    ], []);

    useEffect(() => {
        setIsMounted(true);

        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }

        const storedDoctor = localStorage.getItem("selectedDoctor") || localStorage.getItem("userName");
        if (storedDoctor && staff.some(s => s.name === storedDoctor)) {
            setCurrentDoctor(storedDoctor);
        }

        try {
            const storedRaw = localStorage.getItem("kumar_appointments");
            if (storedRaw) {
                const storedList = JSON.parse(storedRaw);
                if (Array.isArray(storedList)) {
                    const mapped: Appointment[] = [];
                    storedList.forEach((item: any) => {
                        const matchedStaff = staff.find(s => {
                            const clin = (item.clinician || "").toLowerCase();
                            const serv = (item.service || "").toLowerCase();
                            if (s.role === "Physiotherapist" && (clin.includes("physio") || serv.includes("physio") || serv.includes("rehab") || serv.includes("decompression") || serv.includes("therapy"))) {
                                return true;
                            }
                            return s.name.toLowerCase() === clin;
                        });
                        const staffId = matchedStaff ? matchedStaff.id : (item.clinician?.toLowerCase().includes("physio") ? "S5" : "S1");
                        mapped.push({
                            id: item.id || `APT-${Math.floor(100 + Math.random() * 900)}`,
                            patient: item.patientName || "Walk-in Patient",
                            service: item.service || "General Consultation",
                            staffId: staffId,
                            date: item.date || todayYMD,
                            startTime: convertTimeTo24(item.time || "10:00"),
                            durationMinutes: 45,
                            status: (item.status as AppointmentStatus) || "Confirmed"
                        });
                    });
                    setStoredAppointments(mapped);
                }
            }
        } catch (e) {
            console.error("Error loading appointments in calendar", e);
        }
    }, [staff, todayYMD]);

    const normalizedRole = normalizeRole(userRole);
    const isDoctor = normalizedRole === "Doctor";
    const isPhysio = normalizedRole === "Physiotherapist";

    const handlePrevDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const handleNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        setCurrentDate(next);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // Appointments list: base mock appointments (anchored to today and default date) plus dynamically booked appointments
    const appointments: Appointment[] = useMemo(() => {
        const baseAppointments: Appointment[] = [
            // Appointments for Dr. SASIKUMAR (S1)
            { id: "APT-201", patient: "Anjali Nair", service: "IDD THERAPY", staffId: "S1", date: todayYMD, startTime: "09:00", durationMinutes: 60, status: "Confirmed" },
            { id: "APT-206", patient: "Deepa Pillai", service: "PROLOTHERAPY", staffId: "S1", date: todayYMD, startTime: "11:00", durationMinutes: 60, status: "Confirmed" },
            { id: "APT-213", patient: "Harikrishnan Nair", service: "LASER TREATMENT", staffId: "S1", date: todayYMD, startTime: "15:30", durationMinutes: 30, status: "Confirmed" },

            // Appointments for other staff
            { id: "APT-203", patient: "Priya Varma", service: "Spine & Orthopedic Review", staffId: "S2", date: todayYMD, startTime: "10:00", durationMinutes: 45, status: "Confirmed" },
            { id: "APT-209", patient: "Lakshmi Warrier", service: "SPINAL DECOMPRESSION", staffId: "S2", date: todayYMD, startTime: "13:30", durationMinutes: 45, status: "Pending" },
            { id: "APT-205", patient: "Vishnu Namboothiri", service: "Spine Rehab OPD", staffId: "S3", date: todayYMD, startTime: "11:00", durationMinutes: 45, status: "Pending" },
            { id: "APT-210", patient: "Sreekumar Varma", service: "Lumbar Disc Consultation", staffId: "S3", date: todayYMD, startTime: "14:00", durationMinutes: 45, status: "Confirmed" },
            { id: "APT-207", patient: "Meera Nambiar", service: "Spinal Specialist Follow-up", staffId: "S4", date: todayYMD, startTime: "11:30", durationMinutes: 30, status: "Confirmed" },
            { id: "APT-212", patient: "Gokul Das", service: "Back Pain Assessment", staffId: "S4", date: todayYMD, startTime: "15:00", durationMinutes: 30, status: "Confirmed" },
            { id: "APT-202", patient: "Rahul Menon", service: "WARMING & MASSAGE", staffId: "S5", date: todayYMD, startTime: "09:00", durationMinutes: 60, status: "Confirmed" },
            { id: "APT-204", patient: "Anoop Kumar", service: "IDD THERAPY", staffId: "S5", date: todayYMD, startTime: "10:30", durationMinutes: 45, status: "Confirmed" },
            { id: "APT-208", patient: "Reshma Thomas", service: "Cervical & Lumbar Traction", staffId: "S5", date: todayYMD, startTime: "13:00", durationMinutes: 45, status: "Confirmed" },

            // Historic dates backup (2026-07-08)
            { id: "APT-301", patient: "Anjali Nair", service: "IDD THERAPY", staffId: "S1", date: "2026-07-08", startTime: "09:00", durationMinutes: 60, status: "Confirmed" },
            { id: "APT-302", patient: "Rahul Menon", service: "WARMING & MASSAGE", staffId: "S5", date: "2026-07-08", startTime: "09:00", durationMinutes: 60, status: "Confirmed" },
            { id: "APT-303", patient: "Priya Varma", service: "PROLOTHERAPY", staffId: "S2", date: "2026-07-08", startTime: "10:00", durationMinutes: 45, status: "Confirmed" },
            { id: "APT-304", patient: "Deepa Pillai", service: "LASER TREATMENT", staffId: "S1", date: "2026-07-08", startTime: "11:00", durationMinutes: 60, status: "Confirmed" },
        ];

        return [...baseAppointments, ...storedAppointments];
    }, [todayYMD, storedAppointments]);

    // System Config: Clinic Hours (08:00 AM to 05:00 PM)
    const hours = Array.from({ length: 10 }, (_, i) => i + 8);
    const rowHeight = 120; // 120px per hour for absolute positioning calculation

    const getStatusColors = (status: AppointmentStatus) => {
        switch (status) {
            case "Confirmed": return "bg-green-100 border-green-300 text-green-900 dark:bg-green-900/30 dark:border-green-700/50 dark:text-green-200";
            case "Pending": return "bg-orange-100 border-orange-300 text-orange-900 dark:bg-orange-900/30 dark:border-orange-700/50 dark:text-orange-200";
            case "Cancelled": return "bg-red-100 border-red-300 text-red-900 dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-200 line-through opacity-70";
            default: return "bg-gray-100 border-gray-300 text-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200";
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const calculatePosition = (startTime: string, durationMinutes: number) => {
        const [hrs, mins] = startTime.split(":").map(Number);
        const startOffset = ((hrs - 8) * rowHeight) + (((mins || 0) / 60) * rowHeight);
        const height = ((durationMinutes || 45) / 60) * rowHeight;
        return { top: `${startOffset}px`, height: `${height}px` };
    };

    // Calendar Matrix: Hide physio from the calendar matrix (Doctors only)
    const displayedStaff = useMemo(() => {
        if (isDoctor) {
            // For a doctor, show strictly their own schedule column
            return staff.filter(m => m.name === currentDoctor);
        }

        // For Admin / Receptionist / hospital matrix: show doctors only (hide physio)
        return staff.filter(member => {
            if (member.role === "Physiotherapist" || member.name === "PHYSIOTHERAPIST") return false;
            const matchesRole = selectedRole === "All" || member.role === selectedRole;
            const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                appointments.some(apt => apt.staffId === member.id && apt.patient.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesRole && matchesSearch;
        });
    }, [isDoctor, staff, currentDoctor, selectedRole, searchQuery, appointments]);

    const formattedCurrentDate = formatDateYMD(currentDate);

    // Filter appointments for the displayed date and displayed staff
    const displayedStaffIds = useMemo(() => new Set(displayedStaff.map(s => s.id)), [displayedStaff]);

    const filteredAppointments = useMemo(() => {
        return appointments.filter(apt =>
            apt.date === formattedCurrentDate &&
            displayedStaffIds.has(apt.staffId) &&
            (apt.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
                staff.find(s => s.id === apt.staffId)?.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [appointments, formattedCurrentDate, displayedStaffIds, searchQuery, staff]);

    const isViewingToday = formattedCurrentDate === todayYMD;

    if (!isMounted) {
        return (
            <div className="flex h-full w-full flex-col p-8">
                <div className="mb-6 flex flex-col gap-4 border-b border-black/[.15] pb-6 dark:border-white/[.22]">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Calendar Matrix
                    </h1>
                    <p className="text-xs text-foreground/60 mt-1">
                        Loading clinical appointment matrix...
                    </p>
                </div>
                <div className="flex-1 rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-12 flex flex-col items-center justify-center">
                    <CalendarIcon className="h-10 w-10 text-foreground/30 animate-pulse mb-3" />
                    <span className="text-sm font-medium text-foreground/60">Loading schedule matrix...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full flex-col p-8">

            {/* Module Toolbar */}
            <div className="mb-6 flex flex-col gap-4 border-b border-black/[.15] pb-6 dark:border-white/[.22]">
                {/* Header Row */}
                <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                Calendar Matrix
                            </h1>
                            {isPhysio ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-0.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-300">
                                    <Activity className="h-3.5 w-3.5" />
                                    Physiotherapist Schedule View
                                </span>
                            ) : isDoctor ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                    <Stethoscope className="h-3.5 w-3.5" />
                                    Doctor Personal View
                                </span>
                            ) : null}
                        </div>
                        <p className="text-xs text-foreground/60 mt-1">
                            {isPhysio
                                ? "Displaying Physiotherapy & Rehabilitation schedule matrix exclusively"
                                : isDoctor
                                ? `Displaying your personal clinical appointment matrix for ${currentDoctor}`
                                : "Hospital-wide clinical calendar matrix across all doctors and departments"}
                        </p>
                    </div>

                    {/* Actions: Doctor / Physio navigates to My Schedule; Admin sees Appointments */}
                    {isPhysio ? (
                        <Button
                            variant="filled"
                            icon={CalendarIcon}
                            onClick={() => router.push('/dashboard/schedule')}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            My Schedule Timeline
                        </Button>
                    ) : isDoctor ? (
                        <Button
                            variant="filled"
                            icon={CalendarIcon}
                            onClick={() => router.push('/dashboard/schedule')}
                            className="bg-[#3C43EC] hover:bg-[#3239cb] text-white"
                        >
                            My Schedule Timeline
                        </Button>
                    ) : (
                        <Button
                            variant="filled"
                            icon={FileText}
                            onClick={() => router.push('/dashboard/appointments')}
                            className="bg-[#3C43EC] hover:bg-[#3239cb] text-white"
                        >
                            See Appointments
                        </Button>
                    )}
                </div>

                {/* Filters and Search Row */}
                <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                    {/* Date Navigator */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="flex items-center gap-1.5 rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 p-1 dark:border-white/[.22]">
                            <Button variant="ghost" size="xs" icon={ChevronLeft} onClick={handlePrevDay} className="px-2 h-9" />
                            <DatePicker
                                value={formattedCurrentDate}
                                onChange={(val) => {
                                    if (val) {
                                        const [year, month, day] = val.split('-');
                                        setCurrentDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
                                    }
                                }}
                                className="w-56"
                            />
                            <Button variant="ghost" size="xs" icon={ChevronRight} onClick={handleNextDay} className="px-2 h-9" />
                        </div>

                        {!isViewingToday && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleToday}
                                className="h-10 text-xs font-semibold"
                            >
                                Jump to Today
                            </Button>
                        )}
                    </div>

                    {/* Controls & Doctor Switcher */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* If user is Physio, show physio indicator */}
                        {isPhysio ? (
                            <div className="flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50/70 px-3.5 py-1.5 dark:border-teal-900/50 dark:bg-teal-950/20">
                                <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                                    <Activity className="h-3.5 w-3.5 text-teal-600" />
                                    Lead Physiotherapist:
                                </span>
                                <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
                                    PHYSIOTHERAPIST (Personal Schedule)
                                </span>
                            </div>
                        ) : isDoctor ? (
                            <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-1.5 dark:border-blue-900/50 dark:bg-blue-950/20">
                                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 flex items-center gap-1">
                                    <UserCheck className="h-3.5 w-3.5 text-blue-600" />
                                    Doctor:
                                </span>
                                <select
                                    value={currentDoctor}
                                    onChange={(e) => {
                                        setCurrentDoctor(e.target.value);
                                        try {
                                            localStorage.setItem("selectedDoctor", e.target.value);
                                        } catch (_) {}
                                    }}
                                    className="h-8 rounded border border-blue-300 bg-white px-2.5 text-xs font-bold text-blue-900 focus:outline-none dark:border-blue-700 dark:bg-zinc-900 dark:text-blue-100 cursor-pointer"
                                >
                                    {staff.filter(s => s.role === "Doctor").map(doc => (
                                        <option key={doc.id} value={doc.name}>
                                            {doc.name} (My Schedule)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <>
                                {/* Search Bar for Admin */}
                                <div className="relative w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                    <input
                                        type="text"
                                        placeholder="Search patient or doctor..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>

                                {/* Filter Dropdown for Admin */}
                                <div className="relative">
                                    <Button variant="outline" icon={Filter} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                                        Filter: {selectedRole}
                                    </Button>
                                    {showFilterDropdown && (
                                        <div className="absolute right-0 mt-2 z-50 w-48 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-1 shadow-lg dark:border-white/[.22]">
                                            {["All", "Doctor"].map(role => (
                                                <button
                                                    key={role}
                                                    onClick={() => {
                                                        setSelectedRole(role);
                                                        setShowFilterDropdown(false);
                                                    }}
                                                    className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                                >
                                                    {role}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Calendar Grid */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto thin-scrollbar rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] shadow-sm">
                <div
                    className="flex flex-col"
                    style={{
                        minWidth: "100%",
                        width: isDoctor ? "100%" : `${Math.max(80 + (displayedStaff.length * 240), 800)}px`
                    }}
                >

                    {/* Header Row: Staff Column Header */}
                    <div className="sticky top-0 z-40 flex border-b border-black/[.15] bg-slate-50/90 dark:bg-zinc-900/90 backdrop-blur-sm dark:border-white/[.22]">
                        <div className="sticky left-0 z-50 w-24 border-r border-black/[.15] bg-slate-50 dark:bg-zinc-900 p-4 dark:border-white/[.22]">
                            <span className="text-[11px] font-bold uppercase text-foreground/50">Time</span>
                        </div>
                        {displayedStaff.map((member) => (
                            <div
                                key={member.id}
                                className="flex flex-1 min-w-[240px] flex-col items-center justify-center border-r border-black/[.15] py-4 last:border-r-0 dark:border-white/[.22]"
                            >
                                <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                    <Stethoscope className="h-4 w-4 text-[#3C43EC]" />
                                    {member.name}
                                </span>
                                <span className="text-xs font-semibold text-foreground/60">
                                    {isDoctor ? "My Clinical Schedule Lane" : member.role}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Body */}
                    <div className="relative flex">
                        {/* Y-Axis: Time Slots */}
                        <div className="sticky left-0 z-30 w-24 border-r border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22]">
                            {hours.map((hour) => (
                                <div
                                    key={hour}
                                    className="flex flex-col items-end pr-3 pt-2 text-xs font-semibold text-foreground/60 border-b border-black/[.05] dark:border-white/[.05]"
                                    style={{ height: `${rowHeight}px` }}
                                >
                                    {hour === 12 ? '12:00 PM' : hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                                </div>
                            ))}
                        </div>

                        {/* X-Axis: Staff Lanes */}
                        <div className="relative flex flex-1">
                            {/* Background Grid Lines */}
                            <div className="absolute inset-0 flex flex-col pointer-events-none">
                                {hours.map((hour) => (
                                    <div key={`line-${hour}`} className="w-full border-b border-black/[.05] dark:border-white/[.05]" style={{ height: `${rowHeight}px` }} />
                                ))}
                            </div>

                            {/* Staff Appointment Lanes */}
                            {displayedStaff.map((member) => {
                                const memberAppointments = filteredAppointments.filter(apt => apt.staffId === member.id);

                                return (
                                    <div
                                        key={`lane-${member.id}`}
                                        className="relative flex-1 min-w-[240px] border-r border-black/[.15] last:border-r-0 dark:border-white/[.22]"
                                    >
                                        {/* Filter and map appointments for this specific staff member */}
                                        {memberAppointments.map(apt => {
                                            const { top, height } = calculatePosition(apt.startTime, apt.durationMinutes);

                                            return (
                                                <div
                                                    key={apt.id}
                                                    onClick={() => {
                                                        if (isDoctor) {
                                                            router.push('/dashboard/doctor');
                                                        } else {
                                                            router.push(`/dashboard/appointments?id=${apt.id}`);
                                                        }
                                                    }}
                                                    className={`group absolute left-2 right-2 z-10 flex flex-col overflow-hidden rounded-xl border p-3 transition-transform hover:z-20 hover:scale-[1.01] cursor-pointer shadow-sm min-h-[56px] ${getStatusColors(apt.status)}`}
                                                    style={{ top, height }}
                                                >
                                                    <div className="flex items-center gap-2 justify-between">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-200 dark:bg-purple-950 text-purple-800 dark:text-purple-200 font-bold text-[10px]">
                                                                {getInitials(apt.patient)}
                                                            </div>
                                                            <span className="truncate text-xs font-bold leading-tight">{apt.patient}</span>
                                                        </div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 shrink-0">
                                                            {apt.status}
                                                        </span>
                                                    </div>

                                                    <span className="mt-1 truncate text-xs font-semibold opacity-90">{apt.service}</span>

                                                    <div className="mt-auto flex items-center gap-1.5 opacity-90 text-[11px] font-medium pt-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{apt.startTime} ({apt.durationMinutes}m)</span>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {memberAppointments.length === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="text-xs font-medium text-foreground/30 italic">
                                                    No appointments scheduled on this date
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-foreground/70">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-orange-400"></div> Pending</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-green-500"></div> Confirmed</span>
                    <span className="flex items-center gap-2"><div className="h-3 w-3 rounded-sm bg-red-600 opacity-70"></div> Cancelled</span>
                </div>

                {/* Horizontal Scroll Controls on the bottom right (only needed if multiple staff columns exist) */}
                {!isDoctor && displayedStaff.length > 1 && (
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={scrollLeft} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3C43EC] text-white hover:bg-[#3239cb] transition-colors">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={scrollRight} className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3C43EC] text-white hover:bg-[#3239cb] transition-colors">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
}
