'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, Search, Globe, ShieldCheck, Server, PlusCircle } from 'lucide-react';

type Country = { iso: string; name: string };
type Gateway = { id: number; name: string; code: string };
type MatrixData = {
    [countryCode: string]: {
        [gatewayCode: string]: { mobile: boolean; bank: boolean }
    }
};

export default function GatewayMatrixPage() {
    const [search, setSearch] = useState('');
    const [gateways, setGateways] = useState<Gateway[]>([]);
    const [countries, setCountries] = useState<Country[]>([]);
    const [matrix, setMatrix] = useState<MatrixData>({});
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL;
    const API_USERBASE = process.env.NEXT_PUBLIC_API_USER_SERVICE_URL;

    useEffect(() => {
        const loadAllData = async () => {
            try {
                setLoading(true);
                const [resCountries, resGateways, resMatrix] = await Promise.all([
                    fetch(`${API_USERBASE}/api/countries`),
                    fetch(`${API_BASE}/api/gateways`),
                    fetch(`${API_BASE}/api/gateway-matrix`)
                ]);

                const countriesRes = await resCountries.json();
                const gatewaysRes = await resGateways.json();
                const matrixRes = await resMatrix.json();

                setCountries(countriesRes.data || countriesRes || []);
                setGateways(gatewaysRes.data || gatewaysRes || []);
                
                // On récupère la matrice brute
                const rawMatrix = matrixRes.matrix || matrixRes.data?.matrix || matrixRes;
                setMatrix(rawMatrix || {});

            } catch (e) {
                console.error("Erreur chargement", e);
            } finally {
                setLoading(false);
            }
        };
        loadAllData();
    }, []);

    // La fonction toggle doit utiliser les clés exactes de tes objets
    const toggleCell = (countryIso: string, gatewayCode: string, type: 'mobile' | 'bank') => {
        setMatrix((prev) => {
            const countryData = prev[countryIso] || {};
            const gatewayData = countryData[gatewayCode] || { mobile: false, bank: false };

            return {
                ...prev,
                [countryIso]: {
                    ...countryData,
                    [gatewayCode]: {
                        ...gatewayData,
                        [type]: !gatewayData[type]
                    }
                }
            };
        });
    };

    const filteredCountries = useMemo(() =>
        countries.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.iso.toLowerCase().includes(search.toLowerCase())
        ), [search, countries]);

    const save = async () => {
        setIsSaving(true);
        try {
            await fetch(`${API_BASE}/api/gateway-matrix`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ matrix })
            });
            alert('Configuration enregistrée !');
        } catch (e) {
            alert('Erreur lors de la sauvegarde');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto h-10 w-10 text-primary" /></div>;

    return (
        <div className='p-8 max-w-7xl mx-auto space-y-6'>
            <div className='flex justify-between items-center border-b pb-6'>
                <h1 className='text-2xl font-bold flex items-center gap-2'><ShieldCheck className="text-primary" /> Matrix</h1>
                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/settings/gateway_matrix/add-gateways"><PlusCircle className="mr-2 h-4 w-4" /> Gateway</Link>
                    </Button>
                    <Button onClick={save} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />} 
                        Sauvegarder
                    </Button>
                </div>
            </div>

            <Input 
                placeholder='Filtrer par pays ou ISO...' 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="max-w-xs"
            />

            <Card className='overflow-hidden border-slate-200 shadow-sm'>
                <div className='overflow-x-auto max-h-[70vh]'>
                    <table className='w-full text-sm border-collapse'>
                        <thead>
                            <tr className='bg-slate-50 border-b sticky top-0 z-20'>
                                <th className='p-4 text-left sticky left-0 bg-slate-50 z-30 border-r min-w-[200px] font-bold text-slate-600'>Pays</th>
                                {gateways.map((g) => (
                                    <th key={`head-${g.id}`} colSpan={2} className='p-4 text-center border-l font-bold text-slate-700 bg-slate-100/30'>
                                        {g.name}
                                    </th>
                                ))}
                            </tr>
                            <tr className='bg-white border-b sticky top-[53px] z-10 text-[10px] uppercase font-bold text-slate-400'>
                                <th className='p-2 sticky left-0 bg-white z-30 border-r'></th>
                                {gateways.map((g) => (
                                    <React.Fragment key={`subhead-${g.code}`}>
                                        <th className='p-2 border-l'>Mobile</th>
                                        <th className='p-2'>Banque</th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredCountries.map((c) => (
                                <tr key={`row-${c.iso}`} className='hover:bg-slate-50/50 transition-colors'>
                                    <td className='p-4 font-semibold sticky left-0 bg-white z-10 border-r'>
                                        <div className="flex items-center justify-between">
                                            <span>{c.name}</span>
                                            <Badge variant="secondary" className="text-[10px]">{c.iso}</Badge>
                                        </div>
                                    </td>
                                 {gateways.map((g) => {
    const countryKey = c.iso; // ex: "CM"
    
    // On récupère les données du pays
    const countryEntry = matrix[countryKey] || {};

    // SOLUTION DE SECOURS : Trouver la clé même si la casse est différente
    // On cherche dans l'objet countryEntry une clé qui correspond à g.code (sans tenir compte de la casse)
    const actualGatewayKey = Object.keys(countryEntry).find(
        (key) => key.toLowerCase().trim() === g.code.toLowerCase().trim()
    );

    // Si on a trouvé une clé correspondante, on prend ses data, sinon vide
    const cell = actualGatewayKey 
        ? countryEntry[actualGatewayKey] 
        : { mobile: false, bank: false };

    return (
        <React.Fragment key={`cell-${countryKey}-${g.code}`}>
            <td className='p-4 text-center border-l'>
                <Checkbox
                    id={`m-${countryKey}-${g.code}`}
                    checked={Boolean(cell.mobile)}
                    onCheckedChange={() => toggleCell(countryKey, actualGatewayKey || g.code, 'mobile')}
                />
            </td>
            <td className='p-4 text-center border-l'>
                <Checkbox
                    id={`b-${countryKey}-${g.code}`}
                    checked={Boolean(cell.bank)}
                    onCheckedChange={() => toggleCell(countryKey, actualGatewayKey || g.code, 'bank')}
                />
            </td>
        </React.Fragment>
    );
})}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}