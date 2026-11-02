import { Patient } from "./app/dashboard/patients/data";

const mockPatientsData: Patient[] = [
    {
        "id": "REF-7000",
        "name": "Anjali Nair",
        "dob": "1975-01-26",
        "gender": "Male",
        "email": "chrisjen@example.com",
        "phone": "+91 98471 00000",
        "address": "1706 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P0-8",
                    "date": "2025-12-03",
                    "time": "17:00",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-1",
                    "date": "2025-11-10",
                    "time": "17:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-3",
                    "date": "2025-10-11",
                    "time": "14:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-11",
                    "date": "2025-09-11",
                    "time": "08:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-0",
                    "date": "2025-08-29",
                    "time": "17:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-9",
                    "date": "2025-08-19",
                    "time": "14:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-4",
                    "date": "2025-08-08",
                    "time": "08:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-6",
                    "date": "2025-05-28",
                    "time": "12:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-10",
                    "date": "2025-04-08",
                    "time": "08:00",
                    "services": [
                        "PROLOTHERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-7",
                    "date": "2025-03-29",
                    "time": "16:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-5",
                    "date": "2025-03-22",
                    "time": "12:00",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P0-2",
                    "date": "2025-02-19",
                    "time": "17:00",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F0-3",
                    "date": "2026-08-01",
                    "time": "12:30",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-1",
                    "date": "2026-08-28",
                    "time": "13:30",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-4",
                    "date": "2026-10-05",
                    "time": "15:30",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-0",
                    "date": "2026-10-12",
                    "time": "12:30",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F0-2",
                    "date": "2026-10-13",
                    "time": "13:30",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 2,
            "notes": 2
        }
    },
    {
        "id": "REF-6138",
        "name": "Clarissa Draper",
        "dob": "1979-02-14",
        "gender": "Female",
        "email": "clarissa@example.com",
        "phone": "+91 98471 00000",
        "address": "5841 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P1-1",
                    "date": "2025-12-26",
                    "time": "15:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-2",
                    "date": "2025-11-11",
                    "time": "17:00",
                    "services": [
                        "WARMING & MASSAGE",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-3",
                    "date": "2025-10-06",
                    "time": "09:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-6",
                    "date": "2025-08-22",
                    "time": "12:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-0",
                    "date": "2025-08-14",
                    "time": "08:00",
                    "services": [
                        "PROLOTHERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-4",
                    "date": "2025-08-05",
                    "time": "14:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-8",
                    "date": "2025-07-17",
                    "time": "16:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-9",
                    "date": "2025-04-14",
                    "time": "15:00",
                    "services": [
                        "PROLOTHERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-7",
                    "date": "2025-04-13",
                    "time": "16:00",
                    "services": [
                        "LASER TREATMENT",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-5",
                    "date": "2025-03-30",
                    "time": "09:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-10",
                    "date": "2025-02-28",
                    "time": "10:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P1-11",
                    "date": "2025-01-16",
                    "time": "16:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F1-4",
                    "date": "2026-07-14",
                    "time": "09:30",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-3",
                    "date": "2026-08-16",
                    "time": "14:30",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-2",
                    "date": "2026-08-28",
                    "time": "10:30",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-1",
                    "date": "2026-09-16",
                    "time": "09:30",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F1-0",
                    "date": "2026-09-18",
                    "time": "15:30",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 2,
            "notes": 3
        }
    },
    {
        "id": "REF-8008",
        "name": "Alex Holden",
        "dob": "1984-10-28",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "+91 98471 00000",
        "address": "2787 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P2-8",
                    "date": "2025-12-18",
                    "time": "16:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-2",
                    "date": "2025-12-08",
                    "time": "11:00",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-3",
                    "date": "2025-11-25",
                    "time": "17:00",
                    "services": [
                        "PROLOTHERAPY",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-10",
                    "date": "2025-11-25",
                    "time": "17:00",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-4",
                    "date": "2025-09-29",
                    "time": "09:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-9",
                    "date": "2025-09-23",
                    "time": "17:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-1",
                    "date": "2025-08-24",
                    "time": "15:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-6",
                    "date": "2025-06-13",
                    "time": "16:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-11",
                    "date": "2025-05-19",
                    "time": "13:00",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-7",
                    "date": "2025-04-25",
                    "time": "16:00",
                    "services": [
                        "LASER TREATMENT",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-5",
                    "date": "2025-02-20",
                    "time": "17:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P2-0",
                    "date": "2025-02-08",
                    "time": "08:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F2-3",
                    "date": "2026-08-08",
                    "time": "13:30",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-4",
                    "date": "2026-09-15",
                    "time": "10:30",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-0",
                    "date": "2026-09-18",
                    "time": "15:30",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-1",
                    "date": "2026-10-08",
                    "time": "13:30",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F2-2",
                    "date": "2026-10-16",
                    "time": "14:30",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 1,
            "notes": 5
        }
    },
    {
        "id": "REF-9341",
        "name": "Alex Nagata",
        "dob": "1993-01-17",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "+91 98471 00000",
        "address": "9182 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P3-11",
                    "date": "2025-12-10",
                    "time": "11:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-7",
                    "date": "2025-12-05",
                    "time": "13:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-5",
                    "date": "2025-10-22",
                    "time": "15:00",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-3",
                    "date": "2025-10-01",
                    "time": "15:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-4",
                    "date": "2025-09-25",
                    "time": "17:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-2",
                    "date": "2025-07-20",
                    "time": "10:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-0",
                    "date": "2025-07-13",
                    "time": "11:00",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-9",
                    "date": "2025-06-28",
                    "time": "11:00",
                    "services": [
                        "PROLOTHERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-6",
                    "date": "2025-04-17",
                    "time": "17:00",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-1",
                    "date": "2025-03-16",
                    "time": "09:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-10",
                    "date": "2025-03-10",
                    "time": "10:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P3-8",
                    "date": "2025-02-26",
                    "time": "10:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F3-3",
                    "date": "2026-07-27",
                    "time": "08:30",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-0",
                    "date": "2026-07-30",
                    "time": "09:30",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-4",
                    "date": "2026-09-08",
                    "time": "15:30",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-1",
                    "date": "2026-09-09",
                    "time": "11:30",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F3-2",
                    "date": "2026-10-15",
                    "time": "09:30",
                    "services": [
                        "WARMING & MASSAGE",
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 1,
            "notes": 0
        }
    },
    {
        "id": "REF-7548",
        "name": "Anderson Dawes",
        "dob": "1973-04-15",
        "gender": "Female",
        "email": "anderson@example.com",
        "phone": "+91 98471 00000",
        "address": "565 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P4-1",
                    "date": "2025-12-27",
                    "time": "12:00",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-8",
                    "date": "2025-12-03",
                    "time": "13:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-3",
                    "date": "2025-11-14",
                    "time": "17:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-7",
                    "date": "2025-11-08",
                    "time": "09:00",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-6",
                    "date": "2025-09-21",
                    "time": "10:00",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-5",
                    "date": "2025-08-06",
                    "time": "09:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-0",
                    "date": "2025-04-15",
                    "time": "10:00",
                    "services": [
                        "PROLOTHERAPY",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-9",
                    "date": "2025-04-12",
                    "time": "08:00",
                    "services": [
                        "LASER TREATMENT",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-2",
                    "date": "2025-04-10",
                    "time": "12:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-4",
                    "date": "2025-02-25",
                    "time": "12:00",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-10",
                    "date": "2025-02-22",
                    "time": "08:00",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P4-11",
                    "date": "2025-02-12",
                    "time": "10:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F4-2",
                    "date": "2026-07-27",
                    "time": "16:30",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-4",
                    "date": "2026-07-31",
                    "time": "11:30",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-3",
                    "date": "2026-08-06",
                    "time": "10:30",
                    "services": [
                        "PROLOTHERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-1",
                    "date": "2026-08-24",
                    "time": "16:30",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F4-0",
                    "date": "2026-09-13",
                    "time": "14:30",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 2
        }
    },
    {
        "id": "REF-6869",
        "name": "Naomi Holden",
        "dob": "1976-12-02",
        "gender": "Male",
        "email": "naomi@example.com",
        "phone": "+91 98471 00000",
        "address": "362 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P5-0",
                    "date": "2025-12-15",
                    "time": "13:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-5",
                    "date": "2025-12-08",
                    "time": "17:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-10",
                    "date": "2025-10-15",
                    "time": "09:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-6",
                    "date": "2025-09-18",
                    "time": "11:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-9",
                    "date": "2025-09-13",
                    "time": "17:00",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-11",
                    "date": "2025-08-02",
                    "time": "12:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-8",
                    "date": "2025-07-18",
                    "time": "14:00",
                    "services": [
                        "WARMING & MASSAGE",
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-1",
                    "date": "2025-07-02",
                    "time": "16:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-2",
                    "date": "2025-05-30",
                    "time": "15:00",
                    "services": [
                        "LASER TREATMENT",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-7",
                    "date": "2025-05-19",
                    "time": "10:00",
                    "services": [
                        "IDD THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-3",
                    "date": "2025-04-30",
                    "time": "08:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P5-4",
                    "date": "2025-04-16",
                    "time": "12:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F5-1",
                    "date": "2026-07-12",
                    "time": "12:30",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-0",
                    "date": "2026-07-13",
                    "time": "14:30",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-2",
                    "date": "2026-07-27",
                    "time": "11:30",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-3",
                    "date": "2026-08-09",
                    "time": "13:30",
                    "services": [
                        "WARMING & MASSAGE",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F5-4",
                    "date": "2026-10-14",
                    "time": "12:30",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 0,
            "notes": 2
        }
    },
    {
        "id": "REF-9480",
        "name": "Roberta Dawes",
        "dob": "1995-11-03",
        "gender": "Female",
        "email": "roberta@example.com",
        "phone": "+91 98471 00000",
        "address": "5417 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P6-4",
                    "date": "2025-10-21",
                    "time": "13:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-1",
                    "date": "2025-10-19",
                    "time": "08:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-11",
                    "date": "2025-10-03",
                    "time": "17:00",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-5",
                    "date": "2025-08-10",
                    "time": "15:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-6",
                    "date": "2025-08-08",
                    "time": "10:00",
                    "services": [
                        "IDD THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-9",
                    "date": "2025-08-06",
                    "time": "09:00",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-3",
                    "date": "2025-07-31",
                    "time": "17:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-0",
                    "date": "2025-05-31",
                    "time": "14:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-8",
                    "date": "2025-05-01",
                    "time": "15:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-10",
                    "date": "2025-04-23",
                    "time": "11:00",
                    "services": [
                        "PROLOTHERAPY",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-2",
                    "date": "2025-03-17",
                    "time": "14:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P6-7",
                    "date": "2025-01-02",
                    "time": "16:00",
                    "services": [
                        "LASER TREATMENT",
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F6-3",
                    "date": "2026-07-15",
                    "time": "14:30",
                    "services": [
                        "WARMING & MASSAGE",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-4",
                    "date": "2026-07-20",
                    "time": "09:30",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-1",
                    "date": "2026-08-19",
                    "time": "17:30",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-2",
                    "date": "2026-08-29",
                    "time": "11:30",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F6-0",
                    "date": "2026-10-16",
                    "time": "15:30",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 0,
            "notes": 1
        }
    },
    {
        "id": "REF-8175",
        "name": "Naomi Holden",
        "dob": "1983-05-14",
        "gender": "Male",
        "email": "naomi@example.com",
        "phone": "+91 98471 00000",
        "address": "957 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P7-7",
                    "date": "2025-12-21",
                    "time": "10:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-11",
                    "date": "2025-10-25",
                    "time": "11:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-4",
                    "date": "2025-08-30",
                    "time": "08:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-0",
                    "date": "2025-08-22",
                    "time": "08:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-5",
                    "date": "2025-08-19",
                    "time": "10:00",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-1",
                    "date": "2025-08-05",
                    "time": "15:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-9",
                    "date": "2025-07-08",
                    "time": "14:00",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-10",
                    "date": "2025-05-25",
                    "time": "09:00",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-8",
                    "date": "2025-04-19",
                    "time": "17:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-6",
                    "date": "2025-04-12",
                    "time": "12:00",
                    "services": [
                        "WARMING & MASSAGE",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-3",
                    "date": "2025-04-04",
                    "time": "08:00",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P7-2",
                    "date": "2025-02-25",
                    "time": "09:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F7-1",
                    "date": "2026-07-21",
                    "time": "09:30",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-2",
                    "date": "2026-07-28",
                    "time": "13:30",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-4",
                    "date": "2026-08-08",
                    "time": "14:30",
                    "services": [
                        "IDD THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-3",
                    "date": "2026-08-31",
                    "time": "17:30",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F7-0",
                    "date": "2026-09-04",
                    "time": "08:30",
                    "services": [
                        "WARMING & MASSAGE",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 3,
            "consents": 1,
            "notes": 2
        }
    },
    {
        "id": "REF-7429",
        "name": "Alex Mao",
        "dob": "1994-03-25",
        "gender": "Male",
        "email": "alex@example.com",
        "phone": "+91 98471 00000",
        "address": "1305 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P8-2",
                    "date": "2025-12-30",
                    "time": "09:00",
                    "services": [
                        "LASER TREATMENT",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-11",
                    "date": "2025-11-30",
                    "time": "16:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-4",
                    "date": "2025-09-24",
                    "time": "17:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-1",
                    "date": "2025-09-22",
                    "time": "15:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-0",
                    "date": "2025-08-02",
                    "time": "08:00",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-6",
                    "date": "2025-07-15",
                    "time": "13:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-9",
                    "date": "2025-06-12",
                    "time": "13:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-3",
                    "date": "2025-05-10",
                    "time": "17:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-10",
                    "date": "2025-04-28",
                    "time": "08:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-7",
                    "date": "2025-03-05",
                    "time": "10:00",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-8",
                    "date": "2025-03-04",
                    "time": "10:00",
                    "services": [
                        "WARMING & MASSAGE",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P8-5",
                    "date": "2025-02-11",
                    "time": "13:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F8-4",
                    "date": "2026-07-13",
                    "time": "14:30",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-2",
                    "date": "2026-07-19",
                    "time": "16:30",
                    "services": [
                        "WARMING & MASSAGE",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-0",
                    "date": "2026-08-04",
                    "time": "08:30",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-1",
                    "date": "2026-09-08",
                    "time": "11:30",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F8-3",
                    "date": "2026-10-10",
                    "time": "12:30",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 3,
            "notes": 4
        }
    },
    {
        "id": "REF-1362",
        "name": "Eleanor Nagata",
        "dob": "2000-05-13",
        "gender": "Male",
        "email": "eleanor@example.com",
        "phone": "+91 98471 00000",
        "address": "9492 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P9-5",
                    "date": "2025-11-29",
                    "time": "12:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-7",
                    "date": "2025-11-26",
                    "time": "11:00",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-9",
                    "date": "2025-11-09",
                    "time": "14:00",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-2",
                    "date": "2025-11-03",
                    "time": "09:00",
                    "services": [
                        "LASER TREATMENT",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-3",
                    "date": "2025-10-02",
                    "time": "10:00",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-1",
                    "date": "2025-09-20",
                    "time": "13:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-4",
                    "date": "2025-07-25",
                    "time": "08:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-0",
                    "date": "2025-06-25",
                    "time": "14:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-8",
                    "date": "2025-06-22",
                    "time": "08:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-10",
                    "date": "2025-06-06",
                    "time": "14:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-6",
                    "date": "2025-05-06",
                    "time": "16:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P9-11",
                    "date": "2025-02-22",
                    "time": "12:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F9-0",
                    "date": "2026-07-19",
                    "time": "11:30",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-1",
                    "date": "2026-08-14",
                    "time": "08:30",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-2",
                    "date": "2026-09-22",
                    "time": "11:30",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-4",
                    "date": "2026-10-08",
                    "time": "13:30",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F9-3",
                    "date": "2026-10-09",
                    "time": "13:30",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 3,
            "consents": 3,
            "notes": 3
        }
    },
    {
        "id": "REF-4076",
        "name": "Roberta Avasarala",
        "dob": "1981-03-28",
        "gender": "Female",
        "email": "roberta@example.com",
        "phone": "+91 98471 00000",
        "address": "2678 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P10-6",
                    "date": "2025-11-25",
                    "time": "14:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-8",
                    "date": "2025-11-19",
                    "time": "17:00",
                    "services": [
                        "WARMING & MASSAGE",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-4",
                    "date": "2025-11-17",
                    "time": "12:00",
                    "services": [
                        "PROLOTHERAPY",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-3",
                    "date": "2025-10-17",
                    "time": "13:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-0",
                    "date": "2025-10-03",
                    "time": "09:00",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-10",
                    "date": "2025-08-04",
                    "time": "16:00",
                    "services": [
                        "LASER TREATMENT",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-2",
                    "date": "2025-07-26",
                    "time": "11:00",
                    "services": [
                        "PROLOTHERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-7",
                    "date": "2025-07-09",
                    "time": "09:00",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-9",
                    "date": "2025-07-04",
                    "time": "10:00",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-1",
                    "date": "2025-06-17",
                    "time": "11:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-11",
                    "date": "2025-03-19",
                    "time": "15:00",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P10-5",
                    "date": "2025-02-18",
                    "time": "14:00",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F10-3",
                    "date": "2026-07-18",
                    "time": "16:30",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-4",
                    "date": "2026-08-02",
                    "time": "12:30",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-1",
                    "date": "2026-08-05",
                    "time": "13:30",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-0",
                    "date": "2026-08-22",
                    "time": "12:30",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F10-2",
                    "date": "2026-09-07",
                    "time": "15:30",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 1
        }
    },
    {
        "id": "REF-3544",
        "name": "Josephus Mao",
        "dob": "1988-10-13",
        "gender": "Male",
        "email": "josephus@example.com",
        "phone": "+91 98471 00000",
        "address": "7107 Random St, City",
        "history": {
            "past": [
                {
                    "id": "APT-P11-8",
                    "date": "2025-12-07",
                    "time": "08:00",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-5",
                    "date": "2025-11-28",
                    "time": "11:00",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-6",
                    "date": "2025-10-20",
                    "time": "11:00",
                    "services": [
                        "PROLOTHERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-4",
                    "date": "2025-09-22",
                    "time": "11:00",
                    "services": [
                        "PROLOTHERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-9",
                    "date": "2025-09-05",
                    "time": "16:00",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-7",
                    "date": "2025-08-28",
                    "time": "15:00",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-2",
                    "date": "2025-08-16",
                    "time": "09:00",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-11",
                    "date": "2025-05-11",
                    "time": "12:00",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-3",
                    "date": "2025-05-09",
                    "time": "15:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "PROLOTHERAPY"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-1",
                    "date": "2025-05-04",
                    "time": "08:00",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-0",
                    "date": "2025-04-30",
                    "time": "11:00",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Completed"
                },
                {
                    "id": "APT-P11-10",
                    "date": "2025-01-09",
                    "time": "16:00",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Completed"
                }
            ],
            "future": [
                {
                    "id": "APT-F11-4",
                    "date": "2026-07-15",
                    "time": "11:30",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-2",
                    "date": "2026-07-27",
                    "time": "11:30",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-0",
                    "date": "2026-09-17",
                    "time": "12:30",
                    "services": [
                        "LASER TREATMENT",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-3",
                    "date": "2026-10-04",
                    "time": "12:30",
                    "services": [
                        "LASER TREATMENT",
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-F11-1",
                    "date": "2026-10-16",
                    "time": "14:30",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 2,
            "notes": 2
        }
    }
];

