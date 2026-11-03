"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type AppointmentStatus = "Pending" | "Confirmed" | "Cancelled";

const STATUS_OPTIONS: AppointmentStatus[] = ["Pending", "Confirmed", "Cancelled"];

const STATUS_STYLES: Record<AppointmentStatus, { pill: string; dot: string }> = {
    Confirmed: {
        pill: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        dot: "bg-green-500",
    },
    Pending: {
        pill: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        dot: "bg-orange-500",
    },
    Cancelled: {
        pill: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        dot: "bg-red-500",
    },
};

export function StatusDropdown({
    status,
    onChange,
}: {
    status: AppointmentStatus;
    onChange: (status: AppointmentStatus) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const styles = STATUS_STYLES[status];

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((isOpen) => !isOpen)}
                className={`flex h-9 items-center gap-1.5 rounded-full pl-3 pr-2.5 text-xs font-semibold transition-opacity hover:opacity-80 ${styles.pill}`}
            >
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                {status}
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label="Appointment status"
                    className="absolute left-0 top-full z-50 mt-1.5 min-w-[160px] rounded-xl border border-black/[.1] bg-white py-1.5 shadow-lg dark:border-white/[.12] dark:bg-zinc-950"
                >
                    {STATUS_OPTIONS.map((option) => {
                        const optionStyles = STATUS_STYLES[option];
                        const isActive = option === status;

                        return (
                            <button
                                key={option}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => {
                                    onChange(option);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center justify-between gap-3 px-3 py-1.5 transition-colors hover:bg-black/[.03] dark:hover:bg-white/[.04]"
                            >
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${optionStyles.pill}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${optionStyles.dot}`} />
                                    {option}
                                </span>
                                {isActive && (
                                    <svg className="h-3 w-3 shrink-0 text-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
