"use client";

import { useEffect, useState } from "react";
import { Activity, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface PhysioAppointment {
    id: string;
    patientName: string;
    referringDoctor: string;
    sessions: number;
    attendedSessions: number;
    feePerSession: number;
    amountPaid: number;
    status: "Pending" | "Confirmed" | "Cancelled";
}

interface PhysioReferralsProps {
    allowPaymentCollection?: boolean;
}

const PAYMENT_STORAGE_KEY = "kumar_physio_payments";

const sampleAppointments: PhysioAppointment[] = [
    { id: "PHY-SCH-001", patientName: "Anjali Nair", referringDoctor: "Dr. SASIKUMAR", sessions: 12, attendedSessions: 5, feePerSession: 650, amountPaid: 3250, status: "Confirmed" },
    { id: "PHY-SCH-002", patientName: "Rahul Menon", referringDoctor: "Dr. MALINI SASIKUMAR", sessions: 16, attendedSessions: 8, feePerSession: 650, amountPaid: 3900, status: "Confirmed" },
    { id: "PHY-SCH-003", patientName: "Vishnu Namboothiri", referringDoctor: "Dr. SRUTHI SASIKUMAR", sessions: 8, attendedSessions: 2, feePerSession: 650, amountPaid: 650, status: "Pending" },
];

export function getPhysioCollectionTotal(): number {
    const storedReferrals: unknown = JSON.parse(localStorage.getItem("kumar_physio_referrals") || "[]");
    const storedPayments: unknown = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) || "{}");
    const paymentOverrides =
        storedPayments && typeof storedPayments === "object" && !Array.isArray(storedPayments)
            ? storedPayments as Record<string, unknown>
            : {};
    const appointments = new Map<string, number>(
        sampleAppointments.map((appointment) => [appointment.id, appointment.amountPaid])
    );

    if (Array.isArray(storedReferrals)) {
        storedReferrals.forEach((referral: unknown) => {
            if (!referral || typeof referral !== "object" || Array.isArray(referral)) return;
            const record = referral as Record<string, unknown>;
            if (typeof record.id !== "string") return;
            appointments.set(record.id, Number(record.amountPaid) || 0);
        });
    }

    return Array.from(appointments.entries()).reduce((total, [id, defaultAmountPaid]) => {
        const amountPaid = paymentOverrides[id];
        return total + (
            typeof amountPaid === "number" && Number.isFinite(amountPaid) && amountPaid >= 0
                ? amountPaid
                : defaultAmountPaid
        );
    }, 0);
}

