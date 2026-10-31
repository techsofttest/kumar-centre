"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRoleDashboardPath } from "@/lib/roles";

export default function DashboardIndex() {
    const router = useRouter();

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const targetPath = getRoleDashboardPath(storedRole);
        router.replace(targetPath);
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3C43EC] border-t-transparent" />
                <p className="text-sm text-foreground/60">Redirecting to your dashboard...</p>
            </div>
        </div>
    );
}
