"use client";

import React, { useState } from "react";
import {
    Bell,
    Mail,
    Smartphone,
    MessageSquare,
    ShieldAlert,
    ShoppingCart,
    Wallet,
    Save,
    Loader2
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsNotificationsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        // Simulation d'enregistrement
        await new Promise(r => setTimeout(r, 1000));
        setLoading(false);
        toast.success("Préférences de notification enregistrées");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Notifications</h1>
                <p className="text-muted-foreground text-sm">Choisissez comment et quand vous souhaitez être informé des activités.</p>
            </div>

            <div className="space-y-6">

                {/* CANAUX DE RÉCEPTION */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Bell className="size-5 text-indigo-600" /> Canaux de communication
                        </CardTitle>
                        <CardDescription>Définissez vos canaux de réception par défaut.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <NotificationToggle
                            icon={<Mail className="size-4" />}
                            title="Emails"
                            description="Recevoir des rapports et alertes par email."
                            defaultChecked
                        />
                        <Separator />
                        <NotificationToggle
                            icon={<Smartphone className="size-4" />}
                            title="Notifications Push"
                            description="Alertes en temps réel sur votre navigateur ou mobile."
                        />
                        <Separator />
                        <NotificationToggle
                            icon={<MessageSquare className="size-4" />}
                            title="SMS / WhatsApp"
                            description="Pour les alertes critiques uniquement."
                        />
                    </CardContent>
                </Card>

                {/* ÉVÉNEMENTS SPÉCIFIQUES */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldAlert className="size-5 text-rose-600" /> Alertes d'activité
                        </CardTitle>
                        <CardDescription>Choisissez les événements qui déclenchent une notification.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Transactions & Finance</h3>
                            <NotificationToggle
                                icon={<Wallet className="size-4 text-emerald-600" />}
                                title="Nouveaux dépôts"
                                description="Être notifié dès qu'un dépôt crypto est confirmé."
                                defaultChecked
                            />
                            <NotificationToggle
                                icon={<Wallet className="size-4 text-blue-600" />}
                                title="Demandes de retrait"
                                description="Alerte pour validation immédiate des retraits."
                                defaultChecked
                            />
                        </div>

                        <Separator />

                        <div className="space-y-4">
                            <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">E-commerce</h3>
                            <NotificationToggle
                                icon={<ShoppingCart className="size-4 text-indigo-600" />}
                                title="Nouvelles commandes"
                                description="Notification pour chaque vente réalisée."
                                defaultChecked
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* BOUTON SAUVEGARDE */}
                <div className="flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 min-w-[180px]"
                    >
                        {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                        Enregistrer
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Composant réutilisable pour les lignes de toggle
function NotificationToggle({ icon, title, description, defaultChecked = false }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-start gap-3">
                <div className="mt-1 p-2 rounded-md bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {icon}
                </div>
                <div className="space-y-0.5">
                    <p className="text-sm font-bold text-slate-800">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            <Switch defaultChecked={defaultChecked} />
        </div>
    );
}