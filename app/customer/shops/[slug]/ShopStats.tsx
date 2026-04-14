"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {DollarSign, Users, Package, TrendingUp, BarChart3} from "lucide-react";
import {StatsSkeleton} from "./page";

interface Stats {
    revenue: number;
    orders: number;
    products: number;
    conversion: number;
}

export default function ShopStats({ slug }: { slug: string }) {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/shops/${slug}/stats`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [slug]);

    const formatXAF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF' }).format(amount);

    if (loading || !stats) return <StatsSkeleton />;

    return (
        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0 col-span-1 lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <BarChart3 className="w-6 h-6" />
                    Statistiques
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 bg-gradient-to-b from-emerald-50 to-green-50 rounded-2xl border border-emerald-200">
                        <DollarSign className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                        <div className="text-3xl font-black text-emerald-800">{formatXAF(stats.revenue)}</div>
                        <div className="text-sm text-emerald-700 font-semibold">Chiffre d'affaires</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-b from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                        <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                        <div className="text-3xl font-black text-blue-800">{stats.orders}</div>
                        <div className="text-sm text-blue-700 font-semibold">Commandes</div>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-b from-purple-50 to-violet-50 rounded-2xl border border-purple-200 col-span-2">
                        <Package className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <div className="text-3xl font-black text-purple-800">{stats.products}</div>
                        <div className="text-sm text-purple-700 font-semibold">Produits</div>
                        <div className="text-2xl font-bold text-emerald-600 mt-2">
                            {stats.conversion}% conversion
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}