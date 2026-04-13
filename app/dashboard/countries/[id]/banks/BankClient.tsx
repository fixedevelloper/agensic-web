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
import {Bank} from "../../../../types/type";

export function BankClient({
                                   banks
                           }: { banks: Bank[],country_id:string }) {
    const [editingBank, setEditingOperator] = useState<Bank | null>(null);


    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des Banques</CardTitle>

                </CardHeader>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Payercode</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {banks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                    Aucune Banque trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            banks.map((operator:Bank) => (
                                <TableRow key={operator.id}>
                                    <TableCell>{operator.id}</TableCell>
                                    <TableCell>{operator.name}</TableCell>
                                    <TableCell>{operator.code.toUpperCase()}</TableCell>
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

        </>
    );
}