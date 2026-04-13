"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { LayoutDashboard, Users, Settings, Briefcase ,Globe2} from "lucide-react";
import React, { useState } from "react"; // <-- add useState

const menuItems = [
    {
        label: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
        // pas de sous-menu
    },
    {
        label: "Countries",
        href: "/dashboard/countries",
        icon: Globe2,
    },
    {
        label: "Utilisateurs",
        href: "/dashboard/users",
        icon: Users,
        // pas de sous-menu
    },
    {
        label: "Paramètres",
        href: "/dashboard/settings",
        icon: Settings,
        // sous‑menu affiché uniquement quand on clique
        subItems: [
            { label: "Profil", href: "/dashboard/settings/profile" },
            { label: "Sécurité", href: "/dashboard/settings/security" },
            { label: "Notifications", href: "/dashboard/settings/notifications" },
        ],
    },
];


export function SidebarApp() {
    const pathname = usePathname();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <Sidebar collapsible="offcanvas" className="w-64 border-r bg-white shadow-sm">
            {/* HEADER */}
            <SidebarHeader className="border-b bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Briefcase className="size-4 text-white" />
                        </div>
                        <h2 className="text-sm font-semibold tracking-tight text-slate-800">
                            Mon Dashboard
                        </h2>
                    </div>

                    <SidebarTrigger className="sm:hidden size-9 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 active:bg-slate-300 transition" />
                </div>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent className="flex-1 px-2 py-4">
                <SidebarGroup>
                    <SidebarMenu className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            // Clé pour l’item qui peut avoir un sous‑menu
                            const hasSubmenu = !!item.subItems?.length;

                            return (
                                <React.Fragment key={item.href}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all
                        ${isActive
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                            onClick={
                                                hasSubmenu
                                                    ? (e) => {
                                                        // On ne veut pas activer le lien si on clique juste pour ouvrir le menu
                                                        e.preventDefault();
                                                        toggleMenu(item.href); // ID = href du parent
                                                    }
                                                    : undefined
                                            }
                                        >
                                            <Link href={item.href} className="flex items-center gap-3 w-full">
                                                <Icon
                                                    className={`size-4 ${
                                                        isActive ? "text-white" : "text-slate-500"
                                                    }`}
                                                />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>

                                        {/* Sous‑menu déplié au clic */}
                                        {hasSubmenu && openMenuId === item.href && (
                                            <SidebarMenuSub className="mt-1 space-y-0.5">
                                                {item?.subItems?.map((subItem) => {
                                                    const subIsActive = pathname === subItem.href;

                                                    return (
                                                        <SidebarMenuSubButton
                                                            key={subItem.href}
                                                            className={`px-8 py-1.5 text-xs font-medium transition-colors
                                ${subIsActive
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                                                            }`}
                                                        >
                                                            <Link href={subItem.href}>{subItem.label}</Link>
                                                        </SidebarMenuSubButton>
                                                    );
                                                })}
                                            </SidebarMenuSub>
                                        )}
                                    </SidebarMenuItem>
                                </React.Fragment>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter className="border-t bg-slate-50 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium tracking-wide">
                    <span>  © {new Date().getFullYear()} - Tous droits réservés</span>
                    <span className="text-slate-700">Agensic solution</span>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}