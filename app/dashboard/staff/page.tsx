"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import { Modal } from "@/components/ui/modal";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Search,
    Plus,
    ShieldAlert,
    ShieldCheck,
    UserCog,
    Mail,
    Phone,
    GraduationCap,
    CalendarClock,
    MoreVertical,
    X,
    Lock,
    Stethoscope,
    Briefcase,
    Activity
} from "lucide-react";

// SRS Module 8 Staff Structure
type PermissionLevel = "Doctor" | "Physiotherapist" | "Receptionist" | "Administrator" | "Clinician";

interface WorkingHours {
    days: string;
    hours: string;
    weekly?: Record<string, string>;
    weeklySlots?: Record<string, number>;
}

interface PartialLeave {
    date: string;
    hours: string;
    slots: number;
}

interface StaffMember {
    id: string;
    name: string;
    position: string; // e.g., "Lead Sonographer", "Front Desk Manager"
    role: PermissionLevel;
    qualifications: string;
    contact: {
        email: string;
        phone: string;
    };
    schedule: WorkingHours;
    breaks?: string;
    holidays?: string[];
    unavailableDates?: string[];
    partialLeaves?: PartialLeave[];
    isActive: boolean;
}

export default function StaffManagement() {
    const [userRole, setUserRole] = useState<string>("admin");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Security layer: Strict block for non-admins


    // The 6 team staff members of Kumar Centres
    const [staffList, setStaffList] = useState<StaffMember[]>([
        { id: "EMP-001", name: "Dr. SASIKUMAR", position: "Senior Consultant Physician & Director", role: "Doctor", qualifications: "MBBS, MD (Senior Physician)", contact: { email: "dr.sasikumar@kumarcentres.com", phone: "+91 98400 12345" }, schedule: { days: "Mon - Sat", hours: "09:00 AM - 01:00 PM" }, isActive: true },
        { id: "EMP-002", name: "Dr. MALINI SASIKUMAR", position: "Consultant Physician & Specialist", role: "Doctor", qualifications: "MBBS, DGO (Consultant)", contact: { email: "dr.malini@kumarcentres.com", phone: "+91 98400 23456" }, schedule: { days: "Mon - Sat", hours: "10:00 AM - 02:00 PM" }, isActive: true },
        { id: "EMP-003", name: "Dr. SRUTHI SASIKUMAR", position: "Consultant Physician", role: "Doctor", qualifications: "MBBS, MD (General Medicine)", contact: { email: "dr.sruthi@kumarcentres.com", phone: "+91 98400 34567" }, schedule: { days: "Mon - Fri", hours: "02:00 PM - 06:00 PM" }, isActive: true },
        { id: "EMP-004", name: "Dr. SREENATH", position: "Duty Medical Officer / Doctor", role: "Doctor", qualifications: "MBBS (Resident Physician)", contact: { email: "dr.sreenath@kumarcentres.com", phone: "+91 98400 45678" }, schedule: { days: "Mon - Sat", hours: "04:00 PM - 08:00 PM" }, isActive: true },
        { id: "EMP-005", name: "RECEPTIOIST", position: "Front Desk & Reception Coordinator", role: "Receptionist", qualifications: "Front Desk Administration & Patient Care Lead", contact: { email: "reception@kumarcentres.com", phone: "+91 98400 56789" }, schedule: { days: "Mon - Sun", hours: "08:00 AM - 08:00 PM" }, isActive: true },
        { id: "EMP-006", name: "PHYSIOTHERAPIST", position: "Lead Physiotherapy & Rehabilitation Specialist", role: "Physiotherapist", qualifications: "BPT, MPT (Ortho & Sports Rehabilitation)", contact: { email: "physio@kumarcentres.com", phone: "+91 98400 67890" }, schedule: { days: "Mon - Sat", hours: "09:00 AM - 05:00 PM" }, isActive: true },
    ]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [newHoliday, setNewHoliday] = useState("");
    const [newUnavailableStart, setNewUnavailableStart] = useState("");
    const [newUnavailableEnd, setNewUnavailableEnd] = useState("");
    const [newPartialLeaveDate, setNewPartialLeaveDate] = useState("");
    const [newPartialLeaveStart, setNewPartialLeaveStart] = useState("");
    const [newPartialLeaveEnd, setNewPartialLeaveEnd] = useState("");
    const [newPartialLeaveSlots, setNewPartialLeaveSlots] = useState("0");
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [modalSearchQuery, setModalSearchQuery] = useState("");
    const [modalRoleFilter, setModalRoleFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const toggleStaffActive = (id: string) => {
        setStaffList(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    };

    const modalFilteredStaff = useMemo(() => {
        return staffList.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(modalSearchQuery.toLowerCase());
            const matchesRole = modalRoleFilter === "All" || s.role === modalRoleFilter;
            return matchesSearch && matchesRole;
        });
    }, [staffList, modalSearchQuery, modalRoleFilter]);

    const handleAddHoliday = () => {
        if (newHoliday && selectedStaff) {
            setSelectedStaff({
                ...selectedStaff,
                holidays: [...(selectedStaff.holidays || []), newHoliday]
            });
            setNewHoliday("");
        }
    };

    const handleRemoveHoliday = (index: number) => {
        if (selectedStaff) {
            const newHolidays = [...(selectedStaff.holidays || [])];
            newHolidays.splice(index, 1);
            setSelectedStaff({ ...selectedStaff, holidays: newHolidays });
        }
    };

    const handleAddUnavailable = () => {
        if (newUnavailableStart && selectedStaff && (!newUnavailableEnd || newUnavailableEnd >= newUnavailableStart)) {
            const dateRange = !newUnavailableEnd || newUnavailableStart === newUnavailableEnd
                ? newUnavailableStart
                : `${newUnavailableStart} to ${newUnavailableEnd}`;
            setSelectedStaff({
                ...selectedStaff,
                unavailableDates: [...(selectedStaff.unavailableDates || []), dateRange]
            });
            setNewUnavailableStart("");
            setNewUnavailableEnd("");
        }
    };

    const handleRemoveUnavailable = (index: number) => {
        if (selectedStaff) {
            const newDates = [...(selectedStaff.unavailableDates || [])];
            newDates.splice(index, 1);
            setSelectedStaff({ ...selectedStaff, unavailableDates: newDates });
        }
    };

    const handleAddPartialLeave = () => {
        if (newPartialLeaveDate && newPartialLeaveStart && newPartialLeaveEnd && newPartialLeaveEnd > newPartialLeaveStart && selectedStaff) {
            setSelectedStaff({
                ...selectedStaff,
                partialLeaves: [...(selectedStaff.partialLeaves || []), {
                    date: newPartialLeaveDate,
                    hours: `${newPartialLeaveStart} - ${newPartialLeaveEnd}`,
                    slots: Math.max(0, Number(newPartialLeaveSlots) || 0)
                }]
            });
            setNewPartialLeaveDate("");
            setNewPartialLeaveStart("");
            setNewPartialLeaveEnd("");
            setNewPartialLeaveSlots("0");
        }
    };

    const handleRemovePartialLeave = (index: number) => {
        if (selectedStaff) {
            const partialLeaves = [...(selectedStaff.partialLeaves || [])];
            partialLeaves.splice(index, 1);
            setSelectedStaff({ ...selectedStaff, partialLeaves });
        }
    };

    const updateWorkingHours = (day: string, hours: string) => {
        if (selectedStaff) {
            setSelectedStaff({
                ...selectedStaff,
                schedule: {
                    ...selectedStaff.schedule,
                    weekly: { ...selectedStaff.schedule.weekly, [day]: hours }
                }
            });
        }
    };

    const updateWorkingSlots = (day: string, slots: number) => {
        if (selectedStaff) {
            setSelectedStaff({
                ...selectedStaff,
                schedule: {
                    ...selectedStaff.schedule,
                    weeklySlots: { ...selectedStaff.schedule.weeklySlots, [day]: slots }
                }
            });
        }
    };

    const getDefaultHoursForDay = (schedule: WorkingHours, dayIndex: number) => {
        if (schedule.days === "Mon - Sun") return schedule.hours;
        if (schedule.days === "Mon - Sat" && dayIndex < 6) return schedule.hours;
        if (schedule.days === "Mon - Fri" && dayIndex < 5) return schedule.hours;
        return schedule.days.includes(weekDays[dayIndex].slice(0, 3)) ? schedule.hours : "Unavailable";
    };

    const toTimeInputValue = (time: string) => {
        const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
        if (!match) return "";
        let hour = Number(match[1]);
        const minute = match[2];
        const period = match[3]?.toUpperCase();
        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;
        return `${String(hour).padStart(2, "0")}:${minute}`;
    };

    const getTimeRange = (hours: string) => {
        const [start = "", end = ""] = hours.split(" - ");
        return { start: toTimeInputValue(start), end: toTimeInputValue(end) };
    };

    const handleSaveProfile = () => {
        if (selectedStaff) {
            setStaffList(prev => prev.map(s => s.id === selectedStaff.id ? selectedStaff : s));
            setSelectedStaff(null);
        }
    };

    // Filter logic
    const filteredStaff = useMemo(() => {
        return staffList.filter(s => {
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === "All" || s.role === roleFilter;
            const matchesStatus = statusFilter === "All" || (statusFilter === "Available" ? s.isActive : !s.isActive);
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [staffList, searchQuery, roleFilter, statusFilter]);

    const getRoleIcon = (role: PermissionLevel) => {
        switch (role) {
            case "Doctor":
            case "Clinician": return <Stethoscope className="h-4 w-4" />;
            case "Physiotherapist": return <Activity className="h-4 w-4" />;
            case "Receptionist": return <Briefcase className="h-4 w-4" />;
            case "Administrator": return <ShieldCheck className="h-4 w-4" />;
        }
    };

    const getRoleColors = (role: PermissionLevel) => {
        switch (role) {
            case "Doctor":
            case "Clinician": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
            case "Physiotherapist": return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800";
            case "Receptionist": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800";
            case "Administrator": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
        }
    };



    if (userRole !== "super_admin" && userRole !== "administrator" && userRole !== "admin") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-" />
                <h1 className="text-2xl font-bold text-foreground">Administrative Lock</h1>
                <p className="mt-2 text-foreground/60">
                    Staff directories and permissions are restricted to Administrative personnel.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Left Pane: Staff Roster */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${selectedStaff ? "hidden md:flex md:w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header & Seat Tracker */}
                <div className="flex flex-col gap-4 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Our Team</h1>
                            <p className="mt-1 text-sm text-foreground/60">Manage internal accounts, permissions, and schedules.</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                icon={UserCog}
                                onClick={() => setShowStatusModal(true)}
                            >
                                Update Status
                            </Button>
                        </div>
                    </div>

                    <div className="mt-2 flex flex-col sm:flex-row gap-3 w-full items-start sm:items-center">
                        <div className="relative flex-1 max-w-md w-full">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-medium text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer flex-1 sm:flex-none"
                            >
                                <option value="All">All Roles</option>
                                <option value="Doctor">Doctor</option>
                                <option value="Physiotherapist">Physiotherapist</option>
                                <option value="Receptionist">Receptionist</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm font-medium text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer flex-1 sm:flex-none"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Available">Available</option>
                                <option value="Unavailable">Unavailable</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Roster List */}
                <div className="flex-1 overflow-auto thin-scrollbar bg-white dark:bg-zinc-900 p-8 dark:bg-zinc-900 thin-scrollbar ">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {filteredStaff.map((staff) => (
                            <div
                                key={staff.id}
                                onClick={() => setSelectedStaff(staff)}
                                className={`group cursor-pointer rounded-xl border bg-white dark:bg-zinc-900 p-6 transition-all hover: dark:bg-zinc-900 ${selectedStaff?.id === staff.id
                                    ? "border-brand ring-1 ring-brand/30 dark:border-brand dark:ring-brand/50"
                                    : "border-black/[.15] dark:border-white/[.22] hover:border-black/[.15] dark:hover:border-white/[.3]"
                                    }`}
                            >
                                <div className="flex flex-col gap-4">
                                    {/* Top Row: Avatar + Role Badge */}
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-base relative">
                                            {getInitials(staff.name)}
                                            <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${staff.isActive ? "bg-emerald-500" : "bg-zinc-400"}`} />
                                        </div>
                                        <span className={`flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${getRoleColors(staff.role)}`}>
                                            {getRoleIcon(staff.role)}
                                            {staff.role}
                                        </span>
                                    </div>
                                    
                                    {/* Bottom Row: Name + Position */}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-bold text-foreground break-words">{staff.name}</h3>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${staff.isActive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                                                {staff.isActive ? "Available" : "Unavailable"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-foreground/60 break-words mt-0.5">{staff.position}</p>
                                    </div>
                                </div>

                                <div className="mt-6 flex flex-row flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-foreground/70">
                                        <Mail className="h-4 w-4 shrink-0 opacity-50" />
                                        <span className="break-all">{staff.contact.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/70">
                                        <Phone className="h-4 w-4 shrink-0 opacity-50" />
                                        <span>{staff.contact.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-foreground/70">
                                        <CalendarClock className="h-4 w-4 shrink-0 opacity-50" />
                                        <span className="break-words">{staff.schedule.days} • {staff.schedule.hours}</span>
                                    </div>
                                    <span className="text-xs font-medium text-foreground/60">Partial leave: {staff.partialLeaves?.length ?? 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Pane: Staff Detail & Edit Drawer */}
            {selectedStaff && (
                <DetailDrawer
                    onClose={() => setSelectedStaff(null)}
                    title="Profile Configuration"
                    subtitle={selectedStaff.id}
                >
                    <div className="flex flex-col gap-8">

                        {/* Core Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Full Name</label>
                                <input
                                    type="text"
                                    value={selectedStaff.name}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, name: e.target.value })}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Job Position</label>
                                <input
                                    type="text"
                                    value={selectedStaff.position}
                                    onChange={(e) => setSelectedStaff({ ...selectedStaff, position: e.target.value })}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>
                            <div className="pt-2">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-foreground/50">Availability Status</label>
                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedStaff.isActive}
                                        onChange={(e) => setSelectedStaff({ ...selectedStaff, isActive: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    <span className="ml-3 text-sm font-semibold text-foreground">
                                        {selectedStaff.isActive ? "Available" : "Unavailable"}
                                    </span>
                                </label>
                            </div>
                        </div>


                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Qualifications & Schedule (SRS Requirements) */}
                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                    <GraduationCap className="h-4 w-4" /> Qualifications
                                </label>
                                <textarea
                                    defaultValue={selectedStaff.qualifications}
                                    rows={2}
                                    className="w-full resize-none rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground/50">
                                    <CalendarClock className="h-4 w-4" /> Working Schedule
                                </label>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-[7rem_1fr_5rem] items-center gap-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                                        <span>Day</span>
                                        <span>Hours</span>
                                        <span className="text-center">Slots</span>
                                    </div>
                                    {weekDays.map((day, dayIndex) => {
                                        const defaultHours = getDefaultHoursForDay(selectedStaff.schedule, dayIndex);
                                        const hours = selectedStaff.schedule.weekly?.[day] ?? defaultHours;
                                        const timeRange = getTimeRange(hours);
                                        return (
                                            <div key={day} className="grid grid-cols-[7rem_1fr_5rem] items-center gap-3">
                                                <span className="text-sm font-medium text-foreground/70">{day}</span>
                                                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                                    <input
                                                        type="time"
                                                        value={timeRange.start}
                                                        onChange={(event) => updateWorkingHours(day, `${event.target.value} - ${timeRange.end}`)}
                                                        aria-label={`${day} start time`}
                                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                                    />
                                                    <span className="text-xs text-foreground/50">to</span>
                                                    <input
                                                        type="time"
                                                        value={timeRange.end}
                                                        onChange={(event) => updateWorkingHours(day, `${timeRange.start} - ${event.target.value}`)}
                                                        aria-label={`${day} end time`}
                                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="sr-only" htmlFor={`${selectedStaff.id}-${day}-slots`}>{day} appointment slots</label>
                                                    <input
                                                        id={`${selectedStaff.id}-${day}-slots`}
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={selectedStaff.schedule.weeklySlots?.[day] ?? 0}
                                                        onChange={(event) => updateWorkingSlots(day, Math.max(0, Number(event.target.value) || 0))}
                                                        placeholder="Slots"
                                                        title={`${day} appointment slots`}
                                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-2 text-center text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Availability & Exceptions */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Availability & Exceptions</label>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-foreground/70">Unavailable Dates</label>
                                <div className="space-y-3">
                                    {(!selectedStaff.unavailableDates || selectedStaff.unavailableDates.length === 0) ? (
                                        <p className="text-sm text-foreground/50">No dates currently.</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStaff.unavailableDates.map((date, i) => (
                                                <div key={i} className="flex items-center gap-1.5 rounded-md bg-black/[.04] dark:bg-white/[.04] px-2.5 py-1 text-sm text-foreground">
                                                    <span>{date}</span>
                                                    <button type="button" onClick={() => handleRemoveUnavailable(i)} className="text-foreground/50 hover:text-foreground">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <div>
                                            <DatePicker
                                                value={newUnavailableStart}
                                                onChange={setNewUnavailableStart}
                                                placeholder="Start date..."
                                                allowClear
                                            />
                                        </div>
                                        <DatePicker
                                            value={newUnavailableEnd}
                                            onChange={setNewUnavailableEnd}
                                            minDate={newUnavailableStart || undefined}
                                            placeholder="End date..."
                                            allowClear
                                        />
                                    </div>
                                    <button type="button" onClick={handleAddUnavailable} disabled={!newUnavailableStart || (newUnavailableEnd !== "" && newUnavailableEnd < newUnavailableStart)} className="h-10 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center">
                                        <Plus className="h-4 w-4 mr-1" /> Add unavailable date or range
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-semibold text-foreground/70">Partial Leave</label>
                                <p className="mb-3 text-xs text-foreground/50">Set the hours this team member remains available on a specific date.</p>
                                <div className="space-y-2">
                                    {(selectedStaff.partialLeaves || []).map((leave, index) => (
                                        <div key={`${leave.date}-${index}`} className="flex items-center justify-between gap-2 rounded-md bg-black/[.04] dark:bg-white/[.04] px-2.5 py-2 text-sm text-foreground">
                                            <span>{leave.date} • Available {leave.hours} • {leave.slots ?? 0} slots</span>
                                            <button type="button" onClick={() => handleRemovePartialLeave(index)} className="text-foreground/50 hover:text-foreground" aria-label={`Remove partial leave on ${leave.date}`}>
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
                                    <DatePicker value={newPartialLeaveDate} onChange={setNewPartialLeaveDate} placeholder="Select date..." allowClear />
                                    <input
                                        type="time"
                                        value={newPartialLeaveStart}
                                        onChange={(event) => setNewPartialLeaveStart(event.target.value)}
                                        aria-label="Partial leave available start time"
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                    />
                                    <input
                                        type="time"
                                        value={newPartialLeaveEnd}
                                        onChange={(event) => setNewPartialLeaveEnd(event.target.value)}
                                        min={newPartialLeaveStart || undefined}
                                        aria-label="Partial leave available end time"
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={newPartialLeaveSlots}
                                        onChange={(event) => setNewPartialLeaveSlots(event.target.value)}
                                        aria-label="Partial leave appointment slots"
                                        placeholder="Slots"
                                        className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                    />
                                </div>
                                <button type="button" onClick={handleAddPartialLeave} disabled={!newPartialLeaveDate || !newPartialLeaveStart || !newPartialLeaveEnd || newPartialLeaveEnd <= newPartialLeaveStart} className="mt-2 h-10 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center">
                                    <Plus className="h-4 w-4 mr-1" /> Add partial leave
                                </button>
                            </div>
                        </div>

                        <hr className="border-black/[.15] dark:border-white/[.22]" />

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold uppercase tracking-wider text-foreground/50">Contact Details</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="email"
                                    defaultValue={selectedStaff.contact.email}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                <input
                                    type="text"
                                    defaultValue={selectedStaff.contact.phone}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-black/[.15] dark:border-white/[.22] pt-6">
                        <Button variant="ghost" className="text-zinc- hover:text-zinc- hover:bg-zinc- dark:text-zinc- dark:hover:text-zinc- dark:hover:bg-zinc-/30">
                            Revoke Access
                        </Button>
                        <Button
                            variant="filled"
                            onClick={handleSaveProfile}
                            className="text-zinc- hover:text-zinc- hover:bg-zinc- dark:text-zinc- dark:hover:text-zinc- dark:hover:bg-zinc-/30"
                        >
                            Save Profile
                        </Button>
                    </div>
                </DetailDrawer>
            )}

            {/* Bulk Availability / Status Modal */}
            <Modal
                isOpen={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Update Staff Status"
                description="Quickly toggle active availability of team members."
                maxWidth="md"
            >
                {/* Search and Filter Row */}
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search team..."
                            value={modalSearchQuery}
                            onChange={(e) => setModalSearchQuery(e.target.value)}
                            className="h-8 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-8 pr-2 text-xs text-foreground focus:border-brand focus:outline-none dark:border-white/[.22]"
                        />
                    </div>
                    <select
                        value={modalRoleFilter}
                        onChange={(e) => setModalRoleFilter(e.target.value)}
                        className="h-8 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-2 text-xs font-medium text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="Doctor">Doctor</option>
                        <option value="Physiotherapist">Physiotherapist</option>
                        <option value="Receptionist">Receptionist</option>
                    </select>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 thin-scrollbar">
                    {modalFilteredStaff.length === 0 ? (
                        <p className="text-center py-8 text-xs text-foreground/50 font-medium">No team members match filter.</p>
                    ) : (
                        modalFilteredStaff.map((staff) => (
                            <div key={staff.id} className="flex items-center justify-between p-3 rounded-xl border border-black/[.08] dark:border-white/[.08] bg-black/[.01] dark:bg-white/[.01]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                        {getInitials(staff.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground leading-tight">{staff.name}</p>
                                        <p className="text-[10px] font-semibold text-foreground/50 mt-0.5">{staff.role}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={staff.isActive}
                                        onChange={() => toggleStaffActive(staff.id)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button variant="filled" onClick={() => setShowStatusModal(false)}>
                        Done
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
