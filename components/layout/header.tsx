// components/layout/header.tsx
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import React from "react";
import {UserButton} from "./user-button";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Gauche : burger + logo + menu desktop */}
            <div className="flex items-center space-x-4">
                {/* Burger (visible uniquement en mobile / tablette, caché à partir de lg) */}
                <SidebarTrigger
                    className="lg:hidden size-10 rounded-md bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
                />

                <Link href="/dashboard" className="font-bold text-lg text-foreground">
                    Dashboard
                </Link>

                <nav className="hidden md:flex items-center space-x-4 text-sm text-muted-foreground">
                    <Link
                        href="/dashboard"
                        className="hover:text-primary transition-colors"
                    >
                        Accueil
                    </Link>
                    <Link
                        href="/dashboard/analytics"
                        className="hover:text-primary transition-colors"
                    >
                        Stats
                    </Link>
                    <Link
                        href="/dashboard/settings"
                        className="hover:text-primary transition-colors"
                    >
                        Paramètres
                    </Link>
                </nav>
            </div>

            {/* Droite : bouton user */}
            <div className="flex items-center space-x-4">
                <UserButton />
            </div>
        </header>
    );
}