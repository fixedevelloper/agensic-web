"use client";

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import {
    TrendingUp,
    Users,
    CreditCard,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownLeft,
    Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ici, vous pourriez faire un Promise.all pour appeler vos différents microservices
        // ou appeler une route "aggregator" de votre API Gateway
        const fetchStats = async () => {
            try {
                // Simulation d'agrégation de données
                setStats({
                    revenue: "4,250,000 XAF",
                    activeUsers: 1240,
                    pendingOrders: 12,
                    cryptoVolume: "1.45 BTC",
                    recentActivity: [
                        { id: 1, type: 'order', label: 'Nouvelle commande #ORD-99', status: 'paid', time: 'il y a 2 min' },
                        { id: 2, type: 'tx', label: 'Transfert USDT vers Bénéficiaire', status: 'success', time: 'il y a 15 min' },
                        { id: 3, type: 'payment', label: 'Dépôt BTC reçu', status: 'pending', time: 'il y a 1h' },
                    ]
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="p-6 space-y-8 bg-slate-50/50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, Admin 👋</h1>
                <p className="text-muted-foreground">Voici ce qui se passe sur votre plateforme aujourd'hui.</p>
            </div>

            {/* GRILLE DES KPI */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Chiffre d'affaires"
                    value={stats.revenue}
                    icon={<TrendingUp className="text-emerald-500" />}
                    trend="+12.5% vs mois dernier"
                />
                <StatCard
                    title="Utilisateurs Actifs"
                    value={stats.activeUsers}
                    icon={<Users className="text-blue-500" />}
                    trend="+48 nouveaux inscrits"
                />
                <StatCard
                    title="Commandes en attente"
                    value={stats.pendingOrders}
                    icon={<ShoppingBag className="text-amber-500" />}
                    trend="Nécessite action"
                />
                <StatCard
                    title="Volume Crypto"
                    value={stats.cryptoVolume}
                    icon={<CreditCard className="text-indigo-500" />}
                    trend="0.12 BTC aujourd'hui"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* SECTION ACTIVITÉ RÉCENTE (5/7 colonnes) */}
                <Card className="lg:col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="size-5 text-blue-600" /> Flux d'activité
                        </CardTitle>
                        <CardDescription>Les dernières actions sur tous les services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {stats.recentActivity.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="size-9 rounded-full bg-slate-100 flex items-center justify-center">
                                            {item.type === 'order' ? <ShoppingBag className="size-4" /> : <CreditCard className="size-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.label}</p>
                                            <p className="text-xs text-slate-500">{item.time}</p>
                                        </div>
                                    </div>
                                    <Badge variant="secondary" className="bg-slate-50 text-[10px] uppercase font-bold">
                                        {item.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* SECTION ACTIONS RAPIDES (3/7 colonnes) */}
                <Card className="lg:col-span-3 border-none shadow-sm bg-slate-900 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg text-white">Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <QuickActionButton icon={<ArrowUpRight />} label="Initier un retrait" color="bg-blue-500" />
                        <QuickActionButton icon={<ArrowDownLeft />} label="Vérifier un dépôt" color="bg-emerald-500" />
                        <QuickActionButton icon={<ShoppingBag />} label="Gérer les stocks" color="bg-amber-500" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase">{title}</CardTitle>
                <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-[10px] text-muted-foreground mt-1">{trend}</p>
            </CardContent>
        </Card>
    );
}

function QuickActionButton({ icon, label, color }: any) {
    return (
        <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group">
            <div className={`size-8 rounded-lg ${color} flex items-center justify-center text-white`}>
                {React.cloneElement(icon, { size: 16 })}
            </div>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

function DashboardSkeleton() {
    return (
        <div className="p-6 space-y-8">
            <Skeleton className="h-10 w-1/4" />
            <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
            <div className="grid gap-6 md:grid-cols-7">
                <Skeleton className="md:col-span-4 h-64 w-full" />
                <Skeleton className="md:col-span-3 h-64 w-full" />
            </div>
        </div>
    );
}