"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function HomePage() {

    const whatsappNumber = "237657285050"; // 👉 remplace par ton numéro
    const message = encodeURIComponent("Bonjour, je souhaite en savoir plus sur votre plateforme de paiement.");

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#B93E1E] via-[#d65a3a] to-[#f4a261] p-6">

            <div className="w-full max-w-xl text-center space-y-6">

                {/* 🔥 CARD GLASS */}
                <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 space-y-6">

                    {/* 🧠 LOGO / TITLE */}
                    <h1 className="text-3xl md:text-4xl font-bold text-white">
                        🚀 Coming Soon
                    </h1>

                    <p className="text-white/90 text-sm md:text-base">
                        Une nouvelle expérience de paiement arrive bientôt.
                        <br />
                        Rapide, sécurisée et adaptée à l’Afrique.
                    </p>

                    {/* ⏳ SUBTEXT */}
                    <p className="text-white/70 text-xs">
                        Restez connecté pour être parmi les premiers utilisateurs.
                    </p>

                    {/* 📱 WHATSAPP CTA */}
                    <Button
                        onClick={() => window.open(whatsappLink, "_blank")}
                        className="w-full h-12 text-base font-semibold bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2"
                    >
                        <MessageCircle size={18} />
                        Nous contacter sur WhatsApp
                    </Button>

                </div>

                {/* 🧾 FOOTER */}
                <p className="text-white/70 text-xs">
                    © {new Date().getFullYear()} - Tous droits réservés
                </p>

            </div>
        </div>
    );
}