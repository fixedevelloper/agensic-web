'use client'
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {Country} from "../../types/type";
import {AddEditCountryDialog} from "@/components/forms/AddEditCountryDialog";
import {Button} from "@/components/ui/button";  // ✅ Chemin corrigé
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";  // ✅ Chemin corrigé
import {Edit, Globe, MoreVertical, Trash2, Loader2} from "lucide-react";
import Link from "next/link";
import {toast} from "sonner";  // npm i sonner
import {useState, useTransition} from "react";
import axiosServices from "../../../utils/axiosServices";

interface CountryClientProps {
    countries: Country[];
}

export function CountryClient({countries}: CountryClientProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleAdd = async (data: FormData) => {
        try {
            await axiosServices.post("/api/countries", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Pays ajouté avec succès");
            setOpenDialog(false);
            // Refresh : window.location.reload() ou SWR mutate()
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
        } catch (error) {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await axiosServices.delete(`/api/countries/${id}`);
            toast.success("Pays supprimé");
        } catch (error) {
            toast.error("Erreur suppression");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Card className="shadow-xl border-0">
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <div>
                        <CardTitle className="text-2xl font-bold">Liste des Pays</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Gestion des pays et zones (CM, CG, CD...)</p>
                    </div>
                    <Button
                        size="lg"
                        onClick={() => {
                            setEditingCountry(null);
                            setOpenDialog(true);
                        }}
                        className="shadow-lg hover:shadow-xl"
                    >
                        <Globe className="w-4 h-4 mr-2"/>
                        Ajouter Pays
                    </Button>
                </CardHeader>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b-2 border-slate-200">
                                <TableHead>ID</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>ISO</TableHead>
                                <TableHead>Tél.</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Drapeau</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {countries.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                        Aucun pays configuré
                                    </TableCell>
                                </TableRow>
                            ) : (
                                countries.map((country) => (
                                    <TableRow key={country.id} className="hover:bg-slate-50/50 border-b">
                                        <TableCell className="font-mono text-sm">{country.id}</TableCell>
                                        <TableCell className="font-semibold">{country.name}</TableCell>
                                        <TableCell>
                                            <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold">
                                                {country.iso?.toUpperCase()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="font-mono">+{country.phonecode}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                country.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {country.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <img
                                                src={country.flag_url || `/flags/${country.iso.toLowerCase()}.svg`}
                                                alt={country.name}
                                                width={32}
                                                height={24}
                                                className="rounded-lg shadow-md"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = '/flags/xx.svg';
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                                        <MoreVertical className="size-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56">
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setEditingCountry(country);
                                                            setOpenDialog(true);
                                                        }}
                                                        className="cursor-pointer"
                                                    >
                                                        <Edit className="size-4 mr-2"/>
                                                        Modifier
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <Link
                                                            href={`/dashboard/countries/${country.id}/operators`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Globe className="size-4 mr-2"/>
                                                            Opérateurs (12)
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem>
                                                        <Link
                                                            href={`/dashboard/countries/${country.iso}/banks`}
                                                            className="cursor-pointer"
                                                        >
                                                            <Globe className="size-4 mr-2"/>
                                                            Banques (8)
                                                        </Link>
                                                    </DropdownMenuItem>

                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(country.id!)}
                                                        className="text-red-600 focus:text-red-600 border-t border-slate-200"
                                                        disabled={deletingId === country.id}
                                                    >
                                                        {deletingId === country.id ? (
                                                            <>
                                                                <Loader2 className="size-4 mr-2 animate-spin"/>
                                                                Suppression...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Trash2 className="size-4 mr-2"/>
                                                                Supprimer
                                                            </>
                                                        )}
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
        </>
    );
}