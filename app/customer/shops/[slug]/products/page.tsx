"use client";

import {useState, useCallback, useEffect} from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Package, ShoppingCart, DollarSign, TrendingUp, Plus, Search, Filter, Edit, Trash2, Eye
} from "lucide-react";
import { toast } from "sonner";
import {useSession} from "next-auth/react";

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    category: string;
    sku: string;
    stock: number;
    images_count: number;
    orders_count: number;
    revenue: number;
    is_active: boolean;
}

export default function ProductListPage() {
    const params = useParams();
    const shopSlug = params?.slug as string;
    const { data: session } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const formatXAF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'XAF', minimumFractionDigits: 0
        }).format(amount);

    const userId = session?.user?.id;

    const fetchProducts = useCallback(async () => {
        // 1. Protection : on ne fetch pas si on n'a pas l'ID ou le slug
        if (!userId || !shopSlug) return;

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/shops/${shopSlug}/products`, {
                method: "GET", // Optionnel pour un GET mais recommandé pour la clarté
                headers: {
                    "X-User-Id": String(userId),
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setProducts(data.data);
                setFilteredProducts(data.data);
            } else {
                throw new Error("Erreur serveur");
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur chargement produits");
        } finally {
            setLoading(false);
        }
    }, [shopSlug, userId]); // Utilisez userId ici plutôt que l'objet session complet
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]); // fetchProducts changera dès que userId ou shopSlug changera
    // Search
    const handleSearch = (value: string) => {
        setSearch(value);
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(value.toLowerCase()) ||
            product.sku.toLowerCase().includes(value.toLowerCase()) ||
            product.category.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Supprimer "${name}" ?`)) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Produit supprimé");
                // fetchProducts();
            }
        } catch (error) {
            toast.error("Erreur suppression");
        }
    };

    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const activeProducts = products.filter(p => p.is_active).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header + Stats */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
                            Produits {shopSlug}
                        </h1>
                        <p className="text-xl text-slate-600 mt-2">
                            Gérez vos produits et stocks ({products.length})
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            href={`/shops/${shopSlug}/products/create`}
                            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700
                                       text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl
                                       flex items-center gap-3 h-16 text-lg transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Nouveau produit
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-0 group hover:shadow-2xl transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-lg">
                                    <DollarSign className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl lg:text-4xl font-black text-emerald-800">
                                        {formatXAF(totalRevenue)}
                                    </p>
                                    <p className="text-slate-600 font-semibold">Chiffre d'affaires</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-0 group hover:shadow-2xl transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                                    <Package className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl lg:text-4xl font-black text-blue-800">
                                        {products.length}
                                    </p>
                                    <p className="text-slate-600 font-semibold">Produits</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-0 group hover:shadow-2xl transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="p-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-lg">
                                    <ShoppingCart className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl lg:text-4xl font-black text-orange-800">
                                        {totalStock}
                                    </p>
                                    <p className="text-slate-600 font-semibold">Stock total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/90 backdrop-blur-xl shadow-xl border-0 group hover:shadow-2xl transition-all">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="p-4 bg-gradient-to-r from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                                    <TrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl lg:text-4xl font-black text-purple-800">
                                        {activeProducts}
                                    </p>
                                    <p className="text-slate-600 font-semibold">Actifs</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search + Table */}
                <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
                    <CardHeader className="p-8 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="relative max-w-2xl">
                                <Input
                                    placeholder="Rechercher nom, SKU, catégorie..."
                                    value={search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="h-14 pl-14 pr-6 py-3 text-lg shadow-sm focus:ring-emerald-500"
                                />
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                            </div>
                            <Badge className="self-start sm:self-center bg-emerald-100 text-emerald-800 px-6 py-3 text-lg font-bold shadow-lg">
                                {filteredProducts.length} produit(s)
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b-2 border-slate-200 hover:bg-transparent">
                                        <TableHead className="w-16">Images</TableHead>
                                        <TableHead className="w-64">Nom</TableHead>
                                        <TableHead>Catégorie</TableHead>
                                        <TableHead className="w-32">Prix</TableHead>
                                        <TableHead className="w-24 text-right">Stock</TableHead>
                                        <TableHead className="w-32 text-right">Commandes</TableHead>
                                        <TableHead className="w-32 text-right">CA</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={9} className="h-48 text-center py-12">
                                                <Package className="w-20 h-20 mx-auto mb-4 opacity-50 text-slate-400" />
                                                <div className="text-slate-500 space-y-1">
                                                    <p className="text-xl font-semibold">Aucun produit</p>
                                                    <p className="text-sm">Commencez par en créer un</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProducts.map(product => (
                                            <TableRow key={product.id} className="hover:bg-emerald-50/50 border-b hover:border-emerald-200">
                                                <TableCell>
                                                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center shadow-md overflow-hidden">
                                                        <Package className="w-7 h-7 text-slate-500" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-lg">
                                                    <Link
                                                        href={`/customer/shops/${shopSlug}/products/${product.slug}`}
                                                        className="hover:text-emerald-600 font-bold group"
                                                    >
                                                        {product.name}
                                                        <p className="text-xs text-slate-500 font-mono group-hover:text-emerald-500">
                                                            /{product.slug}
                                                        </p>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={`px-4 py-2 font-bold text-sm uppercase tracking-wide shadow-md ${
                                                        product.category === 'canal' ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white' :
                                                            product.category === 'momo' ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' :
                                                                'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                                    }`}>
                                                        {product.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="font-mono text-2xl font-bold text-emerald-700">
                                                    {formatXAF(product.price)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className={`font-bold text-xl px-3 py-2 rounded-xl ${
                                                        product.stock > 10 ? 'bg-emerald-100 text-emerald-800 shadow-emerald-200' :
                                                            product.stock > 0 ? 'bg-amber-100 text-amber-800 shadow-amber-200' :
                                                                'bg-red-100 text-red-800 shadow-red-200'
                                                    }`}>
                                                        {product.stock}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-blue-600 font-bold text-lg">
                                                    {product.orders_count}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span className="text-xl font-bold text-emerald-700">
                                                        {formatXAF(product.revenue)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={product.is_active ? "default" : "secondary"} className="px-4 py-2">
                                                        {product.is_active ? "✅ Actif" : "⏸️ Inactif"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-1 space-x-reverse pr-2">
                                               {/*     <Link href={`/shops/${shopSlug}/products/${product.slug}`}>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-emerald-100">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>*/}
                                                    <Link href={`/customer/shops/${shopSlug}/products/${product.slug}/edit`}>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-100">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-10 w-10 hover:bg-red-100 text-red-600 hover:text-red-700"
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination (si API) */}
                {false && (
                    <div className="flex items-center justify-between px-8 py-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg">
                        <div className="text-sm text-slate-600">
                            Affichage de 1 à 10 sur 25 produits
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">Précédent</Button>
                            <Button variant="outline" size="sm">Suivant</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}