"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhysioReferrals } from "@/components/physio-referrals";

export default function PhysiotherapySchedulesPage() {
    return (
        <div className="flex w-full flex-col gap-6 p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Physiotherapy Schedules</h1>
                    <p className="mt-1 text-sm text-foreground/60">
                        Review doctor-referred therapy appointments and payment progress.
                    </p>
                </div>
                <Link href="/dashboard/overview">
                    <Button variant="outline" icon={ArrowLeft}>Back to Admin Dashboard</Button>
                </Link>
            </div>
            <PhysioReferrals />
        </div>
    );
}
