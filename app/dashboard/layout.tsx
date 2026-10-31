"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/global/Sidebar";
import { normalizeRole, getRoleDashboardPath } from "@/lib/roles";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        const activeRole = storedRole || "admin";
        setUserRole(activeRole);

        const normalized = normalizeRole(activeRole);

        // If user visits /dashboard root, redirect them to their specific role dashboard
        if (pathname === "/dashboard") {
            router.replace(getRoleDashboardPath(activeRole));
        }

        // If non-admin accesses /dashboard/overview, route them to their specialized dashboard
        if (pathname === "/dashboard/overview" && normalized !== "admin") {
            router.replace(getRoleDashboardPath(activeRole));
        }
    }, [pathname, router]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-transparent">
            <div className="flex h-full w-full border border-black/10 dark:border-white/10 bg-transparent">
                {userRole && <Sidebar userRole={userRole} />}

                <main className="flex-1 overflow-hidden m-2 ml-0 rounded-[2rem] bg-slate-50/60 dark:bg-black/60 backdrop-blur-md border border-black/10 dark:border-white/10">
                    <div className="h-full w-full overflow-y-auto thin-scrollbar ">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
