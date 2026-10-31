"use client";

import { useState, useEffect, useRef } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    X,
    ChevronDown
} from "lucide-react";

interface DatePickerProps {
    value?: string; // Format: "YYYY-MM-DD"
    onChange: (date: string) => void;
    placeholder?: string;
    label?: string;
    maxDate?: string; // "YYYY-MM-DD"
    minDate?: string; // "YYYY-MM-DD"
    className?: string;
    required?: boolean;
    disabled?: boolean;
    allowClear?: boolean;
    quickToday?: boolean;
}

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
    value = "",
    onChange,
    placeholder = "Select date",
    label,
    maxDate,
    minDate,
    className = "",
    required = false,
    disabled = false,
    allowClear = false,
    quickToday = true
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial view year/month based on current value or today
    const parsedValue = value ? new Date(value + "T00:00:00") : null;
    const initialDate = parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : new Date();

    const [viewYear, setViewYear] = useState<number>(initialDate.getFullYear());
    const [viewMonth, setViewMonth] = useState<number>(initialDate.getMonth());

    // When value changes from outside, sync view if valid
    useEffect(() => {
        if (value) {
            const d = new Date(value + "T00:00:00");
            if (!isNaN(d.getTime())) {
                setViewYear(d.getFullYear());
                setViewMonth(d.getMonth());
            }
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [isOpen]);

    // Helpers
    const formatDisplay = (val: string) => {
        if (!val) return "";
        const d = new Date(val + "T00:00:00");
        if (isNaN(d.getTime())) return val;
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    const isDateDisabled = (year: number, month: number, day: number) => {
        const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
        if (maxDate && dateStr > maxDate) return true;
        if (minDate && dateStr < minDate) return true;
        return false;
    };

    const isSelected = (year: number, month: number, day: number) => {
        const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
        return value === dateStr;
    };

    const isToday = (year: number, month: number, day: number) => {
        const today = new Date();
        return (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        );
    };

    const handleSelectDay = (day: number) => {
        if (isDateDisabled(viewYear, viewMonth, day)) return;
        const formatted = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const isNextMonthDisabled = () => {
        if (!maxDate) return false;
        const [mY, mM] = maxDate.split("-").map(Number);
        if (viewYear > mY) return true;
        if (viewYear === mY && viewMonth >= mM - 1) return true;
        return false;
    };

    const isPrevMonthDisabled = () => {
        if (!minDate) return false;
        const [mY, mM] = minDate.split("-").map(Number);
        if (viewYear < mY) return true;
        if (viewYear === mY && viewMonth <= mM - 1) return true;
        return false;
    };

    const handlePrevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPrevMonthDisabled()) return;
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear(viewYear - 1);
        } else {
            setViewMonth(viewMonth - 1);
        }
    };

    const handleNextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isNextMonthDisabled()) return;
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear(viewYear + 1);
        } else {
            setViewMonth(viewMonth + 1);
        }
    };

    const handleSetToday = (e: React.MouseEvent) => {
        e.stopPropagation();
        const today = new Date();
        const formatted = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        if (maxDate && formatted > maxDate) return;
        if (minDate && formatted < minDate) return;
        setViewYear(today.getFullYear());
        setViewMonth(today.getMonth());
        onChange(formatted);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setIsOpen(false);
    };

    // Days in current month
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    // Start weekday of current month (0 = Sunday, 1 = Monday, ...)
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

    // Previous month filler days
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
    const leadingDays = Array.from({ length: firstDayIndex }, (_, i) => prevMonthDays - firstDayIndex + 1 + i);

    // Current month days
    const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Trailing filler days for a neat 35 or 42 grid
    const totalSlots = leadingDays.length + currentDays.length;
    const trailingCount = totalSlots <= 35 ? 35 - totalSlots : 42 - totalSlots;
    const trailingDays = Array.from({ length: trailingCount }, (_, i) => i + 1);

    // Year options generator respecting maxDate and minDate
    const currentYear = new Date().getFullYear();
    const maxYear = maxDate ? parseInt(maxDate.split("-")[0]) : currentYear + 10;
    const minYear = minDate ? parseInt(minDate.split("-")[0]) : 1920;
    const yearOptions = [];
    for (let y = maxYear; y >= minYear; y--) {
        yearOptions.push(y);
    }

    const isMonthOptionDisabled = (mIdx: number) => {
        if (maxDate) {
            const [mY, mM] = maxDate.split("-").map(Number);
            if (viewYear > mY) return true;
            if (viewYear === mY && mIdx > mM - 1) return true;
        }
        if (minDate) {
            const [mY, mM] = minDate.split("-").map(Number);
            if (viewYear < mY) return true;
            if (viewYear === mY && mIdx < mM - 1) return true;
        }
        return false;
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`group flex h-11 w-full items-center justify-between rounded-lg border bg-white px-3.5 text-sm transition-all cursor-pointer select-none dark:bg-zinc-900 ${
                    disabled
                        ? "opacity-50 cursor-not-allowed border-black/[.1] dark:border-white/[.1]"
                        : isOpen
                        ? "border-[#3C43EC] ring-1 ring-[#3C43EC] dark:border-blue-500 dark:ring-blue-500"
                        : "border-black/[.15] hover:border-black/[.3] dark:border-white/[.22] dark:hover:border-white/[.4]"
                }`}
            >
                <div className="flex items-center gap-2.5 truncate">
                    <CalendarIcon className="h-4 w-4 shrink-0 text-[#3C43EC] dark:text-blue-400" />
                    {value ? (
                        <span className="font-medium text-foreground">
                            {formatDisplay(value)}
                        </span>
                    ) : (
                        <span className="text-foreground/40">{placeholder}</span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    {allowClear && value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="rounded-full p-1 text-foreground/40 hover:bg-black/[.05] hover:text-foreground dark:hover:bg-white/[.1]"
                            title="Clear date"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                    <ChevronDown
                        className={`h-4 w-4 text-foreground/40 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-[#3C43EC] dark:text-blue-400" : ""
                        }`}
                    />
                </div>
            </div>

            {/* Dropdown Calendar Popover */}
            {isOpen && (
                <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-black/[.15] bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150 dark:border-white/[.22] dark:bg-zinc-900">
                    {/* Calendar Header with Month/Year Navigation */}
                    <div className="flex items-center justify-between gap-1 pb-3 border-b border-black/[.08] dark:border-white/[.1]">
                        <button
                            type="button"
                            disabled={isPrevMonthDisabled()}
                            onClick={handlePrevMonth}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                isPrevMonthDisabled()
                                    ? "opacity-25 cursor-not-allowed text-foreground/30"
                                    : "text-foreground/70 hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/[.08]"
                            }`}
                            title="Previous Month"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-1.5">
                            {/* Month Dropdown */}
                            <select
                                value={viewMonth}
                                onChange={(e) => setViewMonth(parseInt(e.target.value))}
                                className="h-8 rounded-lg bg-transparent px-2 text-xs font-bold text-foreground focus:outline-none hover:bg-slate-100 dark:hover:bg-white/[.08] cursor-pointer"
                            >
                                {MONTH_NAMES.map((m, idx) => (
                                    <option
                                        key={m}
                                        value={idx}
                                        disabled={isMonthOptionDisabled(idx)}
                                        className="bg-white dark:bg-zinc-900 text-foreground disabled:opacity-40"
                                    >
                                        {m}
                                    </option>
                                ))}
                            </select>

                            {/* Year Dropdown */}
                            <select
                                value={viewYear}
                                onChange={(e) => {
                                    const nextYear = parseInt(e.target.value);
                                    setViewYear(nextYear);
                                    if (maxDate) {
                                        const [mY, mM] = maxDate.split("-").map(Number);
                                        if (nextYear === mY && viewMonth > mM - 1) {
                                            setViewMonth(mM - 1);
                                        }
                                    }
                                    if (minDate) {
                                        const [mY, mM] = minDate.split("-").map(Number);
                                        if (nextYear === mY && viewMonth < mM - 1) {
                                            setViewMonth(mM - 1);
                                        }
                                    }
                                }}
                                className="h-8 rounded-lg bg-transparent px-2 text-xs font-bold text-foreground focus:outline-none hover:bg-slate-100 dark:hover:bg-white/[.08] cursor-pointer"
                            >
                                {yearOptions.map((y) => (
                                    <option key={y} value={y} className="bg-white dark:bg-zinc-900 text-foreground">
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            disabled={isNextMonthDisabled()}
                            onClick={handleNextMonth}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                isNextMonthDisabled()
                                    ? "opacity-25 cursor-not-allowed text-foreground/30"
                                    : "text-foreground/70 hover:bg-slate-100 hover:text-foreground dark:hover:bg-white/[.08]"
                            }`}
                            title="Next Month"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Weekday Row */}
                    <div className="grid grid-cols-7 pt-3 text-center text-[11px] font-semibold text-foreground/40">
                        {WEEK_DAYS.map((wd) => (
                            <div key={wd} className="py-1">
                                {wd}
                            </div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-1 pt-1">
                        {/* Leading filler days */}
                        {leadingDays.map((d, i) => (
                            <div
                                key={`prev-${i}`}
                                className="flex h-8 w-8 items-center justify-center text-xs text-foreground/20 select-none mx-auto"
                            >
                                {d}
                            </div>
                        ))}

                        {/* Current month days */}
                        {currentDays.map((d) => {
                            const disabledDay = isDateDisabled(viewYear, viewMonth, d);
                            const selected = isSelected(viewYear, viewMonth, d);
                            const todayDay = isToday(viewYear, viewMonth, d);

                            return (
                                <button
                                    key={`day-${d}`}
                                    type="button"
                                    disabled={disabledDay}
                                    onClick={() => handleSelectDay(d)}
                                    className={`relative flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all select-none mx-auto ${
                                        selected
                                            ? "bg-[#3C43EC] font-bold text-white shadow-md shadow-[#3C43EC]/20 scale-105"
                                            : disabledDay
                                            ? "opacity-25 cursor-not-allowed text-foreground/40"
                                            : "text-foreground hover:bg-slate-100 dark:hover:bg-white/[.08]"
                                    }`}
                                >
                                    <span>{d}</span>
                                    {todayDay && !selected && (
                                        <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#3C43EC] dark:bg-blue-400" />
                                    )}
                                </button>
                            );
                        })}

                        {/* Trailing filler days */}
                        {trailingDays.map((d, i) => (
                            <div
                                key={`next-${i}`}
                                className="flex h-8 w-8 items-center justify-center text-xs text-foreground/20 select-none mx-auto"
                            >
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Quick Shortcuts Footer */}
                    <div className="flex items-center justify-between border-t border-black/[.08] pt-3 dark:border-white/[.1] mt-2 text-xs">
                        {quickToday ? (
                            <button
                                type="button"
                                onClick={handleSetToday}
                                className="font-semibold text-[#3C43EC] hover:underline dark:text-blue-400"
                            >
                                Today
                            </button>
                        ) : <div />}

                        {value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="text-foreground/50 hover:text-red-600 dark:hover:text-red-400"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default DatePicker;
