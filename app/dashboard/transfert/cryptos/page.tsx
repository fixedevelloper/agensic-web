"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, ArrowRight, Wallet, History } from "lucide-react";
import Link from "next/link";
import {TransactionCrypto} from "../../../types/type";

export default function TransactionsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<TransactionCrypto[]>([]);
    const [search, setSearch] = useState("");

    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_CRYPTO_SERVICE_URL}/api/transactions?search=${search}`);
            const json = await res.json();
            setData(json.data.items || []);
        } catch (e) {
            toast.error("Erreur de chargement");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => { fetchTransactions(); }, [fetchTransactions]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <History className="text-blue-600" /> Flux Sortants
                    </h1>
                    <p className="text-muted-foreground text-sm">Suivi des envois XAF vers Portefeuilles Externes.</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-3 top-3 size-4 text-slate-400" />
                    <Input
                        placeholder="Référence ou Hash..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold">Transaction</TableHead>
                                <TableHead className="font-bold">Client</TableHead>
                                <TableHead className="font-bold">Montant (XAF → Crypto)</TableHead>
                                <TableHead className="font-bold text-center">Réseau</TableHead>
                                <TableHead className="font-bold text-right">Statut</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((tx) => (
                                <TableRow key={tx.id} className="hover:bg-slate-50/50">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono font-bold text-blue-600">#{tx.reference.split('-')[0]}</span>
                                            <span className="text-[10px] text-slate-400">{tx.created_at}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{tx.user?.name || "Client #" + tx.user?.id}</div>
                                        <div className="text-[10px] text-slate-500 truncate max-w-[100px]">{tx.crypto.recipient}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-700">{tx.fiat.display}</span>
                                            <ArrowRight className="size-3 text-slate-300" />
                                            <span className="font-bold text-orange-600">{tx.crypto.total_sent} {tx.crypto.symbol}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="text-[10px] font-bold">
                                            {tx.crypto.network}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge style={{ backgroundColor: `${tx.status.color}15`, color: tx.status.color, borderColor: `${tx.status.color}30` }}>
                                            {tx.status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            {tx.crypto.explorer_url && (
                                                <Button variant="ghost" size="icon" className="size-8">
                                                    <a href={tx.crypto.explorer_url} target="_blank"><ExternalLink className="size-3.5" /></a>
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="size-8">
                                                <Link href={`/dashboard/transfert/cryptos/${tx.id}`}><Wallet className="size-3.5" /></Link>
                                            </Button>
                                        </div>
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