export type UserRole =
    | "admin"
    | "Doctor"
    | "Physiotherapist"
    | "Receptionist"
    | "super_admin"
    | "administrator"
    | "reception"
    | "clinician";

export function normalizeRole(role: string | null | undefined): "admin" | "Doctor" | "Physiotherapist" | "Receptionist" {
    if (!role) return "admin";
    const r = role.toLowerCase().trim();
    if (r === "doctor" || r === "clinician") return "Doctor";
    if (r === "physiotherapist" || r === "physio") return "Physiotherapist";
    if (r === "receptionist" || r === "reception") return "Receptionist";
    return "admin";
}

export function getRoleDashboardPath(role: string | null | undefined): string {
    const norm = normalizeRole(role);
    switch (norm) {
        case "Doctor":
            return "/dashboard/doctor";
        case "Physiotherapist":
            return "/dashboard/physiotherapist";
        case "Receptionist":
            return "/dashboard/receptionist";
        case "admin":
        default:
            return "/dashboard/overview";
    }
}

export function getRoleDisplayName(role: string | null | undefined): string {
    const norm = normalizeRole(role);
    switch (norm) {
        case "Doctor":
            return "Doctor";
        case "Physiotherapist":
            return "Physiotherapist";
        case "Receptionist":
            return "Receptionist";
        case "admin":
        default:
            return "Admin";
    }
}

export function getRoleDefaultUser(role: string | null | undefined): { firstName: string; lastName: string; email: string; title: string } {
    const norm = normalizeRole(role);
    switch (norm) {
        case "Doctor":
            return {
                firstName: "Dr.",
                lastName: "SASIKUMAR",
                email: "dr.sasikumar@kumarcentres.com",
                title: "Senior Consultant Physician"
            };
        case "Physiotherapist":
            return {
                firstName: "Lead",
                lastName: "PHYSIOTHERAPIST",
                email: "physio@kumarcentres.com",
                title: "Rehabilitation & Physical Therapy"
            };
        case "Receptionist":
            return {
                firstName: "Front Desk",
                lastName: "RECEPTIOIST",
                email: "reception@kumarcentres.com",
                title: "Reception & Patient Services"
            };
        case "admin":
        default:
            return {
                firstName: "Admin",
                lastName: "",
                email: "admin@kumarcentres.com",
                title: "Administrator"
            };
    }
}
