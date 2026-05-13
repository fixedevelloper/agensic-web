'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Zap, Calculator, ShieldCheck, ChevronRight, UserCircle2, CheckCircle2,
    ArrowRightLeft, Wallet, Landmark, Receipt, Check, Loader2, ArrowRight, AlertCircle
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {Country, Sender} from "../../../types/type";

export default function SimulationPage() {
    // Configuration & State
    const baseUrl = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL || '';
    const API_USERBASE = process.env.NEXT_PUBLIC_API_USER_SERVICE_URL;

    const [step, setStep] = useState(1);
    const [countries, setCountries] = useState<Country[]>([]);
    const [operators, setOperators] = useState<any[]>([]);
    const [origin_fonds, setOriginfonds] = useState<any[]>([]);
    const [motifs, setMotifs] = useState<any[]>([]);
    const [relactions, setRelactions] = useState<any[]>([]);
    const [senders, setSenders] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
    const [isCalculating, setIsCalculating] = useState(false);
    const { data: session } = useSession();

    const [data, setData] = useState({
        amount: '',
        fees: 0,
        total: 0,
        sender: null,
        beneficiary: null,
        type: 'mobile',
        country: 'CM',
        receiver_country: 'CM',
        gateway: null,
        currency: 'XAF',
        relation:'',
        source_of_funds:'',
        motif:''

    });

    // --- FETCH DATA ---
    useEffect(() => {
        if (!API_USERBASE) return;
        fetch(`${API_USERBASE}/api/countries`)
            .then(res => res.json())
            .then(res => setCountries(res.data || []));
    }, [API_USERBASE]);

    useEffect(() => {
        const loadData = async () => {
            if (!session?.user?.id || !baseUrl) return;
            const headers = { 'X-User-Id': session.user.id };

            try {
                const [resS, resB] = await Promise.all([
                    fetch(`${baseUrl}/api/senders`, { headers }),
                    fetch(`${baseUrl}/api/beneficiaries`, { headers })
                ]);
                const sendersData = await resS.json();
                const benefsData = await resB.json();

                setSenders(sendersData.data || []);
                setBeneficiaries(benefsData.data || []);
            } catch (e) {
                toast.error("Erreur de synchronisation des données");
            }
        };
        loadData();
    }, [baseUrl, session?.user?.id]);
    useEffect(() => {
        const loadWaceData = async () => {
            // Sécurité : On attend l'étape 4 ET que l'expéditeur/bénéficiaire soient sélectionnés
            if (!session?.user?.id || !baseUrl || step < 4 || !data.sender || !data.beneficiary) return;

            const headers = {
                'X-User-Id': session.user.id,
                'Accept': 'application/json'
            };

            try {
                // Récupération des objets complets pour avoir le type de compte
                const senderObj = senders.find((s:any) => s.id === data.sender) as any;
                const beneficiaryObj = beneficiaries.find(b => b.id === data.beneficiary) as any;

                // Construction du type (ex: "walletwallet" ou "bankwallet")
                // On utilise une valeur par défaut "wallet" si non trouvé pour éviter les erreurs
                const typeValue = `${senderObj?.account_type || 'wallet'}2${beneficiaryObj?.account_type || 'wallet'}`;

                const res = await fetch(`${baseUrl}/api/wace-data?type=${typeValue}`, { headers });
                const resData = await res.json();

                if (resData?.data) {
                    const allData = resData.data;
                    setRelactions(allData.filter((i: any) => i.service === "relaction") || []);
                    setOriginfonds(allData.filter((i: any) => i.service === "origin_fonds") || []);
                    setMotifs(allData.filter((i: any) => i.service === "raison") || []);
                }
            } catch (e) {
                console.error("Erreur de préchargement WaceData:", e);
            }
        };

        loadWaceData();
    }, [step, data.sender, data.beneficiary, baseUrl, session?.user?.id]);


    useEffect(() => {
        // Définition de l'URL en fonction du type (Mobile Money ou Banque)
        const url = data.type === 'mobile'
            ? `${API_USERBASE}/api/operators-country-code?type=${data.type}&country_code=${data.receiver_country}`
            : `${baseUrl}/api/banks?type=${data.type}&country_code=${data.receiver_country}`;

        // On ne lance le fetch que si on a un pays de sélectionné
        if (data.receiver_country) {
            fetch(url)
                .then(res => res.json())
                .then(res => {
                    // On met à jour la liste des opérateurs ou banques
                    setOperators(res.data || []);
                })
                .catch(err => console.error("Erreur lors de la récupération des opérateurs:", err));
        }
    }, [data.type, data.receiver_country, baseUrl, API_USERBASE]); // Dépendances complètes

    // --- CALCULATIONS ---
    useEffect(() => {
        if (!data.amount || parseFloat(data.amount) <= 0) {
            setData(prev => ({ ...prev, fees: 0, total: 0 }));
            return;
        }
        const timer = setTimeout(() => handleAutoCalculate(), 600);
        return () => clearTimeout(timer);
    }, [data.amount, data.country, data.receiver_country, data.type]);

    const handleAutoCalculate = async () => {
        setIsCalculating(true);
        try {
            const params = new URLSearchParams({
                amount: data.amount,
                country: data.country,
                receiver_country: data.receiver_country,
                type: data.type
            });
            const res = await fetch(`${baseUrl}/api/simulation/calculate-fees?${params}`);
            const result = await res.json();

            if (result.selected_config) {
                setData(prev => ({
                    ...prev,
                    fees: result.selected_config.total_fees,
                    total: result.selected_config.total_to_pay,
                    gateway: result.selected_config.gateway_name
                }));
            }
        } catch (error) {
            toast.error("Erreur de calcul");
        } finally {
            setIsCalculating(false);
        }
    };

    // --- NAVIGATION ---
    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    // --- HELPERS (Filtering for Summary) ---
    const currentCurrency = countries.find(c => c.iso === data.country)?.currency || 'XAF';
    const selectedSender = senders.find((s:any) => s.id === data.sender)as Sender | undefined;;
    const selectedBeneficiary = beneficiaries.find(b => b.id === data.beneficiary)as any | undefined;;
    const handleFinalConfirm = async () => {
        console.log("Config actuelle:", { baseUrl, session: session?.user?.id });
        if (!baseUrl) {
            toast.error("L'URL de l'API est manquante (Variable d'env)");
            return;
        }
        // Vérification de sécurité avant l'envoi
        if (!data.sender || !data.beneficiary || !data.amount) {
            toast.error("Données de transaction incomplètes");
            return;
        }

        const loadingToast = toast.loading("Traitement de votre transfert...");

        try {
            const response = await fetch(`${baseUrl}/api/simulation/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-User-Id': session?.user?.id || '',
                },
                body: JSON.stringify({
                    amount: data.amount,
                    currency: data.currency,
                    type: data.type,
                    operator: data.gateway,
                    sender_id: data.sender,
                    beneficiary_id: data.beneficiary,
                    receiver_country: data.receiver_country,

                    // Données de conformité
                    origin_fond: data.source_of_funds,
                    motif_send: data.motif, // On utilise la sélection "Motif" de l'étape 6
                    relation: data.relation,

                    // Note automatique pour le journal
                    note: `Transfert de ${data.amount} via Simulateur`,
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success("Transfert réussi !", { id: loadingToast });
                // Redirection ou mise à jour de l'UI
                setStep(6); // Une étape de succès final par exemple
            } else {
                throw new Error(result.message || "Une erreur est survenue");
            }
        } catch (error: any) {
            toast.error(error.message, { id: loadingToast });
            console.error("Erreur de confirmation:", error);
        }
    };
    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20 font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 mb-10 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-xl">
                            <Zap className="text-white fill-white h-5 w-5" />
                        </div>
                        <h1 className="text-xl font-black tracking-tight">AGENSIC SIMULATOR</h1>
                    </div>
                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5,6,7].map((i) => (
                            <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${step >= i ? 'bg-primary' : 'bg-slate-200'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6">
                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardContent className="p-0">

                        {/* ETAPE 1: MONTANT */}
                        {/* ETAPE 4: MODE RECEPTION */}
                        {step === 1 && (
                            <div className="p-10 animate-in slide-in-from-right-8">
                                <h2 className="text-2xl font-black mb-8 text-center">Mode de réception</h2>
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'mobile', icon: Wallet, label: 'Mobile' },
                                        { id: 'bank', icon: Landmark, label: 'Banque' },
                                        { id: 'cash', icon: Receipt, label: 'Cash' }
                                    ].map((m) => (
                                        <button key={m.id} onClick={() => setData({...data, type: m.id})} className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-4 transition-all ${data.type === m.id ? 'border-primary bg-primary/5' : 'border-slate-100'}`}>
                                            <m.icon className={data.type === m.id ? 'text-primary' : 'text-slate-300'} />
                                            <span className="text-xs font-bold">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                                <Button className="w-full h-16 rounded-2xl mt-10 text-lg font-bold" onClick={nextStep}>
                                    Continuer
                                </Button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="p-10 animate-in fade-in slide-in-from-bottom-4">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black">Configurez l'envoi</h2>
                                    <p className="text-slate-500">Choisissez le corridor et le montant du transfert.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Sender Group */}
                                    <div className="flex h-24 w-full items-stretch rounded-3xl border-2 border-slate-100 bg-slate-50/50 p-2 focus-within:border-primary transition-all">
                                        <Select value={data.country} onValueChange={(v) => setData({...data, country: v ?? ""})}>
                                            <SelectTrigger className="w-32 border-0 bg-white rounded-2xl shadow-sm focus:ring-0">
                                                <div className="flex items-center gap-2">
                                                    <img src={`https://flagcdn.com/w40/${data.country?.toLowerCase()}.png`} className="w-5 h-3.5 object-cover rounded-sm" alt=""/>
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map((c:any) => (
                                                    <SelectItem key={c.iso} value={c.iso}>{c.iso} - {c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex-1 px-4 flex flex-col justify-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Vous envoyez</span>
                                            <Input
                                                type="number"
                                                className="border-0 p-0 h-8 text-2xl font-mono font-black focus-visible:ring-0 bg-transparent"
                                                value={data.amount}
                                                onChange={(e) => setData({...data, amount: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {/* Receiver Group */}
                                    <div className="flex h-24 w-full items-stretch rounded-3xl border-2 border-slate-100 bg-slate-50/50 p-2">
                                        <div className="flex-1 px-4 flex flex-col justify-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Le bénéficiaire reçoit</span>
                                            <div className="text-2xl font-mono font-black text-slate-400 italic">
                                                {data.amount ? (parseFloat(data.amount) - data.fees).toFixed(2) : "0.00"}
                                            </div>
                                        </div>
                                        <Select value={data.receiver_country} onValueChange={(v) => setData({...data, receiver_country: v ?? ""})}>
                                            <SelectTrigger className="w-32 border-0 bg-white rounded-2xl shadow-sm focus:ring-0">
                                                <div className="flex items-center gap-2">
                                                    <img src={`https://flagcdn.com/w40/${data.receiver_country?.toLowerCase()}.png`} className="w-5 h-3.5 object-cover rounded-sm" alt=""/>
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {countries.map((c:any) => (
                                                    <SelectItem key={c.iso} value={c.iso}>{c.iso}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Recap Block (Black) */}
                                    {Number(data.amount) > 0 ? (
                                        data.fees !== null && data.fees !== undefined && data.fees >= 0 ? (
                                            /* ÉTAT 1 : RÉCAPITULATIF DES FRAIS (Quand le calcul est réussi) */
                                            <div className="bg-[#0f172a] rounded-[2rem] p-6 text-white relative overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-300">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-slate-400 text-sm">Frais de service</span>
                                                    <span className="font-mono text-green-400">
                    {data.fees === 0 ? 'Gratuit' : `+${data.fees} ${currentCurrency}`}
                </span>
                                                </div>

                                                <Separator className="bg-white/10 mb-4" />

                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total à payer</p>
                                                        <p className="text-3xl font-black tracking-tighter">
                                                            {data.total} <span className="text-sm font-bold text-slate-500">{currentCurrency}</span>
                                                        </p>
                                                    </div>
                                                    {data.gateway && (
                                                        <Badge className="bg-primary text-white border-none h-8 px-4 rounded-full">
                                                            Garantie {data.gateway}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            /* ÉTAT 2 : MONTANT NON CONFIGURÉ (Quand le montant est saisi mais hors limites) */
                                            <div className="mt-6 bg-red-50 border-2 border-red-100 rounded-[2rem] p-6 flex items-center gap-4 animate-in slide-in-from-bottom-2">
                                                <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-red-900">Montant non configuré</p>
                                                    <p className="text-xs text-red-600/80">
                                                        Ce montant n'est pas disponible pour ce corridor. Veuillez essayer un autre montant.
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        /* ÉTAT 3 : VIDE (En attente de saisie) */
                                        <div className="mt-6 border-2 border-dashed border-slate-100 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center space-y-3">
                                            <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Calculator className="h-6 w-6 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-600">En attente de montant</p>
                                                <p className="text-xs text-slate-400">Saisissez un montant pour voir les frais.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <Button variant="ghost" className="h-14 px-8" onClick={prevStep}>Retour</Button>
                                    <Button className="flex-1 h-14 rounded-xl font-bold" onClick={nextStep}>  Continuer vers l'expéditeur</Button>
                                </div>

                            </div>
                        )}

                        {/* ETAPE 2: SENDER */}
                        {step === 3 && (
                            <div className="p-10 animate-in slide-in-from-right-8">
                                <h2 className="text-2xl font-black mb-2">Expéditeur</h2>
                                <p className="text-slate-500 mb-8 text-sm">Sélectionnez le compte à débiter.</p>
                                <div className="grid gap-4">
                                    {senders.map((s:any) => (
                                        <div key={s.id} onClick={() => setData({...data, sender: s.id})} className={`p-5 rounded-3xl border-2 cursor-pointer flex items-center gap-4 transition-all ${data.sender === s.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'}`}>
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">{s.name.charAt(0)}</div>
                                            <div className="flex-1"><p className="font-bold">{s.name}</p><p className="text-xs text-slate-500">ID: {s.id}</p></div>
                                            {data.sender === s.id && <CheckCircle2 className="text-primary" />}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <Button variant="ghost" className="h-14 px-8" onClick={prevStep}>Retour</Button>
                                    <Button className="flex-1 h-14 rounded-xl font-bold" onClick={nextStep} disabled={!data.sender}>Suivant</Button>
                                </div>
                            </div>
                        )}

                        {/* ETAPE 3: BENEFICIARY */}
                        {step === 4 && (
                            <div className="p-10 animate-in slide-in-from-right-8">
                                <h2 className="text-2xl font-black mb-2">Bénéficiaire</h2>
                                <p className="text-slate-500 mb-8 text-sm">À qui envoyez-vous l'argent ?</p>
                                <div className="grid gap-4">
                                    {beneficiaries.map((b:any) => (
                                        <div key={b.id} onClick={() => setData({...data, beneficiary: b.id})} className={`p-5 rounded-3xl border-2 cursor-pointer flex items-center gap-4 transition-all ${data.beneficiary === b.id ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'}`}>
                                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{b.name.charAt(0)}</div>
                                            <div className="flex-1"><p className="font-bold">{b.name}</p><p className="text-xs text-slate-500">{b.phone}</p></div>
                                            {data.beneficiary === b.id && <CheckCircle2 className="text-primary" />}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-4 mt-10">
                                    <Button variant="ghost" className="h-14 px-8" onClick={prevStep}>Retour</Button>
                                    <Button className="flex-1 h-14 rounded-xl font-bold" onClick={nextStep} disabled={!data.beneficiary}>Suivant</Button>
                                </div>
                            </div>
                        )}

                        {step === 5 && (
                            <div className="p-10 animate-in slide-in-from-right-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black mb-2">Opérateurs</h2>
                                    <p className="text-slate-500 text-sm">
                                        Sélectionnez le service local pour finaliser le transfert vers le pays de destination.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    {operators.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4">
                                            {operators.map((op: any) => (
                                                <button
                                                    key={op.id}
                                                    onClick={() => setData({ ...data, gateway: op.code || op.name })}
                                                    className={`p-6 rounded-3xl border-2 flex flex-col items-center gap-3 transition-all duration-200 ${
                                                        data.gateway === (op.code || op.name)
                                                            ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                                                            : 'border-slate-100 hover:border-slate-200 bg-white'
                                                    }`}
                                                >
                                                    {/* Affichage du logo si ton API le fournit, sinon une icône par défaut */}
                                                    {op.logo ? (
                                                        <img src={op.logo} alt={op.name} className="h-10 w-10 object-contain" />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                            <span className="text-lg font-bold text-slate-400">{op.name.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs font-black uppercase tracking-wider">{op.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                            <p className="text-slate-400 text-sm">Aucun opérateur disponible pour ce corridor.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <Button variant="ghost" className="h-16 px-8 rounded-2xl font-bold" onClick={prevStep}>
                                        Retour
                                    </Button>
                                    <Button
                                        className="flex-1 h-16 rounded-2xl font-black text-lg shadow-lg"
                                        onClick={nextStep}
                                        disabled={!data.gateway}
                                    >
                                        Vérifier le transfert
                                    </Button>
                                </div>
                            </div>
                        )}
                        {step === 6 && (
                            <div className="p-10 animate-in slide-in-from-right-8">
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black mb-2">Détails du transfert</h2>
                                    <p className="text-slate-500 text-sm">
                                        Ces informations sont requises pour sécuriser votre transaction.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {/* 1. ORIGINE DES FONDS */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Origine des fonds</label>
                                        <Select
                                            value={data.source_of_funds}
                                            onValueChange={(v) => setData({...data, source_of_funds: v ?? ""})}
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:ring-primary">
                                                <SelectValue placeholder="D'où vient l'argent ?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {origin_fonds.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.label || item.name}>
                                                        {item.label || item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* 2. MOTIF DU TRANSFERT */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Motif du transfert</label>
                                        <Select
                                            value={data.motif}
                                            onValueChange={(v) => setData({...data, motif: v ?? ""})}
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:ring-primary">
                                                <SelectValue placeholder="Pourquoi envoyez-vous cet argent ?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {motifs.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.label || item.name}>
                                                        {item.label || item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* 3. RELATION AVEC LE BÉNÉFICIAIRE */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Relation</label>
                                        <Select
                                            value={data.relation}
                                            onValueChange={(v) => setData({...data, relation: v ?? ""})}
                                        >
                                            <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:ring-primary">
                                                <SelectValue placeholder="Qui est le bénéficiaire pour vous ?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {relactions.map((item: any) => (
                                                    <SelectItem key={item.id} value={item.label || item.name}>
                                                        {item.label || item.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <Button variant="ghost" className="h-16 px-8 rounded-2xl font-bold" onClick={prevStep}>
                                        Retour
                                    </Button>
                                    <Button
                                        className="flex-1 h-16 rounded-2xl font-black text-lg shadow-lg"
                                        onClick={nextStep}
                                        disabled={!data.source_of_funds || !data.motif || !data.relation}
                                    >
                                        Vérifier le transfert
                                    </Button>
                                </div>
                            </div>
                        )}
                        {/* ETAPE 5: RECAPITULATIF FINAL */}
                        {step === 7 && (
                            <div className="p-10 animate-in zoom-in-95 duration-500">
                                <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ShieldCheck className="text-primary h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-black text-center mb-8">Vérification finale</h2>

                                <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6">
                                    {/* AXE DE TRANSFERT */}
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Expéditeur</p>
                                            <p className="font-bold">{selectedSender?.name || 'Inconnu'}</p>
                                            <p className="text-[10px] text-slate-500 italic">{data.source_of_funds}</p>
                                        </div>
                                        <div className="h-px flex-1 bg-slate-200 mx-4 relative">
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-slate-50 px-2">
                                                <ArrowRight className="h-4 w-4 text-slate-300" />
                                            </div>
                                        </div>
                                        <div className="text-right space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Bénéficiaire</p>
                                            <p className="font-bold">{selectedBeneficiary?.name || 'Inconnu'}</p>
                                            <p className="text-[10px] text-slate-500 italic">{data.relation}</p>
                                        </div>
                                    </div>

                                    <Separator className="opacity-50" />

                                    {/* DETAILS FINANCIERS ET LOGISTIQUES */}
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Service utilisé</span>
                                            <Badge className="bg-white text-primary border-primary/20 hover:bg-white px-3 capitalize">
                                                {data.gateway} ({data.type})
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Motif du transfert</span>
                                            <span className="font-medium text-slate-700">{data.motif}</span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-slate-500">Montant envoyé</span>
                                            <span className="font-mono font-bold text-slate-900">{data.amount} {currentCurrency}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Frais de service</span>
                                            <span className="font-mono text-red-500 font-bold">+{data.fees} {currentCurrency}</span>
                                        </div>
                                    </div>

                                    {/* TOTAL FINAL */}
                                    <div className="bg-primary text-white p-6 rounded-3xl shadow-lg shadow-primary/20 flex justify-between items-center">
                                        <div>
                                            <span className="text-[10px] font-black uppercase opacity-80">Total à débiter</span>
                                            <p className="text-2xl font-black">{data.total} {currentCurrency}</p>
                                        </div>
                                        <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                            <Wallet className="h-6 w-6" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-10">
                                    <Button variant="ghost" className="h-16 px-8 rounded-2xl font-bold" onClick={prevStep}>
                                        Modifier
                                    </Button>
                                    <Button
                                        className="flex-1 h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                                        onClick={handleFinalConfirm}
                                        disabled={isCalculating}
                                    >
                                        {isCalculating ? (
                                            <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin h-5 w-5" /> Traitement...
                    </span>
                                        ) : (
                                            "CONFIRMER & PAYER"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </main>
        </div>
    );
}