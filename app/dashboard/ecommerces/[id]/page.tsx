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
    ChevronLeft, Printer, Truck, CreditCard,
    MapPin, Store, Package, User, Hash
} from "lucide-react";

export default function OrderDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/orders/${id}`);
                const json = await res.json();
                setOrder(json.data);
            } catch (error) {
                toast.error("Commande introuvable");
                router.push("/dashboard/orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, router]);

    if (loading) return <div className="p-10 space-y-6"><Skeleton className="h-10 w-1/4" /><Skeleton className="h-[500px] w-full" /></div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Barre d'actions */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Retour aux commandes
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Printer className="mr-2 h-4 w-4" /> Facture PDF
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <Truck className="mr-2 h-4 w-4" /> Marquer comme expédiée
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLONNE GAUCHE : ARTICLES ET PAIEMENT */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Liste des articles */}
                    <Card className="border-none shadow-sm">
                        <CardHeader className="border-b bg-slate-50/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5 text-slate-400" />
                                    Articles de la commande
                                </CardTitle>
                                <Badge variant="outline" className="bg-white">{order.items.length} Produits</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden">
                                                {item.product_image ? <img src={item.product_image} alt="" /> : <Package className="h-6 w-6 text-slate-300" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                                <p className="text-xs text-slate-500">Quantité : {item.quantity}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold">{item.price_display}</p>
                                            <p className="text-[10px] text-slate-400">Total: {item.total_display}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-slate-50/50 border-t space-y-2">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Sous-total</span>
                                    <span>{order.financials.display}</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-slate-900 pt-2">
                                    <span>Total TTC</span>
                                    <span>{order.financials.display}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Informations Paiement */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-slate-400">
                                <CreditCard className="h-4 w-4" /> Détails du paiement
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-2 rounded shadow-sm">
                                        <Hash className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Transaction ID</p>
                                        <p className="text-sm font-mono font-bold text-slate-700">{order.payment.transaction_id || "N/A"}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-white uppercase text-[10px] font-bold">
                                    {order.payment.method}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* SIDEBAR : CLIENT, BOUTIQUE ET ADRESSES */}
                <div className="space-y-6">
                    {/* Statut Commande */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className="h-1.5 w-full" style={{ backgroundColor: order.status.color }} />
                        <CardHeader className="pb-4">
                            <CardDescription className="text-[10px] font-bold uppercase">Statut actuel</CardDescription>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-xl font-bold" style={{ color: order.status.color }}>
                                    {order.status.label}
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="text-xs text-slate-500">
                            Commandé le {order.created_at}
                        </CardContent>
                    </Card>

                    {/* Boutique & Client */}
                    <Card className="border-none shadow-sm">
                        <CardContent className="pt-6 space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <Store className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Vendu par</p>
                                    <p className="text-sm font-bold text-slate-800">{order.shop?.name}</p>
                                </div>
                            </div>
                            <Separator />
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Client</p>
                                    <p className="text-sm font-bold text-slate-800">{order.customer.name}</p>
                                    <p className="text-xs text-slate-500">{order.customer.email}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Adresses */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-rose-500" />
                                Adresses
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Livraison</p>
                                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed">
                                    {order.addresses.shipping ? (
                                        <>
                                            <p className="font-bold">{order.addresses.shipping.full_name}</p>
                                            <p>{order.addresses.shipping.address}</p>
                                            <p>{order.addresses.shipping.city}, {order.addresses.shipping.country}</p>
                                        </>
                                    ) : "Pas d'adresse renseignée"}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Facturation</p>
                                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed italic">
                                    Identique à la livraison
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}