"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Package, Tag, Ruler, Hash, Edit3, Trash2, Download, Share2, Eye, ImagePlus
} from "lucide-react";
import ImageSelectorModal from "@/components/modals/ImageSelectorModal";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {Image} from "../../../../../../types/type";

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    category: string;
    sku: string;
    stock: number;
    dimensions?: string;
    images: { id: number; url: string; name: string }[];
    shop: { name: string; slug: string };
}

export default function ProductPage() {
    const router = useRouter();
    const params = useParams();
    const shopSlug = params?.slug as string;
    const productSlug = params?.product as string;
    const { data: session } = useSession();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingImages, setEditingImages] = useState<number[]>([]);
    const [initedImages, setInitedImages] = useState<Image[]>([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const userId = session?.user?.id;
    // 1. Fetch produit
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/products/${productSlug}`, {
                    headers: { "X-User-Id": "123" }  // Session
                });
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data.data);
                    setEditingImages(data.data.images.map((img: any) => img.id));
                    setInitedImages(data.data.images);
                }
            } catch (error) {
                console.error("Erreur produit:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [shopSlug, productSlug]);

    // 2. ImageSelectorModal → IDs
    const handleImagesSelect = useCallback((selectedImages: any[]) => {
        setEditingImages(selectedImages.map(img => img.id));
        setShowImageModal(false);
    }, []);

    // 3. Update images
    const updateImages = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/shops/${shopSlug}/products/${productSlug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": String(userId),
                },
                body: JSON.stringify({ images: editingImages })
            });
            if (res.ok) {
                const data = await res.json();
                setProduct(data.data);
            }
        } catch (error) {
            console.error("Erreur update images");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50/50 py-20">
                <div className="max-w-4xl mx-auto">
                    <Card className="bg-white/90 backdrop-blur-xl shadow-2xl animate-pulse">
                        <CardHeader className="p-12">
                            <div className="h-12 w-96 bg-slate-200 rounded-xl mx-auto"></div>
                        </CardHeader>
                        <CardContent className="p-12 space-y-8">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-64 bg-slate-200 rounded-3xl"></div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (!product) {
        return <div>Produit non trouvé</div>;
    }

    const formatXAF = (amount: number) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency', currency: 'XAF', minimumFractionDigits: 0
        }).format(amount);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div>
                        <Link
                            href={`/shops/${shopSlug}/products`}
                            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-2 font-semibold"
                        >
                            ← Tous produits
                        </Link>
                        <div className="flex items-center gap-4 mb-4">
                            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
                                {product.name}
                            </h1>
                            <Badge className="text-xl px-6 py-3 font-bold bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg">
                                {product.category.toUpperCase()}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-slate-600">
                            <div className="flex items-center gap-2">
                                <Tag className="w-5 h-5" />
                                <span className="font-mono text-2xl font-bold text-emerald-700">
                                    {formatXAF(product.price)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Hash className="w-5 h-5" />
                                <span className="font-mono">{product.sku}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full ${
                                    product.stock > 10 ? 'bg-emerald-500' :
                                        product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'
                                }`} />
                                <span className={`font-bold ${
                                    product.stock > 10 ? 'text-emerald-700' :
                                        product.stock > 0 ? 'text-amber-700' : 'text-red-700'
                                }`}>
                                    {product.stock} en stock
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 self-start lg:self-center">
                        <ImageSelectorModal
                            triggerButton={
                                <Button className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 shadow-xl h-12 px-8">
                                    <ImagePlus className="w-4 h-4" />
                                    Éditer images
                                </Button>
                            }
                            maxSelection={12}
                            initialSelected={initedImages}
                            onSelect={handleImagesSelect}
                        />
                        <Button
                            onClick={updateImages}
                            className="gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 shadow-xl h-12 px-8"
                            disabled={editingImages.length === 0}
                        >
                            💾 Sauvegarder
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Images Gallery */}
                    <Card className="lg:col-span-2 bg-white/90 backdrop-blur-xl shadow-2xl border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                🖼️ Galerie ({product.images.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8">
                                {product.images.map((img) => (
                                    <div key={img.id} className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02]">
                                        <img
                                            src={img.url}
                                            alt={product?.name}
                                            width={300}
                                            height={300}
                                            className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                            <div className="text-white space-y-1">
                                                <p className="font-bold text-sm truncate">{img.name}</p>
                                                <Badge variant="secondary" className="text-xs">ID: {img.id}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {product.images.length === 0 && (
                                    <div className="col-span-full h-64 flex items-center justify-center text-slate-500 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50">
                                        <ImagePlus className="w-20 h-20 opacity-50 mr-4" />
                                        Aucune image - cliquez "Éditer images"
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sidebar Stats */}
                    <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">

                        {/* Actions */}
                        <Card className="bg-gradient-to-br from-emerald-50/80 to-green-50/80 backdrop-blur-xl shadow-xl border-emerald-200/50">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl flex items-center gap-2">⚡ Actions rapides</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <Button className="w-full h-14 rounded-2xl shadow-lg hover:shadow-xl">
                                    <Link href={`/shops/${shopSlug}/products/${product.id}/edit`}>
                                        <Edit3 className="w-5 h-5 mr-2" />
                                        Modifier produit
                                    </Link>
                                </Button>
                                <Button className="w-full h-14 rounded-2xl border-2 shadow-lg hover:shadow-xl" variant="outline">
                                    <Share2 className="w-5 h-5 mr-2" />
                                    Partager
                                </Button>
                                <Button className="w-full h-14 rounded-2xl border-2 shadow-lg hover:shadow-xl" variant="destructive">
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Supprimer
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xl">📊 Statistiques</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-0">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Prix unitaire</span>
                                        <span className="font-bold text-2xl text-emerald-700">
                                            {formatXAF(product.price)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Stock disponible</span>
                                        <span className={`font-bold text-xl ${
                                            product.stock > 10 ? 'text-emerald-600' :
                                                product.stock > 0 ? 'text-amber-600' : 'text-red-600'
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Images</span>
                                        <Badge className="text-lg px-4 py-2 font-bold bg-blue-500/90 shadow-lg">
                                            {product.images.length}
                                        </Badge>
                                    </div>
                                    {product.dimensions && (
                                        <div className="flex items-center justify-between text-sm text-slate-600">
                                            <span>Dimensions</span>
                                            <span className="font-mono">{product.dimensions}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Description */}
                {product.description && (
                    <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0 lg:col-span-3">
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-3">📝 Description</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 prose prose-lg max-w-none">
                            <p className="text-xl leading-relaxed whitespace-pre-wrap text-slate-800">
                                {product.description}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}