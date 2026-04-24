'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Save, Trash2, Globe, Key, Settings2 } from 'lucide-react';

export default function AddGatewayPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // État initial basé sur ton schéma
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'fintech',
    is_active: true,
    logo: '',
    website: '',
    credentials: [{ key: '', value: '' }],
    settings: [{ key: '', value: '' }]
  });

  
  // Gestion des champs simples
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Auto-génération du code à partir du nom
    if (name === 'name') {
      setFormData(prev => ({ ...prev, code: value.toLowerCase().replace(/\s+/g, '_') }));
    }
  };

  // Gestion dynamique pour JSON (Credentials & Settings)
  const handleDynamicChange = (type: 'credentials' | 'settings', index: number, field: 'key' | 'value', val: string) => {
    const updated = [...formData[type]];
    updated[index][field] = val;
    setFormData(prev => ({ ...prev, [type]: updated }));
  };

  const addDynamicField = (type: 'credentials' | 'settings') => {
    setFormData(prev => ({ ...prev, [type]: [...prev[type], { key: '', value: '' }] }));
  };

  const removeDynamicField = (type: 'credentials' | 'settings', index: number) => {
    const updated = formData[type].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [type]: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Transformation des tableaux en objets JSON pour Laravel
    const payload = {
      ...formData,
      credentials: Object.fromEntries(formData.credentials.filter(i => i.key).map(i => [i.key, i.value])),
      settings: Object.fromEntries(formData.settings.filter(i => i.key).map(i => [i.key, i.value])),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL}/api/gateways`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();
      router.push('/dashboard/settings/gateway_matrix'); // Redirection après succès
    } catch (error) {
      alert("Erreur lors de la création de la gateway");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nouvelle Gateway</h1>
            <p className="text-muted-foreground">Configurez un nouveau fournisseur de paiement.</p>
          </div>
          <Button type="submit" disabled={loading} className="px-8 shadow-lg">
            {loading ? "Création..." : "Enregistrer la Gateway"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Section Informations Générales */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Informations Générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom (ex: Flutterwave)</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Flutterwave" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code Unique (slug)</Label>
                <Input id="code" name="code" value={formData.code} onChange={handleChange} required placeholder="flutterwave_v2" />
              </div>
              <div className="space-y-2">
                <Label>Type de Gateway</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData(prev => ({ ...prev, type: val }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fintech">Fintech (Aggregator)</SelectItem>
                    <SelectItem value="bank_api">Direct Bank API</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money Operator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Site Web</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
              </div>
            </CardContent>
          </Card>

          {/* Section Status & Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                <Label htmlFor="active" className="cursor-pointer">Gateway Active</Label>
                <Switch 
                    id="active" 
                    checked={formData.is_active} 
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL du Logo</Label>
                <Input id="logo" name="logo" value={formData.logo} onChange={handleChange} placeholder="https://image.png" />
                {formData.logo && (
                    <div className="mt-2 flex justify-center p-4 border rounded bg-white">
                        <img src={formData.logo} alt="Preview" className="h-12 object-contain" />
                    </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Section Credentials (JSON) */}
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-4 w-4 text-amber-500" /> API Credentials
                </CardTitle>
                <CardDescription>Clés secrètes et identifiants de connexion (ex: secret_key, public_key)</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addDynamicField('credentials')}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.credentials.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center animate-in slide-in-from-left-2">
                  <Input placeholder="Clé" value={item.key} onChange={(e) => handleDynamicChange('credentials', idx, 'key', e.target.value)} className="font-mono text-sm" />
                  <Input placeholder="Valeur" value={item.value} onChange={(e) => handleDynamicChange('credentials', idx, 'value', e.target.value)} type="password" />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDynamicField('credentials', idx)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Section Settings (JSON) */}
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-4 w-4 text-blue-500" /> Paramètres Supplémentaires
                </CardTitle>
                <CardDescription>Configurations spécifiques (ex: callback_url, currency_limit)</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => addDynamicField('settings')}>
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.settings.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <Input placeholder="Paramètre" value={item.key} onChange={(e) => handleDynamicChange('settings', idx, 'key', e.target.value)} />
                  <Input placeholder="Valeur" value={item.value} onChange={(e) => handleDynamicChange('settings', idx, 'value', e.target.value)} />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDynamicField('settings', idx)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}