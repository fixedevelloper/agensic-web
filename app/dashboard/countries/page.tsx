// app/countries/page.tsx (Server Component)
import { CountryClient } from "./CountryClient";
import axiosServices from "../../../utils/axiosServices";

// Service côté serveur (même URL, pas import direct d’axiosServices)
async function fetchCountries() {
    const res = await axiosServices.get("api/countries");
    return res.data.data ?? [];
}

export default async function CountryPage() {
    const countries = await fetchCountries();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Liste des pays</h1>
            <CountryClient countries={countries} />
        </div>
    );
}

