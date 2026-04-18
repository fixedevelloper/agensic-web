"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Search,
    ArrowRightLeft,
    User,
    ArrowRight,
    MoreHorizontal,
    Download,
    Filter
} from "lucide-react";
import Link from "next/link";
import {TransactionFiat} from "../../../types/type";

export default function TransactionsPage() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionFiat[]>([]);
    const [search, setSearch] = useState("");

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            // Remplacez par votre URL d'API réelle
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL}/api/transactions?search=${search}`);
            const json = await res.json();
            setTransactions(json.data || []);
        } catch (e) {
            toast.error("Erreur lors de la récupération des transactions");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timer = setTimeout(fetchTransactions, 500);
        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    return (
        <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
            {/* EN-TÊTE DE PAGE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Journal des Transactions</h1>
                    <p className="text-muted-foreground text-sm">Suivi des mouvements financiers entre comptes.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="size-4 mr-2" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* BARRE DE FILTRES */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        placeholder="Rechercher une référence ou une note..."
                        className="pl-10 bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="bg-white">
                    <Filter className="size-4 mr-2" /> Filtres
                </Button>
            </div>

            {/* TABLEAU PRINCIPAL */}
            <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <ArrowRightLeft className="size-4 text-blue-600" />
                        Flux monétaires
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[150px]">Référence</TableHead>
                                <TableHead>Émetteur / Bénéficiaire</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead className="text-right">Statut</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                                ))
                            ) : transactions.map((tx) => (
                                <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <TableCell className="font-mono text-[11px] font-bold text-slate-500">
                                        {tx.reference}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{tx.parties.sender?.name || 'Système'}</span>
                                                <span className="text-[10px] text-slate-400">Depuis Sender</span>
                                            </div>
                                            <ArrowRight className="size-3 text-slate-300" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{tx.parties.beneficiary?.name || 'N/A'}</span>
                                                <span className="text-[10px] text-slate-400">Vers Bénéficiaire</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-slate-900">
                                            {tx.financials.display}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-slate-100">
                                            {tx.financials.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            style={{ backgroundColor: `${tx.status.color}15`, color: tx.status.color, borderColor: `${tx.status.color}30` }}
                                            className="font-bold border shadow-none"
                                        >
                                            {tx.status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/transactions/${tx.id}`}>
                                            <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100">
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// Composant Skeleton simple
function Skeleton({ className }: { className?: string }) {
    return <div className={`animate-pulse bg-slate-200 rounded ${className}`} />;
}