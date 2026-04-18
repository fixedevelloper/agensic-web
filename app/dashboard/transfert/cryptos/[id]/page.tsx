"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft, Copy, ExternalLink, ArrowRight,
    User, Wallet, Zap, ShieldCheck, Globe, Clock
} from "lucide-react";

export default function TransactionDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [tx, setTx] = useState<any>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_CRYPTO_SERVICE_URL}/api/transactions/${id}`);
                const json = await res.json();
                setTx(json.data);
            } catch (error) {
                toast.error("Erreur de récupération");
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id]);

    const copy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copié !");
    };

    if (loading) return <div className="p-10"><Skeleton className="h-96 w-full" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ChevronLeft className="size-4" /> Retour au flux
                </Button>
                {tx?.crypto?.explorer_url && (
                    <Button variant="outline">
                        <a href={tx?.crypto?.explorer_url} target="_blank">
                            <ExternalLink className="size-4 mr-2" /> Blockchain Explorer
                        </a>
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* BLOC PRINCIPAL : CALCUL ET STATUS */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className="h-1.5 w-full" style={{ backgroundColor: tx.status.color }} />
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardDescription>Référence UUID</CardDescription>
                                    <CardTitle className="font-mono text-lg">{tx.reference}</CardTitle>
                                </div>
                                <Badge style={{ backgroundColor: `${tx.status.color}20`, color: tx.status.color }} className="border-none px-4 py-1">
                                    {tx.status.label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Visualisation du Change */}
                            <div className="flex items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Montant Reçu</p>
                                    <p className="text-2xl font-black text-slate-900">{tx.fiat.display}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <Badge variant="secondary" className="mb-2 text-[10px]">Taux: {tx.fiat.rate}</Badge>
                                    <ArrowRight className="size-6 text-slate-300" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] uppercase font-bold text-slate-400">Montant Envoyé</p>
                                    <p className="text-2xl font-black text-orange-600">{tx.crypto.total_sent} {tx.crypto.symbol}</p>
                                </div>
                            </div>

                            {/* Détails Blockchain */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DetailItem label="Réseau Blockchain" value={tx.crypto.network} icon={<Globe className="size-4" />} />
                                <DetailItem label="Frais de réseau" value={`${tx.crypto.fee} ${tx.crypto.symbol}`} icon={<Zap className="size-4" />} />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Adresse du bénéficiaire</p>
                                <div className="flex items-center justify-between bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-sm">
                                    <span className="truncate mr-4">{tx.crypto.recipient}</span>
                                    <Button size="icon" variant="ghost" onClick={() => copy(tx.crypto.recipient)} className="size-8 hover:bg-slate-800">
                                        <Copy className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* LOGS / PROOF */}
                    {tx.crypto.tx_hash && (
                        <Card className="border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm">Preuve de hachage (TXID)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-mono text-xs break-all bg-slate-50 p-4 rounded border border-dashed border-slate-200 text-slate-500">
                                    {tx.tx_hash}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* SIDEBAR : CLIENT & BENEFICIAIRE */}
                <div className="space-y-6">
                    {/* Carte Utilisateur (Microservice) */}
                    <Card className="border-none shadow-sm bg-blue-600 text-white">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <User className="size-4" /> Émetteur
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-lg font-bold">{tx.user?.name || "Chargement..."}</span>
                                <span className="text-xs opacity-70">{tx.user?.email || "ID: " + tx.user?.id}</span>
                            </div>
                            <Separator className="opacity-20" />
                            <div className="flex justify-between text-xs">
                                <span>Solde Client</span>
                                <span className="font-bold">Voir Profil</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Carte Bénéficiaire */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                                <ShieldCheck className="size-4 text-emerald-500" /> Bénéficiaire
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-slate-50 p-3 rounded-lg">
                                <p className="text-xs text-slate-500 italic">Enregistré sous :</p>
                                <p className="font-bold text-slate-700">{tx.beneficiary?.name || "Bénéficiaire Unique"}</p>
                                <p className="text-xs font-medium text-slate-400">{tx.beneficiary?.phone}</p>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                <Clock className="size-3" /> Traité le {tx.processed_at}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value, icon }: any) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-white">
            <div className="p-2 bg-slate-50 rounded-lg text-slate-500">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
        </div>
    );
}