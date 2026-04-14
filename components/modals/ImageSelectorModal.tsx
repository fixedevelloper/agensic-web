"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Library,
    PlusCircle,
    Search,
    CheckCircle2,
    X,
    CloudUpload,
    Image as ImageIcon
} from "lucide-react";
import {useSession} from "next-auth/react";
import {Image} from "../../app/types/type";



interface ImageSelectorProps {
    triggerButton?: React.ReactNode;
    onSelect: (images: Image[]) => void;
    maxSelection?: number;
    initialSelected?: Image[];
}

export default function ImageSelectorModal({
                                               triggerButton = <Button>Choisir images</Button>,
                                               onSelect,
                                               maxSelection = 10,
                                               initialSelected = []
                                           }: ImageSelectorProps) {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<Image[]>([]);
    const [selectedImages, setSelectedImages] = useState<Image[]>(initialSelected);
    const [search, setSearch] = useState("");
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState("library");
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [customName, setCustomName] = useState("");
    const userId = session?.user?.id;

    const fetchImages = useCallback(async () => {
        // On ne lance l'appel que si userId est défini
        if (!userId) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/images`, {
                headers: {
                    "X-User-Id": String(userId),
                },
            });
            const data = await res.json();
            setImages(data.data || []);
        } catch (error) {
            console.error("Erreur:", error);
        }
    }, [userId]); // IMPORTANT : userId doit être ici

    useEffect(() => {
        if (open) fetchImages();
    }, [open, fetchImages]);

    const handleImageClick = (image: Image) => {
        const isSelected = selectedImages.some(img => img.id === image.id);
        if (isSelected) {
            setSelectedImages(prev => prev.filter(img => img.id !== image.id));
        } else if (selectedImages.length < maxSelection) {
            setSelectedImages(prev => [...prev, image]);
        }
    };


    const handleConfirm = () => {
        onSelect(selectedImages);
        setOpen(false);
    };

    const filteredImages = images.filter(img =>
        img.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                {triggerButton}
            </DialogTrigger>

            {/* Largeur Maximale : max-w-screen-2xl */}
            <DialogContent className="max-w-[98vw] 2xl:max-w-screen-2xl w-full h-[95vh] p-0 flex flex-col gap-0 border-none shadow-2xl rounded-2xl overflow-hidden">

                {/* Header Unifié */}
                <div className="bg-white border-b px-8 py-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-emerald-100 p-2 rounded-lg">
                            <Library className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-slate-900">Gestionnaire de Médias</DialogTitle>
                            <p className="text-sm text-slate-500">Gérez et sélectionnez vos visuels</p>
                        </div>
                    </div>

                    <Badge variant="outline" className="text-md px-4 py-2 border-2 border-emerald-100 bg-emerald-50 text-emerald-700 font-bold rounded-full">
                        {selectedImages.length} / {maxSelection} sélectionnés
                    </Badge>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar de sélection (Panier) */}
                    <aside className="w-72 border-r bg-slate-50/50 flex flex-col shrink-0">
                        <div className="p-4 border-b bg-white/50">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Votre sélection</span>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            {selectedImages.length === 0 ? (
                                <div className="h-40 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl">
                                    <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                                    <p className="text-xs font-medium">Vide</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {selectedImages.map(img => (
                                        <div key={`sel-${img.id}`} className="relative group aspect-square rounded-lg overflow-hidden border border-emerald-200">
                                            <img src={img.url} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => handleImageClick(img)}
                                                className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                            >
                                                <X className="text-white w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        <div className="p-4 bg-white border-t">
                            <Button onClick={handleConfirm} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 rounded-xl shadow-lg shadow-emerald-200" disabled={selectedImages.length === 0}>
                                Confirmer la sélection
                            </Button>
                        </div>
                    </aside>

                    {/* Zone de contenu principale avec Tabs */}
                    <main className="flex-1 bg-white flex flex-col min-w-0">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                            <div className="px-8 py-2 border-b flex items-center justify-between">
                                <TabsList className="bg-transparent gap-8 h-14">
                                    <TabsTrigger value="library" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none bg-transparent px-0 text-md font-semibold h-full">
                                        <Library className="w-4 h-4 mr-2" />
                                        Médiathèque
                                    </TabsTrigger>
                                    <TabsTrigger value="upload" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none bg-transparent px-0 text-md font-semibold h-full">
                                        <PlusCircle className="w-4 h-4 mr-2" />
                                        Ajouter image
                                    </TabsTrigger>
                                </TabsList>

                                {activeTab === "library" && (
                                    <div className="relative w-80">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            placeholder="Chercher par nom..."
                                            className="pl-10 h-10 bg-slate-50 border-none rounded-full"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>

                            <TabsContent value="library" className="flex-1 m-0 p-8 pt-6">
                                <ScrollArea className="h-full pr-4">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
                                        {filteredImages.map((img) => {
                                            const isSelected = selectedImages.some(s => s.id === img.id);
                                            return (
                                                <div
                                                    key={img.id}
                                                    onClick={() => handleImageClick(img)}
                                                    className={`group relative aspect-[4/3] rounded-xl cursor-pointer transition-all duration-200 overflow-hidden border-4 shadow-sm ${
                                                        isSelected ? 'border-emerald-500 ring-4 ring-emerald-50' : 'border-white hover:border-slate-200'
                                                    }`}
                                                >
                                                    <img src={img.url} alt={img.name} className={`w-full h-full object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover:scale-110'}`} />

                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-emerald-500/10 flex items-center justify-center">
                                                            <div className="bg-emerald-500 text-white rounded-full p-1 shadow-xl">
                                                                <CheckCircle2 className="w-6 h-6" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <p className="text-white text-[11px] font-medium truncate">{img.name}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="upload" className="flex-1 m-0 flex items-center justify-center bg-slate-50/30">
                                <div className="w-full max-w-2xl p-12 bg-white rounded-3xl border-2 border-slate-200 shadow-sm text-center relative">

                                    {!pendingFile ? (
                                        /* --- ZONE DE DROP INITIALE --- */
                                        <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl p-10 hover:border-emerald-400 transition-all">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setPendingFile(file);
                                                        setCustomName(file.name.split('.')[0]); // Pré-remplit avec le nom du fichier sans extension
                                                    }
                                                }}
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="space-y-4">
                                                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                                    <CloudUpload className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-800">Choisir une image</h3>
                                                    <p className="text-sm text-slate-500 mt-1">Glissez-déposez ou cliquez pour commencer</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        /* --- FORMULAIRE D'ENREGISTREMENT --- */
                                        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                                            <div className="flex flex-col items-center">
                                                <div className="relative w-40 h-40 rounded-xl overflow-hidden border-4 border-emerald-50 shadow-md mb-4">
                                                    <img
                                                        src={URL.createObjectURL(pendingFile)}
                                                        className="w-full h-full object-cover"
                                                        alt="Preview"
                                                    />
                                                    <button
                                                        onClick={() => setPendingFile(null)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-slate-500">Aperçu du fichier</p>
                                            </div>

                                            <div className="space-y-4 text-left">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 ml-1">
                                                        Nom de l'image en base de données
                                                    </label>
                                                    <Input
                                                        value={customName}
                                                        onChange={(e) => setCustomName(e.target.value)}
                                                        placeholder="Ex: Bannière Promotionnelle Printemps"
                                                        className="h-12 border-slate-200 focus-visible:ring-emerald-500"
                                                    />
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setPendingFile(null)}
                                                        className="flex-1 h-12 rounded-xl"
                                                        disabled={uploading}
                                                    >
                                                        Annuler
                                                    </Button>
                                                    <Button
                                                        onClick={async () => {
                                                            if (!pendingFile) return;
                                                            setUploading(true);

                                                            const formData = new FormData();
                                                            formData.append("image", pendingFile);
                                                            formData.append("name", customName); // On envoie le nom personnalisé

                                                            try {
                                                                const res = await fetch(`${process.env.NEXT_PUBLIC_API_ECOMMERCE_SERVICE_URL}/api/images/upload`, {
                                                                    method: "POST",
                                                                    headers: {
                                                                        "X-User-Id": String(userId),
                                                                    },
                                                                    body: formData
                                                                });
                                                                const data = await res.json();
                                                                if (res.ok) {
                                                                    setImages(prev => [data.data, ...prev]);
                                                                    setPendingFile(null);
                                                                    setActiveTab("library");
                                                                }
                                                            } catch (error) {
                                                                console.error("Upload failed", error);
                                                            } finally {
                                                                setUploading(false);
                                                            }
                                                        }}
                                                        className="flex-[2] h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100"
                                                        disabled={uploading || !customName.trim()}
                                                    >
                                                        {uploading ? (
                                                            <>
                                                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                                Enregistrement...
                                                            </>
                                                        ) : (
                                                            "Enregistrer dans la base de données"
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </DialogContent>
        </Dialog>
    );
}