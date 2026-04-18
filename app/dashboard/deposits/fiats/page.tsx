"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Wallet, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {DepositFiat} from "../../../types/type";

export default function DepotFiatPage() {
    const [loading, setLoading] = useState(true);
    const [deposits, setDeposits] = useState<DepositFiat[]>([]);
    const [filteredDeposits, setFilteredDeposits] = useState<DepositFiat[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const { data: session } = useSession();
    const baseUrl_user_service = process.env.NEXT_PUBLIC_API_USER_SERVICE_URL;

    const fetchDeposits = useCallback(async () => {
        const userId = session?.user?.id;
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl_user_service}/api/deposits-admin`, {
                headers: {
                    "X-User-Id": String(userId),
                },
                next: { revalidate: 300 }
            });
            if (!res.ok) throw new Error("Erreur chargement");
            const data = await res.json();

            // On s'adapte à la structure renvoyée par Laravel (items ou data)
            const items = data.data.items || data.data;
            setDeposits(items);
            setFilteredDeposits(items);
        } catch (error) {
            toast.error("Erreur lors du chargement des dépôts");
        } finally {
            setLoading(false);
        }
    }, [baseUrl_user_service]);

    useEffect(() => {
        fetchDeposits();
    }, [fetchDeposits]);

    // Logique de recherche simple (Client-side)
    useEffect(() => {
        const results = deposits.filter(d =>
            d.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDeposits(results);
    }, [searchTerm, deposits]);

    return (
        <div className="p-6 space-y-6">
            {/* Header de la page */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dépôts Fiats</h1>
                    <p className="text-muted-foreground text-sm">
                        Gérez et suivez les flux monétaires entrants.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher une référence..."
                            className="pl-8 bg-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchDeposits} variant="outline" size="icon">
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Tableau principal */}
            <Card className="shadow-sm border-slate-200">
                <CardHeader className="bg-slate-50/50 border-b">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Wallet className="size-4 text-blue-600" />
                        Historique des transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[150px]">Référence</TableHead>
                                <TableHead>Utilisateur</TableHead>
                                <TableHead>Opérateur</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}><Skeleton className="h-10 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredDeposits.length > 0 ? (
                                filteredDeposits.map((deposit) => (
                                    <TableRow key={deposit.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs font-bold text-slate-500">
                                            {deposit.reference}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-sm">{deposit.user?.name}</span>
                                                <span className="text-[11px] text-muted-foreground">{deposit.user?.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {deposit.operator?.logo && (
                                                    <img src={deposit.operator.logo} alt="" className="size-6 rounded shadow-sm" />
                                                )}
                                                <span className="text-sm font-medium">{deposit.operator?.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-900">
                                            {deposit.amount} <span className="text-[10px] text-slate-400">XAF</span>
                                        </TableCell>
                                        <TableCell className="text-slate-500 text-sm">
                                            {deposit.created_at}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className={getStatusStyles(deposit.status)}>
                                                {deposit.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        Aucun dépôt trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// Fonction helper pour styler les badges selon le statut
function getStatusStyles(status: string) {
    switch (status?.toLowerCase()) {
        case "completed":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "pending":
            return "bg-amber-50 text-amber-700 border-amber-200";
        case "failed":
            return "bg-rose-50 text-rose-700 border-rose-200";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200";
    }
}