export function PhysioReferrals({ allowPaymentCollection = false }: PhysioReferralsProps) {
    const [appointments, setAppointments] = useState<PhysioAppointment[]>(sampleAppointments);
    const [paymentAppointmentId, setPaymentAppointmentId] = useState<string | null>(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

    useEffect(() => {
        const loadAppointments = () => {
            try {
                const stored = localStorage.getItem("kumar_physio_referrals");
                const referrals: unknown = stored ? JSON.parse(stored) : [];
                const storedPayments: unknown = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) || "{}");
                const paymentOverrides =
                    storedPayments && typeof storedPayments === "object" && !Array.isArray(storedPayments)
                        ? storedPayments as Record<string, unknown>
                        : {};
                const getAmountPaid = (id: string, fallback: number) => {
                    const savedAmount = paymentOverrides[id];
                    return typeof savedAmount === "number" && Number.isFinite(savedAmount) && savedAmount >= 0
                        ? savedAmount
                        : fallback;
                };
                const mapped: PhysioAppointment[] = Array.isArray(referrals) ? referrals.map((referral) => ({
                    id: referral.id,
                    patientName: referral.patientName,
                    referringDoctor: referral.referringDoctor,
                    sessions: Number(referral.sessions) || 1,
                    attendedSessions: Number(referral.attendedSessions) || 0,
                    feePerSession: Number(referral.feePerSession) || 0,
                    amountPaid: getAmountPaid(referral.id, Number(referral.amountPaid) || 0),
                    status: referral.status === "Confirmed" || referral.status === "Cancelled" ? referral.status : "Pending"
                })) : [];
                const samplesWithPayments = sampleAppointments.map((appointment) => ({
                    ...appointment,
                    amountPaid: getAmountPaid(appointment.id, appointment.amountPaid),
                }));
                setAppointments([...mapped, ...samplesWithPayments]);
            } catch (error) {
                console.error("Error loading physiotherapy referrals and payments", error);
                setAppointments(sampleAppointments);
            }
        };

        loadAppointments();
        window.addEventListener("storage", loadAppointments);
        return () => window.removeEventListener("storage", loadAppointments);
    }, []);

    const paymentAppointment = appointments.find((appointment) => appointment.id === paymentAppointmentId) ?? null;
    const paymentTotal = paymentAppointment
        ? paymentAppointment.sessions * paymentAppointment.feePerSession
        : 0;
    const paymentRemaining = paymentAppointment
        ? Math.max(0, paymentTotal - paymentAppointment.amountPaid)
        : 0;

    const handleCollectPayment = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!paymentAppointment) return;

        const amount = Number(paymentAmount);
        if (!Number.isFinite(amount) || amount <= 0 || amount > paymentRemaining) {
            setPaymentError(`Enter an amount greater than ₹0 and no more than ₹${paymentRemaining}.`);
            return;
        }

        const updatedAmountPaid = paymentAppointment.amountPaid + amount;
        try {
            const storedPayments: unknown = JSON.parse(localStorage.getItem(PAYMENT_STORAGE_KEY) || "{}");
            if (!storedPayments || typeof storedPayments !== "object" || Array.isArray(storedPayments)) {
                throw new Error("Stored physiotherapy payments are invalid.");
            }
            const payments = storedPayments as Record<string, unknown>;
            payments[paymentAppointment.id] = updatedAmountPaid;
            localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(payments));
        } catch {
            setPaymentError("Payment could not be saved. Please try again.");
            return;
        }

        setAppointments((current) => current.map((appointment) =>
            appointment.id === paymentAppointment.id
                ? { ...appointment, amountPaid: updatedAmountPaid }
                : appointment
        ));
        setPaymentNotice(`₹${amount.toLocaleString("en-IN")} payment recorded for ${paymentAppointment.patientName}.`);
        setPaymentAppointmentId(null);
        setPaymentAmount("");
        setPaymentError(null);
    };

    return (
        <section className="rounded-xl border border-black/[.15] bg-white p-5 dark:border-white/[.22] dark:bg-zinc-900">
            <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" />
                <div>
                    <h2 className="font-semibold text-foreground">Physiotherapy Schedules</h2>
                    <p className="text-xs text-foreground/60">Doctor-referred physiotherapy appointments and payment progress.</p>
                </div>
            </div>
            {paymentNotice && (
                <div role="status" className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
                    {paymentNotice}
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="border-b border-black/[.1] text-xs uppercase tracking-wider text-foreground/50 dark:border-white/[.15]">
                        <tr>
                            <th className="px-3 py-2">Patient</th>
                            <th className="px-3 py-2">Doctor referred</th>
                            <th className="px-3 py-2">Sessions attended</th>
                            <th className="px-3 py-2">Total amount</th>
                            <th className="px-3 py-2">Amount paid</th>
                            <th className="px-3 py-2">Remaining</th>
                            {allowPaymentCollection && <th className="px-3 py-2">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[.06] dark:divide-white/[.1]">
                        {appointments.map((appointment) => {
                            const total = appointment.sessions * appointment.feePerSession;
                            const paid = appointment.amountPaid;
                            const remaining = Math.max(0, total - paid);
                            const progress = Math.min(100, Math.round((appointment.attendedSessions / appointment.sessions) * 100));
                            return (
                                <tr key={appointment.id}>
                                    <td className="px-3 py-3 font-semibold text-foreground">{appointment.patientName}</td>
                                    <td className="px-3 py-3 text-foreground/70">{appointment.referringDoctor}</td>
                                    <td className="px-3 py-3">
                                        <div className="min-w-36">
                                            <div className="mb-1 flex justify-between text-xs text-foreground/70"><span>{appointment.attendedSessions} / {appointment.sessions}</span><span>{progress}%</span></div>
                                            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"><div className="h-full rounded-full bg-teal-500" style={{ width: `${progress}%` }} /></div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-3 font-medium text-foreground">₹{total}</td>
                                    <td className="px-3 py-3 font-medium text-emerald-600">₹{paid}</td>
                                    <td className="px-3 py-3 font-medium text-amber-600">₹{remaining}</td>
                                    {allowPaymentCollection && (
                                        <td className="px-3 py-3">
                                            <Button
                                                size="sm"
                                                variant={remaining > 0 ? "filled" : "outline"}
                                                disabled={remaining === 0}
                                                onClick={() => {
                                                    setPaymentAppointmentId(appointment.id);
                                                    setPaymentAmount("");
                                                    setPaymentError(null);
                                                }}
                                            >
                                                <CreditCard className="h-4 w-4" />
                                                {remaining > 0 ? "Collect payment" : "Fully paid"}
                                            </Button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {allowPaymentCollection && (
                <Modal
                    isOpen={paymentAppointment !== null}
                    onClose={() => {
                        setPaymentAppointmentId(null);
                        setPaymentAmount("");
                        setPaymentError(null);
                    }}
                    title="Collect physiotherapy payment"
                    description={paymentAppointment?.patientName}
                    maxWidth="md"
                >
                    {paymentAppointment && (
                        <form onSubmit={handleCollectPayment} className="space-y-5">
                            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-4 dark:bg-white/5">
                                <div>
                                    <p className="text-xs text-foreground/60">Total amount</p>
                                    <p className="mt-1 font-semibold text-foreground">₹{paymentTotal.toLocaleString("en-IN")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-foreground/60">Amount paid</p>
                                    <p className="mt-1 font-semibold text-emerald-600">₹{paymentAppointment.amountPaid.toLocaleString("en-IN")}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-foreground/60">Remaining</p>
                                    <p className="mt-1 font-semibold text-amber-600">₹{paymentRemaining.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="physio-payment-amount" className="mb-1.5 block text-sm font-semibold text-foreground">
                                    Amount to collect
                                </label>
                                <input
                                    id="physio-payment-amount"
                                    type="number"
                                    min="0.01"
                                    max={paymentRemaining}
                                    step="0.01"
                                    required
                                    autoFocus
                                    value={paymentAmount}
                                    onChange={(event) => {
                                        setPaymentAmount(event.target.value);
                                        setPaymentError(null);
                                    }}
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white px-3 text-sm text-foreground focus:border-brand focus:outline-none dark:border-white/[.22] dark:bg-zinc-900"
                                    placeholder="Enter amount"
                                />
                                {paymentError && <p role="alert" className="mt-2 text-sm text-red-600">{paymentError}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setPaymentAppointmentId(null);
                                        setPaymentAmount("");
                                        setPaymentError(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={paymentRemaining === 0}>
                                    Submit payment
                                </Button>
                            </div>
                        </form>
                    )}
                </Modal>
            )}
        </section>
    );
}
