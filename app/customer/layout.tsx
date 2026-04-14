import React from "react";

import type { Metadata } from "next";
import {HeaderCustomer} from "../../components/layout/customer/header-customer";
import {BottomNavCustomer} from "../../components/layout/customer/BottomNavCustomer";

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

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen  w-full pb-16 md:pb-0">

            <HeaderCustomer />

            <main>{children}</main>

            <BottomNavCustomer />

        </div>
    );
}