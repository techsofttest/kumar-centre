"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DetailDrawer } from "@/components/ui/detail-drawer";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    BriefcaseMedical,
    Clock,
    IndianRupee,
    Copy,
    Power,
    PowerOff,
    Edit,
    ShieldAlert,
    X,
    Tags
} from "lucide-react";

// SRS Service Data Structure
interface ClinicService {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    duration: number; // in minutes
    isActive: boolean;
}

export default function ServicesManager() {
    // DEMONSTRATION ONLY: Mock role loadable from localStorage/Context
    const [userRole, setUserRole] = useState<string>("admin");

    useEffect(() => {
        const storedRole = localStorage.getItem("userRole");
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    // Security layer: Block non-administrative staff[cite: 2]


    // Mock Database populated with Back Pain & Spine Care services
    const [services, setServices] = useState<ClinicService[]>([
        { id: "SRV-01", name: "WARMING & MASSAGE", category: "Physical Therapy & Rehab", description: "Therapeutic warming and targeted deep tissue back massage.", price: 650, duration: 45, isActive: true },
        { id: "SRV-02", name: "IDD THERAPY", category: "Advanced Spine Care", description: "Intervertebral Differential Dynamics non-surgical spinal decompression.", price: 1500, duration: 45, isActive: true },
        { id: "SRV-03", name: "LASER TREATMENT", category: "Advanced Spine Care", description: "Class IV high-intensity targeted laser spine therapy.", price: 1200, duration: 30, isActive: true },
        { id: "SRV-04", name: "PROLOTHERAPY", category: "Regenerative Spine Care", description: "Regenerative injection therapy for chronic lower back & ligament repair.", price: 2500, duration: 45, isActive: true },
        { id: "SRV-05", name: "SPINAL DECOMPRESSION", category: "Advanced Spine Care", description: "Computerized spinal decompression therapy for herniated lumbar discs.", price: 1800, duration: 45, isActive: true },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingService, setEditingService] = useState<ClinicService | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const categories = useMemo(() => {
        const allCategories = services.map(s => s.category);
        return ["All", ...Array.from(new Set(allCategories))];
    }, [services]);

    const filteredServices = useMemo(() => {
        return services.filter(s => {
            const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
            const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, services, selectedCategory]);

    const handleDuplicate = (service: ClinicService) => {
        const duplicate: ClinicService = {
            ...service,
            id: `SRV-${Math.floor(Math.random() * 1000)}`,
            name: `${service.name} (Copy)`,
            isActive: false // Duplicates should default to inactive until configured
        };
        setServices([duplicate, ...services]);
    };

    const toggleStatus = (id: string) => {
        setServices(services.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    };

    const openEditor = (service?: ClinicService) => {
        setEditingService(service || null);
        setIsDrawerOpen(true);
    };

    if (userRole !== "super_admin" && userRole !== "administrator" && userRole !== "admin") {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900">
                <ShieldAlert className="mb-4 h-12 w-12 text-zinc-" />
                <h1 className="text-2xl font-bold text-foreground">Administrative Lock</h1>
                <p className="mt-2 text-foreground/60">
                    Only Clinic Administrators and Super Admins can configure service catalogs[cite: 2].
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-full w-full overflow-hidden">

            {/* Main Content Area */}
            <div className={`flex flex-col transition-all duration-300 ease-in-out ${isDrawerOpen ? "w-2/3 border-r border-black/[.15] dark:border-white/[.22]" : "w-full"}`}>

                {/* Header & Search */}
                <div className="flex flex-col gap-4 border-b border-black/[.15] p-8 dark:border-white/[.22]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Service Catalogs</h1>
                            <p className="mt-1 text-sm text-foreground/60">Configure clinic offerings, pricing, and durations.</p>
                        </div>
                        <Button variant="filled" icon={Plus} onClick={() => openEditor()}>
                            Create Service
                        </Button>
                    </div>

                    <div className="mt-4 flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Search by service name or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                            />
                        </div>
                        <div className="relative">
                            <Button variant="outline" icon={Filter} onClick={() => setShowFilterDropdown(!showFilterDropdown)}>
                                Filter: {selectedCategory}
                            </Button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 mt-2 z-50 w-48 rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-1 shadow-lg dark:border-white/[.22]">
                                    {categories.map(category => (
                                        <button
                                            key={category}
                                            onClick={() => {
                                                setSelectedCategory(category);
                                                setShowFilterDropdown(false);
                                            }}
                                            className="w-full rounded-md px-3 py-2 text-left text-sm text-foreground hover:bg-black/[.04] dark:hover:bg-white/[.04]"
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Database Table */}
                <div className="flex-1 overflow-hidden bg-white dark:bg-zinc-900 p-8">
                    <div className="h-full rounded-xl border border-black/[.15] bg-white dark:bg-zinc-900 dark:border-white/[.22] overflow-auto thin-scrollbar">
                        <table className="w-full text-left text-sm text-foreground">
                            <thead className="border-b border-black/[.15] bg-black/[.02] text-xs uppercase text-foreground/60 dark:border-white/[.22] dark:bg-white/[.02]">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Service Name & Description</th>
                                    <th className="px-6 py-4 font-medium">Category</th>
                                    <th className="px-6 py-4 font-medium">Pricing & Time</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/[.08] dark:divide-white/[.145]">
                                {filteredServices.map((service) => (
                                    <tr key={service.id} className="transition-colors hover:bg-black/[.02] dark:hover:bg-white/[.04]">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-md ${service.isActive ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' : 'bg-zinc-100 text-zinc-400 dark:bg-zinc-800'}`}>
                                                    <BriefcaseMedical className="h-4 w-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`font-semibold ${service.isActive ? 'text-foreground' : 'text-foreground/50'}`}>{service.name}</span>
                                                    <span className="max-w-[250px] truncate text-xs text-foreground/50">{service.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium text-foreground/70 dark:bg-white/[.04]">
                                                <Tags className="h-3 w-3" /> {service.category}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 font-medium text-foreground">
                                                    <IndianRupee className="h-3.5 w-3.5 text-green-600" /> {service.price.toFixed(2)}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-foreground/60">
                                                    <Clock className="h-3.5 w-3.5" /> {service.duration} mins
                                                </span>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${service.isActive
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                                }`}>
                                                {service.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Status Toggle Requirement */}
                                                <div className="relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() => toggleStatus(service.id)}
                                                        icon={service.isActive ? PowerOff : Power}
                                                        className={service.isActive ? 'text-red-600 hover:text-red-500 hover:bg-zinc- dark:hover:bg-zinc-/30' : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30'}
                                                    />
                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded bg-slate-900 dark:bg-zinc-800 px-2.5 py-1 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap shadow-md">
                                                        {service.isActive ? "Deactivate" : "Activate"}
                                                    </span>
                                                </div>

                                                {/* Duplicate Requirement */}
                                                <div className="relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() => handleDuplicate(service)}
                                                        icon={Copy}
                                                        className="text-foreground/50 hover:text-foreground"
                                                    />
                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded bg-slate-900 dark:bg-zinc-800 px-2.5 py-1 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap shadow-md">
                                                        Duplicate
                                                    </span>
                                                </div>

                                                {/* Edit Action */}
                                                <div className="relative group">
                                                    <Button
                                                        variant="ghost"
                                                        size="xs"
                                                        onClick={() => openEditor(service)}
                                                        icon={Edit}
                                                        className="text-foreground/50 hover:text-foreground"
                                                    />
                                                    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded bg-slate-900 dark:bg-zinc-800 px-2.5 py-1 text-[12px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap shadow-md">
                                                        Edit Service
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Slide-over Configurator */}
            {isDrawerOpen && (
                <DetailDrawer
                    onClose={() => setIsDrawerOpen(false)}
                    title={editingService ? "Edit Service" : "New Service Configurator"}
                    subtitle={editingService ? `ID: ${editingService.id}` : "Define parameters"}
                >
                    {/* Form Fields corresponding to SRS Module 7 */}
                    <div className="flex flex-col gap-6">

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Service Name</label>
                                <input
                                    type="text"
                                    defaultValue={editingService?.name}
                                    placeholder="e.g. WARMING & MASSAGE"
                                    className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Category</label>
                                <select className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 px-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]">
                                    <option>Advanced Spine Care</option>
                                    <option>Physical Therapy & Rehab</option>
                                    <option>Regenerative Spine Care</option>
                                    <option>Consultations</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                        <input
                                            type="number"
                                            defaultValue={editingService?.price}
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Duration (mins)</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                                        <input
                                            type="number"
                                            defaultValue={editingService?.duration}
                                            step="5"
                                            className="h-10 w-full rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 pl-9 pr-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-foreground/50">Public Description</label>
                                <textarea
                                    defaultValue={editingService?.description}
                                    rows={4}
                                    placeholder="Describe the service for the patient portal..."
                                    className="w-full resize-none rounded-md border border-black/[.15] bg-white dark:bg-zinc-900 p-3 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-white/[.22]"
                                />
                            </div>

                            {/* Status Toggle */}
                            <div className="flex items-center justify-between rounded-lg border border-black/[.15] bg-white dark:bg-zinc-900 p-4 dark:border-white/[.22] dark:bg-zinc-900">
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">Service Status</h4>
                                    <p className="text-xs text-foreground/60">If inactive, it cannot be booked.</p>
                                </div>
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input type="checkbox" defaultChecked={editingService ? editingService.isActive : true} className="peer sr-only" />
                                    <div className="peer h-6 w-11 rounded-full bg-zinc-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white dark:bg-zinc-900 after:transition-all after:content-[''] peer-checked:bg-[#3C43EC] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#3C43EC]/30 dark:bg-zinc-700 dark:border-gray-600"></div>
                                </label>
                            </div>

                        </div>
                    </div>

                    <div className="mt-auto border-t border-black/[.15] dark:border-white/[.22] pt-6">
                        <Button
                            variant="filled"
                            onClick={() => setIsDrawerOpen(false)}
                            className="w-full bg-[#3C43EC] text-white hover:bg-[#2b30c6]"
                        >
                            Save Configuration
                        </Button>
                    </div>
                </DetailDrawer>
            )}
        </div>
    );
}
