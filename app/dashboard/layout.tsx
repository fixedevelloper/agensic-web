// app/(dashboard)/layout.tsx
import { SidebarApp } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import React from "react";
import {SidebarProvider} from "../../components/ui/sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Plateforme de paiement - Afrique",
}
export default function DashboardLayout({
                                            children,
                                        }: { children: React.ReactNode }) {
    return (
        <SidebarProvider className="h-full w-full flex">
        <div className="flex h-screen  w-screen flex-col md:flex-row">
            {/* Sidebar (visible en desktop uniquement) */}
            <div className="hidden w-64 border-r md:block">
                <SidebarApp />
            </div>

            {/* Mobile sidebar toggle si tu veux plus tard */}
            <div className="flex flex-1 flex-col">
                <Header />
                <main className="flex-1 overflow-auto bg-muted/40 p-2 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
        </SidebarProvider>
    );
}