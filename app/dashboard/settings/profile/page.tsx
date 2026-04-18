"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
    User, Mail, Phone, Lock, Camera, Loader2, Save, ShieldCheck
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Schéma de validation
const profileSchema = z.object({
    name: z.string().min(2, "Le nom est trop court"),
    email: z.string().email("Email invalide"),
    phone: z.string().optional(),
    current_password: z.string().optional(),
    new_password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères").optional().or(z.literal('')),
});

export default function SettingProfilPage() {
    const [isUpdating, setIsUpdating] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "Christian Mbappé",
            email: "admin@exemple.cm",
            phone: "+237 600 000 000",
        },
    });

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        setIsUpdating(true);
        try {
            // Simulation appel API
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(values);
            toast.success("Profil mis à jour avec succès");
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Mon Profil</h1>
                <p className="text-muted-foreground">Gérez vos informations personnelles et votre sécurité.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* SECTION : INFORMATIONS GÉNÉRALES */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="size-5 text-blue-600" /> Informations Personnelles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Gestion de l'Avatar */}
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <Avatar className="size-24 border-4 border-white shadow-md">
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>AD</AvatarFallback>
                                    </Avatar>
                                    <button type="button" className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera className="size-6" />
                                    </button>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-700">Photo de profil</p>
                                    <p className="text-xs text-muted-foreground mb-3">PNG, JPG ou GIF. Max 2Mo.</p>
                                    <Button variant="outline" size="sm" type="button">Changer l'image</Button>
                                </div>
                            </div>

                            <Separator />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom complet</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                                    <Input className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresse Email</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                                    <Input className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Téléphone</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                                    <Input className="pl-10" {...field} />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* SECTION : SÉCURITÉ */}
                    <Card className="border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Lock className="size-5 text-rose-600" /> Sécurité du compte
                            </CardTitle>
                            <CardDescription>Laissez vide si vous ne souhaitez pas changer de mot de passe.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="current_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe actuel</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="new_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nouveau mot de passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Min. 6 caractères" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" type="button" onClick={() => form.reset()}>Réinitialiser</Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={isUpdating}>
                            {isUpdating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                            Sauvegarder
                        </Button>
                    </div>

                </form>
            </Form>

            {/* BADGE DE CONFIANCE (Bonus) */}
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-4">
                <div className="bg-emerald-500 p-2 rounded-lg text-white">
                    <ShieldCheck className="size-6" />
                </div>
                <div>
                    <p className="text-sm font-bold text-emerald-900">Compte Administrateur Protégé</p>
                    <p className="text-xs text-emerald-700">Votre session est sécurisée par un chiffrement de bout en bout.</p>
                </div>
            </div>
        </div>
    );
}