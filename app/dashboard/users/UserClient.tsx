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
import { User} from "../../types/type";


export function UserClient({
                                  users,
                              }: { users: User[] }) {

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Liste des utilisateurs</CardTitle>
                </CardHeader>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nom </TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>téléphone</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                                    Aucun utilisateur trouvé
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((country) => (
                                <TableRow key={country.id}>
                                    <TableCell>{country.id}</TableCell>
                                    <TableCell>{country.name}</TableCell>
                                    <TableCell>{country.email}</TableCell>
                                    <TableCell>{country.phone}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
}