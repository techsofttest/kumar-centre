"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ClinicalChartContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            router.replace(`/dashboard/patients/${id}`);
        } else {
            router.replace("/dashboard/patients");
        }
    }, [router, searchParams]);

    return (
        <div className="flex h-full w-full items-center justify-center p-8 text-foreground/60 font-medium">
            Loading Patient Database...
        </div>
    );
}

export default function ClinicalChart() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center p-8 text-foreground/60 font-medium">Loading Patient Database...</div>}>
            <ClinicalChartContent />
        </Suspense>
    );
}
