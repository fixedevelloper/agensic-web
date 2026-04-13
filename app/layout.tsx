import { Providers } from "@/components/providers";
import React from "react";
import "./globals.css"; // ← c’est ici qu’on importe le CSS global

export default function RootLayout({
                                       children,
                                   }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}