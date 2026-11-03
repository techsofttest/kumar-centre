"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRoleDashboardPath } from '@/lib/roles';

export default function Login() {
    const [selectedRole, setSelectedRole] = useState('admin');
    const [username, setUsername] = useState('admin@kumarcentres.com');
    const [password, setPassword] = useState('demo1234');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    // Handle role selection change and update credentials
    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        if (role === 'admin') {
            setUsername('dr.sasikumar@kumarcentres.com');
        } else if (role === 'Doctor') {
            setUsername('dr.sasikumar@kumarcentres.com');
        } else if (role === 'Physiotherapist') {
            setUsername('physio@kumarcentres.com');
        } else if (role === 'Receptionist') {
            setUsername('reception@kumarcentres.com');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Persist the selected role for the session
        localStorage.setItem('userRole', selectedRole);

        // Redirect to the dashboard of the selected role
        const targetPath = getRoleDashboardPath(selectedRole);
        router.push(targetPath);
    };

    return (
        <div className="flex min-h-screen bg-transparent">

            {/* Left Column: Brand & Imagery (Hidden on mobile, visible on lg screens) */}
            <div className="relative hidden w-1/2 flex-col justify-between bg-brand p-12 lg:flex">
                {/* Background image tinted by the brand background */}
                <div className="absolute inset-0 bg-[url('/login/login.jpg')] bg-cover bg-center opacity-80" />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent" />

                <div className="relative z-10 text-white">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
                        Clinical & Healthcare Network
                    </span>
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight">Kumar Centres</h1>
                </div>

                <div className="relative z-10">
                    <blockquote className="space-y-1 text-white">
                        <p className="text-base font-medium text-white/90 italic">
                            "Precision care and rehabilitation for superior patient outcomes."
                        </p>
                    </blockquote>
                </div>
            </div>

            {/* Right Column: Interactive Login Area */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 sm:px-16 lg:px-24">
                <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-8">

                    <div className="flex flex-col space-y-2 text-center">
                        {/* Text brand name */}
                        <div className="mb-2">
                            <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                Kumar Centres
                            </span>
                        </div>
                        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                            Portal Access
                        </h2>
                        <p className="text-sm text-foreground/60">
                            Please sign in with your credentials to access your portal.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="role"
                                className="text-sm font-medium leading-none text-foreground"
                            >
                                Access Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    value={selectedRole}
                                    onChange={(e) => handleRoleChange(e.target.value)}
                                    className="flex h-12 w-full appearance-none bg-white/60 dark:bg-zinc-800/60 items-center rounded-md border border-foreground/20 px-4 text-sm font-medium text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors cursor-pointer"
                                >
                                    <option value="admin">admin</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Physiotherapist">Physiotherapist</option>
                                    <option value="Receptionist">Receptionist</option>
                                </select>
                                {/* Custom minimalist dropdown arrow */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
                                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium leading-none text-foreground"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex h-12 w-full items-center rounded-md border border-foreground/20 bg-white/60 dark:bg-zinc-800/60 px-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none text-foreground"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-12 w-full items-center rounded-md border border-foreground/20 bg-white/60 dark:bg-zinc-800/60 pl-4 pr-12 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/80 transition-colors"
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="filled"
                            size="lg"
                            className="w-full bg-[#3C43EC] hover:bg-[#3239cb] text-white font-medium py-3 rounded-lg shadow-md transition-all"
                        >
                            Login to Dashboard
                        </Button>
                    </form>

                </div>
            </div>

        </div>
    );
}
