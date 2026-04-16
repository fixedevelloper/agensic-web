"use client";

import React, { useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Package, Tag, ImagePlus, Ruler, Hash, Save, X, AlertCircle, Loader2
} from "lucide-react";
import ImageSelectorModal from "@/components/modals/ImageSelectorModal";  // Votre modal
import Link from "next/link";
import {useSession} from "next-auth/react";

interface ProductForm {
    name: string;
    slug: string;
    description: string;
    price: string;
    category: string;
    sku: string;
    stock: number;
    dimensions?: string;
    images: any[];
}

export default function CreateProductPage() {
    const router = useRouter();
    const params = useParams();
    const shopSlug = params?.slug as string;
    const { data: session } = useSession();
    const [form, setForm] = useState<ProductForm>({
        name: "",
        slug: "",
        description: "",
        price: "",
        category: "",
        sku: "",
        stock: 0,
        dimensions: "",
        images: []
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const userId = session?.user?.id;
    // 1. ImageSelectorModal callback
    const handleImagesSelect = useCallback((selectedImages: any[]) => {
        setForm(prev => ({ ...prev, images: selectedImages }));
        setErrors(prev => ({ ...prev, images: "" }));
    }, []);

    // 2. Auto-générer slug
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setForm(prev => ({
            ...prev,
            name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        }));
    };

    // 3. Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        // Vérifie ton handleSubmit
        const imageIds = form.images
            .filter(img => img.id && img.id !== 0) // Sécurité : on retire les IDs nuls ou 0
            .map(img => img.id);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/shops/${shopSlug}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": String(userId),
                },
                body: JSON.stringify({
                    ...form,
                    price: parseFloat(form.price.replace(/[^\d.]/g, '')),
                    stock: parseInt(form.stock.toString()),
                    images:imageIds
                })
            });

            if (!res.ok) {
                const error = await res.json();
                setErrors(error.errors || { general: "Erreur création" });
                return;
            }

            // Succès → redirect
            router.push(`/customer/shops/${shopSlug}/products`);
        } catch (error) {
            setErrors({ general: "Erreur réseau" });
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        "Électronique & Informatique",
        "Téléphones & Tablettes",
        "Mode & Accessoires",
        "Beauté & Santé",
        "Maison & Cuisine",
        "Meubles & Déco",
        "Électroménager",
        "Sport & Loisirs",
        "Bébé & Jouets",
        "Automobile",
        "Services & Prestations"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center lg:text-left">
                    <Link
                        href={`/customer/shops/${shopSlug}/products`}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-2"
                    >
                        ← Retour produits
                    </Link>
                    <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
                        Nouveau Produit
                    </h1>
                    <p className="text-xl text-slate-600 mt-3 max-w-2xl">
                        Créez votre produit avec images, prix et stock en temps réel.
                    </p>
                </div>

                {/* Form Card */}
                <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
                    <CardContent className="p-8 lg:p-12 space-y-8">

                        {/* Errors */}
                        {errors.general && (
                            <div className="p-6 rounded-2xl border-2 border-red-200/60 bg-red-50/80 backdrop-blur-sm">
                                <div className="flex items-center gap-3 text-red-800">
                                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                                    <span className="font-semibold">{errors.general}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Colonne 1: Infos principales */}
                            <div className="space-y-6">

                                {/* Nom */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">Nom produit</Label>
                                    <Input
                                        value={form.name}
                                        onChange={handleNameChange}
                                        placeholder="Canal+ Mensuel 10k"
                                        className="h-14 text-xl shadow-sm border-2 focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">Slug URL</Label>
                                    <Input
                                        value={form.slug}
                                        onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                                        placeholder="canal-mensuel-10k"
                                        className="h-14 text-lg bg-slate-50 font-mono shadow-sm"
                                    />
                                </div>

                                {/* Prix */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">Prix (CFA)</Label>
                                    <Input
                                        type="text"
                                        value={form.price}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^\d.]/g, '');
                                            setForm(prev => ({ ...prev, price: parseFloat(value).toLocaleString('fr-FR') }));
                                        }}
                                        placeholder="12500"
                                        className="h-14 text-xl font-mono text-emerald-700 shadow-sm focus:border-emerald-500"
                                    />
                                    <p className="text-sm text-slate-500 mt-1 font-mono">
                                        {form.price ? parseFloat(form.price.replace(/[^\d.]/g, '')).toLocaleString('fr-FR') + ' CFA' : ''}
                                    </p>
                                </div>

                                {/* Catégorie */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">Catégorie</Label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full h-14 p-4 text-xl border-2 rounded-2xl shadow-sm focus:border-emerald-500 focus:outline-none bg-white"
                                        required
                                    >
                                        <option value="">Sélectionner...</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* SKU */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">SKU</Label>
                                    <Input
                                        value={form.sku}
                                        onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value.toUpperCase() }))}
                                        placeholder="CANAL-M10K-001"
                                        className="h-14 text-lg font-mono uppercase shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Colonne 2: Images + Stock + Description */}
                            <div className="space-y-6">

                                {/* Images avec Modal */}
                                <div>
                                    <Label className="text-lg font-semibold mb-4 block flex items-center gap-2">
                                        🖼️ Images ({form.images.length})
                                    </Label>
                                    <div className="space-y-4">
                                        {form.images.length === 0 ? (
                                            <div className="h-48 border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center bg-slate-50/50 text-slate-500">
                                                <ImagePlus className="w-16 h-16 opacity-50 mr-4" />
                                                <span className="font-semibold text-lg">Cliquez pour ajouter des images</span>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-auto p-2 bg-slate-50 rounded-2xl">
                                                {form.images.slice(0, 9).map((img, idx) => (
                                                    <div key={img.id || idx} className="group relative bg-white rounded-2xl shadow-md p-2 hover:shadow-xl transition-all">
                                                        <img
                                                            src={img.url || img}
                                                            alt={img.name}
                                                            className="w-full h-24 object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform"
                                                        />
                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Badge variant="destructive" className="cursor-pointer"
                                                                   onClick={() => setForm(prev => ({
                                                                       ...prev,
                                                                       images: prev.images.filter((_, i) => i !== idx)
                                                                   }))}
                                                            >
                                                                ✕
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* ✅ ImageSelectorModal */}
                                        <ImageSelectorModal
                                            triggerButton={
                                                <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 shadow-xl text-lg font-bold rounded-2xl">
                                                    <ImagePlus className="w-5 h-5 mr-2" />
                                                    {form.images.length === 0 ? "Ajouter images" : `+${9 - form.images.length} images`}
                                                </Button>
                                            }
                                            maxSelection={9}
                                            onSelect={handleImagesSelect}
                                        />

                                        {errors.images && (
                                            <p className="text-red-600 text-sm flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" /> {errors.images}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Stock */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">Stock</Label>
                                    <Input
                                        type="number"
                                        value={form.stock}
                                        onChange={(e) => setForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                                        min="0"
                                        className="h-14 text-2xl font-mono text-emerald-600 shadow-sm focus:border-emerald-500"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Dimensions */}
                                <div>
                                    <Label className="text-lg font-semibold mb-2 block">Dimensions (optionnel)</Label>
                                    <Input
                                        value={form.dimensions}
                                        onChange={(e) => setForm(prev => ({ ...prev, dimensions: e.target.value }))}
                                        placeholder="10x15cm ou 500g"
                                        className="h-14 text-lg shadow-sm"
                                    />
                                </div>

                                {/* Description */}
                                <div className="lg:col-span-2">
                                    <Label className="text-lg font-semibold mb-2 block">Description</Label>
                                    <Textarea
                                        value={form.description}
                                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Détails du produit, avantages, utilisation..."
                                        rows={4}
                                        className="h-32 text-lg resize-none shadow-sm focus:border-emerald-500 p-6"
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t bg-gradient-to-r from-slate-50/50">
                            <Button
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 h-16 bg-gradient-to-r from-emerald-600 to-green-600
                                           hover:from-emerald-700 hover:to-green-700 shadow-2xl hover:shadow-3xl
                                           font-bold text-xl rounded-3xl border-0 disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                        Création...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-6 h-6 mr-3" />
                                        Créer produit
                                    </>
                                )}
                            </Button>
                            <Link
                                href={`/shops/${shopSlug}/products`}
                                className="flex-1 h-16 bg-white/80 backdrop-blur-xl hover:bg-slate-100
                                           border-2 border-slate-200 shadow-lg hover:shadow-xl
                                           font-bold text-xl rounded-3xl text-slate-800 flex items-center justify-center"
                            >
                                <X className="w-6 h-6 mr-3" />
                                Annuler
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}