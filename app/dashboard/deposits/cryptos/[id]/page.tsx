"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    Copy,
    ExternalLink,
    Clock,
    CheckCircle2,
    AlertCircle,
    User,
    Hash,
    ArrowRightLeft
} from "lucide-react";

export default function PaymentDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [payment, setPayment] = useState<any>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_CRYPTO_SERVICE_URL;

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/payments/${id}`);
                if (!res.ok) throw new Error();
                const json = await res.json();
                setPayment(json.data);
            } catch (error) {
                toast.error("Impossible de récupérer les détails du paiement");
                router.push("/dashboard/deposits/crypto");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, baseUrl, router]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié dans le presse-papier");
    };

    if (loading) return <DetailSkeleton />;

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Navigation & Actions Rapides */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ChevronLeft className="size-4" /> Retour
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                        <Hash className="size-4 mr-2" /> Vérifier sur Explorer
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Colonne Gauche : Statut et Montants */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="border-none shadow-md overflow-hidden">
                        <div className="h-2 w-full" style={{ backgroundColor: payment.status.color }} />
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardDescription>Référence de transaction</CardDescription>
                                    <CardTitle className="text-2xl font-mono">{payment.reference}</CardTitle>
                                </div>
                                <Badge
                                    style={{ backgroundColor: `${payment.status.color}20`, color: payment.status.color }}
                                    className="px-4 py-1.5 text-sm font-bold border-none"
                                >
                                    {payment.status.label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-8 py-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500 font-medium">Montant Fiat</p>
                                    <p className="text-3xl font-bold text-slate-900">{payment.fiat.display}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500 font-medium">Montant Crypto</p>
                                    <p className="text-3xl font-bold text-orange-600">{payment.crypto.display}</p>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Date de création</span>
                                    <span className="font-semibold">{payment.created_at}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Date de traitement</span>
                                    <span className="font-semibold">{payment.processed_at || "En attente..."}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Détails Blockchain */}
                    <Card className="border-none shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ArrowRightLeft className="size-5 text-blue-500" />
                                Détails du transfert
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Adresse de dépôt (Destination)</label>
                                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <code className="flex-1 text-sm font-mono break-all text-slate-700">{payment.crypto.pay_address}</code>
                                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(payment.crypto.pay_address)}>
                                        <Copy className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Adresse de réception client</label>
                                <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <code className="flex-1 text-sm font-mono break-all text-slate-700">{payment.crypto.recipient}</code>
                                    <Button size="icon" variant="ghost" onClick={() => copyToClipboard(payment.crypto.recipient)}>
                                        <Copy className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Colonne Droite : Utilisateur & Metadata */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-5 text-blue-400" />
                                Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                                    <User className="size-6" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-bold truncate">{payment.user?.name || "N/A"}</p>
                                    <p className="text-xs text-slate-400 truncate">{payment.user?.email || "ID: " + payment.user?.id}</p>
                                </div>
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="text-[11px] text-slate-400">
                                <p>Données synchronisées depuis le Microservice Utilisateurs.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-400">Time-line</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <TimelineItem
                                icon={<Clock className="size-3" />}
                                title="Initialisation"
                                date={payment.created_at}
                                completed
                            />
                            <TimelineItem
                                icon={<ArrowRightLeft className="size-3" />}
                                title="Attente Blockchain"
                                date={payment.status.value === 'waiting' ? "En cours..." : "-"}
                                active={payment.status.value === 'waiting'}
                                completed={payment.status.value !== 'waiting'}
                            />
                            <TimelineItem
                                icon={<CheckCircle2 className="size-3" />}
                                title="Finalisation"
                                date={payment.processed_at || "-"}
                                completed={payment.is_finalized}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ icon, title, date, completed, active }: any) {
    return (
        <div className="flex gap-3">
            <div className="flex flex-col items-center">
                <div className={`size-6 rounded-full flex items-center justify-center border-2 ${
                    completed ? "bg-emerald-500 border-emerald-500 text-white" :
                        active ? "border-blue-500 text-blue-500 animate-pulse" : "border-slate-200 text-slate-300"
                }`}>
                    {icon}
                </div>
                <div className="w-[2px] h-full bg-slate-100 min-h-[20px] mt-1" />
            </div>
            <div className="pb-4">
                <p className={`text-sm font-bold ${completed ? "text-slate-900" : "text-slate-400"}`}>{title}</p>
                <p className="text-[10px] text-slate-500">{date}</p>
            </div>
        </div>
    );
}

function DetailSkeleton() {
    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Skeleton className="h-10 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-[250px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-[150px] w-full" />
                    <Skeleton className="h-[200px] w-full" />
                </div>
            </div>
        </div>
    );
}