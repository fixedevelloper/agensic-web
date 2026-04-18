"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from "lucide-react";
import {Country} from "../../types/type";

// Schéma de validation
const formSchema = z.object({
    name: z.string().min(2, "Le nom est requis"),
    iso: z.string().min(2, "Code ISO requis (ex: CM)").max(3),
    phonecode: z.string().min(1, "Code téléphonique requis"),
    status: z.enum(["active", "inactive"]),
    flag: z.any().optional(),
});

interface AddEditCountryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    country: Country | null;
    onSubmit: (data: FormData) => Promise<void>;
}

export function AddEditCountryDialog({
                                         open,
                                         onOpenChange,
                                         country,
                                         onSubmit,
                                     }: AddEditCountryDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            iso: "",
            phonecode: "",
            status: "active",
        },
    });

    // Reset du formulaire quand on ouvre en mode édition
    useEffect(() => {
        if (country) {
            form.reset({
                name: country.name,
                iso: country.iso,
                phonecode: country.phonecode.toString(),
                status: country.status as "active" | "inactive",
            });
        } else {
            form.reset({
                name: "",
                iso: "",
                phonecode: "",
                status: "active",
            });
        }
    }, [country, form, open]);

    const handleInternalSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("iso", values.iso);
        formData.append("phonecode", values.phonecode);
        formData.append("status", values.status);

        // Gestion du fichier image
        if (values.flag && values.flag[0]) {
            formData.append("flag", values.flag[0]);
        }

        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {country ? "Modifier le pays" : "Ajouter un nouveau pays"}
                    </DialogTitle>
                    <DialogDescription>
                        Configurez les informations de la zone géographique et son statut.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleInternalSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nom du pays</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Cameroun" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="iso"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code ISO (2 lettres)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="CM" {...field} maxLength={2} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phonecode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Indicatif Tél.</FormLabel>
                                        <FormControl>
                                            <Input placeholder="237" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Statut opérationnel</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un statut" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Actif (Visible)</SelectItem>
                                            <SelectItem value="inactive">Inactif (Masqué)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="flag"
                            render={({ field: { value, onChange, ...field } }) => (
                                <FormItem>
                                    <FormLabel>Drapeau (Optionnel)</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 border-slate-300">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <UploadCloud className="w-8 h-8 mb-3 text-slate-400" />
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Cliquez pour uploader le drapeau (SVG, PNG)
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => onChange(e.target.files)}
                                                    {...field}
                                                />
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => onOpenChange(false)}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {country ? "Enregistrer les modifications" : "Créer le pays"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}