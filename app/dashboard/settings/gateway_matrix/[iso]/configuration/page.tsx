import axiosServices from "../../../../../../utils/axiosServices";
import ConfigurationClientPage from "./congiguration";
import React from "react";

export const dynamic = "force-dynamic";

async function fetchData(iso: string) {
    // On construit l'URL complète
    // Note : Remplace par ton URL réelle ou utilise une variable d'environnement
    const API_BASE = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL;
    const url = `${API_BASE}/api/gateway-matrix/${iso}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Ajoute ici tes headers d'auth si nécessaire
                // 'Authorization': `Bearer ${token}`
            },
            // Optionnel : force le rafraîchissement des données (équivalent dynamic force-dynamic)
            cache: 'no-store'
        });

        if (!response.ok) {
            // Fetch ne rejette pas l'erreur sur les codes 404 ou 500, il faut vérifier response.ok
            console.error(`Erreur API: ${response.status} ${response.statusText}`);
            return [];
        }

        const resData = await response.json();

        // On s'adapte à ta structure Laravel (data.data ou data directement)
        return resData?.data || resData || [];

    } catch (error) {
        console.error("Erreur réseau ou serveur lors du fetch:", error);
        return [];
    }
}

export default async function ConfigurationPage({
                                                    params,
                                                }: {
    params: Promise<{ iso: string }>; // Change 'id' par 'iso' si ton dossier est [iso]
}) {
    // Dans Next.js 15+, params est une Promise
    const resolvedParams = await params;
    const countryId = resolvedParams.iso; // Utilise 'iso' ou 'id' selon le nom de ton dossier

    const configs = await fetchData(countryId);

    return (
        <div className="min-h-screen bg-slate-50/30">
            <ConfigurationClientPage
                configs={configs}
                country_id={countryId}
            />
        </div>
    );
}