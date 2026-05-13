"use client";
import {SessionProvider} from "next-auth/react";
import React from "react";
import {SidebarProvider} from "./ui/sidebar";
import {Toaster} from "sonner";

export function Providers({children}: { children: React.ReactNode }) {
    return <SessionProvider>
        <SidebarProvider>
        {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
            />
    </SidebarProvider>
    </SessionProvider>;
}