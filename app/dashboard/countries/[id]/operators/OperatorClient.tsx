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

import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {MoreVertical} from "lucide-react";
import {Operator} from "../../../../types/type";
import {AddEditOperatorDialog} from "../../../../../components/forms/AddEditOperatorDialog";
import axiosServices from "../../../../../utils/axiosServices";

export function OperatorClient({
                                   operators,country_id
                              }: { operators: Operator[],country_id:string }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [editingOperator, setEditingOperator] = useState<Operator | null>(null);

    const handleAdd = async (data: FormData) => {
        console.log("Ajouter FormData:", data);

        await axiosServices.post("api/operators", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    const handleEdit = async (data: FormData) => {
        data.append("_method", "PUT");

        await axiosServices.post(`api/operators/${editingOperator?.id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des operateurs</CardTitle>
                    <Button
                        size="sm"
                        onClick={() => {
                            setEditingOperator(null);
                            setOpenDialog(true);
                        }}
                    >
                        Ajouter un operateur
                    </Button>
                </CardHeader>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Logo</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {operators.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                    Aucun pays trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            operators.map((operator:Operator) => (
                                <TableRow key={operator.id}>
                                    <TableCell>{operator.id}</TableCell>
                                    <TableCell>{operator.name}</TableCell>
                                    <TableCell>{operator.code.toUpperCase()}</TableCell>
                                    <TableCell>
                                        <img
                                            src={`${operator.logo_url}`}
                                            alt="flag"
                                            width={40}
                                            height={30}
                                        />
                                    </TableCell>
                                    <TableCell>{operator.status}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent align="end" side="top">
                                                <DropdownMenuItem onClick={() =>{
                                                    setEditingOperator(operator);
                                                    setOpenDialog(true);

                                                }

                                                }>
                                                    Modifier
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    onClick={() => {

                                                    }
                                                    }
                                                    className="text-red-500"
                                                >
                                                    Supprimer
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

            <AddEditOperatorDialog
                open={openDialog}
                country_id={country_id}
                onOpenChange={setOpenDialog}
                operator={editingOperator}
                onSubmit={editingOperator ? handleEdit : handleAdd}
            />
        </>
    );
}