"use client";
import {SessionProvider} from "next-auth/react";
import React from "react";
import {SidebarProvider} from "./ui/sidebar";

export function Providers({children}: { children: React.ReactNode }) {
    return <SessionProvider>
        <SidebarProvider>
        {children}
    </SidebarProvider>
    </SessionProvider>;
}