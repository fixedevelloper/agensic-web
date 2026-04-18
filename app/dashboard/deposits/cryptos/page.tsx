"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Bitcoin, ArrowRight, RefreshCw, Copy, ExternalLink, User } from "lucide-react";
import Link from "next/link";
import {Payment} from "../../../types/type";

export default function DepotCryptoPage() {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const { data: session } = useSession();
    const baseUrl = process.env.NEXT_PUBLIC_API_CRYPTO_SERVICE_URL;

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/payments`, {
                headers: { "X-User-Id": String(session?.user?.id) }
            });
            if (!res.ok) throw new Error();
            const data = await res.json();
            const items = data.data.items || data.data;
            setPayments(items);
            setFilteredPayments(items);
        } catch (error) {
            toast.error("Erreur de synchronisation avec le service de paiement");
        } finally {
            setLoading(false);
        }
    }, [baseUrl, session?.user?.id]);

    useEffect(() => { fetchPayments(); }, [fetchPayments]);

    useEffect(() => {
        // On normalise le terme de recherche pour éviter les répétitions
        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            setFilteredPayments(payments);
            return;
        }

        const results = payments.filter((p) => {
            // Utilisation systématique de l'optional chaining ?.
            const matchRef = p.reference?.toLowerCase().includes(term);
            const matchAddress = p.crypto?.pay_address?.toLowerCase().includes(term);
            const matchUser = p.user?.name?.toLowerCase().includes(term);

            return matchRef || matchAddress || matchUser;
        });

        setFilteredPayments(results);
    }, [searchTerm, payments]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Adresse copiée !");
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Passerelle Crypto</h1>
                    <p className="text-slate-500 text-sm font-medium">Surveillance des dépôts et confirmations blockchain.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Réf, Adresse ou Client..."
                            className="pl-10 bg-white shadow-sm border-slate-200 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchPayments} variant="outline" className="bg-white shadow-sm">
                        <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Rafraîchir
                    </Button>
                </div>
            </div>

            {/* TABLEAU */}
            <Card className="border-slate-200 shadow-md overflow-hidden">
                <CardHeader className="bg-white border-b py-5">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                        <Bitcoin className="size-5 text-orange-500" />
                        Flux de paiements cryptographiques
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[180px] font-bold">Référence</TableHead>
                                <TableHead className="font-bold">Client</TableHead>
                                <TableHead className="font-bold">Conversion (Fiat → Crypto)</TableHead>
                                <TableHead className="font-bold">Adresse de dépôt</TableHead>
                                <TableHead className="font-bold text-center">Statut</TableHead>
                                <TableHead className="text-right font-bold">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell></TableRow>
                                ))
                            ) : filteredPayments.map((payment) => (
                                <TableRow key={payment.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <TableCell className="font-mono text-xs font-bold text-blue-600">
                                        {payment.reference}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="size-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="size-4" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700 truncate max-w-[120px]">
                                                {payment.user?.name || "Anonyme"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="font-medium text-slate-600">{payment.fiat.display}</span>
                                            <ArrowRight className="size-3 text-slate-300" />
                                            <span className="font-bold text-slate-900">{payment.crypto.display}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <code className="text-[11px] bg-slate-100 p-1.5 rounded text-slate-600 font-medium">
                                                {payment.crypto.pay_address?.substring(0, 8)}...{payment.crypto.pay_address?.slice(-8)}
                                            </code>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copyToClipboard(payment.crypto.pay_address)}
                                            >
                                                <Copy className="size-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            style={{ backgroundColor: `${payment.status.color}15`, color: payment.status.color, borderColor: `${payment.status.color}30` }}
                                            className="font-bold px-3 py-1 border shadow-none"
                                        >
                                            {payment.status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link
                                                        href={`/dashboard/deposits/cryptos/${payment.id}`}
                                                        className="text-slate-400 hover:text-blue-600"
                                                    >
                                                        <ExternalLink className="size-4" />
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Explorer la transaction</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
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