import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Plateforme de paiement - Afrique",
    description: "Créez et partagez des liens de paiement facilement en Afrique. Rapide, sécurisé et fiable.",
    keywords: ["paiement", "Afrique", "mobile money", "fintech", "paiement en ligne"],
    authors: [{ name: "R.MBAH" }],

    openGraph: {
        title: "Plateforme de paiement",
        description: "Envoyez et recevez des paiements facilement",
        url: "https://agensic.com",
        siteName: "agensic solution",
        images: [
            {
                url: "https://agensic.com/og-image.png",
                width: 1200,
                height: 630,
            },
        ],
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "Plateforme de paiement",
        description: "Paiement simple et rapide",
        images: ["https://agensic.com/og-image.png"],
    },
};

export default function FrontendLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}