"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Store, MapPin, MoreVertical, Eye, Edit, Trash2, Loader2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {useSession} from "next-auth/react";

interface Shop {
    id: number;
    name: string;
    slug: string;
    category: string;
    location: string;
    products_count: number;
    orders_count: number;
    revenue: number;
    is_active: boolean;
    logo_url?: string;
    logo?: string;
}

export default function ShopListClient() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const baseUrl_ecommerce_service = process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL;
    const fetchShops = useCallback(async () => {
        setLoading(true);
        const userId = session?.user?.id;
        try {
            const res = await fetch(`${baseUrl_ecommerce_service}/api/shops`, {
                headers: {
                    "X-User-Id": String(userId),
                },
                next: { revalidate: 300 }  // ISR 5min
            });
            if (!res.ok) throw new Error("Erreur chargement");
            const data = await res.json();
            setShops(data.data);
            setFilteredShops(data.data);
        } catch (error) {
            toast.error("Erreur chargement boutiques");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShops();
    }, [fetchShops]);

    useEffect(() => {
        const filtered = shops.filter(shop =>
            shop.name.toLowerCase().includes(search.toLowerCase()) ||
            shop.location.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredShops(filtered);
    }, [search, shops]);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Supprimer "${name}" ?`)) return;

        try {
            const res = await fetch(`/api/shops/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Erreur suppression");
            toast.success("Boutique supprimée");
            fetchShops();  // Refresh
        } catch (error) {
            toast.error("Erreur suppression");
        }
    };

    const formatXAF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'XAF', minimumFractionDigits: 0
        }).format(amount);

    if (loading) {
        return <ShopsSkeleton />;
    }

    return (
        <>
            {/* Search */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border-0 mb-8">
                <div className="relative max-w-md mx-auto">
                    <Input
                        placeholder="Rechercher boutique ou ville..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-6 py-4 text-lg shadow-sm"
                    />
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                </div>
                <p className="text-center text-sm text-slate-500 mt-4">
                    {filteredShops.length} boutique(s) trouvée(s)
                </p>
            </div>

            {/* Table */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-0 overflow-hidden p-5">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-2 border-slate-200">
                            <TableHead className="w-20">Logo</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>Ville</TableHead>
                            <TableHead className="text-right">Produits</TableHead>
                            <TableHead className="text-right">Commandes</TableHead>
                            <TableHead className="text-right">CA</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredShops.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-48 text-center text-slate-500 py-12">
                                    <Store className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                    <div>Aucune boutique trouvée</div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredShops.map(shop => (
                                <TableRow key={shop.id} className="hover:bg-emerald-50/50 border-b hover:border-emerald-200">
                                    <TableCell>
                                        <img
                                            src={shop.logo ? `${shop.logo_url}` : "/default-shop.jpg"}
                                            alt={shop.name}
                                            className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-slate-100"
                                            width={56}
                                            height={56}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            href={`/customer/shops/${shop.slug}`}
                                            className="font-bold text-lg hover:text-emerald-600 hover:underline block"
                                        >
                                            {shop.name}
                                        </Link>
                                        <span className="text-sm text-slate-500 font-mono">{shop.slug}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`px-3 py-1 font-semibold text-xs uppercase tracking-wide shadow-md ${
                                            shop.category === 'canal' ? 'bg-purple-500' :
                                                shop.category === 'momo' ? 'bg-emerald-500' :
                                                    'bg-blue-500'
                                        } text-white`}>
                                            {shop.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                            <span>{shop.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-emerald-600 font-bold">
                                        {shop.products_count}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-blue-600 font-bold">
                                        {shop.orders_count}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-lg font-bold text-emerald-700">
                                            {formatXAF(shop.revenue)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={shop.is_active ? "default" : "secondary"}>
                                            {shop.is_active ? "Active" : "Inactif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon" className="h-10 w-10">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem>
                                                    <Link href={`/customer/shops/${shop.slug}`} className="w-full">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Voir boutique
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href={`/customer/shops/${shop.id}/edit`} className="w-full">
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Modifier
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-red-600 focus:text-red-600"
                                                    onClick={() => handleDelete(shop.id, shop.name)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Supprimer
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

function ShopsSkeleton() {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl animate-pulse">
            <div className="space-y-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-6 p-6 bg-slate-100 rounded-2xl">
                        <div className="w-20 h-20 bg-slate-200 rounded-2xl"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-6 bg-slate-200 rounded-xl w-64"></div>
                            <div className="flex gap-3">
                                <div className="h-5 bg-slate-200 rounded-full w-24"></div>
                                <div className="h-5 bg-slate-200 rounded-full w-20"></div>
                            </div>
                        </div>
                        <div className="w-24 h-10 bg-slate-200 rounded-xl"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}