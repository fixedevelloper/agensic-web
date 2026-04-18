"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import {
    Globe, Edit, Trash2, MoreVertical, Loader2, Plus, Flag
} from "lucide-react";
import { toast } from "sonner";

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import axiosServices from "../../../utils/axiosServices";
import { AddEditCountryDialog } from "./AddEditCountryDialog";
import {Country} from "../../types/type"; // À créer si non existant

interface CountryClientProps {
    countries: Country[];
}

export function CountryClient({ countries }: CountryClientProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // --- LOGIQUE CRUD ---

    const handleAdd = async (data: FormData) => {
        try {
            await axiosServices.post("/api/countries", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Pays ajouté avec succès");
            setOpenDialog(false);
            window.location.reload(); // Rechargement simple pour mettre à jour la liste
        } catch (error) {
            toast.error("Erreur lors de l'ajout");
        }
    };

    const handleEdit = async (data: FormData) => {
        try {
            data.append("_method", "PUT");
            await axiosServices.post(`/api/countries/${editingCountry?.id}`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Pays mis à jour");
            setOpenDialog(false);
            window.location.reload();
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce pays ?")) return;

        setDeletingId(id);
        try {
            await axiosServices.delete(`/api/countries/${id}`);
            toast.success("Pays supprimé");
            window.location.reload();
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <div>
                        <CardTitle className="text-2xl font-black flex items-center gap-2">
                            <Flag className="text-blue-600 size-6" />
                            Zones d'Opérations
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Configuration des pays et passerelles locales.</p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingCountry(null);
                            setOpenDialog(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100"
                    >
                        <Plus className="w-4 h-4 mr-2"/>
                        Ajouter un Pays
                    </Button>
                </CardHeader>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow>
                                <TableHead className="w-[60px]">ID</TableHead>
                                <TableHead>Drapeau</TableHead>
                                <TableHead>Pays</TableHead>
                                <TableHead>ISO</TableHead>
                                <TableHead>Préfixe</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {countries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                                        Aucun pays n'a encore été configuré.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                countries.map((country) => (
                                    <TableRow key={country.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-mono text-xs text-slate-400">#{country.id}</TableCell>
                                        <TableCell>
                                            <div className="w-10 h-7 rounded-md overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                                                <img
                                                    src={country.flag_url || `https://flagcdn.com/w80/${country.iso?.toLowerCase()}.png`}
                                                    alt={country.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://flagcdn.com/w80/un.png'; }}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-700">{country.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono text-[10px] bg-slate-100">
                                                {country.iso?.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-blue-600">+{country.phonecode}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`text-[10px] font-black border-none ${
                                                    country.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-orange-50 text-orange-600'
                                                }`}
                                            >
                                                {(country.status || "inactive")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger >
                                                    <Button variant="ghost" size="icon" className="h-8 w-10 hover:bg-slate-100">
                                                        <MoreVertical className="size-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-52">
                                                    <DropdownMenuItem onClick={() => { setEditingCountry(country); setOpenDialog(true); }}>
                                                        <Edit className="size-4 mr-2"/> Modifier
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <Link href={`/dashboard/countries/${country.id}/operators`}>
                                                            <Globe className="size-4 mr-2"/> Gérer Opérateurs
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <Link href={`/dashboard/countries/${country.iso}/banks`}>
                                                            <Plus className="size-4 mr-2"/> Gérer Banques
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(country.id!)}
                                                        className="text-red-600 focus:text-red-600 mt-2 border-t pt-2"
                                                        disabled={deletingId === country.id}
                                                    >
                                                        {deletingId === country.id ? (
                                                            <Loader2 className="size-4 mr-2 animate-spin"/>
                                                        ) : (
                                                            <Trash2 className="size-4 mr-2"/>
                                                        )}
                                                        Supprimer le pays
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            <AddEditCountryDialog
                open={openDialog}
                onOpenChange={setOpenDialog}
                country={editingCountry}
                onSubmit={editingCountry ? handleEdit : handleAdd}
            />
        </div>
    );
}