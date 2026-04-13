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

import React, {useState} from "react";
import {Country} from "../../types/type";


import { AddEditCountryDialog } from "@/components/forms/AddEditCountryDialog";
import {Button} from "../../../components/ui/button";
import axiosServices from "../../../utils/axiosServices";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../../components/ui/dropdown-menu";
import {Globe, MoreVertical} from "lucide-react";
import Link from "next/link";

export function CountryClient({
                                  countries,
                              }: { countries: Country[] }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingCountry, setEditingCountry] = useState<Country | null>(null);

    const handleAdd = async (data: FormData) => {
        console.log("Ajouter FormData:", data);

        await axiosServices.post("api/countries", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    const handleEdit = async (data: FormData) => {
        data.append("_method", "PUT");

        await axiosServices.post(`api/countries/${editingCountry?.id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    console.log(countries)
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des pays</CardTitle>
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditingCountry(null);
                            setOpenDialog(true);
                        }}
                    >
                        Ajouter un pays
                    </Button>
                </CardHeader>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom du pays</TableHead>
                            <TableHead>Code ISO</TableHead>
                            <TableHead>Zone téléphonique</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {countries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                    Aucun pays trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            countries.map((country) => (
                                <TableRow key={country.id}>
                                    <TableCell>{country.id}</TableCell>
                                    <TableCell>{country.name}</TableCell>
                                    <TableCell>{country.iso.toUpperCase()}</TableCell>
                                    <TableCell>{country.phonecode}</TableCell>
                                    <TableCell>{country.status}</TableCell>
                                    <TableCell>
                                        <img
                                            src={country.flag_url}
                                            alt={country.name}
                                            width={40}
                                            height={30}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger  >
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" side="top">
                                                <DropdownMenuItem onClick={() =>{
                                                    setEditingCountry(country);
                                                    setOpenDialog(true);

                                                }

                                                }>
                                                    Modifier
                                                </DropdownMenuItem>

                                                <DropdownMenuItem>
                                                    <Link
                                                        href={`/countries/${country.id}/operators`}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Globe className="size-4" />
                                                        Opérateurs
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {

                                                    }
                                                    }
                                                    className="text-red-500"
                                                >
                                                    <Link
                                                        href={`/countries/${country.iso}/banks`}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Globe className="size-4" />
                                                        Banques
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
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