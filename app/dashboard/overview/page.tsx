"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Calendar,
    IndianRupee,
    Users,
    Plus,
    Search,
    CreditCard,
    Clock,
    UserX,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

import { normalizeRole } from "@/lib/roles";

type RoleType = string;

export default function OverviewDashboard() {
    const [userRole, setUserRole] = useState<RoleType>("admin");
    const [reminderSuccessMsg, setReminderSuccessMsg] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    const handleSendWhatsAppReminder = (apt: { patient: string; service: string; time: string; staff: string }) => {
        const msg = encodeURIComponent(
            `Hello ${apt.patient}, this is a reminder for your upcoming appointment (${apt.service}) with ${apt.staff} today at ${apt.time} at Kumar Centres. Please let us know if you need any assistance!`
        );
        window.open(`https://wa.me/919447123456?text=${msg}`, "_blank");
        setReminderSuccessMsg(`WhatsApp reminder sent to ${apt.patient}!`);
        setTimeout(() => setReminderSuccessMsg(null), 4000);
    };

    // Mock Data for UI visualization
    const todayAppointments = [
        { id: "APT-001", patient: "Anjali Nair", service: "IDD THERAPY", time: "09:00 AM", status: "Confirmed", staff: "Dr. SASIKUMAR" },
        { id: "APT-002", patient: "Rahul Menon", service: "WARMING & MASSAGE", time: "09:45 AM", status: "Confirmed", staff: "PHYSIOTHERAPIST" },
        { id: "APT-003", patient: "Priya Varma", service: "PROLOTHERAPY", time: "10:30 AM", status: "Pending", staff: "Dr. MALINI SASIKUMAR" },
    ];

    const alerts = [
        { id: 1, type: "Cancellation", message: "Rahul Menon cancelled SPINAL DECOMPRESSION", time: "10 mins ago", icon: UserX, color: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30" },
        { id: 3, type: "Confirmation", message: "Anjali Nair confirmed IDD THERAPY", time: "2 hrs ago", icon: CheckCircle, color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30" },
    ];

    return (
        <div className="flex w-full flex-col gap-8 p-8">

            {/* Page Header & Quick Actions */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Administrator Portal • Kumar Centres
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground mt-1">Admin Dashboard</h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        System operations, clinician rosters, patient volumes, and clinical performance overview.
                    </p>
                </div>

                {reminderSuccessMsg && (
                    <div className="w-full flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-in fade-in">
                        <WhatsAppIcon className="h-5 w-5 text-emerald-600 shrink-0" />
                        {reminderSuccessMsg}
                    </div>
                )}

                {/* Quick Actions[cite: 1, 2] */}
                <div className="flex w-full gap-3 md:w-auto">
                    <Link href="/dashboard/appointments/new" className="flex-1 md:flex-none">
                        <Button variant="filled" icon={Plus} className="w-full h-full">
                            New Appointment
                        </Button>
                    </Link>
                    <Link href="/dashboard/patients?focus=search" className="flex-1 md:flex-none">
                        <Button variant="outline" icon={Search} className="w-full h-full">
                            Search Patient
                        </Button>
                    </Link>
                    {/* <Button variant="outline" icon={CreditCard} className="flex-1 md:flex-none">
                        Pay
                    </Button> */}
                </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total Appointments Metric */}
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Today's Appointments</span>
                        <Calendar className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">24</span>
                    </div>
                </div>

                {/* Pending Confirmations Metric[cite: 1, 2] */}
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Pending Confirmations</span>
                        <Clock className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">7</span>
                        <span className="text-xs font-medium text-foreground/50">Require action</span>
                    </div>
                </div>

                {/* Patients Metric */}
                <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground/70">Patients</span>
                        <Users className="h-4 w-4 text-foreground/70" />
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-foreground">12</span>
                    </div>
                </div>

                {/* Revenue Summary - Conditionally Rendered via RBAC */}
                {(normalizeRole(userRole) === "admin") && (
                    <div className="flex flex-col justify-between rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 p-6 dark:border-white/[.22] dark:bg-zinc-900">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground/70">Physiotherapy revenue</span>
                            <IndianRupee className="h-4 w-4 text-foreground/70" />
                        </div>
                        <div className="mt-4 flex items-baseline gap-2">
                            <span className="text-3xl font-bold tracking-tight text-foreground">₹42,500</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* Left Column: Today's Schedule[cite: 1, 2] */}
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">Today's Schedule</h2>
                    <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] dark:bg-zinc-900">
                        <div className="min-w-full divide-y divide-black/[.08] dark:divide-white/[.145]">
                            {todayAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-foreground">{apt.patient}</span>
                                            <span className="text-xs text-foreground/60">{apt.service} • <span className="font-medium text-foreground/75">{apt.staff}</span></span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
                                            <Clock className="h-3.5 w-3.5 text-foreground/50" />
                                            {apt.time}
                                        </span>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                            apt.status === "Confirmed" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                            apt.status === "Cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                        }`}>
                                            {apt.status}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleSendWhatsAppReminder(apt)}
                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                                            title={`Send WhatsApp reminder to ${apt.patient}`}
                                        >
                                            <WhatsAppIcon className="h-5 w-5 shrink-0" />
                                            Send Reminder
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-black/[.15] p-4 text-center dark:border-white/[.22]">
                            <Link href="/dashboard/calendar">
                                <Button variant="ghost" className="text-brand">View Full Calendar</Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts & Notifications[cite: 1, 2] */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground">Notifications</h2>
                        <Link href="/dashboard/notifications" className="text-sm font-medium text-brand hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] dark:bg-zinc-900">
                        <div className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                            {alerts.map((alert) => {
                                const Icon = alert.icon;
                                return (
                                    <div key={alert.id} className="flex gap-4 p-4 transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.02]">
                                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${alert.color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm font-bold text-foreground">{alert.type}</span>
                                                <span className="text-xs font-medium text-foreground/50">{alert.time}</span>
                                            </div>
                                            <span className="text-sm font-medium text-foreground/90">{alert.message}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {alerts.length === 0 && (
                                <div className="p-8 text-center text-sm text-foreground/50">
                                    No active alerts.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
