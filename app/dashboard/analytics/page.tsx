"use client";

import React, { useState } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from "recharts";
import {
    TrendingUp, Users, ShoppingCart, Wallet,
    ArrowUpRight, ArrowDownRight, Calendar
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Données fictives pour l'exemple
const revenueData = [
    { name: "Jan", total: 4500 },
    { name: "Fév", total: 5200 },
    { name: "Mar", total: 4800 },
    { name: "Avr", total: 6100 },
    { name: "Mai", total: 5900 },
    { name: "Juin", total: 7200 },
];

const categoryData = [
    { name: "Crypto", value: 400, color: "#4f46e5" },
    { name: "E-commerce", value: 300, color: "#10b981" },
    { name: "Services", value: 200, color: "#f59e0b" },
];

export default function AnalyticsPage() {
    return (
        <div className="p-6 space-y-8 bg-slate-50/30 min-h-screen">
            {/* ENTÊTE AVEC FILTRE TEMPOREL */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Analytique</h1>
                    <p className="text-muted-foreground">Performances globales de l'écosystème en temps réel.</p>
                </div>
                <Select defaultValue="7d">
                    <SelectTrigger className="w-[180px] bg-white">
                        <Calendar className="mr-2 size-4" />
                        <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="24h">Dernières 24h</SelectItem>
                        <SelectItem value="7d">7 derniers jours</SelectItem>
                        <SelectItem value="30d">30 derniers jours</SelectItem>
                        <SelectItem value="90d">Dernier trimestre</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* CARTES DE RÉSUMÉ (KPIs) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Volume Total" value="12,450,000 XAF" trend="+14%" up={true} icon={<Wallet />} />
                <KpiCard title="Nouvelles Commandes" value="156" trend="+8%" up={true} icon={<ShoppingCart />} />
                <KpiCard title="Utilisateurs" value="2,840" trend="-2%" up={false} icon={<Users />} />
                <KpiCard title="Taux de Conversion" value="3.2%" trend="+0.4%" up={true} icon={<TrendingUp />} />
            </div>

            <Tabs defaultValue="revenue" className="space-y-6">
                <TabsList className="bg-white border">
                    <TabsTrigger value="revenue">Revenus & Flux</TabsTrigger>
                    <TabsTrigger value="users">Activité Utilisateurs</TabsTrigger>
                </TabsList>

                <TabsContent value="revenue" className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* GRAPHIQUE LINÉAIRE (AIRE) */}
                        <Card className="lg:col-span-2 border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Croissance des revenus (XAF)</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] pl-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <defs>
                                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* GRAPHIQUE EN CAMEMBERT */}
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold uppercase text-slate-500">Répartition par Service</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={categoryData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2 w-full mt-4">
                                    {categoryData.map((item) => (
                                        <div key={item.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                                                <span className="text-slate-600">{item.name}</span>
                                            </div>
                                            <span className="font-bold">{item.value}M</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// --- COMPOSANTS INTERNES ---

function KpiCard({ title, value, trend, up, icon }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase">{title}</CardTitle>
                <div className="p-2 bg-slate-50 rounded-md text-slate-600">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-black text-slate-900">{value}</div>
                <div className={`flex items-center mt-1 text-xs font-bold ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {up ? <ArrowUpRight className="size-3 mr-1" /> : <ArrowDownRight className="size-3 mr-1" />}
                    {trend}
                    <span className="text-slate-400 font-normal ml-1">vs mois dernier</span>
                </div>
            </CardContent>
        </Card>
    );
}