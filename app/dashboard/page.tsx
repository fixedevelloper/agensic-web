"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    TrendingUp, DollarSign, Users, FileText, Shield, Clock,
    Activity, BarChart3, Receipt, Zap, Award, MapPin
} from "lucide-react";

export default function DashboardPage() {
    const { data: session } = useSession();

    // Mock data (remplacez par SWR/API)
    const [stats, setStats] = useState({
        totalTransactions: 1247,
        revenueToday: 2850000,
        activeUsers: 89,
        successRate: 98.7
    });
    const [recentActivities, setRecentActivities] = useState([
        { id: 1, type: "canal", amount: 5500, user: "Jean M.", time: "2min", status: "success" },
        { id: 2, type: "momo", amount: 25000, user: "Marie K.", time: "5min", status: "pending" },
        { id: 3, type: "eneo", amount: 12000, user: "Paul T.", time: "12min", status: "success" }
    ]);

    useEffect(() => {
        // Polling toutes les 30s
        const interval = setInterval(() => {
            setStats(prev => ({
                totalTransactions: prev.totalTransactions + Math.floor(Math.random() * 5),
                revenueToday: prev.revenueToday + Math.floor(Math.random() * 50000),
                activeUsers: 85 + Math.floor(Math.random() * 10),
                successRate: Number((97 + Math.random() * 3).toFixed(1))
            }));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatXAF = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/50 p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-slate-800 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-xl text-slate-600 mt-2">
                            {formatXAF(stats.revenueToday)} générés aujourd'hui • {stats.activeUsers} utilisateurs actifs
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all">
                            Nouveau paiement
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                                <DollarSign className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">{formatXAF(stats.revenueToday)}</p>
                                <p className="text-sm text-slate-500 mt-1">Aujourd'hui</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">+12.4%</span>
                        </div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2">
                        <div className="flex items-center justify-between">
                            <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
                                <Activity className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">{stats.totalTransactions.toLocaleString()}</p>
                                <p className="text-sm text-slate-500 mt-1">Transactions</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">+28%</span>
                        </div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2">
                        <div className="flex items-center justify-between">
                            <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl">
                                <Users className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">{stats.activeUsers}</p>
                                <p className="text-sm text-slate-500 mt-1">Actifs</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-blue-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">+5</span>
                        </div>
                    </div>

                    <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl hover:-translate-y-2">
                        <div className="flex items-center justify-between">
                            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl">
                                <Shield className="w-8 h-8 text-white" />
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">{stats.successRate}%</p>
                                <p className="text-sm text-slate-500 mt-1">Succès</p>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-emerald-600">
                            <TrendingUp className="w-4 h-4" />
                            <span className="font-semibold">+0.8%</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activities */}
                    <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900">
                            <Activity className="w-7 h-7" />
                            Activités Récentes
                        </h2>
                        <div className="space-y-4">
                            {recentActivities.map(activity => (
                                <div key={activity.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl hover:shadow-md transition-all">
                                    <div className={`p-3 rounded-2xl ${
                                        activity.type === 'canal' ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                                            activity.type === 'momo' ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                                                'bg-gradient-to-r from-orange-500 to-red-600'
                                    }`}>
                                        <Zap className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">
                                            Réab. {activity.type.toUpperCase()} • {activity.user}
                                        </p>
                                        <p className="text-sm text-slate-500">{formatXAF(activity.amount)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-700 font-medium">
                                            {activity.time}
                                        </span>
                                        <div className={`w-3 h-3 rounded-full ${
                                            activity.status === 'success' ? 'bg-emerald-500' : 'bg-orange-500 animate-pulse'
                                        }`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl">
                            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900">
                                <BarChart3 className="w-5 h-5" />
                                Par Service
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span>Canal+</span>
                                    <span className="font-semibold text-emerald-600">67% (834)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>MTN MoMo</span>
                                    <span className="font-semibold text-blue-600">22% (274)</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Eneo</span>
                                    <span className="font-semibold text-orange-600">11% (139)</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-6 rounded-3xl shadow-2xl">
                            <div className="flex items-center gap-3">
                                <Award className="w-12 h-12" />
                                <div>
                                    <p className="font-bold text-xl">Pro Partner</p>
                                    <p className="text-emerald-100">Canal+ Agréé</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}