import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function DashboardPage() {
    const data = [
        { id: 1, name: "Produit A", price: 99 },
        { id: 2, name: "Produit B", price: 149 },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Statistiques</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Nombre total de produits : {data.length}</p>
                    </CardContent>
                    <CardFooter>
                        <Button>Exporter</Button>
                    </CardFooter>
                </Card>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Prix</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}