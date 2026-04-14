// components/layout/user-button.tsx
"use client";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "../ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar";
import React from "react";

export function UserButton() {
    const { data: session } = useSession();

    if (!session?.user) {
        return null;
    }
    const user = session?.user;
    return (
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
                    <Link href="/dashboard/profile">
                        Mon profil
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem>
                    <Link href="/dashboard/settings">
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
    );
}