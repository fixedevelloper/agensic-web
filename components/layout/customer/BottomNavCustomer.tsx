"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {Home, BoxIcon, Settings, Package} from "lucide-react";
import React from "react";


export function BottomNavCustomer() {
    const pathname = usePathname();

    const navItems = [
        { href: "/customer", label: "Accueil", icon: Home },
        { href: "/customer/shops", label: "Mes boutiques", icon: Package },
        { href: "/customer/settings", label: "Paramètres", icon: Settings },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden pb-[env(safe-area-inset-bottom)]">

            <div className="flex justify-around items-center h-16">

                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center text-xs transition-all duration-200 ${
                                active
                                    ? "text-primary scale-105"
                                    : "text-muted-foreground"
                            }`}
                        >
                            <Icon
                                size={22}
                                className={`mb-0.5 transition-all ${
                                    active ? "text-primary" : ""
                                }`}
                            />

                            <span className="leading-none">
                                {item.label}
                            </span>

                            {/* active indicator dot */}
                            {active && (
                                <div className="w-1 h-1 bg-primary rounded-full mt-1" />
                            )}
                        </Link>
                    );
                })}

            </div>
        </nav>
    );
}