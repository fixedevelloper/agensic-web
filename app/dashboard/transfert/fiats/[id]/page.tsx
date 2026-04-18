"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ChevronLeft,
    Copy,
    ArrowRight,
    Calendar,
    Fingerprint,
    User,
    Wallet,
    BookText,
    Info
} from "lucide-react";

export default function TransactionDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [tx, setTx] = useState<any>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL}/api/transactions/${id}`);
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
        toast.success("Référence copiée !");
    };

    if (loading) return <div className="p-10 space-y-4"><Skeleton className="h-12 w-1/4" /><Skeleton className="h-96 w-full" /></div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                    <ChevronLeft className="size-4" /> Retour
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                        Imprimer le reçu
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Colonne Gauche: Détails Financiers */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Référence Transaction</p>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="font-mono text-xl">{tx.reference}</CardTitle>
                                    <Button variant="ghost" size="icon" className="size-8" onClick={() => copy(tx.reference)}>
                                        <Copy className="size-3" />
                                    </Button>
                                </div>
                            </div>
                            <Badge
                                style={{ backgroundColor: `${tx.status.color}20`, color: tx.status.color }}
                                className="px-4 py-1 border-none text-sm font-bold"
                            >
                                {tx.status.label}
                            </Badge>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-8 pb-10">
                            <div className="flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-4 bg-slate-50 rounded-full">
                                    <ArrowRightLeft className="size-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-4xl font-black text-slate-900">{tx.financials.display}</p>
                                    <p className="text-sm text-muted-foreground mt-1">Nature de l'opération : <span className="font-bold">{tx.financials.type}</span></p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Parties Impliquées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PartyCard title="Émetteur (Source)" party={tx.parties.sender} icon={<Wallet className="text-blue-500" />} />
                        <PartyCard title="Bénéficiaire (Cible)" party={tx.parties.beneficiary} icon={<User className="text-emerald-500" />} />
                    </div>

                    {/* Note additionnelle */}
                    {tx.meta.note && (
                        <Card className="border-none shadow-sm bg-amber-50/50 border border-amber-100">
                            <CardContent className="p-4 flex gap-3">
                                <Info className="size-5 text-amber-500 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-amber-800 uppercase">Note / Motif</p>
                                    <p className="text-sm text-amber-900 mt-1 italic">"{tx.meta.note}"</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar: Metadata & Audit */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Audit & Dates</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <MetaItem icon={<Calendar className="size-3.5" />} label="Date de création" value={tx.dates.created_at} />
                            <MetaItem icon={<Calendar className="size-3.5" />} label="Dernière mise à jour" value={tx.dates.updated_at} />
                            <MetaItem icon={<Fingerprint className="size-3.5" />} label="Initié par" value={tx.meta.initiated_by || "Système"} />
                            <Separator />
                            <div className="pt-2 flex items-center justify-between">
                                <span className="text-xs font-medium text-muted-foreground">Écritures comptables</span>
                                {tx.meta.has_ledger ? (
                                    <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100 gap-1">
                                        <BookText className="size-3" /> Présentes
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-slate-400 bg-slate-50">Aucune</Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action destructive / Correction */}
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 space-y-3">
                        <p className="text-xs font-bold text-rose-800">Zone d'administration</p>
                        <p className="text-[11px] text-rose-600">En cas d'erreur sur cette transaction, veuillez contacter le responsable financier avant toute modification manuelle.</p>
                        <Button variant="destructive" size="sm" className="w-full text-xs" disabled>
                            Annuler la transaction
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PartyCard({ title, party, icon }: any) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                    {icon} {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {party ? (
                    <div className="space-y-1">
                        <p className="font-bold text-slate-800">{party.name}</p>
                        <p className="text-xs text-slate-500">{party.phone || party.email || 'Pas de contact'}</p>
                    </div>
                ) : (
                    <p className="text-sm italic text-slate-400">Non renseigné</p>
                )}
            </CardContent>
        </Card>
    );
}

function MetaItem({ icon, label, value }: any) {
    return (
        <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2 text-slate-500">
                {icon}
                <span className="text-xs">{label}</span>
            </div>
            <span className="text-xs font-semibold text-slate-700">{value}</span>
        </div>
    );
}

function ArrowRightLeft(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>
        </svg>
    );
}