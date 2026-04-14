"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
    Package,
    DollarSign,
    TrendingUp,
    ShieldCheck,
    Receipt,
    Clock,
    Award,
    Zap,
    MapPin,
} from "lucide-react";
import {Country} from "../types/type";

export default function DashboardCustomerPage() {
    const { data: session } = useSession();
    const user = session?.user;

    const [stats, setStats] = useState<any>(null);
    const [recentPayments, setRecentPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);
    const baseUrl = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL;
    const baseUrl_user_service = process.env.NEXT_PUBLIC_API_USER_SERVICE_URL;

    if (!baseUrl) {
        throw new Error("API URL non définie");
    }
    const formatXAF = (amount: number) =>
        new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XAF",
            minimumFractionDigits: 0,
        }).format(amount || 0);

    // FETCH DATA
    useEffect(() => {
        // 1. Définition des fonctions de chargement
        const loadDashboardData = async (uId: string) => {
            try {
                setLoading(true);
                const res = await fetch(`${baseUrl}/api/customer/dashboard`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Id": uId, // Ici, uId est forcément une string
                    },
                });

                if (!res.ok) throw new Error("Erreur dashboard");

                const data = await res.json();
                setStats(data.stats);
                setRecentPayments(data.recent);
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        const loadCountries = async () => {
            try {
                const res = await fetch(`${baseUrl_user_service}/api/countries`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();
                setCountries(data.data);
            } catch (error) {
                console.error("Countries Error:", error);
            }
        };

        // 2. Exécution logique
        loadCountries(); // Indépendant de l'utilisateur

        const userId = session?.user?.id;
        if (userId) {
            loadDashboardData(String(userId));
        }

    }, [session, baseUrl, baseUrl_user_service]); // Dépendances importantes

    if (loading || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse text-emerald-600 font-semibold">
                    Chargement...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="max-w-7xl mx-auto">

                {/* WELCOME */}
                <div className="text-center lg:text-left mb-12">
                    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-xl mb-6">

                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Package className="w-8 h-8 text-white" />
                        </div>

                        <div>
                            <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
                                Bonjour {user?.name?.split(" ")[0] || "Client"} !
                            </h1>

                            <p className="text-lg text-slate-600 mt-2">
                                Vos commissions :{" "}
                                <span className="font-bold text-2xl text-emerald-600">
                                    {formatXAF(stats.commissions)}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

                    {/* PAYMENTS */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">
                                    {stats.totalPayments}
                                </p>
                                <p className="text-sm text-slate-500">Paiements</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">+3 aujourd'hui</span>
                        </div>
                    </div>

                    {/* SUCCESS */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">
                                    {stats.successRate}%
                                </p>
                                <p className="text-sm text-slate-500">Succès</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">Stable</span>
                        </div>
                    </div>

                    {/* LAST PAYMENT */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl">
                                <Receipt className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-slate-900">
                                    {formatXAF(stats.lastPayment)}
                                </p>
                                <p className="text-sm text-slate-500">Dernier paiement</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span className="font-semibold">Récemment</span>
                        </div>
                    </div>

                    {/* ACTION */}
                    <Link
                        href="/customer/shop/create"
                        className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <Award className="w-12 h-12" />
                            <div>
                                <p className="font-bold text-xl">Ajouter une boutique</p>
                                <p className="text-emerald-100 text-sm">Commencer maintenant</p>
                            </div>
                        </div>
                    </Link>

                </div>

                {/* RECENT PAYMENTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    <div className="lg:col-span-2 bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                            <Receipt className="w-7 h-7" />
                            Derniers paiements
                        </h2>

                        <div className="space-y-4">

                            {recentPayments?.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">

                                    <div className="p-4 bg-emerald-100 rounded-2xl mb-4">
                                        <Zap className="w-6 h-6 text-emerald-600" />
                                    </div>

                                    <p className="font-semibold text-slate-700">
                                        Aucun paiement pour le moment
                                    </p>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Vos transactions apparaîtront ici dès qu’elles seront effectuées.
                                    </p>

                                </div>
                            ) : (
                                recentPayments?.map((payment: any) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center gap-4 p-6 bg-gradient-to-r from-slate-50 to-emerald-50/30 rounded-2xl border border-slate-200/50"
                                    >
                                        <div className="p-3 bg-emerald-500 rounded-2xl">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-900 truncate">
                                                {payment.service}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatXAF(payment.amount)}
                                            </p>
                                        </div>

                                        <div className="text-xs text-slate-500">
                                            {payment.date}
                                        </div>
                                    </div>
                                ))
                            )}

                        </div>
                    </div>

                    {/* COUNTRIES */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-200 scrollbar-track-transparent">

                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900">
                            <MapPin className="w-5 h-5" />
                            Pays actifs
                        </h3>

                        <div className="space-y-3">

                            {countries?.map((country: Country) => (
                                <div
                                    key={country.id}
                                    className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl"
                                >

                                    {/* LEFT: flag + name */}
                                    <div className="flex items-center gap-3 min-w-0">

                                        <img
                                            src={country.flag_url}
                                            alt={country.name}
                                            className="w-6 h-6 rounded-full object-cover shadow-sm"
                                        />

                                        <span className="truncate">
                        {country.name}
                    </span>
                                    </div>

                                    {/* RIGHT: status */}
                                    <span className="font-bold text-emerald-700 text-sm">
                    Actif
                </span>

                                </div>
                            ))}

                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}