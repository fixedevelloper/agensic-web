"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Avatar, AvatarFallback, AvatarImage
} from "@/components/ui/avatar";
import {
    Home, Package, Settings, Bell
} from "lucide-react";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/customer", label: "Accueil", icon: Home },
    { href: "/customer/shops", label: "Mes boutiques", icon: Package },
    { href: "/customer/settings", label: "Paramètres", icon: Settings },
];

export function HeaderCustomer() {
    const { data: session } = useSession();
    const user = session?.user;
    const pathname = usePathname();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="h-16 border-b bg-white/90 backdrop-blur-xl shadow-sm sticky top-0 z-50">

            <div className="flex h-full items-center justify-between px-4 lg:px-6 max-w-7xl mx-auto">

                {/* LEFT */}
                <div className="flex items-center min-w-0">

                    {/* Logo */}
                    <Link
                        href="/customer"
                        className="flex items-center space-x-2 shrink-0"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>

                        {/* hide text on small screens */}
                        <span className="hidden sm:block font-bold text-lg truncate">
                            PayLink
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex ml-8 items-center space-x-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                                        isActive(item.href)
                                            ? "text-emerald-600 bg-emerald-50"
                                            : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/50"
                                    }`}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">

                    {/* Notifications - hide label overflow safe */}
                    <button className="relative p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                            3
                        </span>
                    </button>

                    {/* USER */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <button className="flex items-center gap-2 p-1 sm:p-2 rounded-xl hover:bg-slate-100 transition min-w-0">

                                <Avatar className="h-9 w-9 shrink-0">
                                    <AvatarImage src={user?.image || ""} />
                                    <AvatarFallback className="bg-emerald-600 text-white text-sm">
                                        {user?.name?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                {/* name hidden on mobile */}
                                <div className="hidden sm:block min-w-0">
                                    <p className="text-sm font-semibold truncate max-w-[120px]">
                                        {user?.name || "Client"}
                                    </p>
                                </div>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            align="end"
                            className="w-56 p-2 rounded-xl"
                        >
                            <div className="px-3 py-2 border-b mb-2">
                                <p className="font-semibold truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>

                            <DropdownMenuItem>
                                <Link href="/customer/profile">
                                    Mon profil
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem>
                                <Link href="/customer/settings">
                                    Paramètres
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                            >
                                Se déconnecter
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    );
}