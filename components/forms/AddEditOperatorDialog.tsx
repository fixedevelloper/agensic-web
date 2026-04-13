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
import {Operator} from "../../app/types/type";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    operator?: Operator | null;
    country_id: string;
    onSubmit: (data: FormData) => Promise<void>;
};

export function AddEditOperatorDialog({
                                          open,
                                          onOpenChange,
                                          operator,
                                          country_id,
                                          onSubmit,
                                      }: Props) {
    const isCreate = !operator;

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        country_id: country_id,
        status: "active",
        logo: "",
        logo_url: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Sync edit
    useEffect(() => {
        if (operator) {
            setFormData({
                name: operator.name ?? "",
                code: operator.code ?? "",
                country_id: operator.country_id ?? country_id,
                status: operator.status ?? "active",
                logo: operator.logo ?? "",
                logo_url: operator.logo_url ?? "",
            });
        } else {
            setFormData({
                name: "",
                code: "",
                country_id: country_id,
                status: "active",
                logo: "",
                logo_url: "",
            });
        }
    }, [operator, country_id]);

    // Reset file
    useEffect(() => {
        if (!open) setSelectedFile(null);
    }, [open]);

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
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();

        fd.append("name", formData.name);
        fd.append("code", formData.code);
        fd.append("country_id", String(formData.country_id));
        fd.append("status", formData.status);

        if (selectedFile) {
            fd.append("logo", selectedFile);
        }

        await onSubmit(fd);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isCreate ? "Ajouter un opérateur" : "Modifier l’opérateur"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Champs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Nom</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label>Code</Label>
                            <Input
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <Label>Status</Label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                        </select>
                    </div>

                    {/* Upload */}
                    <div>
                        <Label>Logo</Label>
                        <Input type="file" accept="image/*" onChange={handleFileChange} />

                        {formData.logo && (
                            <div className="mt-2 flex items-center gap-2">
                                <Image
                                    src={formData.logo_url}
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