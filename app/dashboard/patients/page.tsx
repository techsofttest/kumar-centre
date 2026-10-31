"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Search,
    Plus,
    Filter,
    User,
    Phone,
    Mail,
    ChevronRight
} from "lucide-react";
import { Patient, mockPatientsData } from "./data";

export default function PatientCRM() {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string>("Receptionist");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("focus") === "search" && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }

        const storedPatients = localStorage.getItem("patients_v3");
        if (storedPatients) {
            try {
                setPatients(JSON.parse(storedPatients));
            } catch (e) {
                setPatients(mockPatientsData);
            }
        } else {
            setPatients(mockPatientsData);
            localStorage.setItem("patients_v3", JSON.stringify(mockPatientsData));
        }
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    // Multi-parameter search (SRS Requirement: Search by Name, Email, Phone, Reference)
    const filteredPatients = useMemo(() => {
        const q = searchQuery.toLowerCase();
        return patients.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.phone.includes(q) ||
            p.id.toLowerCase().includes(q)
        );
    }, [searchQuery, patients]);


    return (
        <div className="flex h-full w-full overflow-hidden">
            <div className="flex flex-col w-full">
                {/* Header & Search */}
                <div className="flex flex-col gap-4 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Patient Database</h1>
                            <p className="mt-1 text-sm text-foreground/60">Manage profiles, history, and medical vaults.</p>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative w-64 md:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search by Name, Email, Phone, or Reference ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>
                            <Button variant="filled" icon={Plus} onClick={() => router.push("/dashboard/appointments/new")}>
                                New Appointment
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Database Table */}
                <div className="flex-1 overflow-hidden p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Patient Info</th>
                                    <th className="px-6 py-4 font-medium">Contact</th>
                                    <th className="px-6 py-4 font-medium">Reference ID</th>
                                    <th className="px-6 py-4 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
                                        className="cursor-pointer transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-sm">
                                                    {getInitials(patient.name)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground">{patient.name}</span>
                                                    <span className="text-xs text-foreground/50">DOB: {patient.dob}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-xs text-foreground/80"><Phone className="h-3 w-3" /> {patient.phone}</span>
                                                <span className="flex items-center gap-1 text-xs text-foreground/80"><Mail className="h-3 w-3" /> {patient.email}</span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-foreground/60 font-mono text-xs">
                                            {patient.id}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <ChevronRight className="ml-auto h-4 w-4 text-foreground/40" />
                                        </td>
                                    </tr>
                                ))}
                                {filteredPatients.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="py-12 text-center text-foreground/50">No patients found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}