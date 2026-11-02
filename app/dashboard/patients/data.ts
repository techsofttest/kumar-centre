export interface AppointmentRecord {
    id: string;
    date: string;
    time?: string;
    services: string[];
    status: "Confirmed" | "Pending" | "Cancelled";
}

export interface Patient {
    id: string;
    name: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    address: string;
    history: {
        past: AppointmentRecord[];
        future: AppointmentRecord[];
    };
    vault: {
        questionnaires: number;
        consents: number;
        notes: number;
    };
}

export const mockPatientsData: Patient[] = [
    {
        "id": "REF-8000",
        "name": "Anjali Nair",
        "dob": "1974-02-15",
        "gender": "Female",
        "email": "anjali.nair@email.com",
        "phone": "+91 98471 49856",
        "address": "M.G. Road, Ernakulam, Kochi, Kerala 682016",
        "history": {
            "past": [
                {
                    "id": "APT-008",
                    "date": "2026-06-06",
                    "time": "04:30 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "SPINE REHAB FOLLOW-UP",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-010",
                    "date": "2026-05-22",
                    "time": "12:30 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-006",
                    "date": "2026-04-22",
                    "time": "01:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-005",
                    "date": "2026-04-07",
                    "time": "12:30 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-001",
                    "date": "2025-12-29",
                    "time": "09:30 AM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-009",
                    "date": "2025-12-07",
                    "time": "09:00 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-002",
                    "date": "2025-07-07",
                    "time": "12:30 PM",
                    "services": [
                        "PROLOTHERAPY",
                        "ULTRASOUND & HEAT THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-007",
                    "date": "2025-06-21",
                    "time": "01:00 PM",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-003",
                    "date": "2025-05-05",
                    "time": "12:00 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-004",
                    "date": "2025-04-21",
                    "time": "04:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-012",
                    "date": "2026-08-23",
                    "time": "02:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-014",
                    "date": "2026-09-24",
                    "time": "09:30 AM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-013",
                    "date": "2026-10-07",
                    "time": "02:00 PM",
                    "services": [
                        "PROLOTHERAPY",
                        "WARMING & MASSAGE",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-011",
                    "date": "2026-11-14",
                    "time": "03:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 0,
            "notes": 6
        }
    },
    {
        "id": "REF-8001",
        "name": "Rahul Menon",
        "dob": "1991-01-15",
        "gender": "Male",
        "email": "rahul.menon@email.com",
        "phone": "+91 98472 55512",
        "address": "Panampilly Nagar, Kochi, Kerala 682036",
        "history": {
            "past": [
                {
                    "id": "APT-018",
                    "date": "2026-06-15",
                    "time": "02:00 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-021",
                    "date": "2026-06-03",
                    "time": "12:30 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-016",
                    "date": "2026-03-09",
                    "time": "11:00 AM",
                    "services": [
                        "WARMING & MASSAGE",
                        "LASER TREATMENT",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-024",
                    "date": "2025-10-22",
                    "time": "09:30 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-017",
                    "date": "2025-08-31",
                    "time": "10:30 AM",
                    "services": [
                        "IDD THERAPY",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-020",
                    "date": "2025-08-17",
                    "time": "03:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-023",
                    "date": "2025-05-27",
                    "time": "11:00 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "SPINAL DECOMPRESSION",
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-019",
                    "date": "2025-04-29",
                    "time": "11:30 AM",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-022",
                    "date": "2025-03-06",
                    "time": "10:30 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-015",
                    "date": "2025-03-04",
                    "time": "10:00 AM",
                    "services": [
                        "LASER TREATMENT",
                        "TRIGGER POINT INJECTION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-025",
                    "date": "2026-07-04",
                    "time": "12:00 PM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-029",
                    "date": "2026-09-18",
                    "time": "04:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "LUMBAR TRACTION THERAPY",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-026",
                    "date": "2026-10-06",
                    "time": "10:00 AM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-027",
                    "date": "2026-11-02",
                    "time": "11:00 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-028",
                    "date": "2026-11-20",
                    "time": "09:00 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 3,
            "notes": 8
        }
    },
    {
        "id": "REF-8002",
        "name": "Deepa Pillai",
        "dob": "1978-06-15",
        "gender": "Female",
        "email": "deepa.pillai@email.com",
        "phone": "+91 98473 78901",
        "address": "Kowdiar, Thiruvananthapuram, Kerala 695003",
        "history": {
            "past": [
                {
                    "id": "APT-039",
                    "date": "2026-04-08",
                    "time": "12:00 PM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-033",
                    "date": "2026-03-19",
                    "time": "02:00 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-035",
                    "date": "2026-02-16",
                    "time": "12:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINAL DECOMPRESSION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-037",
                    "date": "2026-02-15",
                    "time": "01:30 PM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-034",
                    "date": "2025-10-19",
                    "time": "01:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-038",
                    "date": "2025-06-27",
                    "time": "12:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINE REHAB FOLLOW-UP",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-036",
                    "date": "2025-03-20",
                    "time": "11:00 AM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-031",
                    "date": "2025-03-05",
                    "time": "09:30 AM",
                    "services": [
                        "IDD THERAPY",
                        "SPINE REHAB FOLLOW-UP",
                        "PROLOTHERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-030",
                    "date": "2025-02-16",
                    "time": "02:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-032",
                    "date": "2025-01-20",
                    "time": "02:00 PM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-040",
                    "date": "2026-08-16",
                    "time": "02:00 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-043",
                    "date": "2026-08-30",
                    "time": "02:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-042",
                    "date": "2026-10-14",
                    "time": "09:30 AM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-041",
                    "date": "2026-10-21",
                    "time": "03:30 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 2,
            "notes": 7
        }
    },
    {
        "id": "REF-8003",
        "name": "Vishnu Namboothiri",
        "dob": "1981-09-15",
        "gender": "Male",
        "email": "vishnu.n@email.com",
        "phone": "+91 98474 23456",
        "address": "Round North, Thrissur, Kerala 680001",
        "history": {
            "past": [
                {
                    "id": "APT-048",
                    "date": "2026-06-15",
                    "time": "01:00 PM",
                    "services": [
                        "IDD THERAPY",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-053",
                    "date": "2026-05-01",
                    "time": "12:00 PM",
                    "services": [
                        "LASER TREATMENT",
                        "DRY NEEDLING & ACUPUNCTURE",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-044",
                    "date": "2026-03-21",
                    "time": "03:00 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-046",
                    "date": "2026-01-15",
                    "time": "09:00 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "TRIGGER POINT INJECTION",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-050",
                    "date": "2025-12-14",
                    "time": "04:00 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-051",
                    "date": "2025-10-08",
                    "time": "10:00 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-047",
                    "date": "2025-09-26",
                    "time": "01:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-052",
                    "date": "2025-08-04",
                    "time": "03:30 PM",
                    "services": [
                        "LASER TREATMENT",
                        "ULTRASOUND & HEAT THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-045",
                    "date": "2025-06-11",
                    "time": "11:30 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "SPINE REHAB FOLLOW-UP",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-049",
                    "date": "2025-02-15",
                    "time": "02:30 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-055",
                    "date": "2026-10-01",
                    "time": "09:30 AM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-057",
                    "date": "2026-10-31",
                    "time": "02:00 PM",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-054",
                    "date": "2026-11-16",
                    "time": "12:00 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "PROLOTHERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-056",
                    "date": "2026-11-23",
                    "time": "10:30 AM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "SPINE REHAB FOLLOW-UP",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 3,
            "consents": 0,
            "notes": 5
        }
    },
    {
        "id": "REF-8004",
        "name": "Arjun Kurup",
        "dob": "1987-06-15",
        "gender": "Female",
        "email": "arjun.kurup@email.com",
        "phone": "+91 98475 34567",
        "address": "Civil Station Ward, Alappuzha, Kerala 688001",
        "history": {
            "past": [
                {
                    "id": "APT-067",
                    "date": "2026-06-25",
                    "time": "10:00 AM",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-058",
                    "date": "2026-04-27",
                    "time": "09:00 AM",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-065",
                    "date": "2026-03-21",
                    "time": "01:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-059",
                    "date": "2026-02-14",
                    "time": "01:30 PM",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-063",
                    "date": "2026-01-14",
                    "time": "09:30 AM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-064",
                    "date": "2025-11-12",
                    "time": "12:30 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-069",
                    "date": "2025-07-09",
                    "time": "12:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-060",
                    "date": "2025-06-29",
                    "time": "12:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-066",
                    "date": "2025-06-26",
                    "time": "12:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-062",
                    "date": "2025-05-23",
                    "time": "11:30 AM",
                    "services": [
                        "LASER TREATMENT",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-061",
                    "date": "2025-05-07",
                    "time": "11:00 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-068",
                    "date": "2025-03-20",
                    "time": "11:00 AM",
                    "services": [
                        "PROLOTHERAPY",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-072",
                    "date": "2026-07-23",
                    "time": "10:00 AM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-073",
                    "date": "2026-09-17",
                    "time": "11:30 AM",
                    "services": [
                        "WARMING & MASSAGE",
                        "IDD THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-070",
                    "date": "2026-10-27",
                    "time": "11:30 AM",
                    "services": [
                        "PROLOTHERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-071",
                    "date": "2026-11-30",
                    "time": "12:30 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-074",
                    "date": "2026-12-05",
                    "time": "03:00 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "IDD THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 4,
            "notes": 9
        }
    },
    {
        "id": "REF-8005",
        "name": "Lakshmi Warrier",
        "dob": "1992-04-15",
        "gender": "Male",
        "email": "lakshmi.warrier@email.com",
        "phone": "+91 98476 45678",
        "address": "Kaloor, Kochi, Kerala 682017",
        "history": {
            "past": [
                {
                    "id": "APT-075",
                    "date": "2026-03-28",
                    "time": "01:30 PM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-082",
                    "date": "2026-03-06",
                    "time": "04:30 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-078",
                    "date": "2026-02-19",
                    "time": "02:00 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "LUMBAR TRACTION THERAPY",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-079",
                    "date": "2026-02-02",
                    "time": "09:00 AM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-084",
                    "date": "2025-11-05",
                    "time": "11:00 AM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-085",
                    "date": "2025-09-22",
                    "time": "04:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "TRIGGER POINT INJECTION",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-077",
                    "date": "2025-04-15",
                    "time": "02:30 PM",
                    "services": [
                        "WARMING & MASSAGE",
                        "IDD THERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-083",
                    "date": "2025-03-16",
                    "time": "03:30 PM",
                    "services": [
                        "LASER TREATMENT",
                        "CORE STABILIZATION THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-080",
                    "date": "2025-01-13",
                    "time": "03:30 PM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-081",
                    "date": "2025-01-10",
                    "time": "04:00 PM",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-076",
                    "date": "2025-01-08",
                    "time": "10:00 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "POSTURAL & ERGONOMIC REHAB",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-090",
                    "date": "2026-08-02",
                    "time": "04:00 PM",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-087",
                    "date": "2026-08-15",
                    "time": "01:00 PM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-086",
                    "date": "2026-09-09",
                    "time": "04:00 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-091",
                    "date": "2026-10-29",
                    "time": "12:00 PM",
                    "services": [
                        "IDD THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-088",
                    "date": "2026-11-05",
                    "time": "10:30 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-089",
                    "date": "2026-11-29",
                    "time": "04:30 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 1,
            "consents": 4,
            "notes": 2
        }
    },
    {
        "id": "REF-8006",
        "name": "Reshma Thomas",
        "dob": "1971-06-15",
        "gender": "Female",
        "email": "reshma.thomas@email.com",
        "phone": "+91 98477 56789",
        "address": "Collectorate P.O., Kottayam, Kerala 686002",
        "history": {
            "past": [
                {
                    "id": "APT-093",
                    "date": "2026-03-29",
                    "time": "09:00 AM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-102",
                    "date": "2026-03-20",
                    "time": "02:30 PM",
                    "services": [
                        "PROLOTHERAPY",
                        "IDD THERAPY",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-097",
                    "date": "2026-02-14",
                    "time": "03:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-096",
                    "date": "2026-02-08",
                    "time": "04:00 PM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-095",
                    "date": "2026-01-24",
                    "time": "04:30 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-098",
                    "date": "2025-12-04",
                    "time": "09:00 AM",
                    "services": [
                        "PROLOTHERAPY",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-092",
                    "date": "2025-11-12",
                    "time": "12:00 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-099",
                    "date": "2025-10-07",
                    "time": "11:30 AM",
                    "services": [
                        "WARMING & MASSAGE",
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-100",
                    "date": "2025-04-17",
                    "time": "09:00 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "IDD THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-094",
                    "date": "2025-01-15",
                    "time": "04:00 PM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-101",
                    "date": "2025-01-08",
                    "time": "02:00 PM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-104",
                    "date": "2026-07-08",
                    "time": "10:00 AM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-105",
                    "date": "2026-07-16",
                    "time": "09:00 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-107",
                    "date": "2026-09-15",
                    "time": "10:00 AM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-103",
                    "date": "2026-10-12",
                    "time": "02:00 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-108",
                    "date": "2026-11-01",
                    "time": "09:30 AM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "SPINAL DECOMPRESSION",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-106",
                    "date": "2026-11-08",
                    "time": "02:00 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 8
        }
    },
    {
        "id": "REF-8007",
        "name": "Sreekumar Varma",
        "dob": "1978-06-15",
        "gender": "Male",
        "email": "sreekumar.varma@email.com",
        "phone": "+91 98478 67890",
        "address": "Palayam, Kozhikode, Kerala 673001",
        "history": {
            "past": [
                {
                    "id": "APT-119",
                    "date": "2026-04-26",
                    "time": "01:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-111",
                    "date": "2026-04-13",
                    "time": "03:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "CORE STABILIZATION THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-120",
                    "date": "2026-03-03",
                    "time": "04:30 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-114",
                    "date": "2026-02-16",
                    "time": "12:00 PM",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-113",
                    "date": "2025-11-18",
                    "time": "04:30 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "ULTRASOUND & HEAT THERAPY",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-118",
                    "date": "2025-09-22",
                    "time": "12:30 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "LASER TREATMENT",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-116",
                    "date": "2025-08-08",
                    "time": "04:30 PM",
                    "services": [
                        "IDD THERAPY",
                        "TRIGGER POINT INJECTION",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-110",
                    "date": "2025-07-26",
                    "time": "09:30 AM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-112",
                    "date": "2025-04-18",
                    "time": "01:00 PM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-115",
                    "date": "2025-02-17",
                    "time": "11:30 AM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "LUMBAR TRACTION THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-117",
                    "date": "2025-02-02",
                    "time": "03:30 PM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-109",
                    "date": "2025-01-01",
                    "time": "10:30 AM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "IDD THERAPY"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-123",
                    "date": "2026-09-08",
                    "time": "04:30 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "POSTURAL & ERGONOMIC REHAB",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-122",
                    "date": "2026-09-30",
                    "time": "04:00 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-125",
                    "date": "2026-10-10",
                    "time": "12:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "CORE STABILIZATION THERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-124",
                    "date": "2026-11-27",
                    "time": "04:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-126",
                    "date": "2026-12-09",
                    "time": "10:00 AM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "SPINAL DECOMPRESSION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-121",
                    "date": "2026-12-14",
                    "time": "12:00 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 0,
            "consents": 2,
            "notes": 3
        }
    },
    {
        "id": "REF-8008",
        "name": "Harikrishnan Nair",
        "dob": "1975-04-15",
        "gender": "Female",
        "email": "harikrishnan.nair@email.com",
        "phone": "+91 98479 78901",
        "address": "East Fort, Thiruvananthapuram, Kerala 695023",
        "history": {
            "past": [
                {
                    "id": "APT-133",
                    "date": "2026-06-29",
                    "time": "10:00 AM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-138",
                    "date": "2026-05-08",
                    "time": "01:30 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "WARMING & MASSAGE",
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-129",
                    "date": "2026-04-28",
                    "time": "02:00 PM",
                    "services": [
                        "PROLOTHERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-135",
                    "date": "2026-04-26",
                    "time": "02:30 PM",
                    "services": [
                        "LASER TREATMENT",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-131",
                    "date": "2026-04-13",
                    "time": "10:00 AM",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-136",
                    "date": "2026-01-28",
                    "time": "11:00 AM",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-137",
                    "date": "2026-01-19",
                    "time": "09:30 AM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-128",
                    "date": "2025-09-23",
                    "time": "03:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "SPINE REHAB FOLLOW-UP",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-132",
                    "date": "2025-07-12",
                    "time": "11:00 AM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-130",
                    "date": "2025-05-21",
                    "time": "04:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-134",
                    "date": "2025-05-14",
                    "time": "01:30 PM",
                    "services": [
                        "WARMING & MASSAGE",
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-127",
                    "date": "2025-02-04",
                    "time": "12:30 PM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Cancelled"
                }
            ],
            "future": [
                {
                    "id": "APT-142",
                    "date": "2026-07-10",
                    "time": "03:30 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-141",
                    "date": "2026-09-27",
                    "time": "12:30 PM",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-139",
                    "date": "2026-09-30",
                    "time": "12:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-140",
                    "date": "2026-12-20",
                    "time": "09:30 AM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "PROLOTHERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 4,
            "consents": 1,
            "notes": 9
        }
    },
    {
        "id": "REF-8009",
        "name": "Malavika Panicker",
        "dob": "1983-06-15",
        "gender": "Male",
        "email": "malavika.p@email.com",
        "phone": "+91 98460 89012",
        "address": "Bank Road, Kannur, Kerala 670001",
        "history": {
            "past": [
                {
                    "id": "APT-152",
                    "date": "2026-05-28",
                    "time": "11:30 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-146",
                    "date": "2026-05-20",
                    "time": "12:00 PM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "PROLOTHERAPY",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-151",
                    "date": "2026-01-13",
                    "time": "04:30 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-145",
                    "date": "2025-12-31",
                    "time": "10:00 AM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "LASER TREATMENT",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-153",
                    "date": "2025-12-06",
                    "time": "10:30 AM",
                    "services": [
                        "WARMING & MASSAGE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-148",
                    "date": "2025-07-23",
                    "time": "10:00 AM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-150",
                    "date": "2025-07-19",
                    "time": "09:00 AM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "DRY NEEDLING & ACUPUNCTURE",
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-143",
                    "date": "2025-06-12",
                    "time": "04:00 PM",
                    "services": [
                        "IDD THERAPY",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-144",
                    "date": "2025-06-01",
                    "time": "01:30 PM",
                    "services": [
                        "PROLOTHERAPY",
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-149",
                    "date": "2025-02-18",
                    "time": "12:30 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "LUMBAR TRACTION THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-147",
                    "date": "2025-01-11",
                    "time": "10:00 AM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-156",
                    "date": "2026-07-18",
                    "time": "04:30 PM",
                    "services": [
                        "DRY NEEDLING & ACUPUNCTURE",
                        "PROLOTHERAPY",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-155",
                    "date": "2026-09-14",
                    "time": "03:30 PM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-154",
                    "date": "2026-10-06",
                    "time": "09:30 AM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-157",
                    "date": "2026-12-01",
                    "time": "10:00 AM",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 4,
            "notes": 9
        }
    },
    {
        "id": "REF-8010",
        "name": "Meera Nambiar",
        "dob": "1972-07-15",
        "gender": "Female",
        "email": "meera.nambiar@email.com",
        "phone": "+91 98461 90123",
        "address": "Chandranagar Colony, Palakkad, Kerala 678007",
        "history": {
            "past": [
                {
                    "id": "APT-165",
                    "date": "2026-05-16",
                    "time": "04:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-169",
                    "date": "2026-05-03",
                    "time": "04:00 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "DRY NEEDLING & ACUPUNCTURE",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-162",
                    "date": "2026-04-15",
                    "time": "01:00 PM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-163",
                    "date": "2026-01-06",
                    "time": "10:30 AM",
                    "services": [
                        "SPINAL DECOMPRESSION",
                        "MYOFASCIAL RELEASE",
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-167",
                    "date": "2025-10-31",
                    "time": "04:00 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-161",
                    "date": "2025-10-19",
                    "time": "10:30 AM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-168",
                    "date": "2025-08-27",
                    "time": "01:30 PM",
                    "services": [
                        "SPINAL DECOMPRESSION"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-158",
                    "date": "2025-08-01",
                    "time": "04:00 PM",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-160",
                    "date": "2025-06-20",
                    "time": "04:30 PM",
                    "services": [
                        "WARMING & MASSAGE",
                        "LUMBAR TRACTION THERAPY",
                        "LASER TREATMENT"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-164",
                    "date": "2025-03-28",
                    "time": "12:00 PM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-159",
                    "date": "2025-03-08",
                    "time": "10:30 AM",
                    "services": [
                        "IDD THERAPY",
                        "WARMING & MASSAGE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-166",
                    "date": "2025-01-08",
                    "time": "10:30 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY",
                        "PROLOTHERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-171",
                    "date": "2026-07-11",
                    "time": "09:00 AM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "WARMING & MASSAGE",
                        "CORE STABILIZATION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-175",
                    "date": "2026-08-06",
                    "time": "03:30 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-174",
                    "date": "2026-09-14",
                    "time": "11:00 AM",
                    "services": [
                        "SPINE REHAB FOLLOW-UP"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-170",
                    "date": "2026-09-27",
                    "time": "03:00 PM",
                    "services": [
                        "ULTRASOUND & HEAT THERAPY",
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-173",
                    "date": "2026-10-09",
                    "time": "10:30 AM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-172",
                    "date": "2026-10-24",
                    "time": "12:00 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "CORE STABILIZATION THERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 3,
            "notes": 5
        }
    },
    {
        "id": "REF-8011",
        "name": "Gokul Das",
        "dob": "1972-05-15",
        "gender": "Male",
        "email": "gokul.das@email.com",
        "phone": "+91 98462 01234",
        "address": "Fort Road, Thalassery, Kannur, Kerala 670101",
        "history": {
            "past": [
                {
                    "id": "APT-177",
                    "date": "2026-06-25",
                    "time": "03:00 PM",
                    "services": [
                        "MYOFASCIAL RELEASE",
                        "LASER TREATMENT"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-186",
                    "date": "2026-05-15",
                    "time": "01:30 PM",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-183",
                    "date": "2025-12-26",
                    "time": "01:00 PM",
                    "services": [
                        "IDD THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-185",
                    "date": "2025-12-16",
                    "time": "09:00 AM",
                    "services": [
                        "LASER TREATMENT"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-181",
                    "date": "2025-06-22",
                    "time": "02:30 PM",
                    "services": [
                        "LASER TREATMENT",
                        "PROLOTHERAPY",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-180",
                    "date": "2025-05-22",
                    "time": "01:30 PM",
                    "services": [
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-182",
                    "date": "2025-05-20",
                    "time": "12:00 PM",
                    "services": [
                        "PROLOTHERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-178",
                    "date": "2025-05-13",
                    "time": "12:30 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "DRY NEEDLING & ACUPUNCTURE"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-176",
                    "date": "2025-04-20",
                    "time": "02:30 PM",
                    "services": [
                        "WARMING & MASSAGE",
                        "POSTURAL & ERGONOMIC REHAB"
                    ],
                    "status": "Cancelled"
                },
                {
                    "id": "APT-184",
                    "date": "2025-04-04",
                    "time": "02:00 PM",
                    "services": [
                        "POSTURAL & ERGONOMIC REHAB",
                        "LUMBAR TRACTION THERAPY"
                    ],
                    "status": "Confirmed"
                },
                {
                    "id": "APT-179",
                    "date": "2025-01-28",
                    "time": "01:00 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Confirmed"
                }
            ],
            "future": [
                {
                    "id": "APT-190",
                    "date": "2026-07-09",
                    "time": "02:00 PM",
                    "services": [
                        "TRIGGER POINT INJECTION",
                        "CORE STABILIZATION THERAPY",
                        "ULTRASOUND & HEAT THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-187",
                    "date": "2026-10-20",
                    "time": "04:30 PM",
                    "services": [
                        "CORE STABILIZATION THERAPY",
                        "MYOFASCIAL RELEASE"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-188",
                    "date": "2026-12-18",
                    "time": "12:30 PM",
                    "services": [
                        "WARMING & MASSAGE",
                        "IDD THERAPY"
                    ],
                    "status": "Pending"
                },
                {
                    "id": "APT-189",
                    "date": "2026-12-21",
                    "time": "11:30 AM",
                    "services": [
                        "TRIGGER POINT INJECTION"
                    ],
                    "status": "Pending"
                }
            ]
        },
        "vault": {
            "questionnaires": 2,
            "consents": 0,
            "notes": 5
        }
    }
];

export const getAptFinancials = (apt: AppointmentRecord) => {
    let paid = 0;
    let pending = 0;
    const basePrice = apt.services.length * 500;
    if (apt.status === "Confirmed") {
        paid = basePrice;
        pending = 0;
    } else if (apt.status === "Pending") {
        paid = Math.floor(basePrice * 0.3);
        pending = basePrice - paid;
    } else if (apt.status === "Cancelled") {
        paid = 0;
        pending = 0;
    }
    return { paid, pending };
};

export const getClinicalNotes = (p: Patient) => {
    return p.history.past.map((apt, idx) => ({
        id: `N-${apt.id.split('-')[1] || idx}`,
        date: apt.date,
        author: "Dr. SASIKUMAR",
        note: `Notes for ${apt.services.join(" & ")}: Targeted back pain therapy administered. Patient reported improved lumbar mobility and reduced pain. Home stretching and core stabilization advised.`
    }));
};
