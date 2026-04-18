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
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Search, PhoneForwarded, Eye, RefreshCw, FileText } from "lucide-react";
import {DepositUssd, Payment} from "../../../types/type";

export default function DepotUssdPage() {
    const [loading, setLoading] = useState(true);
    const [deposits, setDeposits] = useState<DepositUssd[]>([]);
    const [filteredDeposits, setFilteredDeposits] = useState<DepositUssd[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [adminNote, setAdminNote] = useState("");

    const { data: session } = useSession();
    const baseUrl_user_service = process.env.NEXT_PUBLIC_API_USER_SERVICE_URL;

    const fetchDeposits = useCallback(async () => {
        if (!session?.user?.id) return;
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl_user_service}/api/deposit_ussds`, {
                headers: {
                    "X-User-Id": String(session.user.id),
                }
            });
            if (!res.ok) throw new Error("Erreur chargement");
            const data = await res.json();

            const items = data.data.items || data.data;
            setDeposits(items);
            setFilteredDeposits(items);
        } catch (error) {
            toast.error("Erreur lors du chargement des dépôts USSD");
        } finally {
            setLoading(false);
        }
    }, [baseUrl_user_service, session?.user?.id]);

    useEffect(() => {
        fetchDeposits();
    }, [fetchDeposits]);

    useEffect(() => {
        const results = deposits.filter(d =>
            d.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.ussd_code?.includes(searchTerm)
        );
        setFilteredDeposits(results);
    }, [searchTerm, deposits]);

    const handleValidate = async (status: 'success' | 'failed') => {
        if (!selectedDeposit) return;
        setIsActionLoading(true);

        try {
            const res = await fetch(`${baseUrl_user_service}/api/deposit_ussds/${selectedDeposit.id}/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': String(session?.user?.id)
                },
                body: JSON.stringify({ status, admin_note: adminNote })
            });

            if (!res.ok) throw new Error("Erreur lors de la validation");

            toast.success(`Dépôt ${status === 'success' ? 'approuvé' : 'rejeté'} avec succès`);
            setSelectedDeposit(null); // Fermer le modal
            setAdminNote("");
            fetchDeposits(); // Rafraîchir la liste
        } catch (error) {
            toast.error("Impossible de valider cette transaction");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* EN-TÊTE */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dépôts USSD</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Validation manuelle des transferts via codes USSD.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Référence, utilisateur ou code..."
                            className="pl-10 bg-white border-slate-200"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={fetchDeposits} variant="outline" size="sm" className="gap-2">
                        <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
                        Actualiser
                    </Button>
                </div>
            </div>

            {/* TABLEAU */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-700">
                        <PhoneForwarded className="size-4 text-orange-500" />
                        Transactions USSD à traiter
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/30">
                            <TableRow>
                                <TableHead className="font-bold">Utilisateur</TableHead>
                                <TableHead className="font-bold">Code USSD</TableHead>
                                <TableHead className="font-bold">Montant</TableHead>
                                <TableHead className="font-bold">Référence</TableHead>
                                <TableHead className="font-bold">Preuve</TableHead>
                                <TableHead className="font-bold text-right">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell colSpan={6}><Skeleton className="h-12 w-full" /></TableCell>
                                    </TableRow>
                                ))
                            ) : filteredDeposits.length > 0 ? (
                                filteredDeposits.map((deposit) => (
                                    <TableRow key={deposit.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-sm text-slate-800">{deposit.user?.name}</span>
                                                <span className="text-[11px] text-slate-500 font-medium">{deposit.country_code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-blue-700">
                                                {deposit.ussd_code}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-slate-900 text-sm">
                                                {deposit.amount} <span className="text-[10px] text-slate-400">{deposit.currency}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs font-medium text-slate-500">
                                            {deposit.reference}
                                        </TableCell>
                                        <TableCell>
                                            {deposit.proof_url ? (
                                                <Dialog>
                                                    <DialogTrigger>
                                                        <Button variant="ghost" size="sm" className="h-8 gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <Eye className="size-3.5" />
                                                            Voir
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-3xl">
                                                        <DialogHeader>
                                                            <DialogTitle>Preuve de dépôt - {deposit.reference}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="mt-4 flex justify-center bg-slate-100 rounded-lg p-2">
                                                            <img
                                                                src={deposit.proof_url}
                                                                alt="Reçu de paiement"
                                                                className="max-h-[70vh] object-contain rounded-md shadow-lg"
                                                            />
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic">Aucune preuve</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge className={`font-bold px-2.5 py-0.5 rounded-full border-none ${getStatusColor(deposit.status)}`}>
                                                {deposit.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {deposit.status === 'processing' ? (
                                                <Button
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 h-8"
                                                    onClick={() => setSelectedDeposit(deposit)}
                                                >
                                                    Valider
                                                </Button>
                                            ) : (
                                                <Badge className={`font-bold ${getStatusColor(deposit.status)}`}>
                                                    {deposit.status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                            <FileText className="size-8 opacity-20" />
                                            <p className="text-sm font-medium">Aucun dépôt USSD trouvé</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            <Dialog open={!!selectedDeposit} onOpenChange={(open) => !open && setSelectedDeposit(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="size-5 text-blue-600" />
                            Validation du dépôt #{selectedDeposit?.reference}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Résumé de la transaction */}
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Utilisateur</p>
                                <p className="text-sm font-semibold">{selectedDeposit?.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-400">Montant déclaré</p>
                                <p className="text-sm font-bold text-blue-700">{selectedDeposit?.amount} {selectedDeposit?.currency}</p>
                            </div>
                        </div>

                        {/* Note administrative */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Note administrative (Optionnel)</label>
                            <textarea
                                className="w-full min-h-[80px] p-3 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ex: Reçu vérifié, fonds reçus sur le compte Orange..."
                                value={adminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                            />
                        </div>

                        {/* Aperçu rapide de la preuve */}
                        {selectedDeposit?.proof_url && (
                            <div className="border rounded-md overflow-hidden bg-black/5 flex justify-center">
                                <img src={selectedDeposit.proof_url} alt="Proof" className="max-h-32 object-contain" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between gap-3 mt-4">
                        <Button
                            variant="outline"
                            className="flex-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200"
                            onClick={() => handleValidate('failed')}
                            disabled={isActionLoading}
                        >
                            Rejeter le dépôt
                        </Button>
                        <Button
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleValidate('success')}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? "Validation..." : "Approuver les fonds"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// Helper pour les couleurs de badge
function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
        case "completed": return "bg-emerald-100 text-emerald-700";
        case "pending": return "bg-amber-100 text-amber-700";
        case "failed": return "bg-rose-100 text-rose-700";
        case "rejected": return "bg-slate-200 text-slate-700";
        default: return "bg-blue-100 text-blue-700";
    }
}

