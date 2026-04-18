"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Eye, Store, Package } from "lucide-react";
import Link from "next/link";
import {Order} from "../../types/type";

export default function OrdersPage() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/orders?search=${search}`);
                const json = await res.json();
                setOrders(json.data || []);
            } catch (e) {
                toast.error("Erreur de chargement des commandes");
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchOrders, 400);
        return () => clearTimeout(timer);
    }, [search]);

    return (
        <div className="p-6 space-y-6 bg-slate-50/30 min-h-screen">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShoppingBag className="text-indigo-600" /> Commandes Clients
                    </h1>
                    <p className="text-muted-foreground text-sm">Gestion des ventes et suivis d'expéditions.</p>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        placeholder="Référence commande..."
                        className="pl-9 bg-white border-slate-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card className="border-none shadow-sm">
                <CardHeader className="bg-white border-b py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Package className="size-4 text-slate-400" /> Flux de vente global
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="font-bold">Référence</TableHead>
                                <TableHead className="font-bold">Boutique</TableHead>
                                <TableHead className="font-bold">Client</TableHead>
                                <TableHead className="font-bold">Montant</TableHead>
                                <TableHead className="font-bold text-center">Articles</TableHead>
                                <TableHead className="font-bold text-right">Statut</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} className="group hover:bg-indigo-50/20">
                                    <TableCell className="font-mono text-xs font-bold uppercase">
                                        {order.reference}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Store className="size-3 text-slate-400" />
                                            <span className="text-sm font-medium">{order.shop?.name || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{order.customer.name}</span>
                                            <span className="text-[10px] text-slate-400">{order.created_at}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-slate-900">{order.financials.display}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                                            {order.items_count}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            style={{ backgroundColor: `${order.status.color}15`, color: order.status.color }}
                                            className="border-none font-bold"
                                        >
                                            {order.status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/ecommerces/${order.id}`}>
                                            <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100">
                                                <Eye className="size-4 text-slate-500" />
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