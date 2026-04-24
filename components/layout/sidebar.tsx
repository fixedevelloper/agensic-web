"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    LayoutDashboard,
    Users,
    Settings,
    Briefcase,
    Globe2,
    Wallet,
    ArrowRightLeft,
    ShieldCheck
} from "lucide-react";

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

const menuItems = [
    {
        label: "Tableau de bord",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "text-blue-500"
    },
    {
        label: "Pays & Zones",
        href: "/dashboard/countries",
        icon: Globe2,
        color: "text-emerald-500"
    },
    {
        label: "Gestion Utilisateurs",
        href: "/dashboard/users",
        icon: Users,
        color: "text-purple-500"
    },
    {
        label: "Dépôts",
        href: "/dashboard/deposits",
        icon: Wallet,
        color: "text-amber-500",
        subItems: [
            { label: "Comptes Fiat", href: "/dashboard/deposits/fiats" },
            { label: "Portefeuilles Crypto", href: "/dashboard/deposits/cryptos" },
            { label: "Services USSD", href: "/dashboard/deposits/ussds" },
        ],
    },
    {
        label: "Transactions",
        href: "/dashboard/transaction",
        icon: ArrowRightLeft,
        color: "text-rose-500",
        subItems: [
            { label: "Transferts sortants", href: "/dashboard/transfert/fiats" },
            { label: "Échanges Crypto", href: "/dashboard/transfert/cryptos" },
            { label: "Flux Ecommerce", href: "/dashboard/ecommerces" },
            { label: "Facturation (Billing)", href: "/dashboard/billings" },
        ],
    },
    {
        label: "Paramètres",
        href: "/dashboard/settings",
        icon: Settings,
        color: "text-slate-500",
        subItems: [
            { label: "Gateways", href: "/dashboard/settings/gateway_matrix" },
            { label: "Mon Profil", href: "/dashboard/settings/profile" },
            { label: "Sécurité & Accès", href: "/dashboard/settings/security" },
            { label: "Notifications", href: "/dashboard/settings/notifications" },
        ],
    },
];

export function SidebarApp() {
    const pathname = usePathname();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    useEffect(() => {
        const activeParent = menuItems.find(item =>
            item.subItems?.some(sub => pathname.startsWith(sub.href))
        );
        if (activeParent) setOpenMenuId(activeParent.href);
    }, [pathname]);

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    return (
        <Sidebar collapsible="offcanvas" className="w-72 border-r border-slate-200 bg-slate-50/50">
            {/* HEADER - Agrandissement du titre et de l'icône */}
            <SidebarHeader className="p-6">
                <div className="flex items-center gap-4 px-1">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-100">
                        <Briefcase className="size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-bold text-slate-900 leading-tight">Agensic Pay</span>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Admin Space</span>
                    </div>
                </div>
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent className="px-4 py-2">
                <SidebarGroup>
                    <SidebarMenu className="gap-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const hasSubmenu = !!item.subItems?.length;
                            const isOpen = openMenuId === item.href;
                            const isActive = pathname === item.href || (hasSubmenu && pathname.startsWith(item.href));

                            return (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        render={!hasSubmenu ? <Link href="/dashboard/settings" /> : undefined}
                                        onClick={hasSubmenu ? () => toggleMenu(item.href) : undefined}
                                        className={`
                                            group w-full flex items-center justify-between rounded-xl px-4 py-6 transition-all duration-200
                                            ${isActive
                                            ? "bg-white text-blue-700 shadow-md ring-1 ring-slate-200"
                                            : "text-slate-600 hover:bg-white hover:shadow-sm"}
                                        `}
                                    >
                                        {hasSubmenu ? (
                                            <div className="flex items-center justify-between w-full cursor-pointer">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-blue-50" : "bg-slate-100 group-hover:bg-slate-200/70"}`}>
                                                        <Icon className={`size-5 ${isActive ? "text-blue-600" : item.color}`} />
                                                    </div>
                                                    <span className="font-bold text-[15px]">{item.label}</span>
                                                </div>
                                                <ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : "opacity-40"}`} />
                                            </div>
                                        ) : (
                                            <Link href={item.href} className="flex items-center gap-4">
                                                <div className={`p-2 rounded-lg transition-colors ${isActive ? "bg-blue-600" : "bg-slate-100 group-hover:bg-slate-200/70"}`}>
                                                    <Icon className={`size-5 ${isActive ? "text-white" : item.color}`} />
                                                </div>
                                                <span className="font-bold text-[15px]">{item.label}</span>
                                            </Link>
                                        )}
                                    </SidebarMenuButton>

                                    {/* SOUS-MENU AGRANDI */}
                                    {hasSubmenu && isOpen && (
                                        <SidebarMenuSub className="ml-7 mt-2 border-l-2 border-slate-200 pl-4 space-y-2">
                                            {item.subItems?.map((subItem) => {
                                                const subIsActive = pathname === subItem.href;
                                                return (
                                                    <SidebarMenuSubButton
                                                        key={subItem.href}
                                                        render={
                                                            <Link
                                                                href={subItem.href}
                                                                className={`
                py-2 text-[14px] font-medium transition-all
                ${subIsActive
                                                                    ? "text-blue-600 font-bold translate-x-1"
                                                                    : "text-slate-500 hover:text-slate-900 hover:translate-x-1"}
            `}
                                                            />
                                                        }
                                                    >
                                                        {subItem.label}
                                                    </SidebarMenuSubButton>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    )}
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* FOOTER AGRANDI */}
            <SidebarFooter className="p-6 border-t border-slate-100 bg-white/50">
                <div className="flex items-center gap-4 px-1">
                    <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center ring-4 ring-emerald-50/50">
                        <ShieldCheck className="size-5 text-emerald-600" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">Support Client</span>
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5 uppercase">
                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            Connecté
                        </span>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}