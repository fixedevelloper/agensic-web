// components/forms/AddEditCountryDialog.tsx
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {Country} from "../../app/types/type";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    country?: Country | null;
    onSubmit: (data: FormData) => Promise<void>;
};

export function AddEditCountryDialog({
                                         open,
                                         onOpenChange,
                                         country,
                                         onSubmit,
                                     }: Props) {
    const isCreate = !country;
    const [formData, setFormData] = useState<Omit<Country, "id">>({
        name: "",
        currency: "",
        iso: "",
        iso3: "",
        phonecode: "",
        status: "active",
        flag: "",
        flag_url:  "",
    });
    useEffect(() => {
        if (country) {
            setFormData({
                name: country.name ?? "",
                currency: country.currency ?? "",
                iso: country.iso ?? "",
                iso3: country.iso3 ?? "",
                phonecode: country.phonecode ?? "",
                status: country.status ?? "active",
                flag: country.flag ?? "",
                flag_url: country.flag_url ?? "",
            });
        } else {
            // reset si mode création
            setFormData({
                name: "",
                currency: "",
                iso: "",
                iso3: "",
                phonecode: "",
                status: "active",
                flag: "",
                flag_url:  "",
            });
        }
    }, [country]);
    useEffect(() => {
        if (!open) {
            setSelectedFile(null);
        }
    }, [open]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            // Tu peux mettre ici un base64 ou bien l’envoyer plus tard via formData
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, flag: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        formDataToSend.append("name", formData.name);
        formDataToSend.append("iso", formData.iso);
        formDataToSend.append("iso3", formData.iso3);
        formDataToSend.append("phonecode", formData.phonecode);
        formDataToSend.append("currency", formData.currency || "");
        formDataToSend.append("status", formData.status);

        if (selectedFile) {
            formDataToSend.append("flag", selectedFile);
        }

        await onSubmit(formDataToSend);

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>
                        {isCreate ? "Ajouter un pays" : "Modifier le pays"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-2">
                    {/* Champs existants */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nom du pays</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="ex: France"
                                required
                            />
                        </div>
                        <div>
                            <Label>Code ISO</Label>
                            <Input
                                name="iso"
                                value={formData.iso}
                                onChange={handleChange}
                                placeholder="ex: FR"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Code ISO3</Label>
                            <Input
                                name="iso3"
                                value={formData.iso3}
                                onChange={handleChange}
                                placeholder="ex: FRA"
                                required
                            />
                        </div>
                        <div>
                            <Label>Indicatif téléphonique</Label>
                            <Input
                                name="phonecode"
                                value={formData.phonecode}
                                onChange={handleChange}
                                placeholder="ex: +33"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Devise</Label>
                            <Input
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                placeholder="ex: EUR"
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                            >
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                            </select>
                        </div>
                    </div>

                    {/* Upload du drapeau */}
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="flag">Drapeau</Label>
                        <Input id="flag" type="file" accept="image/*" onChange={handleFileChange} />

                        {formData.flag && (
                            <div className="mt-2 flex items-center gap-2">
                                <Image
                                    src={formData.flag_url}
                                    alt="Drapeau"
                                    width={40}
                                    height={30}
                                    className="rounded"
                                />
                                <span className="text-xs text-muted-foreground">
                  {selectedFile?.name}
                </span>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => onOpenChange(false)}
                        >
                            Annuler
                        </Button>
                        <Button type="submit">
                            {isCreate ? "Ajouter" : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}