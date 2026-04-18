"use client";

import { User } from "../../types/type";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon, Mail, Phone, ShieldCheck } from "lucide-react";

export function UserClient({ users }: { users: User[] }) {
    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b py-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <UserIcon className="size-5 text-blue-600" />
                        Liste des utilisateurs
                    </CardTitle>
                    <Badge variant="outline" className="font-mono">
                        {users.length} Inscrits
                    </Badge>
                </div>
            </CardHeader>

            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow>
                        <TableHead className="w-[80px]">ID</TableHead>
                        <TableHead>Identité</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-10 text-sm text-muted-foreground">
                                Aucun utilisateur trouvé
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-mono text-xs text-slate-500">
                                    #{user.id}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700">{user.name}</span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                            <ShieldCheck className="size-3" /> Client Vérifié
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="size-3 text-slate-400" />
                                        {user.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Phone className="size-3 text-slate-400" />
                                        {user.phone || "—"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    {/* Exemple de badge dynamique basé sur un champ status */}
                                    <Badge
                                        variant="secondary"
                                        className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold text-[10px]"
                                    >
                                        ACTIF
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}