
import axiosServices from "../../../../../utils/axiosServices";
import {BankClient} from "./BankClient";
export const dynamic = "force-dynamic";
async function fetchBanks(countryCode: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_TRANSFERT_SERVICE_URL;

    if (!baseUrl) {
        throw new Error("API URL non définie");
    }

    const res = await fetch(
        `${baseUrl}/api/banks/${countryCode}`,
        {
            cache: "no-store",
        }
    );

    if (!res.ok) {
        throw new Error("Erreur lors du chargement des banques");
    }

    const data = await res.json();
    return data.data ?? [];
}

export default async function BankPage({
                                               params,
                                           }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const banks = await fetchBanks(id);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Liste des Banques
            </h1>

            <BankClient
                banks={banks}
             country_id='cm'/>
        </div>
    );
}