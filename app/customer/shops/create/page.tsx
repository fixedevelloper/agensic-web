"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Store, ImagePlus, MapPin, ShieldCheck, Zap, CheckCircle2,
    Loader2, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const categories = [
    { value: "vetements", label: "Vetements", icon: ShieldCheck },
    { value: "electronique", label: "Electronique", icon: Zap },
    { value: "digital", label: "Produits Numériques", icon: ImagePlus },
    { value: "services", label: "Services", icon: Store },
    { value: "physical", label: "Articles Physiques", icon: MapPin },
];

export default function CreateShop() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        location: "",  // Douala, Yaoundé...
    });
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const baseUrl_ecommerce_service = process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL;
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const submitData = new FormData();

            submitData.append("name", formData.name);
            submitData.append("category", formData.category);
            submitData.append("description", formData.description ?? "");
            submitData.append("location", formData.location ?? "");

            if (logoFile) {
                submitData.append("logo", logoFile);
            }

            const userId = session?.user?.id;

            const res = await fetch(`${baseUrl_ecommerce_service}/api/shops`, {
                method: "POST",
                headers: {
                    "X-User-Id": String(userId),
                },
                body: submitData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Erreur serveur");
            }

            toast.success("Boutique créée !");
            router.push(`/customer/shops/${data.data.slug}`); // ⚠️ Laravel retourne souvent data.data
            router.refresh();

        } catch (error: any) {
            console.error("Shop creation error:", error);
            toast.error(error.message || "Erreur création boutique");
        } finally {
            setLoading(false);
        }
    }, [formData, logoFile, router, session]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size < 5 * 1024 * 1024 && file.type.startsWith('image/')) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            toast.error("Image < 5Mo (JPG/PNG)");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <Store className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent mb-4">
                        Créez votre Boutique
                    </h1>
                    <p className="text-xl text-slate-600 max-w-md mx-auto">
                        Vendez vos articles sur la plateforme.
                    </p>
                </div>

                {/* Form Card */}
                <Card className="bg-white/90 backdrop-blur-xl shadow-2xl border-0 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 pb-8">
                        <CardTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <ShieldCheck className="w-7 h-7 text-emerald-600" />
                            Informations Boutique
                        </CardTitle>
                        <CardDescription>
                            Remplissez pour créer votre point de vente PayLink
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8 pt-0 space-y-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Nom Boutique */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-lg font-semibold">
                                    Nom de la boutique <span className="text-emerald-600">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="ex: Canal+ Bonapriso, Recharge Express"
                                    required
                                    className="h-14 text-lg border-2 focus-visible:ring-4 focus-visible:ring-emerald-500/20 shadow-sm"
                                />
                            </div>

                            {/* Catégorie */}
                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-lg font-semibold">
                                    Catégorie principale
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {categories.map(cat => (
                                        <Button
                                            key={cat.value}
                                            type="button"
                                            variant={formData.category === cat.value ? "default" : "outline"}
                                            onClick={() => setFormData({...formData, category: cat.value})}
                                            className="h-20 flex flex-col gap-2 justify-start p-4 rounded-2xl border-2 hover:border-emerald-300 hover:shadow-md transition-all"
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                                formData.category === cat.value
                                                    ? "bg-emerald-500 text-white shadow-lg"
                                                    : "bg-slate-100 text-slate-700"
                                            }`}>
                                                <cat.icon className="w-5 h-5" />
                                            </div>
                                            <span className="font-semibold text-sm">{cat.label}</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-lg font-semibold">
                                    Description (optionnel)
                                </Label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows={4}
                                    placeholder="Ex: Revendeur officiel Canal+ à Douala Bonanjo. Réabonnements immédiats + commissions."
                                    className="w-full h-32 p-4 border-2 rounded-2xl bg-slate-50/50 text-lg focus-visible:ring-4 focus-visible:ring-emerald-500/20 resize-vertical shadow-sm"
                                />
                            </div>

                            {/* Location */}
                            <div className="grid grid-cols-2 gap-4 items-end">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-lg font-semibold">
                                        Localisation
                                    </Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        placeholder="ex: Bonapriso, Douala"
                                        className="h-14 text-lg border-2 focus-visible:ring-4 focus-visible:ring-emerald-500/20 shadow-sm"
                                    />
                                </div>

                                {/* Logo Upload */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-semibold flex items-center gap-2">
                                        <ImagePlus className="w-5 h-5" />
                                        Logo boutique (JPG/PNG 1 max Mo)
                                    </Label>
                                    <div className="space-y-3">
                                        <input
                                            type="file"
                                            onChange={handleLogoChange}
                                            accept="image/jpeg,image/png"
                                            className="w-full file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer h-14"
                                        />
                                        {logoPreview && (
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="w-24 h-24 object-cover rounded-2xl shadow-md mx-auto border-4 border-slate-200"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-8">
                                <Link
                                    href="/customer"
                                    className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 px-8 rounded-2xl shadow-sm hover:shadow-md transition-all"
                                >
                                    ← Annuler
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={loading || !formData.name || !formData.category}
                                    size="lg"
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-xl hover:shadow-2xl font-bold text-lg py-6 px-12 rounded-2xl transition-all transform hover:-translate-y-1 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                            Création...
                                        </>
                                    ) : (
                                        <>
                                            <Store className="w-6 h-6 mr-3" />
                                            Créer ma Boutique
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Aperçu */}
                <div className="text-center text-sm text-slate-500 mt-12">
                    <p>Une fois créée, votre boutique sera accessible sur <Badge>paylink.cm/shop/votre-nom</Badge></p>
                </div>
            </div>
        </div>
    );
}