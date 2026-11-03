export const APPOINTMENT_TYPES = [
    "New Registration",
    "Review Consultation",
    "Procedure",
] as const;

export type AppointmentType = (typeof APPOINTMENT_TYPES)[number];

export function getAppointmentType(appointment: {
    appointmentType?: string;
    clinician?: string;
    service?: string;
}): AppointmentType {
    if (APPOINTMENT_TYPES.includes(appointment.appointmentType as AppointmentType)) {
        return appointment.appointmentType as AppointmentType;
    }

    const clinician = (appointment.clinician || "").toUpperCase();
    const service = (appointment.service || "").toLowerCase();
    const legacyPhysio =
        clinician === "PHYSIOTHERAPIST" ||
        ["physio", "rehab", "decompression", "tens", "cryo", "massage"].some((term) => service.includes(term));

    return legacyPhysio ? "Procedure" : "New Registration";
}

export function isPhysiotherapyAppointment(appointment: {
    appointmentType?: string;
    clinician?: string;
    service?: string;
}): boolean {
    return getAppointmentType(appointment) === "Procedure";
}
