"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Search,
    Calendar,
    CheckCircle2,
    Users,
    UserPlus,
    Stethoscope,
    Activity,
    CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { getAppointmentType, isPhysiotherapyAppointment } from "@/lib/appointment-types";
import type { AppointmentType } from "@/lib/appointment-types";
import { getPhysioCollectionTotal } from "@/components/physio-referrals";

interface FrontDeskQueue {
    id: string;
    token: string;
    patientName: string;
    phone: string;
    practitioner: string;
    type: "Doctor" | "Physiotherapy";
    appointmentType: AppointmentType;
    date: string;
    time: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    paymentStatus: "Paid" | "Pending";
    fee: number;
}

const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

export default function ReceptionistDashboard() {
    const [queue, setQueue] = useState<FrontDeskQueue[]>(() => [
        {
            id: "REC-101",
            token: "A-01",
            patientName: "Anjali Nair",
            phone: "+91 98471 12345",
            practitioner: "Dr. SASIKUMAR",
            type: "Doctor",
            appointmentType: "New Registration",
            date: getTodayDateString(),
            time: "09:30 AM",
            status: "Confirmed",
            paymentStatus: "Paid",
            fee: 500
        },
        {
            id: "REC-102",
            token: "P-01",
            patientName: "Rahul Menon",
            phone: "+91 98472 23456",
            practitioner: "PHYSIOTHERAPIST",
            type: "Physiotherapy",
            appointmentType: "Procedure",
            date: getTodayDateString(),
            time: "09:45 AM",
            status: "Confirmed",
            paymentStatus: "Paid",
            fee: 650
        },
        {
            id: "REC-103",
            token: "A-02",
            patientName: "Anoop Kumar",
            phone: "+91 98473 34567",
            practitioner: "Dr. MALINI SASIKUMAR",
            type: "Doctor",
            appointmentType: "Review Consultation",
            date: getTodayDateString(),
            time: "10:00 AM",
            status: "Confirmed",
            paymentStatus: "Pending",
            fee: 500
        },
        {
            id: "REC-104",
            token: "P-02",
            patientName: "Vishnu Namboothiri",
            phone: "+91 98474 45678",
            practitioner: "PHYSIOTHERAPIST",
            type: "Physiotherapy",
            appointmentType: "Procedure",
            date: getTodayDateString(),
            time: "10:15 AM",
            status: "Pending",
            paymentStatus: "Pending",
            fee: 650
        },
        {
            id: "REC-105",
            token: "A-03",
            patientName: "Priya Varma",
            phone: "+91 98475 56789",
            practitioner: "Dr. SRUTHI SASIKUMAR",
            type: "Doctor",
            appointmentType: "New Registration",
            date: getTodayDateString(),
            time: "10:30 AM",
            status: "Pending",
            paymentStatus: "Pending",
            fee: 500
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [activeSchedule, setActiveSchedule] = useState<"Doctor" | "Physiotherapy">("Doctor");
    const [physioCollected, setPhysioCollected] = useState(0);

    useEffect(() => {
        const updatePhysioCollection = () => {
            try {
                setPhysioCollected(getPhysioCollectionTotal());
            } catch (error) {
                console.error("Error loading physiotherapy collection total", error);
            }
        };

        const loadAppointments = () => {
            try {
                const rawAppointments = localStorage.getItem("kumar_appointments");
                const parsed: unknown = rawAppointments ? JSON.parse(rawAppointments) : [];
                if (!Array.isArray(parsed)) return;

                const storedAppointments: FrontDeskQueue[] = parsed
                    .filter((appointment): appointment is Record<string, unknown> =>
                        !!appointment && typeof appointment === "object" && !Array.isArray(appointment) &&
                        typeof appointment.id === "string" && typeof appointment.patientName === "string"
                    )
                    .map((appointment) => {
                        const appointmentType = getAppointmentType({
                            appointmentType: typeof appointment.appointmentType === "string" ? appointment.appointmentType : undefined,
                            clinician: typeof appointment.clinician === "string" ? appointment.clinician : undefined,
                            service: typeof appointment.service === "string" ? appointment.service : undefined,
                        });
                        const isPhysio = isPhysiotherapyAppointment({ appointmentType });
                        return {
                            id: appointment.id as string,
                            token: appointment.id as string,
                            patientName: appointment.patientName as string,
                            phone: typeof appointment.phone === "string" ? appointment.phone : "",
                            practitioner: typeof appointment.clinician === "string"
                                ? appointment.clinician
                                : isPhysio ? "PHYSIOTHERAPIST" : "Dr. SASIKUMAR",
                            type: isPhysio ? "Physiotherapy" : "Doctor",
                            appointmentType,
                            date: typeof appointment.date === "string" ? appointment.date : getTodayDateString(),
                            time: typeof appointment.time === "string" ? appointment.time : "09:00 AM",
                            status: appointment.status === "Pending" || appointment.status === "Cancelled" ? appointment.status : "Confirmed",
                            paymentStatus: "Pending",
                            fee: Number(appointment.amount ?? appointment.fee) || 0,
                        };
                    });

                setQueue((current) => {
                    const byId = new Map(current.map((appointment) => [appointment.id, appointment]));
                    storedAppointments.forEach((appointment) => byId.set(appointment.id, appointment));
                    return Array.from(byId.values());
                });
            } catch (error) {
                console.error("Error loading receptionist appointments", error);
            }
        };

        loadAppointments();
        updatePhysioCollection();
        window.addEventListener("storage", loadAppointments);
        window.addEventListener("storage", updatePhysioCollection);
        return () => {
            window.removeEventListener("storage", loadAppointments);
            window.removeEventListener("storage", updatePhysioCollection);
        };
    }, []);

    const handleConfirm = (id: string) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status: "Confirmed" } : item
        ));
        const patient = queue.find(q => q.id === id);
        setAlertMessage(`${patient?.patientName} successfully confirmed!`);
        setTimeout(() => setAlertMessage(null), 3500);
    };

    const handleSendWhatsAppReminder = (item: FrontDeskQueue) => {
        const cleanPhone = item.phone.replace(/[^0-9]/g, "");
        const formattedPhone = cleanPhone.startsWith("91") && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`;
        const msg = encodeURIComponent(
            `Hello ${item.patientName}, this is a reminder for your appointment with ${item.practitioner} at Kumar Centres today at ${item.time}. Token: ${item.token}. Please let us know if you need assistance!`
        );
        window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
        setAlertMessage(`WhatsApp reminder sent to ${item.patientName} (${item.phone})!`);
        setTimeout(() => setAlertMessage(null), 4000);
    };

    const todayQueue = queue.filter((item) => item.date === getTodayDateString());
    const filteredQueue = todayQueue.filter((item) =>
        item.type === activeSchedule && (
            item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.practitioner.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const doctorAppointmentCount = todayQueue.filter((item) => item.type === "Doctor").length;
    const physioAppointmentCount = todayQueue.filter((item) => item.type === "Physiotherapy").length;

    return (
        <div className="flex w-full flex-col gap-8 p-8">
            {/* Alert notification */}
            {alertMessage && (
                <div className="flex items-center gap-3 rounded-xl border border-purple-300 bg-purple-50 p-4 text-purple-800 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300 animate-in fade-in slide-in-from-top duration-300">
                    <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0" />
                    <span className="text-sm font-medium">{alertMessage}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                            Front Desk & Reception • Kumar Centres
                        </span>
                    </div>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">
                        Receptionist Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        RECEPTIOIST • Front Desk & Patient Services • Patient Check-In & Queue Management
                    </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    <Link href="/dashboard/appointments/new">
                        <Button
                            variant="filled"
                            icon={UserPlus}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            New Appointment
                        </Button>
                    </Link>
                    <Link href="/dashboard/appointments">
                        <Button variant="outline" icon={Calendar}>
                            Master Calendar
                        </Button>
                    </Link>
                    <Link href="/dashboard/receptionist/physiotherapy">
                        <Button variant="outline" icon={Activity}>
                            Physiotherapy Schedule
                        </Button>
                    </Link>
                    <Link href="/dashboard/patients">
                        <Button variant="outline" icon={Users}>
                            Patient Directory
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Today&apos;s Appointments</span>
                        <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{todayQueue.length}</span>
                        <span className="text-xs font-medium text-emerald-600">All departments</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Doctor Appointments</span>
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{doctorAppointmentCount}</span>
                        <span className="text-xs font-medium text-blue-600">Today</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Physio Appointments</span>
                        <Activity className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{physioAppointmentCount}</span>
                        <span className="text-xs font-medium text-emerald-600">Today</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Physiotherapy Collection</span>
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">₹{physioCollected}</span>
                        <span className="text-xs font-medium text-green-600">Total paid</span>
                    </div>
                </div>
            </div>

            {/* Practitioner Roster Cards */}
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                    Active Clinician Rooms Status
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">Dr. SASIKUMAR</span>
                            <span className="text-[11px] text-foreground/60">Room 101 • Senior Physician</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Available
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">Dr. MALINI SASIKUMAR</span>
                            <span className="text-[11px] text-foreground/60">Room 102 • Specialist</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Available
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">Dr. SRUTHI SASIKUMAR</span>
                            <span className="text-[11px] text-foreground/60">Room 103 • Physician</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Available
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            <Stethoscope className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">Dr. SREENATH</span>
                            <span className="text-[11px] text-foreground/60">Room 104 • Duty Doctor</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Available
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                            <Activity className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-foreground">PHYSIOTHERAPIST</span>
                            <span className="text-[11px] text-foreground/60">Rehab Bay 1 • Physical Therapy</span>
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Available
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Queue Table */}
            <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">
                            {activeSchedule === "Doctor" ? "Doctor Schedule" : "Physiotherapy Schedule"}
                        </h2>
                        <p className="text-xs text-foreground/60">
                            Manage today&apos;s appointments and check in patients.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex rounded-lg border border-black/10 p-1 dark:border-white/10">
                            {(["Doctor", "Physiotherapy"] as const).map((schedule) => (
                                <button
                                    key={schedule}
                                    type="button"
                                    onClick={() => setActiveSchedule(schedule)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                        activeSchedule === schedule
                                            ? "bg-purple-600 text-white"
                                            : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10"
                                    }`}
                                >
                                    {schedule === "Doctor" ? "Doctor Schedule" : "Physio Schedule"}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Filter schedule..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border border-foreground/20 bg-slate-50 dark:bg-zinc-800 pl-9 pr-3 py-1.5 text-xs text-foreground focus:border-purple-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-black/10 bg-slate-50/50 dark:border-white/10 dark:bg-white/5 uppercase tracking-wider text-foreground/60">
                            <tr>
                                <th className="px-4 py-3">Token</th>
                                <th className="px-4 py-3">Patient Name</th>
                                <th className="px-4 py-3">Department & Clinician</th>
                                <th className="px-4 py-3">Appointment Type</th>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Queue Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/5 dark:divide-white/5">
                            {filteredQueue.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3.5 font-bold text-foreground">
                                        <span className="rounded bg-slate-100 dark:bg-white/10 px-2 py-1 font-mono text-purple-700 dark:text-purple-300">
                                            {item.token}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-foreground">{item.patientName}</div>
                                        <div className="text-[11px] text-foreground/50">{item.phone}</div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-medium text-foreground">{item.practitioner}</div>
                                        <div className="text-[11px] text-foreground/50">{item.type}</div>
                                    </td>
                                    <td className="px-4 py-3.5 text-foreground/70">{item.appointmentType}</td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-medium text-foreground">{item.time}</div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                            item.status === "Confirmed"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                                : item.status === "Pending"
                                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => handleSendWhatsAppReminder(item)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                            title={`Send WhatsApp reminder to ${item.patientName}`}
                                        >
                                            <WhatsAppIcon className="h-5 w-5 shrink-0" />
                                            Send Reminder
                                        </button>
                                        {item.status === "Pending" && (
                                            <Button
                                                size="sm"
                                                variant="filled"
                                                onClick={() => handleConfirm(item.id)}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            >
                                                Confirm
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
