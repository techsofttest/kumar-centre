"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    Clock,
    UserCheck,
    CreditCard,
    Plus,
    Search,
    Calendar,
    CheckCircle2,
    Building2,
    Phone,
    UserPlus,
    Stethoscope,
    Activity,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface FrontDeskQueue {
    id: string;
    token: string;
    patientName: string;
    phone: string;
    practitioner: string;
    type: "Doctor" | "Physiotherapy";
    room: string;
    time: string;
    status: "Checked-In" | "In Consultation" | "Completed" | "Pending Check-In";
    paymentStatus: "Paid" | "Pending";
    fee: number;
}

export default function ReceptionistDashboard() {
    const [queue, setQueue] = useState<FrontDeskQueue[]>([
        {
            id: "REC-101",
            token: "A-01",
            patientName: "Eleanor Vance",
            phone: "+44 7911 123456",
            practitioner: "Dr. SASIKUMAR",
            type: "Doctor",
            room: "Room 101",
            time: "09:30 AM",
            status: "In Consultation",
            paymentStatus: "Paid",
            fee: 85
        },
        {
            id: "REC-102",
            token: "P-01",
            patientName: "James Holden",
            phone: "+44 7911 234567",
            practitioner: "PHYSIOTHERAPIST",
            type: "Physiotherapy",
            room: "Rehab Bay 1",
            time: "09:45 AM",
            status: "Checked-In",
            paymentStatus: "Paid",
            fee: 65
        },
        {
            id: "REC-103",
            token: "A-02",
            patientName: "Marcus Thorne",
            phone: "+44 7911 345678",
            practitioner: "Dr. MALINI SASIKUMAR",
            type: "Doctor",
            room: "Room 102",
            time: "10:00 AM",
            status: "Checked-In",
            paymentStatus: "Pending",
            fee: 90
        },
        {
            id: "REC-104",
            token: "P-02",
            patientName: "Amos Burton",
            phone: "+44 7911 456789",
            practitioner: "PHYSIOTHERAPIST",
            type: "Physiotherapy",
            room: "Rehab Bay 1",
            time: "10:15 AM",
            status: "Pending Check-In",
            paymentStatus: "Pending",
            fee: 65
        },
        {
            id: "REC-105",
            token: "A-03",
            patientName: "Sophia Sterling",
            phone: "+44 7911 567890",
            practitioner: "Dr. SRUTHI SASIKUMAR",
            type: "Doctor",
            room: "Room 103",
            time: "10:30 AM",
            status: "Pending Check-In",
            paymentStatus: "Pending",
            fee: 110
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [showNewBooking, setShowNewBooking] = useState(false);
    const [newPatientName, setNewPatientName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newType, setNewType] = useState<"Doctor" | "Physiotherapy">("Doctor");
    const [newPractitioner, setNewPractitioner] = useState("Dr. SASIKUMAR");
    const [alertMessage, setAlertMessage] = useState<string | null>(null);

    const handleCheckIn = (id: string) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, status: "Checked-In" } : item
        ));
        const patient = queue.find(q => q.id === id);
        setAlertMessage(`${patient?.patientName} successfully checked in! Sent to waiting lounge.`);
        setTimeout(() => setAlertMessage(null), 3500);
    };

    const handleCollectPayment = (id: string) => {
        setQueue(prev => prev.map(item =>
            item.id === id ? { ...item, paymentStatus: "Paid" } : item
        ));
        const patient = queue.find(q => q.id === id);
        setAlertMessage(`Payment received from ${patient?.patientName} (£${patient?.fee}). Receipt issued.`);
        setTimeout(() => setAlertMessage(null), 3500);
    };

    const handleCreateBooking = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPatientName) return;

        const isDoc = newType === "Doctor";
        const newEntry: FrontDeskQueue = {
            id: `REC-${Date.now().toString().slice(-3)}`,
            token: isDoc ? `A-0${queue.length + 1}` : `P-0${queue.length + 1}`,
            patientName: newPatientName,
            phone: newPhone || "+44 7900 000000",
            practitioner: newPractitioner,
            type: newType,
            room: isDoc ? "Room 102" : "Rehab Bay 1",
            time: "Immediate Walk-In",
            status: "Checked-In",
            paymentStatus: "Paid",
            fee: isDoc ? 85 : 65
        };

        setQueue([newEntry, ...queue]);
        setShowNewBooking(false);
        setNewPatientName("");
        setNewPhone("");
        setAlertMessage(`Walk-in patient ${newPatientName} registered and assigned Token ${newEntry.token}!`);
        setTimeout(() => setAlertMessage(null), 4000);
    };

    const filteredQueue = queue.filter(item =>
        item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.token.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.practitioner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const checkedInCount = queue.filter(q => q.status === "Checked-In").length;
    const pendingArrivalCount = queue.filter(q => q.status === "Pending Check-In").length;
    const totalCollected = queue
        .filter(q => q.paymentStatus === "Paid")
        .reduce((sum, item) => sum + item.fee, 0);

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
                    <Button
                        variant="filled"
                        icon={UserPlus}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        onClick={() => setShowNewBooking(true)}
                    >
                        Walk-in Patient Check-In
                    </Button>
                    <Link href="/dashboard/appointments">
                        <Button variant="outline" icon={Calendar}>
                            Master Calendar
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
                        <span className="text-sm font-medium text-foreground/70">In Waiting Lounge</span>
                        <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{checkedInCount}</span>
                        <span className="text-xs font-medium text-amber-600">Arrived & waiting</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Expected Arrivals</span>
                        <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{pendingArrivalCount}</span>
                        <span className="text-xs font-medium text-blue-600">Due for check-in</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Today's Total Appts</span>
                        <Calendar className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">{queue.length}</span>
                        <span className="text-xs font-medium text-emerald-600">Doctors & Physio</span>
                    </div>
                </div>

                <div className="flex flex-col justify-between rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Counter Collections</span>
                        <CreditCard className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">£{totalCollected}</span>
                        <span className="text-xs font-medium text-green-600">Collected today</span>
                    </div>
                </div>
            </div>

            {/* Quick Walk-in Modal */}
            {showNewBooking && (
                <div className="rounded-xl border border-purple-200 bg-purple-50/70 p-6 dark:border-purple-900 dark:bg-purple-950/20 shadow-md animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-purple-200 dark:border-purple-900">
                        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-purple-600" />
                            Fast Walk-In Registration & Token Generation
                        </h3>
                        <button
                            onClick={() => setShowNewBooking(false)}
                            className="text-foreground/60 hover:text-foreground text-sm font-semibold"
                        >
                            Cancel
                        </button>
                    </div>

                    <form onSubmit={handleCreateBooking} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="text-xs font-semibold text-foreground/80 block mb-1">
                                Patient Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={newPatientName}
                                onChange={(e) => setNewPatientName(e.target.value)}
                                placeholder="e.g. John Smith"
                                className="w-full rounded-md border border-foreground/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-foreground focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-foreground/80 block mb-1">
                                Contact Phone
                            </label>
                            <input
                                type="text"
                                value={newPhone}
                                onChange={(e) => setNewPhone(e.target.value)}
                                placeholder="e.g. +44 7911 000000"
                                className="w-full rounded-md border border-foreground/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-foreground focus:border-purple-600 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-foreground/80 block mb-1">
                                Service Department
                            </label>
                            <select
                                value={newType}
                                onChange={(e) => {
                                    const val = e.target.value as "Doctor" | "Physiotherapy";
                                    setNewType(val);
                                    setNewPractitioner(val === "Doctor" ? "Dr. SASIKUMAR" : "PHYSIOTHERAPIST");
                                }}
                                className="w-full rounded-md border border-foreground/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-foreground focus:border-purple-600 focus:outline-none"
                            >
                                <option value="Doctor">Doctor Consultation</option>
                                <option value="Physiotherapy">Physiotherapy & Rehab</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-foreground/80 block mb-1">
                                Assign Practitioner
                            </label>
                            <select
                                value={newPractitioner}
                                onChange={(e) => setNewPractitioner(e.target.value)}
                                className="w-full rounded-md border border-foreground/20 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-foreground focus:border-purple-600 focus:outline-none"
                            >
                                {newType === "Doctor" ? (
                                    <>
                                        <option value="Dr. SASIKUMAR">Dr. SASIKUMAR (Room 101)</option>
                                        <option value="Dr. MALINI SASIKUMAR">Dr. MALINI SASIKUMAR (Room 102)</option>
                                        <option value="Dr. SRUTHI SASIKUMAR">Dr. SRUTHI SASIKUMAR (Room 103)</option>
                                        <option value="Dr. SREENATH">Dr. SREENATH (Room 104)</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="PHYSIOTHERAPIST">PHYSIOTHERAPIST (Rehab Bay 1)</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3 pt-2">
                            <Button
                                type="submit"
                                variant="filled"
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                Generate Token & Check-In
                            </Button>
                        </div>
                    </form>
                </div>
            )}

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
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                In Consultation
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
                                Ready for Next
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
                                Free for Walk-Ins
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
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 mt-0.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                                In Active Therapy
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
                            Front Desk Patient Queue & Check-In
                        </h2>
                        <p className="text-xs text-foreground/60">
                            Manage arrivals, call patients into consult rooms, and collect co-payments
                        </p>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Filter queue..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-md border border-foreground/20 bg-slate-50 dark:bg-zinc-800 pl-9 pr-3 py-1.5 text-xs text-foreground focus:border-purple-600 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="border-b border-black/10 bg-slate-50/50 dark:border-white/10 dark:bg-white/5 uppercase tracking-wider text-foreground/60">
                            <tr>
                                <th className="px-4 py-3">Token</th>
                                <th className="px-4 py-3">Patient Name</th>
                                <th className="px-4 py-3">Department & Clinician</th>
                                <th className="px-4 py-3">Time & Room</th>
                                <th className="px-4 py-3">Queue Status</th>
                                <th className="px-4 py-3">Fee / Bill</th>
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
                                    <td className="px-4 py-3.5">
                                        <div className="font-medium text-foreground">{item.time}</div>
                                        <div className="text-[11px] text-foreground/50">{item.room}</div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                                            item.status === "In Consultation"
                                                ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                                : item.status === "Checked-In"
                                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                                : "bg-slate-100 text-slate-800 dark:bg-white/10 dark:text-zinc-300"
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <div className="font-semibold text-foreground">£{item.fee}</div>
                                        <span className={`text-[10px] font-semibold ${
                                            item.paymentStatus === "Paid" ? "text-green-600" : "text-orange-600"
                                        }`}>
                                            {item.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right space-x-2">
                                        {item.status === "Pending Check-In" && (
                                            <Button
                                                size="sm"
                                                variant="filled"
                                                onClick={() => handleCheckIn(item.id)}
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                Mark Arrived
                                            </Button>
                                        )}
                                        {item.paymentStatus === "Pending" && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleCollectPayment(item.id)}
                                            >
                                                Collect £{item.fee}
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
