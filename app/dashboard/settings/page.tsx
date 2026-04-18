"use client";

import React from "react";
import Link from "next/link";
import {
    User,
    ShieldCheck,
    Bell,
    ChevronRight,
    Settings,
    Globe,
    CreditCard,
    Briefcase
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {Button} from "../../../components/ui/button";

export default function SettingPage() {
    const settingSections = [
        {
            title: "Profil Personnel",
            description: "Modifiez votre nom, email et votre photo de profil.",
            icon: <User className="size-6 text-blue-600" />,
            href: "/dashboard/settings/profile",
            color: "bg-blue-50"
        },
        {
            title: "Sécurité & Accès",
            description: "Gérez votre mot de passe et la double authentification (2FA).",
            icon: <ShieldCheck className="size-6 text-rose-600" />,
            href: "/dashboard/settings/security",
            color: "bg-rose-50"
        },
        {
            title: "Notifications",
            description: "Configurez vos alertes emails, SMS et push.",
            icon: <Bell className="size-6 text-amber-600" />,
            href: "/dashboard/settings/notifications",
            color: "bg-amber-50"
        },
        {
            title: "Zones & Pays",
            description: "Configurez les pays d'opération et les indicatifs.",
            icon: <Globe className="size-6 text-emerald-600" />,
            href: "/dashboard/countries",
            color: "bg-emerald-50"
        },
        {
            title: "Méthodes de Paiement",
            description: "Gérez les banques et opérateurs mobiles disponibles.",
            icon: <CreditCard className="size-6 text-indigo-600" />,
            href: "/dashboard/settings/payments",
            color: "bg-indigo-50"
        },
        {
            title: "Préférences Système",
            description: "Maintenance du site, mode sombre et logs système.",
            icon: <Settings className="size-6 text-slate-600" />,
            href: "/dashboard/settings/system",
            color: "bg-slate-100"
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-white">
                        <Briefcase className="size-6" />
                    </div>
                    Paramètres Généraux
                </h1>
                <p className="text-muted-foreground">
                    Centralisez la gestion de votre compte et de la plateforme.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {settingSections.map((section, index) => (
                    <Link key={index} href={section.href}>
                        <Card className="h-full border-none shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                                <div className={`p-3 rounded-xl ${section.color}`}>
                                    {section.icon}
                                </div>
                                <ChevronRight className="size-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-lg font-bold mb-2">
                                    {section.title}
                                </CardTitle>
                                <CardDescription className="text-sm leading-relaxed">
                                    {section.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* SECTION INFOS SYSTÈME (Bas de page) */}
            <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <p className="font-bold text-lg">Besoin d'aide technique ?</p>
                    <p className="text-slate-400 text-sm">Consultez la documentation API ou contactez le support technique.</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                        Documentation
                    </Button>
                    <Button className="bg-white text-slate-900 hover:bg-slate-100">
                        Support Live
                    </Button>
                </div>
            </div>
        </div>
    );
}