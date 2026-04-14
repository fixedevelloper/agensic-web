"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Badge,
} from "@/components/ui/badge";
import {
    Package, Edit, Trash2, Plus, Search, Filter, Loader2, ImagePlus
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import ImageSelectorModal from "../../../../components/modals/ImageSelectorModal";

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    category: string;
    stock: number;
    sku: string;
    is_active: boolean;
}

export default function ShopProducts({ slug }: { slug: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/shops/${slug}/products`, {
                next: { revalidate: 30 }
            });
            if (!res.ok) throw new Error("Erreur chargement");
            const data = await res.json();
            setProducts(data.data);
            setFilteredProducts(data.data);
        } catch (error) {
            toast.error("Erreur chargement produits");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [search, products]);

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Supprimer "${name}" ? Stock perdu.`)) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Erreur suppression");
            toast.success("Produit supprimé");
            fetchProducts();
        } catch (error) {
            toast.error("Erreur suppression");
        } finally {
            setDeletingId(null);
        }
    };

    const formatXAF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'XAF', minimumFractionDigits: 0
        }).format(amount);

    if (loading) {
        return <ProductsSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
                        <Package className="w-7 h-7 text-white" />
                    </div>
                    <ImageSelectorModal
                        triggerButton={
                            <Button className="gap-2">
                                <ImagePlus className="w-4 h-4" />
                                Images produit
                            </Button>
                        }
                        maxSelection={6}
                        onSelect={(selectedImages) => {
                            console.log("Images sélectionnées:", selectedImages);
                            // setProduct({ ...product, images: selectedImages });
                        }}
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">
                            Produits ({products.length})
                        </h2>
                        <p className="text-sm text-slate-500">
                            {filteredProducts.length} trouvés
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => fetchProducts()}
                    >
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                        Actualiser
                    </Button>
                    <Link
                        href={`/customer/shops/${slug}/products/create`}
                        className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Input
                    placeholder="Rechercher nom, SKU, catégorie..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-6 py-4 text-lg max-w-2xl shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            </div>

            {/* Table */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-2 border-slate-200 hover:bg-transparent">
                            <TableHead>Image</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Catégorie</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead className="text-right">Prix</TableHead>
                            <TableHead className="text-right">Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-32 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-48 text-center text-slate-500 py-12">
                                    <Package className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                    <div className="text-lg">Aucun produit</div>
                                    <Link
                                        href={`/shops/${slug}/products/create`}
                                        className="mt-4 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Ajouter le premier produit
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts.map(product => (
                                <TableRow key={product.id} className="hover:bg-emerald-50/50 border-b hover:border-emerald-200">
                                    <TableCell>
                                        <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center shadow-md overflow-hidden">
                                            <Package className="w-8 h-8 text-slate-400" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        <Link
                                            href={`/shops/${slug}/products/${product.slug}`}
                                            className="hover:text-emerald-600 font-bold block"
                                        >
                                            {product.name}
                                        </Link>
                                        <span className="text-xs text-slate-500 font-mono">{product.slug}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="px-3 py-1 text-xs uppercase font-semibold">
                                            {product.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-mono text-sm bg-slate-50 px-3 py-1 rounded-xl">
                                        {product.sku}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-lg font-bold text-emerald-700">
                                            {formatXAF(product.price)}
                                        </span>
                                    </TableCell>
                                    <TableCell className={`text-right font-mono font-bold px-3 py-1 rounded-xl ${
                                        product.stock > 10 ? 'text-emerald-600 bg-emerald-50' :
                                            product.stock > 0 ? 'text-amber-600 bg-amber-50' :
                                                'text-red-600 bg-red-50'
                                    }`}>
                                        {product.stock}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.is_active ? "default" : "secondary"}>
                                            {product.is_active ? "Actif" : "Inactif"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9"
                                            >
                                                <Link href={`/shops/${slug}/products/${product.id}/edit`}>
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(product.id, product.name)}
                                                disabled={deletingId === product.id}
                                            >
                                                {deletingId === product.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function ProductsSkeleton() {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl animate-pulse space-y-6">
            <div className="flex items-center justify-between">
                <div className="h-10 w-64 bg-slate-200 rounded-xl"></div>
                <div className="h-12 w-32 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 bg-slate-100 rounded-2xl">
                        <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-6 bg-slate-200 rounded-lg w-72"></div>
                            <div className="flex gap-4">
                                <div className="h-4 bg-slate-200 rounded-full w-24"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-20"></div>
                                <div className="h-4 bg-slate-200 rounded-full w-16"></div>
                            </div>
                        </div>
                        <div className="w-24 h-10 bg-slate-200 rounded-xl"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}