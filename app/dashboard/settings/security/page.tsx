"use client";

import React, { useState } from "react";
import {
    ShieldCheck,
    Smartphone,
    Key,
    LogOut,
    History,
    Monitor,
    Lock,
    ChevronRight,
    AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsSecurityPage() {
    const [twoFA, setTwoFA] = useState(false);

    const handle2FAToggle = (checked: boolean) => {
        setTwoFA(checked);
        toast.info(checked ? "Configuration de la 2FA activée" : "2FA désactivée");
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Sécurité</h1>
                <p className="text-muted-foreground text-sm">Protégez votre compte avec des outils d'authentification avancés.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* COLONNE GAUCHE : CONFIGURATION 2FA */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <ShieldCheck className="size-5 text-emerald-600" />
                                        Double Authentification (2FA)
                                    </CardTitle>
                                    <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte.</CardDescription>
                                </div>
                                <Switch checked={twoFA} onCheckedChange={handle2FAToggle} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <Smartphone className="size-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Application d'authentification</p>
                                    <p className="text-xs text-muted-foreground italic">Utilisez Google Authenticator ou Authy pour générer des codes.</p>
                                </div>
                                <ChevronRight className="size-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 opacity-50 cursor-not-allowed">
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                                    <Key className="size-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold">Clé de sécurité physique</p>
                                    <p className="text-xs text-muted-foreground">Utilisez une clé Yubikey ou équivalent (Bientôt disponible).</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* HISTORIQUE DE CONNEXION */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <History className="size-5 text-slate-400" /> Historique de connexion
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                <LoginHistoryItem
                                    device="MacBook Pro - Chrome (Douala, CM)"
                                    status="Actuel"
                                    time="Maintenant"
                                    ip="154.72.164.22"
                                />
                                <LoginHistoryItem
                                    device="iPhone 15 - Safari (Yaoundé, CM)"
                                    status="Inactif"
                                    time="Il y a 2 jours"
                                    ip="41.202.219.10"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* COLONNE DROITE : ALERTES ET SESSIONS */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-rose-50 border border-rose-100">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-rose-800 flex items-center gap-2 uppercase tracking-tighter">
                                <AlertTriangle className="size-4" /> Zone Critique
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-rose-700 leading-relaxed">
                                Si vous soupçonnez une activité inhabituelle, déconnectez toutes les autres sessions actives.
                            </p>
                            <Button variant="destructive" className="w-full text-xs font-bold" size="sm">
                                <LogOut className="mr-2 size-3" /> Déconnecter tout
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Sessions Actives</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Monitor className="size-4 text-slate-400" />
                                    <span className="text-xs font-medium">Desktop (Chrome)</span>
                                </div>
                                <Badge className="bg-emerald-100 text-emerald-700 text-[10px] border-none">Actif</Badge>
                            </div>
                            <Separator />
                            <p className="text-[10px] text-muted-foreground italic text-center">
                                Votre compte est actuellement utilisé sur 1 seul appareil.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function LoginHistoryItem({ device, status, time, ip }: any) {
    return (
        <div className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
            <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">{device}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span>IP: {ip}</span>
                    <span>•</span>
                    <span>{time}</span>
                </div>
            </div>
            {status === "Actuel" ? (
                <Badge variant="outline" className="text-blue-600 border-blue-100 bg-blue-50 text-[10px]">Session actuelle</Badge>
            ) : (
                <Button variant="ghost" size="sm" className="text-xs h-7 opacity-0 group-hover:opacity-100">Révoquer</Button>
            )}
        </div>
    );
}