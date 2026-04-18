"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {UserButton} from "./user-button";

const NAV_LINKS = [
    { href: "/dashboard", label: "Accueil" },
    { href: "/dashboard/analytics", label: "Stats" },
    { href: "/dashboard/settings", label: "Paramètres" },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 flex h-16  px-12  items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-6">
                {/* Menu mobile - Gardé minimaliste */}
                <SidebarTrigger className="lg:hidden" />

                <Link href="/dashboard" className="text-xl font-black tracking-tighter hover:opacity-80 transition-opacity">
                    CORE<span className="text-blue-600">.</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all",
                                    isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="flex items-center gap-4">
                <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                <UserButton />
            </div>
        </header>
    );
}