'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft, Save, Plus, Trash2,
    Settings2, Percent, DollarSign, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import {Operator} from "../../../../../types/type";
import axiosServices from "../../../../../../utils/axiosServices";

type PricingTier = {
    min: number;
    max: number | null;
    fixed_fee: number;
    percent_fee: number;
};

type GatewayConfig = {
    id: number;
    gateway_name: string;
    service_type: string;
    fixed_fee: number;
    percent_fee: number;
    is_enabled: boolean;
    meta: {
        pricing_type: 'simple' | 'tiered';
        tiers: PricingTier[];
    } | null;
};



export default function ConfigurationClientPage({
                                                    configs: initialConfigs,
                                                    country_id
                                                }: { configs: GatewayConfig[], country_id: string }) {

    const { iso } = useParams();
    const router = useRouter();

    // CRITIQUE : Transférer la prop dans un state local pour permettre l'édition
    const [localConfigs, setLocalConfigs] = useState<GatewayConfig[]>(initialConfigs);
    const [isSaving, setIsSaving] = useState(false);

    const addTier = (configIndex: number) => {
        const newConfigs = [...localConfigs];
        const currentConfig = { ...newConfigs[configIndex] };

        const currentTiers = currentConfig.meta?.tiers || [];
        const lastMax = currentTiers.length > 0 ? currentTiers[currentTiers.length - 1].max || 0 : 0;

        const newTier: PricingTier = {
            min: lastMax + 1,
            max: null,
            fixed_fee: 0,
            percent_fee: 0
        };

        currentConfig.meta = {
            pricing_type: 'tiered',
            tiers: [...currentTiers, newTier]
        };

        newConfigs[configIndex] = currentConfig;
        setLocalConfigs(newConfigs);
    };

    const removeTier = (configIndex: number, tierIndex: number) => {
        const newConfigs = [...localConfigs];
        const currentConfig = { ...newConfigs[configIndex] };

        if (currentConfig.meta?.tiers) {
            const newTiers = [...currentConfig.meta.tiers];
            newTiers.splice(tierIndex, 1);
            currentConfig.meta = { ...currentConfig.meta, tiers: newTiers };
            newConfigs[configIndex] = currentConfig;
            setLocalConfigs(newConfigs);
        }
    };

    const updateTier = (configIndex: number, tierIndex: number, field: keyof PricingTier, value: string) => {
        const newConfigs = [...localConfigs];
        const currentConfig = { ...newConfigs[configIndex] };

        if (currentConfig.meta?.tiers) {
            const newTiers = [...currentConfig.meta.tiers];
            const val = value === "" ? 0 : parseFloat(value);

            newTiers[tierIndex] = { ...newTiers[tierIndex], [field]: val };
            currentConfig.meta = { ...currentConfig.meta, tiers: newTiers };

            newConfigs[configIndex] = currentConfig;
            setLocalConfigs(newConfigs);
        }
    };

    const saveConfiguration = async () => {
        setIsSaving(true);

        // Récupère l'URL de base (ex: http://localhost:8000)
        // ou utilise une URL relative si ton proxy est configuré
        const baseUrl = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL || '';
        const url = `${baseUrl}/api/gateway-matrix/sync-country`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    iso,
                    configs: localConfigs,
                    country_id
                }),
            });

            // Fetch ne throw pas d'erreur sur les status 4xx ou 5xx
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erreur lors de la sauvegarde");
            }

            const result = await response.json();
            toast.success("Configuration mise à jour avec succès");

        } catch (e: any) {
            console.error("Save Error:", e);
            toast.error(e.message || "Une erreur réseau est survenue");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold uppercase">Pays : {iso}</h1>
                        <p className="text-sm text-muted-foreground">Définissez les paliers tarifaires spécifiques.</p>
                    </div>
                </div>
                <Button onClick={saveConfiguration} disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : <><Save className="mr-2 h-4 w-4" /> Sauvegarder</>}
                </Button>
            </div>

            <Separator />

            <div className="grid gap-6">
                {localConfigs.map((config, cIdx) => (
                    <Card key={config.id} className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 flex flex-row items-center justify-between space-y-0">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg font-bold">{config.gateway_name}</CardTitle>
                                    <Badge variant={config.service_type === 'mobile' ? 'default' : 'outline'} className="capitalize">
                                        {config.service_type}
                                    </Badge>
                                </div>
                                <CardDescription>Configuration #{config.id}</CardDescription>
                            </div>
                            <div className="flex gap-4 text-xs font-mono bg-white p-2 rounded border">
                                <div className="text-slate-500">Global Fixe: <span className="text-black font-bold">{config.fixed_fee}</span></div>
                                <div className="text-slate-500">Global %: <span className="text-black font-bold">{config.percent_fee}%</span></div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-bold flex items-center gap-2">
                                        <Settings2 className="h-4 w-4 text-primary" />
                                        GRILLE TARIFAIRE DYNAMIQUE
                                    </Label>
                                    <Button size="sm" variant="secondary" onClick={() => addTier(cIdx)}>
                                        <Plus className="h-3 w-3 mr-1" /> Nouveau palier
                                    </Button>
                                </div>

                                <div className="rounded-md border">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-50 text-slate-500 font-medium">
                                        <tr className="border-b">
                                            <th className="p-3 text-left w-24">Min</th>
                                            <th className="p-3 text-left w-24">Max</th>
                                            <th className="p-3 text-left">Frais Fixe</th>
                                            <th className="p-3 text-left">Frais %</th>
                                            <th className="p-3 w-10"></th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                        {(config.meta?.tiers || []).map((tier, tIdx) => (
                                            <tr key={tIdx} className="group">
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        className="h-8 text-xs"
                                                        value={tier.min}
                                                        onChange={(e) => updateTier(cIdx, tIdx, 'min', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <Input
                                                        type="number"
                                                        className="h-8 text-xs"
                                                        placeholder="∞"
                                                        value={tier.max || ''}
                                                        onChange={(e) => updateTier(cIdx, tIdx, 'max', e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <div className="relative">
                                                        <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                        <Input
                                                            className="h-8 pl-6 text-xs"
                                                            value={tier.fixed_fee}
                                                            onChange={(e) => updateTier(cIdx, tIdx, 'fixed_fee', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <div className="relative">
                                                        <Percent className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-400" />
                                                        <Input
                                                            className="h-8 pl-6 text-xs"
                                                            value={tier.percent_fee}
                                                            onChange={(e) => updateTier(cIdx, tIdx, 'percent_fee', e.target.value)}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeTier(cIdx, tIdx)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!config.meta?.tiers || config.meta.tiers.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="p-6 text-center text-slate-400 text-xs italic">
                                                    Aucun palier spécifique. Les frais globaux s'appliquent.
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}